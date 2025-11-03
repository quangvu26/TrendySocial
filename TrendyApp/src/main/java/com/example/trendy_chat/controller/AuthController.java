package com.example.trendy_chat.controller;

import com.example.trendy_chat.dto.LoginRequest;
import com.example.trendy_chat.dto.RegisterRequest;
import com.example.trendy_chat.dto.UserResponse;
import com.example.trendy_chat.service.AuthService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/trendy/auth")
public class AuthController {
    @Autowired
    AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<UserResponse> dangKy(@RequestBody RegisterRequest registerRequest) throws BadRequestException {
        UserResponse userResponse = authService.dangKy(registerRequest);
        return ResponseEntity.ok(userResponse);
    }
    @PostMapping("/login")
    public ResponseEntity<UserResponse> dangNhap(@RequestBody LoginRequest loginRequest) {
        UserResponse userResponse = authService.dangNhap(loginRequest);
        return ResponseEntity.ok(userResponse);
    }
    @GetMapping("/check")
    public ResponseEntity<String> checkAuth(){
        return ResponseEntity.ok("Người dũng đã đăng nhập hợp lệ");
    }
    @PostMapping("/send-verify-code")
    public ResponseEntity<String> sendVerifyCode(@RequestBody Map<String, String> body){
        String email = body.get("email");
        authService.sendVerifyCode(email);
        return ResponseEntity.ok("Đã gửi mã xác nhận");
    }
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestBody Map<String, String> body){
        String email = body.get("email");
        String code = body.get("code");
        String token = authService.verifyCode(email, code); // trả token
        return ResponseEntity.ok(Map.of("token", token));
    }







}
