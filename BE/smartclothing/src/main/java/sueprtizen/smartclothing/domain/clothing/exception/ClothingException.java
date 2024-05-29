package sueprtizen.smartclothing.domain.clothing.exception;

import lombok.Getter;

@Getter
public class ClothingException extends RuntimeException {
    private final ClothingErrorCode errorCode;

    public ClothingException(ClothingErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
