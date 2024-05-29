package sueprtizen.smartclothing.domain.clothing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClothingConfirmRequestDTO {
    @Schema(description = "옷 아이디", example = "1")
    private int clothingId;
}
