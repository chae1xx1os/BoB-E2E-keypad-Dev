package bob.simple.spring.service

import bob.simple.spring.model.KeypadResponse
import org.springframework.stereotype.Service
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.nio.file.Paths
import java.security.MessageDigest
import java.util.*
import javax.imageio.ImageIO

@Service
class KeypadService {

    // 랜덤 키패드 레이아웃 생성
    fun generateShuffledLayout(): List<String> {
        val keys = (0..9).map { it.toString() } + listOf("blank", "blank")
        return keys.shuffled()
    }

    // 키패드 이미지를 불러와서 Base64로 인코딩된 문자열로 반환
    fun buildKeypadImage(layout: List<String>): String {
        val width = 300
        val height = 400
        val keypadImage = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
        val graphics = keypadImage.createGraphics()

        val rows = 4
        val cols = 3
        val cellWidth = width / cols
        val cellHeight = height / rows

        for (i in layout.indices) {
            val image = ImageIO.read(Paths.get("src/main/resources/static/images/${layout[i]}.png").toFile())
            val x = (i % cols) * cellWidth
            val y = (i / cols) * cellHeight
            graphics.drawImage(image, x, y, cellWidth, cellHeight, null)
        }

        graphics.dispose()

        val outputStream = ByteArrayOutputStream()
        ImageIO.write(keypadImage, "png", outputStream)
        val imageBytes = outputStream.toByteArray()
        return Base64.getEncoder().encodeToString(imageBytes)
    }

    // HMAC 생성
    private fun generateHMAC(data: String, key: String): String {
        val hmacKey = key.toByteArray()
        val mac = MessageDigest.getInstance("SHA-256")
        mac.update(hmacKey)
        val digest = mac.digest(data.toByteArray())
        return Base64.getEncoder().encodeToString(digest)
    }

    // ID 및 timestamp 유효성 검증
    fun validateIdAndTimestamp(keypadId: String, timestamp: String, hash: String, secretKey: String): Boolean {
        val calculatedHash = generateHMAC(keypadId + timestamp, secretKey)
        return calculatedHash == hash
    }

    // userInput 복호화
    fun decryptUserInput(userInput: String, keyHashMap: Map<String, String>): String {
        return userInput.map { keyHashMap[it.toString()] ?: error("Invalid key") }.joinToString("")
    }

    // 키패드 응답 데이터 생성
    fun generateKeypadResponse(): KeypadResponse {
        val layout = generateShuffledLayout()
        val imageBase64 = buildKeypadImage(layout)

        val keypadId = UUID.randomUUID().toString()
        val timestamp = System.currentTimeMillis().toString()
        val secretKey = "your-secret-key"
        val hash = generateHMAC(keypadId + timestamp, secretKey)

        return KeypadResponse(
            layout = layout,
            imageBase64 = imageBase64,
            keypadId = keypadId,
            timestamp = timestamp,
            hash = hash
        )
    }
}
