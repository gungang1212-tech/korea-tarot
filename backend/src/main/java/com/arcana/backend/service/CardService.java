package com.arcana.backend.service;

import com.arcana.backend.dto.card.CardDetail;
import com.arcana.backend.dto.card.CardSummary;
import com.arcana.backend.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    public List<CardSummary> getAllCards() {
        return cardRepository.findAll().stream()
                .map(CardSummary::new)
                .collect(Collectors.toList());
    }

    public CardDetail getCard(Integer id) {
        return cardRepository.findById(id)
                .map(CardDetail::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카드를 찾을 수 없습니다."));
    }
}
