package sueprtizen.smartclothing.domain.location.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum LocationErrorCode {
    LOCATION_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 지역을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String errorMessage;
}
