package sueprtizen.smartclothing.socket.machine.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sueprtizen.smartclothing.domain.calendar.entity.Schedule;
import sueprtizen.smartclothing.domain.clothing.service.ClothingService;
import sueprtizen.smartclothing.global.fcm.FCMService;
import sueprtizen.smartclothing.socket.machine.dto.AirdresserResponseDTO;
import sueprtizen.smartclothing.socket.machine.repository.AirdresserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AirdresserServiceImpl implements AirdresserService {
    private final AirdresserRepository airdresserRepository;
    private final ClothingService clothingService;
    private final FCMService fcmService;

    LocalDate today = LocalDate.now();

    @Transactional(readOnly = true)
    public List<JSONObject> getAllOutfitList() {
        List<Schedule> schedules = airdresserRepository.findAllByDateIsAfter(today);
        List<AirdresserResponseDTO> scheduleDtos = schedules.stream().map(entity -> AirdresserResponseDTO.builder()
                .image(entity.getOutfitImagePath())
                .schedule(entity.getScheduleName())
                .userName(entity.getUser().getUserName())
                .build()
        ).collect(Collectors.toList());

        List<JSONObject> jsonArray = new ArrayList<JSONObject>();
        for (AirdresserResponseDTO dto : scheduleDtos) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("image", dto.image());
            jsonObject.put("schedule", dto.schedule());
            jsonObject.put("userName", dto.userName());
            jsonArray.add(jsonObject);
        }

        return jsonArray;
    }

    @Transactional(readOnly = true)
    public List<JSONObject> getMainOutfitList() {
        List<Schedule> schedules = airdresserRepository.findTop2ByDateIsAfter(today);
        List<AirdresserResponseDTO> scheduleDtos = schedules.stream().map(entity -> AirdresserResponseDTO.builder()
                .image(entity.getOutfitImagePath())
                .schedule(entity.getScheduleName())
                .userName(entity.getUser().getUserName())
                .build()
        ).collect(Collectors.toList());

        List<JSONObject> jsonArray = new ArrayList<JSONObject>();
        for (AirdresserResponseDTO dto : scheduleDtos) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("image", dto.image());
            jsonObject.put("schedule", dto.schedule());
            jsonObject.put("userName", dto.userName());
            jsonArray.add(jsonObject);
        }

        return jsonArray;
    }

    public void addCareClothes(String rfid) {
        clothingService.putClothingIntoAirdresser(rfid);
        fcmService.sendMessageTo(Long.valueOf(clothingService.getClothingOwner(rfid)),"옷이 에어드레서에 들어갔습니다.","케어 알림");
    }

}
