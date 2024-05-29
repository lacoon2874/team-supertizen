package sueprtizen.smartclothing.socket.machine.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sueprtizen.smartclothing.domain.calendar.repository.CalendarRepository;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.clothing.service.ClothingService;
import sueprtizen.smartclothing.global.fcm.FCMService;
import sueprtizen.smartclothing.socket.machine.dto.WasherResponseDTO;
import sueprtizen.smartclothing.socket.machine.repository.WasherRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class WasherServiceImpl implements WasherService {
    private final WasherRepository washerRepository;
    private final ClothingService clothingService;
    private final FCMService fcmService;

    @Transactional(readOnly = true)
    public List<JSONObject> getAllLaundryList() {
        List<Clothing> laundry = washerRepository.findAllByNowAt("세탁기");
        List<WasherResponseDTO> laundryDtos = laundry.stream().map(entity -> WasherResponseDTO.builder()
                .texture(entity.getClothingDetail().getClothingTextures().get(0).getTexture().getTextureName())
                .image(entity.getClothingDetail().getClothingImgPath())
                .wornCount(entity.getWornCount())
                .build()
        ).toList();

        List<JSONObject> jsonArray = new ArrayList<JSONObject>();
        for (WasherResponseDTO dto : laundryDtos) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("texture", dto.texture());
            jsonObject.put("image", dto.image());
            jsonObject.put("wornCount", dto.wornCount());
            jsonArray.add(jsonObject);
        }

        return jsonArray;
    }

    @Transactional(readOnly = true)
    public List<JSONObject> getMainLaundryList() {
        List<Clothing> laundry = washerRepository.findTop2ByNowAt("세탁기");
        List<WasherResponseDTO> laundryDtos = laundry.stream().map(entity -> WasherResponseDTO.builder()
                .texture(entity.getClothingDetail().getClothingTextures().get(0).getTexture().getTextureName())
                .image(entity.getClothingDetail().getClothingImgPath())
                .wornCount(entity.getWornCount())
                .build()
        ).toList();

        List<JSONObject> jsonArray = new ArrayList<JSONObject>();
        for (WasherResponseDTO dto : laundryDtos) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("texture", dto.texture());
            jsonObject.put("image", dto.image());
            jsonObject.put("wornCount", dto.wornCount());
            jsonArray.add(jsonObject);
        }

        return jsonArray;
    }

    public void addLaundry(String rfid) {
        clothingService.putClothingIntoWasher(rfid);
        fcmService.sendMessageTo(Long.valueOf(clothingService.getClothingOwner(rfid)),"옷이 세탁기에 들어갔습니다.","세탁 알림");
    }
}
