package com.example.trendy_chat.repository;

import com.example.trendy_chat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    boolean existsByEmail(String email);
    public Optional<User> findByEmail(String email);
}
