package com.example.trendy_chat.service;

import com.example.trendy_chat.dto.*;
import com.example.trendy_chat.entity.User;
import com.example.trendy_chat.exception.UnauthorizedException;
import com.example.trendy_chat.mapper.UserMapper;
import com.example.trendy_chat.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtService jwtService;
    @Autowired
    EmailService emailService;
    public UserResponse dangKy(RegisterRequest req) throws BadRequestException {
        if (userRepository.existsByEmail(req.getEmail())){
           throw new BadRequestException("Email đã tồn tại");
        }
        User user = new User();
        user.setId(req.getId());
        user.setTen(req.getTen());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setGioiTinh(req.getGioiTinh());
        user.setNgaySinh(req.getNgaySinh());
        user.setKieuDangNhap("LOCAL");
        user.setTrangThai(false);
        user.setNgayTao(LocalDateTime.now());
        userRepository.save(user);
        UserResponse resp = UserMapper.toResponse(user);
        // Generate JWT token for the newly registered user so frontend can log in immediately
        String token = jwtService.genToken(user.getEmail());
        resp.setToken(token);
        return resp;
    }
    public UserResponse dangNhap(LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new UnauthorizedException("Email không tồn tại"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new UnauthorizedException("Sai mật khẩu");
        }
        String token = jwtService.genToken(user.getEmail());
        UserResponse res = UserMapper.toResponse(user);
        res.setToken(token); // <-- set token vào response
        return res;
    }
    public void sendVerifyCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String code = String.valueOf(new Random().nextInt(900_000) + 100_000);

        user.setMaXacNhan(code);
        user.setThoiGianHetHan(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendEmail(email, "Mã xác nhận", "Code: " + code);
    }
    public String verifyCode(String email, String code){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (user.getMaXacNhan() == null) throw new RuntimeException("Hãy gửi mã xác nhận trước");
        if (!user.getMaXacNhan().equals(code)) throw new RuntimeException("Sai mã xác nhận");
        if (user.getThoiGianHetHan() == null || user.getThoiGianHetHan().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Mã xác nhận đã hết hạn");

        // Kích hoạt tài khoản
        user.setTrangThai(true);
        user.setMaXacNhan(null);
        user.setThoiGianHetHan(null);
        userRepository.save(user);

        // Tạo token và trả về cho frontend để auto-login
        return jwtService.genToken(user.getEmail());
    }

    // Utility: check if email exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Utility: check if id exists (id is the username in this project)
    public boolean existsById(String id){
        return userRepository.existsById(id);
    }

    // Reset password for given email (used after verification code is validated)
    public void resetPassword(String email, String newPassword){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


}
