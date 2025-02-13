package com.example; 

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*") 
public class WeatherController {

    private final String GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search?name=%s&count=1&language=en&format=json";
    private final String WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current_weather=true";

    @GetMapping
    public Map<String, Object> getWeather(@RequestParam String city) {
        RestTemplate restTemplate = new RestTemplate();

        // Step 1: Get Latitude & Longitude
        String geoUrl = String.format(GEO_API_URL, city);
        Map geoResponse = restTemplate.getForObject(geoUrl, Map.class);

        if (geoResponse == null || !geoResponse.containsKey("results")) {
            return Map.of("error", "City not found");
        }

        Map<String, Object> location = ((Map<String, Object>) ((java.util.List<?>) geoResponse.get("results")).get(0));
        double latitude = (double) location.get("latitude");
        double longitude = (double) location.get("longitude");

    
        String weatherUrl = String.format(WEATHER_API_URL, latitude, longitude);
        Map weatherResponse = restTemplate.getForObject(weatherUrl, Map.class);

        if (weatherResponse == null || !weatherResponse.containsKey("current_weather")) {
            return Map.of("error", "Weather data not found");
        }

        return weatherResponse;
    }
}
