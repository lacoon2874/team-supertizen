package sueprtizen.smartclothing.domain.calendar.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sueprtizen.smartclothing.domain.calendar.dto.*;
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
import sueprtizen.smartclothing.domain.outfit.recommended.entity.RecommendedOutfit;
import sueprtizen.smartclothing.domain.outfit.recommended.repository.RecommendedOutfitRepository;
import sueprtizen.smartclothing.domain.users.entity.User;
import sueprtizen.smartclothing.domain.users.exception.UserErrorCode;
import sueprtizen.smartclothing.domain.users.exception.UserException;
import sueprtizen.smartclothing.domain.users.repository.UserRepository;
import sueprtizen.smartclothing.domain.weather.entity.Weather;
import sueprtizen.smartclothing.domain.weather.repository.WeatherRepository;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {
    final UserRepository userRepository;
    final CalendarRepository calendarRepository;
    final WeatherRepository weatherRepository;
    final ClothingRepository clothingRepository;
    final RecommendedOutfitRepository recommendedOutfitRepository;
    final UserClothingRepository userClothingRepository;

    @Override
    public CalendarMonthlyScheduleResponseDTO calendarMonthlySchedules(
            int userId,
            String startDate,
            String endDate
    ) {
        User currentUser = getUser(userId);


        List<ScheduleDTO> schedules = calendarRepository.findSchedulesByUserAndDateBetweenOrderByDateAsc(
                currentUser,
                LocalDate.parse(startDate),
                LocalDate.parse(endDate)
        ).stream().map(schedule ->
                new ScheduleDTO(
                        schedule.getScheduleId(),
                        schedule.getScheduleName(),
                        schedule.getScheduleCategory(),
                        schedule.getDate().toString()
                )
        ).toList();

        return new CalendarMonthlyScheduleResponseDTO(schedules);
    }

    @Override
    @Transactional
    public void scheduleSave(int userId, ScheduleSaveRequestDTO scheduleSaveRequestDTO, MultipartFile file) {
        User currentUser = getUser(userId);

        Optional<Schedule> oldSchedule = calendarRepository.findScheduleByUserAndDate(currentUser, LocalDate.parse(scheduleSaveRequestDTO.date()));

        if (oldSchedule.isPresent()) {
            throw new CalendarException(CalendarErrorCode.SCHEDULE_ALREADY_EXISTS);
        }

        Optional<Weather> weather = weatherRepository.findByLocationKeyAndDate(
                scheduleSaveRequestDTO.locationKey(),
                LocalDate.parse(scheduleSaveRequestDTO.date())
        );

        //TODO: file 저장 후 file 위치 저장
        String uploadDir = "/app/outfit_images/";
        String fileName = UUID.randomUUID()+".png";
        // 파일 객체 생성
        File outfitPNG = new File(uploadDir + fileName);

        try {
            // 파일 저장
            file.transferTo(outfitPNG);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


        Schedule newScheDule;

        if (weather.isEmpty()) {
            newScheDule = Schedule.builder()
                    .scheduleName(scheduleSaveRequestDTO.title())
                    .scheduleCategory(scheduleSaveRequestDTO.category())
                    .user(currentUser)
                    .outfitImagePath("https://j10s006.p.ssafy.io/outfit/"+fileName) //url
                    .date(LocalDate.parse(scheduleSaveRequestDTO.date()))
                    .locationKey(scheduleSaveRequestDTO.locationKey())
                    .build();
        } else {
            newScheDule = Schedule.builder()
                    .scheduleName(scheduleSaveRequestDTO.title())
                    .scheduleCategory(scheduleSaveRequestDTO.category())
                    .user(currentUser)
                    .outfitImagePath("https://j10s006.p.ssafy.io/outfit/"+fileName)
                    .weather(weather.get())
                    .date(LocalDate.parse(scheduleSaveRequestDTO.date()))
                    .locationKey(scheduleSaveRequestDTO.locationKey())
                    .build();
        }

        calendarRepository.save(newScheDule);

        scheduleSaveRequestDTO.clothing().forEach(
                outfitRequestDTO -> {
                    Clothing clothing = clothingRepository.findById(outfitRequestDTO.clothingId())
                            .orElseThrow(() -> new ClothingException(ClothingErrorCode.CLOTHING_NOT_FOUND));
                    RecommendedOutfit newRecommendedOutfit = new RecommendedOutfit(
                            newScheDule,
                            clothing,
                            outfitRequestDTO.x(),
                            outfitRequestDTO.y(),
                            outfitRequestDTO.width(),
                            outfitRequestDTO.height()
                    );
                    recommendedOutfitRepository.save(newRecommendedOutfit);

                }
        );
    }

    @Override
    @Transactional
    public void scheduleDelete(int userId, String date) {
        User currentUser = getUser(userId);

        LocalDate scheduleDate = LocalDate.parse(date);

        Schedule schedule = calendarRepository.findScheduleByUserAndDate(currentUser, scheduleDate)
                .orElseThrow(() -> new CalendarException(CalendarErrorCode.SCHEDULE_NOT_FOUND));

        schedule.updateScheduleDisabled(true);

    }

    @Override
    public ScheduleDetailResponseDTO scheduleConfirmation(int userId, String date) {
        User currentUser = getUser(userId);

        LocalDate scheduleDate = LocalDate.parse(date);

        Schedule schedule = calendarRepository.findScheduleByUserAndDate(currentUser, scheduleDate)
                .orElseThrow(() -> new CalendarException(CalendarErrorCode.SCHEDULE_NOT_FOUND));

        ScheduleDTO scheduleDTO = new ScheduleDTO(
                schedule.getScheduleId(),
                schedule.getScheduleName(),
                schedule.getScheduleCategory(),
                schedule.getDate().toString()
        );

        List<OutfitResponseDTO> outfitResponseDTOList = schedule.getRecommendedOutfits().stream().map(recommendedOutfit ->
                new OutfitResponseDTO(
                        recommendedOutfit.getRecommendedOutfitId(),
                        recommendedOutfit.getClothing().getClothingDetail().getClothingImgPath(),
                        recommendedOutfit.getX(),
                        recommendedOutfit.getY(),
                        recommendedOutfit.getWidth(),
                        recommendedOutfit.getHeight()
                )
        ).toList();

        return new ScheduleDetailResponseDTO(
                scheduleDTO,
                outfitResponseDTOList
        );


    }

    @Override
    public ScheduleOutfitResponseDTO scheduleOutfitConformation(int userId, String date) {
        User currentUser = getUser(userId);

        LocalDate localDate = LocalDate.parse(date);

        Schedule schedule = calendarRepository.findScheduleByUserAndDate(currentUser, localDate)
                .orElseThrow(() -> new CalendarException(CalendarErrorCode.SCHEDULE_NOT_FOUND));

        List<ClothingInfoDTO> clothingInfoDTOList = schedule.getRecommendedOutfits().stream().map(recommendedOutfit ->
                {
                    Clothing clothing = recommendedOutfit.getClothing();
                    UserClothing userClothing = userClothingRepository.findUserClothingByClothing(currentUser, clothing)
                            .orElseThrow(() -> new ClothingException(ClothingErrorCode.CLOTHING_NOT_FOUND));

                    //TODO: 현재 어디에 있는지 확인, 입은 횟수 확인 후 세탁 필요 여부 확인 필요
                    return new ClothingInfoDTO(
                            clothing.getClothingId(),
                            userClothing.getClothingName(),
                            clothing.getClothingDetail().getClothingImgPath(),
                            String.format("현재 %s에 있습니다.", clothing.getNowAt())
                    );
                }
        ).toList();

        return new ScheduleOutfitResponseDTO(
                schedule.getScheduleId(),
                schedule.getScheduleCategory(),
                schedule.getScheduleName(),
                schedule.getOutfitImagePath(),
                clothingInfoDTOList
        );
    }

    @Override
    public ScheduleCheckingResponseDTO scheduleChecking(int userId, String date) {
        User currentUser = getUser(userId);
        return calendarRepository.findScheduleByUserAndDate(currentUser, LocalDate.parse(date)).map(schedule ->
                new ScheduleCheckingResponseDTO(true)
        ).orElseGet(() -> new ScheduleCheckingResponseDTO(false));
    }


    private User getUser(int userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));
    }
}
