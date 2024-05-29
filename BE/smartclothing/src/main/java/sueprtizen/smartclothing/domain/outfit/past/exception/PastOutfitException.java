package sueprtizen.smartclothing.domain.outfit.past.exception;

import lombok.Getter;

@Getter
public class PastOutfitException extends RuntimeException {
    private final sueprtizen.smartclothing.domain.outfit.past.exception.PastOutfitErrorCode errorCode;

    public PastOutfitException(PastOutfitErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
