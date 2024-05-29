package sueprtizen.smartclothing.domain.weather.controller;

import com.google.api.client.util.Value;
import lombok.RequiredArgsConstructor;
import org.json.simple.parser.ParseException;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import sueprtizen.smartclothing.domain.weather.dto.WeatherResponseDTO;
import sueprtizen.smartclothing.domain.weather.service.WeatherService;
import sueprtizen.smartclothing.global.dto.Message;

@RequestMapping("/weather")
@RestController
@RequiredArgsConstructor
public class WeatherController {

    @Value("{WEATHER_KEY}")
    private String serviceKey;

    final WeatherService weatherService;

    @GetMapping()
    public ResponseEntity<Message<WeatherResponseDTO>> weatherFromLocationAndDate(
            @RequestParam int locationKey,
            @RequestParam String date) {
        return ResponseEntity.ok(
                Message.success(weatherService.weatherFromLocationAndDate(locationKey, date))
        );
    }

    @Scheduled(cron="0 0 0 * * * ",zone="Asia/Seoul")
    @GetMapping("/openApi")
    public void callOpenApi() throws ParseException {
        weatherService.callOpenApi();
    }

}

