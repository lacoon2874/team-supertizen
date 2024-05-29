package sueprtizen.smartclothing.domain.calendar.exception;

import lombok.Getter;

@Getter
public class CalendarException extends RuntimeException {
    private final CalendarErrorCode errorCode;

    public CalendarException(CalendarErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
