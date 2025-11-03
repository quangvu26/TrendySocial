package com.example.trendy_chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "nguoi_dung")
public class User {
    @Id
    @NotBlank(message = "Id user không được để trống")
    @Column(name = "id_user")
    private String id;
    @NotBlank(message = "Tên không được để trống")
    @Column(name = "name")
    private String ten;
    @Column(name = "avatar")
    private String avatar;
    @Column(name = "tieu_su")
    private String tieuSu;
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    @Column(name = "email")
    private String email;
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mât khẩu phải từ 6 ký tự trở lên")
    @Column(name = "mat_khau")
    private String password;
    @NotNull(message = "Giói tính không được để trống")
    @Column(name = "gioi_tinh")
    private Boolean gioiTinh;
    @NotNull(message = "Ngày sinh không được để trống")
    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;
    @Column(name = "kieu_dang_nhap")
    private String kieuDangNhap;
    @Column(name = "ma_xac_nhan")
    private String maXacNhan;
    @Column(name = "thoi_gian_het_han")
    private LocalDateTime thoiGianHetHan;
    @Column(name = "trang_thai")
    private Boolean trangThai;
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
