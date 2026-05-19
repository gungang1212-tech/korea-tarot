package com.arcana.backend.controller;

import com.arcana.backend.dto.card.CardDetail;
import com.arcana.backend.dto.card.CardSummary;
import com.arcana.backend.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    public ResponseEntity<List<CardSummary>> getAllCards() {
        return ResponseEntity.ok(cardService.getAllCards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDetail> getCard(@PathVariable Integer id) {
        return ResponseEntity.ok(cardService.getCard(id));
    }
}
