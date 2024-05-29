package sueprtizen.smartclothing.domain.weather.service;

import lombok.RequiredArgsConstructor;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import sueprtizen.smartclothing.domain.location.service.LocationService;
import sueprtizen.smartclothing.domain.weather.dto.WeatherResponseDTO;
import sueprtizen.smartclothing.domain.weather.entity.Weather;
import sueprtizen.smartclothing.domain.weather.exception.WeatherErrorCode;
import sueprtizen.smartclothing.domain.weather.exception.WeatherException;
import sueprtizen.smartclothing.domain.weather.repository.WeatherRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService {

    final WeatherRepository weatherRepository;
    private final LocationService locationService;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public WeatherResponseDTO weatherFromLocationAndDate(int locationKey, String date) {
        Weather weather = weatherRepository.findByLocationKeyAndDate(locationKey, LocalDate.parse(date))
                .orElseThrow(() -> new WeatherException(WeatherErrorCode.WEATHER_NOT_FOUND));
        return new WeatherResponseDTO(
                weather.getIcon(),
                weather.getLowestTemperature(),
                weather.getHighestTemperature(),
                weather.getLowestRealFeelingTemperature(),
                weather.getHighestRealFeelingTemperature(),
                weather.getPrecipitation(),
                weather.getSnowCover(),
                weather.getHumidity(),
                weather.getWindSpeed(),
                weather.getSolarIrradiance(),
                weather.getUv(),
                weather.getUVMessage()

        );
    }

    Double changeToDouble(Object obj) {
        String strX = (obj).toString();
        return Double.parseDouble(strX);
    }

    public void callOpenApi() throws ParseException {
        JSONParser parser = new JSONParser();

        List<Integer> keys = locationService.findAllLocationKeys();
        String basicUrl = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/";

        for (Integer key : keys) {
            String url = basicUrl + key +
                    "?apikey=" + "RqMYXRbKGhJchYNWS3vlUsYYBt8OAG4A" + //이 부분 꼭 value로 바꾸기!!
                    "&language=ko-kr&details=true&metric=true";
            ResponseEntity response = restTemplate.getForEntity(url, String.class);
            JSONObject body = (JSONObject) parser.parse(response.getBody().toString());
            JSONArray daily = (JSONArray) body.get("DailyForecasts");
            for (Object day : daily) {
                JSONObject jsonDay = (JSONObject) day;
                LocalDate date = LocalDate.parse(((String) jsonDay.get("Date")).split("T")[0]);
                JSONObject dayTime = (JSONObject) jsonDay.get("Day");
                JSONObject temp = (JSONObject) jsonDay.get("Temperature");
                JSONObject real = (JSONObject) jsonDay.get("RealFeelTemperature");
                JSONObject minTemp = (JSONObject) temp.get("Minimum");
                JSONObject maxTemp = (JSONObject) temp.get("Maximum");
                JSONObject realMinTem = (JSONObject) real.get("Minimum");
                JSONObject realMaxTem = (JSONObject) real.get("Maximum");
                JSONObject rain = (JSONObject) dayTime.get("Rain");
                JSONObject snow = (JSONObject) dayTime.get("Snow");
                JSONObject humidity = (JSONObject) dayTime.get("RelativeHumidity");
                JSONObject wind = (JSONObject) dayTime.get("Wind");
                JSONObject speed = (JSONObject) wind.get("Speed");
                JSONObject solar = (JSONObject) dayTime.get("SolarIrradiance");
                JSONObject air = (JSONObject) ((JSONArray) (jsonDay.get("AirAndPollen"))).get(5);

                Weather newWeather = new Weather(
                        key, date, Integer.parseInt(dayTime.get("Icon").toString()), changeToDouble(minTemp.get("Value")), changeToDouble(maxTemp.get("Value")), changeToDouble(realMinTem.get("Value")), changeToDouble(realMaxTem.get("Value")), changeToDouble(rain.get("Value")), changeToDouble(snow.get("Value")), changeToDouble(humidity.get("Average")), changeToDouble(speed.get("Value")), changeToDouble(solar.get("Value")), changeToDouble(air.get("Value")), (String) air.get("Category")
                );

                Optional<Weather> weather = weatherRepository.findByLocationKeyAndDate(key, date);
                if (weather.isPresent()) {
                    weather.get().updateValue(newWeather);
                } else {

                    weatherRepository.save(newWeather);
                }

            }
        }
    }
}