package sueprtizen.smartclothing.global.fcm;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sueprtizen.smartclothing.domain.users.entity.User;
import sueprtizen.smartclothing.domain.users.exception.UserErrorCode;
import sueprtizen.smartclothing.domain.users.exception.UserException;
import sueprtizen.smartclothing.domain.users.repository.UserRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FCMServiceImpl implements FCMService {
    private final UserRepository userRepository;

    @Transactional
    @Override
    public void saveFCMToken(Integer userId, String token) {
        Optional<User> user = userRepository.findByUserId(userId);
        if(user.isPresent()){
            user.get().updateToken(token);
        }

    }

    @Override
    public void sendMessageTo(Long userId, String body, String title) {
        // token 찾고
        User user = userRepository.findByUserId(userId.intValue()).orElseThrow(()
                -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));
        String token = user.getFcmToken();

        // makeMessage 로 리팩토링
        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();

        // firebase에 비동기 전송
        FirebaseMessaging.getInstance().sendAsync(message);
    }
}