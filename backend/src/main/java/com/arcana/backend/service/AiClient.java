package com.arcana.backend.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.List;

@Service
public class AiClient {

    private final RestTemplate restTemplate;
    private final String aiServerUrl;

    public AiClient(RestTemplateBuilder builder,
                    @Value("${ai-server.url}") String aiServerUrl,
                    @Value("${ai-server.timeout}") long timeoutMs) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofMillis(timeoutMs))
                .setReadTimeout(Duration.ofMillis(timeoutMs))
                .build();
        this.aiServerUrl = aiServerUrl;
    }

    public String interpret(String concern, List<CardRequest> cards) {
        AiRequest request = new AiRequest(concern, cards);
        try {
            AiResponse response = restTemplate.postForObject(
                    aiServerUrl + "/interpret", request, AiResponse.class);
            if (response == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI 서버 응답이 없습니다.");
            }
            return response.getResult();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI 서버 연결에 실패했습니다.");
        }
    }

    @Getter @Setter
    public static class CardRequest {
        private Integer cardId;
        private String nameEn;
        private Integer position;
        private boolean reversed;

        public CardRequest(Integer cardId, String nameEn, Integer position, boolean reversed) {
            this.cardId = cardId;
            this.nameEn = nameEn;
            this.position = position;
            this.reversed = reversed;
        }
    }

    @Getter @Setter
    private static class AiRequest {
        private final String concern;
        private final List<CardRequest> cards;

        public AiRequest(String concern, List<CardRequest> cards) {
            this.concern = concern;
            this.cards = cards;
        }
    }

    @Getter @Setter
    private static class AiResponse {
        private String result;
    }
}
