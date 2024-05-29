package sueprtizen.smartclothing.domain.weather.service;

import org.json.simple.parser.ParseException;
import org.springframework.web.client.RestTemplate;
import sueprtizen.smartclothing.domain.weather.dto.WeatherResponseDTO;

public interface WeatherService {

    WeatherResponseDTO weatherFromLocationAndDate(int locationKey, String date);

    void callOpenApi() throws ParseException;
}
