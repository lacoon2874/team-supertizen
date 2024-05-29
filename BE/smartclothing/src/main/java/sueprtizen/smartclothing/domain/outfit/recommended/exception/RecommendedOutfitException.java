package sueprtizen.smartclothing.domain.outfit.recommended.exception;

import lombok.Getter;

@Getter
public class RecommendedOutfitException extends RuntimeException {
    private final RecommendedOutfitErrorCode errorCode;

    public RecommendedOutfitException(RecommendedOutfitErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
