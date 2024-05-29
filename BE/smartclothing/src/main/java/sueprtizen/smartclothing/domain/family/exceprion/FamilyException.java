package sueprtizen.smartclothing.domain.family.exceprion;

import lombok.Getter;

@Getter
public class FamilyException extends RuntimeException {
    private final FamilyErrorCode errorCode;

    public FamilyException(FamilyErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
