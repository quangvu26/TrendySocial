package com.example.trendy_chat.mapper;

import com.example.trendy_chat.dto.RegisterRequest;
import com.example.trendy_chat.dto.UserResponse;
import com.example.trendy_chat.entity.User;

public class UserMapper {
    public static User toEntity(RegisterRequest registerUser) {
        User user = new User();
        user.setId(registerUser.getId());
        user.setTen(registerUser.getTen());
        user.setEmail(registerUser.getEmail());
        user.setPassword(registerUser.getPassword());
        user.setGioiTinh(registerUser.getGioiTinh());
        user.setNgaySinh(registerUser.getNgaySinh());
        return user;
    }
    public static UserResponse toResponse(User user){
        UserResponse ur = new UserResponse();
        ur.setId(user.getId());
        ur.setTen(user.getTen());
        ur.setEmail(user.getEmail());
        ur.setAvatar(user.getAvatar());
        ur.setTieuSu(user.getTieuSu());
        ur.setGioiTinh(user.getGioiTinh());
        ur.setKieuDangNhap(user.getKieuDangNhap());
        ur.setNgaySinh(user.getNgaySinh());
        ur.setTrangThai(user.getTrangThai());
        ur.setNgayTao(user.getNgayTao());
        return ur;
    }
}
