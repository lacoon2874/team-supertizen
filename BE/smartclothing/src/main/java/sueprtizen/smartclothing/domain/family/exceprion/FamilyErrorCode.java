package sueprtizen.smartclothing.domain.family.exceprion;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum FamilyErrorCode {
    FAMILY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 가족을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String errorMessage;
}
