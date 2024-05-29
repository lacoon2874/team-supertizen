package sueprtizen.smartclothing.domain.location.exception;

import lombok.Getter;

@Getter
public class LocationException extends RuntimeException {
    private final sueprtizen.smartclothing.domain.location.exception.LocationErrorCode errorCode;

    public LocationException(LocationErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
