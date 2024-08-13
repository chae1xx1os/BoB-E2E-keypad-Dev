package bob.simple.spring.controller

import bob.simple.spring.model.KeypadResponse
import bob.simple.spring.service.KeypadService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin // 이 줄을 추가합니다.
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/keypad")
@CrossOrigin(origins = ["http://localhost:3000"]) // 이 애노테이션을 사용하여 CORS 문제를 해결합니다.
class KeypadController(val keypadService: KeypadService) {

    @GetMapping
    fun getKeypad(): ResponseEntity<KeypadResponse> {
        val keypadResponse = keypadService.generateKeypadResponse()
        return ResponseEntity.ok(keypadResponse)
    }
}
