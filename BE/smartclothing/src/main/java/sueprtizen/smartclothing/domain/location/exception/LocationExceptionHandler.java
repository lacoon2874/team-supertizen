package sueprtizen.smartclothing.domain.location.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import sueprtizen.smartclothing.domain.weather.exception.WeatherException;
import sueprtizen.smartclothing.global.dto.Message;


@Slf4j
@RestControllerAdvice
public class LocationExceptionHandler {

    @ExceptionHandler(sueprtizen.smartclothing.domain.weather.exception.WeatherException.class)
    public ResponseEntity<Message<Void>> userException(WeatherException e) {
        log.error("위치 관련 오류: {}", e.getMessage());
        return ResponseEntity.status(e.getErrorCode().getHttpStatus()).body(Message.fail(e.getErrorCode().getHttpStatus(), e.getErrorCode().getErrorMessage()));
    }
}
