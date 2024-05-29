package sueprtizen.smartclothing.global.fcm;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sueprtizen.smartclothing.global.dto.Message;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class FCMController {
    private final FCMService fcmService;

    /**
     * FCM Token 저장
     *
     * @param fcmTokenDto FCM Token
     * @return
     */
    @PostMapping()
    public ResponseEntity saveFCMToken(@RequestHeader("User-Id") @Valid int userId, @RequestBody FCMTokenDTO fcmTokenDto) {

        fcmService.saveFCMToken(userId, fcmTokenDto.getToken());

        return ResponseEntity.ok(Message.success());
    }

}