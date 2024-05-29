package sueprtizen.smartclothing.socket.clothes.dto;

import lombok.Builder;

@Builder
public record SocketUserResponseDTO(Integer userId, String userName,String image) {
}
