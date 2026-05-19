package com.arcana.backend.service;

import com.arcana.backend.dto.reading.*;
import com.arcana.backend.entity.Card;
import com.arcana.backend.entity.Reading;
import com.arcana.backend.entity.SelectedCard;
import com.arcana.backend.entity.User;
import com.arcana.backend.repository.CardRepository;
import com.arcana.backend.repository.ReadingRepository;
import com.arcana.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReadingService {

    private final ReadingRepository readingRepository;
    private final UserRepository userRepository;
    private final CardRepository cardRepository;
    private final AiClient aiClient;

    @Transactional
    public ReadingDetail createReading(CreateReadingRequest request, UserDetails principal) {
        User user = getUser(principal.getUsername());

        List<AiClient.CardRequest> aiCards = new ArrayList<>();
        List<SelectedCard> selectedCards = new ArrayList<>();

        Reading reading = Reading.builder()
                .user(user)
                .concern(request.getConcern())
                .result("")
                .selectedCards(selectedCards)
                .build();

        for (CardInput input : request.getCards()) {
            Card card = cardRepository.findById(input.getCardId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "카드를 찾을 수 없습니다: " + input.getCardId()));

            SelectedCard sc = SelectedCard.builder()
                    .reading(reading)
                    .card(card)
                    .position(input.getPosition())
                    .reversed(input.getReversed())
                    .build();
            selectedCards.add(sc);

            aiCards.add(new AiClient.CardRequest(card.getId(), card.getNameEn(),
                    input.getPosition(), input.getReversed()));
        }

        String result = aiClient.interpret(request.getConcern(), aiCards);
        reading.setResult(result);

        Reading saved = readingRepository.save(reading);
        return new ReadingDetail(saved);
    }

    @Transactional(readOnly = true)
    public ReadingListResponse getMyReadings(UserDetails principal) {
        User user = getUser(principal.getUsername());
        List<ReadingListItem> items = readingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(ReadingListItem::new)
                .collect(Collectors.toList());
        return new ReadingListResponse(items, items.size());
    }

    @Transactional(readOnly = true)
    public ReadingDetail getReading(Long id, UserDetails principal) {
        User user = getUser(principal.getUsername());
        Reading reading = readingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "리딩을 찾을 수 없습니다."));
        if (!reading.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
        }
        return new ReadingDetail(reading);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자를 찾을 수 없습니다."));
    }
}
