package com.arcana.backend.seed;

import com.arcana.backend.entity.Card;
import com.arcana.backend.repository.CardRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CardDataInitializer implements ApplicationRunner {

    private final CardRepository cardRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (cardRepository.count() > 0) {
            return;
        }

        ClassPathResource resource = new ClassPathResource("data/tarot_cards.json");
        List<CardSeedDto> seeds = objectMapper.readValue(
                resource.getInputStream(),
                objectMapper.getTypeFactory().constructCollectionType(List.class, CardSeedDto.class));

        List<Card> cards = seeds.stream().map(s -> Card.builder()
                .id(s.getId())
                .nameKo(s.getNameKo())
                .nameEn(s.getNameEn())
                .arcana(s.getArcana())
                .suit(s.getSuit())
                .number(s.getNumber())
                .description(s.getUprightMeaning())
                .build()
        ).toList();

        cardRepository.saveAll(cards);
        log.info("Seeded {} tarot cards", cards.size());
    }

    @Getter @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class CardSeedDto {
        private Integer id;
        @JsonProperty("name_ko") private String nameKo;
        @JsonProperty("name_en") private String nameEn;
        private String arcana;
        private String suit;
        private Integer number;
        @JsonProperty("upright_meaning") private String uprightMeaning;
    }
}
