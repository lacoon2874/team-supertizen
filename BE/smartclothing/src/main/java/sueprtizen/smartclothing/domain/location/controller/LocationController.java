package sueprtizen.smartclothing.domain.location.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sueprtizen.smartclothing.domain.location.dto.SiDoResponseDTO;
import sueprtizen.smartclothing.domain.location.dto.SiGunGuResponseDTO;
import sueprtizen.smartclothing.domain.location.service.LocationService;
import sueprtizen.smartclothing.global.dto.Message;

@RequestMapping("/location")
@RestController
@RequiredArgsConstructor
public class LocationController {
    final LocationService locationService;
    @GetMapping("/si-do")
    public ResponseEntity<Message<SiDoResponseDTO>> AllSiDo() {
        return ResponseEntity.ok(Message.success(locationService.AllSiDo()));
    }

    @GetMapping("/si-gun-gu/{siDoId}")
    public ResponseEntity<Message<SiGunGuResponseDTO>> AllSiGunGuInSiDO(
            @PathVariable int siDoId
    ) {
        return ResponseEntity.ok(Message.success(locationService.AllSiGunGuInSiDo(siDoId)));
    }


}

