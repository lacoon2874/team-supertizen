package sueprtizen.smartclothing.global.fcm;

public interface FCMService {

    void saveFCMToken(Integer memberId, String token);

    void sendMessageTo(Long userId, String content, String title);
}