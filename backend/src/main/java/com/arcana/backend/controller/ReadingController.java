package com.arcana.backend.controller;

import com.arcana.backend.dto.reading.CreateReadingRequest;
import com.arcana.backend.dto.reading.ReadingDetail;
import com.arcana.backend.dto.reading.ReadingListResponse;
import com.arcana.backend.service.ReadingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readings")
@RequiredArgsConstructor
public class ReadingController {

    private final ReadingService readingService;

    @PostMapping
    public ResponseEntity<ReadingDetail> createReading(@Valid @RequestBody CreateReadingRequest request,
                                                        @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(readingService.createReading(request, principal));
    }

    @GetMapping
    public ResponseEntity<ReadingListResponse> getMyReadings(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(readingService.getMyReadings(principal));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReadingDetail> getReading(@PathVariable Long id,
                                                     @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(readingService.getReading(id, principal));
    }
}
