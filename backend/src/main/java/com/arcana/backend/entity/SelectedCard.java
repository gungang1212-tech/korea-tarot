package com.arcana.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "selected_cards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SelectedCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reading_id", nullable = false)
    private Reading reading;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "is_reversed", nullable = false)
    private boolean reversed;
}
