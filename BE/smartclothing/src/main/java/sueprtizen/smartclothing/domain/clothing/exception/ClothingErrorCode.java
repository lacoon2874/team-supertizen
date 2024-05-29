package sueprtizen.smartclothing.domain.clothing.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ClothingErrorCode {
    CLOTHING_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 옷을 찾을 수 없습니다."),
    STYLE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 스타일을 찾을 수 없습니다."),
    TEXTURE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 소재를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String errorMessage;
}
