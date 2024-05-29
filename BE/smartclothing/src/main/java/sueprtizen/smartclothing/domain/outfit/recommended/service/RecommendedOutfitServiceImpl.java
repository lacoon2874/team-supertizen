package sueprtizen.smartclothing.domain.outfit.recommended.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sueprtizen.smartclothing.domain.calendar.entity.Schedule;
import sueprtizen.smartclothing.domain.calendar.exception.CalendarErrorCode;
import sueprtizen.smartclothing.domain.calendar.exception.CalendarException;
import sueprtizen.smartclothing.domain.calendar.repository.CalendarRepository;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.clothing.entity.UserClothing;
import sueprtizen.smartclothing.domain.clothing.exception.ClothingErrorCode;
import sueprtizen.smartclothing.domain.clothing.exception.ClothingException;
import sueprtizen.smartclothing.domain.clothing.repository.UserClothingRepository;
import sueprtizen.smartclothing.domain.outfit.recommended.dto.ClothingInPastOutfitResponseDTO;
import sueprtizen.smartclothing.domain.outfit.recommended.dto.PastOutfitResponseDTO;
import sueprtizen.smartclothing.domain.outfit.recommended.dto.ScheduleDTO;
import sueprtizen.smartclothing.domain.outfit.recommended.dto.WeatherDTO;
import sueprtizen.smartclothing.domain.outfit.recommended.entity.RecommendedOutfit;
import sueprtizen.smartclothing.domain.outfit.recommended.repository.RecommendedOutfitRepository;
import sueprtizen.smartclothing.domain.users.entity.User;
import sueprtizen.smartclothing.domain.users.exception.UserErrorCode;
import sueprtizen.smartclothing.domain.users.exception.UserException;
import sueprtizen.smartclothing.domain.users.repository.UserRepository;
import sueprtizen.smartclothing.domain.weather.entity.Weather;
import sueprtizen.smartclothing.domain.weather.exception.WeatherErrorCode;
import sueprtizen.smartclothing.domain.weather.exception.WeatherException;
import sueprtizen.smartclothing.domain.weather.repository.WeatherRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RecommendedOutfitServiceImpl implements RecommendedOutfitService {

    final UserRepository userRepository;
    final CalendarRepository calendarRepository;
    final RecommendedOutfitRepository recommendedOutfitRepository;
    final WeatherRepository weatherRepository;
    final UserClothingRepository userClothingRepository;

    @Override
    public List<PastOutfitResponseDTO> pastOutfitConformation(int userId) {
        User currentUser = getUser(userId);

        List<Schedule> scheduleList = calendarRepository.findAllByUserOrderByDateAsc(currentUser, LocalDate.now());

        List<PastOutfitResponseDTO> pastOutfitResponseDTOList = new ArrayList<>();

        for (Schedule schedule : scheduleList) {

            ScheduleDTO scheduleDTO = ScheduleDTO.builder()
                    .scheduleId(schedule.getScheduleId())
                    .scheduleCategory(schedule.getScheduleCategory())
                    .date(schedule.getDate().toString())
                    .outfitImagePath(schedule.getOutfitImagePath())
                    .build();


            Weather weather = weatherRepository.findByLocationKeyAndDate(schedule.getLocationKey(), schedule.getDate())
                    .orElseThrow(() -> new WeatherException(WeatherErrorCode.WEATHER_NOT_FOUND));

            WeatherDTO weatherDTO = WeatherDTO.builder()
                    .highestTemperature(weather.getHighestTemperature())
                    .lowestTemperature(weather.getLowestTemperature())
                    .icon(weather.getIcon())
                    .build();


            pastOutfitResponseDTOList.add(new PastOutfitResponseDTO(scheduleDTO, weatherDTO));
        }


        return pastOutfitResponseDTOList;
    }

    @Override
    public List<ClothingInPastOutfitResponseDTO> getClothingInPastOutfit(int userId, int scheduleId) {
        User currentUser = getUser(userId);
        Schedule schedule = calendarRepository.findScheduleByUserAndScheduleId(currentUser, scheduleId)
                .orElseThrow(() -> new CalendarException(CalendarErrorCode.SCHEDULE_NOT_FOUND));


        List<RecommendedOutfit> recommendedOutfitList = recommendedOutfitRepository.findAllBySchedule(schedule);

        return recommendedOutfitList.stream().map(pastOutfit -> {
                    Clothing clothing = pastOutfit.getClothing();
            UserClothing userClothing = userClothingRepository.findUserClothingByClothing(currentUser, clothing)
                    .orElseThrow(() -> new ClothingException(ClothingErrorCode.CLOTHING_NOT_FOUND));
                    return ClothingInPastOutfitResponseDTO.builder()
                            .clothingId(clothing.getClothingId())
                            .clothingName(userClothing.getClothingName())
                            .x(pastOutfit.getX())
                            .y(pastOutfit.getY())
                            .width(pastOutfit.getWidth())
                            .height(pastOutfit.getHeight())
                            .clothingImagePath(clothing.getClothingDetail().getClothingImgPath())
                            .build();
                }
        ).toList();

    }

    private User getUser(int userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));
    }
}
