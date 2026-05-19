package com.arcana.backend.repository;

import com.arcana.backend.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Integer> {
    List<Card> findByArcana(String arcana);
    List<Card> findBySuit(String suit);
}
