package sueprtizen.smartclothing.domain.outfit.past.service;

import lombok.RequiredArgsConstructor;
import org.json.simple.JSONArray;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sueprtizen.smartclothing.domain.calendar.entity.Schedule;
import sueprtizen.smartclothing.domain.calendar.exception.CalendarErrorCode;
import sueprtizen.smartclothing.domain.calendar.exception.CalendarException;
import sueprtizen.smartclothing.domain.calendar.repository.CalendarRepository;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.clothing.entity.UserClothing;
import sueprtizen.smartclothing.domain.clothing.exception.ClothingErrorCode;
import sueprtizen.smartclothing.domain.clothing.exception.ClothingException;
import sueprtizen.smartclothing.domain.clothing.repository.ClothingRepository;
import sueprtizen.smartclothing.domain.clothing.repository.UserClothingRepository;
import sueprtizen.smartclothing.domain.outfit.past.dto.TodayClothingDTO;
import sueprtizen.smartclothing.domain.outfit.past.dto.TodayClothingDTOUpdateRequest;
import sueprtizen.smartclothing.domain.outfit.past.entity.PastOutfit;
import sueprtizen.smartclothing.domain.outfit.past.repository.PastOutfitRepository;
import sueprtizen.smartclothing.domain.users.entity.User;
import sueprtizen.smartclothing.domain.users.exception.UserErrorCode;
import sueprtizen.smartclothing.domain.users.exception.UserException;
import sueprtizen.smartclothing.domain.users.repository.UserRepository;
import sueprtizen.smartclothing.global.fcm.FCMService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class PastOutfitServiceImpl implements PastOutfitService {
    final private UserRepository userRepository;
    final private CalendarRepository calendarRepository;
    final private PastOutfitRepository pastOutfitRepository;
    final private ClothingRepository clothingRepository;
    final private UserClothingRepository userClothingRepository;
    final private FCMService fcmService;


    @Override
    public List<TodayClothingDTO> todayOutfitsConfirmation(int userId) {
        User currentUser = getUser(userId);

        List<PastOutfit> pastOutFitList = pastOutfitRepository.findAllBySchedule_UserAndSchedule_Date(
                currentUser, LocalDate.now()
        );

        AtomicInteger index = new AtomicInteger(1);

        return pastOutFitList.stream().map(
                pastOutfit -> {
                    Clothing clothing = pastOutfit.getClothing();
                    String clothingName;

                    Optional<UserClothing> userClothing = userClothingRepository.findUserClothingByClothing(currentUser, clothing);

                    if (userClothing.isEmpty()) {
                        clothingName = "옷" + index.getAndIncrement();
                    } else {
                        clothingName = userClothing.get().getClothingName();
                    }
                    return new TodayClothingDTO(
                            clothing.getClothingId(), clothingName, clothing.getClothingDetail().getClothingImgPath()
                    );
                }
        ).toList();
    }

    @Transactional
    @Override
    public void updateTodayOutfits(int userId, TodayClothingDTOUpdateRequest todayClothingList) {
        User currentUser = getUser(userId);
        pastOutfitRepository.deleteAllBySchedule_UserAndSchedule_Date(currentUser, LocalDate.now());

        Schedule schedule = calendarRepository.findScheduleByUserAndDate(currentUser, LocalDate.now())
                .orElseThrow(() -> new CalendarException(CalendarErrorCode.SCHEDULE_NOT_FOUND));

        List<PastOutfit> newPastOutfitList = todayClothingList.todayClothing().stream().map(
                clothingId -> {
                    Clothing clothing = clothingRepository.findById(clothingId).orElseThrow(
                            () -> new ClothingException(ClothingErrorCode.CLOTHING_NOT_FOUND)
                    );
                    return PastOutfit.builder()
                            .schedule(schedule)
                            .clothing(clothing)
                            .build();
                }
        ).toList();
        pastOutfitRepository.saveAll(newPastOutfitList);
    }

    public void addTodayOutfit(Long userId, JSONArray clothes){
        Schedule todaySchedule = calendarRepository.findScheduleByUserAndDate(getUser(userId.intValue()), LocalDate.now())
                .orElseThrow(() -> new CalendarException(CalendarErrorCode.SCHEDULE_NOT_FOUND));
        for(Object clothing:clothes){
            Clothing tmpClothing = clothingRepository.findByRfidUid(String.valueOf(clothing));
            PastOutfit newpastOutfit = new PastOutfit(todaySchedule,tmpClothing);
            pastOutfitRepository.save(newpastOutfit);
        }
        fcmService.sendMessageTo(userId,"오늘 입은 옷이 인식되었어요. 맞는 지 확인해주세요.","RFID 태깅 알림");
    }

    private User getUser(int userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));
    }
}
