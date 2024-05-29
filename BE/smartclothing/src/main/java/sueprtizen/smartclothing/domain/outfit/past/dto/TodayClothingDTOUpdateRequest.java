package sueprtizen.smartclothing.domain.outfit.past.dto;

import java.util.List;

public record TodayClothingDTOUpdateRequest(
        List<Integer> todayClothing
) {
}
