package com.arcana.backend.repository;

import com.arcana.backend.entity.SelectedCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelectedCardRepository extends JpaRepository<SelectedCard, Long> {
}
