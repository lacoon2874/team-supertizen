package sueprtizen.smartclothing.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(title = "Smartclothing api",
                description = "Smartclothing api",
                version = "v1"
        )
)
@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                .group("user-api")
                .pathsToMatch("/users/**")
                .build();
    }

    @Bean
    public GroupedOpenApi clothingApi() {
        return GroupedOpenApi.builder()
                .group("clothing-api")
                .pathsToMatch("/clothing/**")
                .build();
    }

    @Bean
    public GroupedOpenApi calendarApi() {
        return GroupedOpenApi.builder()
                .group("calendar-api")
                .pathsToMatch("/calendar/**")
                .build();
    }

    @Bean
    public GroupedOpenApi weatherApi() {
        return GroupedOpenApi.builder()
                .group("weather-api")
                .pathsToMatch("/weather/**")
                .build();
    }

    @Bean
    public GroupedOpenApi locationApi() {
        return GroupedOpenApi.builder()
                .group("location-api")
                .pathsToMatch("/location/**")
                .build();
    }

    @Bean
    public GroupedOpenApi recommendedOutfitApi() {
        return GroupedOpenApi.builder()
                .group("recommendedOutfit-api")
                .pathsToMatch("/outfit/recommended/**")
                .build();
    }

    @Bean
    public GroupedOpenApi pastOutfitApi() {
        return GroupedOpenApi.builder()
                .group("pastOutfit-api")
                .pathsToMatch("/outfit/past/**")
                .build();
    }

    @Bean
    public GroupedOpenApi familyApi() {
        return GroupedOpenApi.builder()
                .group("family-api")
                .pathsToMatch("/familyApi/**")
                .build();
    }
}
