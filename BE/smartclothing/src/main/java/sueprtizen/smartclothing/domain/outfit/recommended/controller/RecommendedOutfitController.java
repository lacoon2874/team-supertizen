package sueprtizen.smartclothing.domain.outfit.recommended.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sueprtizen.smartclothing.domain.outfit.recommended.dto.ClothingInPastOutfitResponseDTO;
import sueprtizen.smartclothing.domain.outfit.recommended.dto.PastOutfitResponseDTO;
import sueprtizen.smartclothing.domain.outfit.recommended.service.RecommendedOutfitService;
import sueprtizen.smartclothing.global.dto.Message;

import java.util.List;

@RequestMapping("/outfit/recommended")
@RestController
@RequiredArgsConstructor
public class RecommendedOutfitController {

    final private RecommendedOutfitService recommendedOutfitService;

    @GetMapping
    public ResponseEntity<Message<List<PastOutfitResponseDTO>>> getPastOutfitList(
            @RequestHeader("User-Id") int userId
    ) {
        return ResponseEntity.ok(Message.success(recommendedOutfitService.pastOutfitConformation(userId)));
    }

    @GetMapping("/pastOutfit")
    public ResponseEntity<Message<List<ClothingInPastOutfitResponseDTO>>> getPastOutfitList(
            @RequestHeader("User-Id") int userId,
            @RequestParam int scheduleId
    ) {
        return ResponseEntity.ok(Message.success(recommendedOutfitService.getClothingInPastOutfit(userId, scheduleId)));
    }
}
