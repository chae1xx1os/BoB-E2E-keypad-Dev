package bob.simple.spring.model

data class KeypadResponse(
    val layout: List<String>,
    val imageBase64: String,
    val keypadId: String,
    val timestamp: String,
    val hash: String
)
