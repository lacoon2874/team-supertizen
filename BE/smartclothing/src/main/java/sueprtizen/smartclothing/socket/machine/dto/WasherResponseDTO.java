package sueprtizen.smartclothing.socket.machine.dto;

import lombok.Builder;

@Builder
public record WasherResponseDTO(
        String image, String texture, Integer wornCount, String schedule, String userName
) {
}
