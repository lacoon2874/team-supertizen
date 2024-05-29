package sueprtizen.smartclothing.domain.outfit.past.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sueprtizen.smartclothing.domain.outfit.past.dto.TodayClothingDTO;
import sueprtizen.smartclothing.domain.outfit.past.dto.TodayClothingDTOUpdateRequest;
import sueprtizen.smartclothing.domain.outfit.past.service.PastOutfitService;
import sueprtizen.smartclothing.global.dto.Message;

import java.util.List;

@RequestMapping("/outfit/past")
@RestController
@RequiredArgsConstructor
public class PastOutfitController {

    final private PastOutfitService pastOutfitService;

    @GetMapping("/today")
    public ResponseEntity<Message<List<TodayClothingDTO>>> getTodayOutfitList(
            @RequestHeader("User-Id") int userId
    ) {
        return ResponseEntity.ok(Message.success(pastOutfitService.todayOutfitsConfirmation(userId)));
    }

    @PutMapping("/today")
    public ResponseEntity<Message<Void>> updateTodayOutfitList(
            @RequestHeader("User-Id") int userId,
            @RequestBody TodayClothingDTOUpdateRequest todayClothingIds
    ) {
        pastOutfitService.updateTodayOutfits(userId, todayClothingIds);
        return ResponseEntity.ok(Message.success());
    }
}
