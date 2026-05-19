package com.arcana.backend.repository;

import com.arcana.backend.entity.Reading;
import com.arcana.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReadingRepository extends JpaRepository<Reading, Long> {
    List<Reading> findByUserOrderByCreatedAtDesc(User user);
}
