package sueprtizen.smartclothing.socket.machine.dto;

import lombok.Builder;

@Builder
public record AirdresserResponseDTO(
        String image, String schedule, String userName
) {
}
