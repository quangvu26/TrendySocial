package com.example.trendy_chat.controller;

import com.example.trendy_chat.dto.UserResponse;
import com.example.trendy_chat.entity.User;
import com.example.trendy_chat.mapper.UserMapper;
import com.example.trendy_chat.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trendy/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        UserResponse resp = UserMapper.toResponse(user);
        return ResponseEntity.ok(resp);
    }
}
