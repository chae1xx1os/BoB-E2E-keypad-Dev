package bob.simple.spring.controller

import bob.simple.spring.model.KeypadResponse
import bob.simple.spring.service.KeypadService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/keypad")
@CrossOrigin(origins = ["http://localhost:3000"])
class KeypadController(val keypadService: KeypadService) {

    @GetMapping
    fun getKeypad(): ResponseEntity<KeypadResponse> {
        val keypadResponse = keypadService.generateKeypadResponse()
        return ResponseEntity.ok(keypadResponse)
    }

    @PostMapping("/auth")
    fun authenticate(
        @RequestParam keypadId: String,
        @RequestParam timestamp: String,
        @RequestParam hash: String,
        @RequestBody userInput: String,
        @RequestBody keyHashMap: Map<String, String>
    ): ResponseEntity<String> {
        val secretKey = "your-secret-key"
        return if (keypadService.validateIdAndTimestamp(keypadId, timestamp, hash, secretKey)) {
            val decryptedInput = keypadService.decryptUserInput(userInput, keyHashMap)
            ResponseEntity.ok("SUCCESS - $decryptedInput")
        } else {
            ResponseEntity.badRequest().body("FAILURE - Invalid ID or Timestamp")
        }
    }
}
