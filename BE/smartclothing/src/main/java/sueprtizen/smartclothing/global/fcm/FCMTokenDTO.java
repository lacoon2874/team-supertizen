package sueprtizen.smartclothing.global.fcm;

import com.google.firebase.database.annotations.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FCMTokenDTO {
    @NotNull
    private String token;

}