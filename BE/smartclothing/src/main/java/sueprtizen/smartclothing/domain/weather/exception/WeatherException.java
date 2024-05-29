package sueprtizen.smartclothing.domain.weather.exception;

import lombok.Getter;

@Getter
public class WeatherException extends RuntimeException {
    private final WeatherErrorCode errorCode;

    public WeatherException(WeatherErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
