package sueprtizen.smartclothing.domain.clothing.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sueprtizen.smartclothing.domain.clothing.dto.*;
import sueprtizen.smartclothing.domain.clothing.service.ClothingService;
import sueprtizen.smartclothing.global.dto.Message;

import java.util.List;

@RequestMapping("/clothing")
@RestController
@RequiredArgsConstructor
public class ClothingController {

    private final ClothingService clothingService;

    @Operation(summary = "옷장 조회", description = "사용자의 옷장안의 모든 옷의 이미지와 id를 가져옵니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ClosetConfirmResponseDTO.class))),
    })
    @GetMapping
    public ResponseEntity<Message<List<ClosetConfirmResponseDTO>>> getClothingList(
            @RequestHeader("User-ID") int userId
    ) {
        List<ClosetConfirmResponseDTO> clothingList = clothingService.closetConfirmation(userId);
        return ResponseEntity.ok(Message.success(clothingList));
    }

    @GetMapping("/{clothingId}")
    public ResponseEntity<Message<ClothingConfirmResponseDTO>> clothingConfirm(
            @RequestHeader("User-ID") int userId,
            @PathVariable int clothingId
    ) {
        ClothingConfirmResponseDTO clothingConfirmResponseDTO = clothingService.clothingConfirmation(userId, clothingId);
        return ResponseEntity.ok(Message.success(clothingConfirmResponseDTO));
    }

    @DeleteMapping("/{clothingId}")
    public ResponseEntity<Message<Void>> removeClothing(
            @RequestHeader("User-ID") int userId,
            @PathVariable int clothingId
    ) {
        clothingService.removeClothing(userId, clothingId);
        return ResponseEntity.ok(Message.success());
    }

    @PutMapping("/{clothingId}")
    public ResponseEntity<Message<Void>> updateClothing(
            @RequestHeader("User-ID") int userId,
            @RequestBody ClothingUpdateRequestDTO clothingUpdateRequestDTO
    ) {
        clothingService.updateClothing(userId, clothingUpdateRequestDTO);
        return ResponseEntity.ok(Message.success());
    }

    @GetMapping("/position")
    public ResponseEntity<Message<List<ClothingPositionResponseDTO>>> getClothingPosition(
            @RequestHeader("User-ID") int userId
    ) {
        List<ClothingPositionResponseDTO> clothingPosition = clothingService.getClothingPosition(userId);
        return ResponseEntity.ok(Message.success(clothingPosition));
    }

    @GetMapping("/{clothingId}/info")
    public ResponseEntity<Message<ClothingWashInfoResponseDTO>> getClothingWashInfo(
            @RequestHeader("User-ID") int userId,
            @PathVariable int clothingId
    ) {
        ClothingWashInfoResponseDTO clothingInfo = clothingService.getClothingWashInfo(userId, clothingId);
        return ResponseEntity.ok(Message.success(clothingInfo));
    }

}
