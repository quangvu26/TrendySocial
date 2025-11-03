CREATE DATABASE [TRENDYSOCIALAPP];
GO
USE [TRENDYSOCIALAPP];
GO
/*ALTER DATABASE TRENDYSOCIALAPP SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP database TRENDYSOCIALAPP
*/
-- ==============================
--  BẢNG NGƯỜI DÙNG
-- ==============================
CREATE TABLE [nguoi_dung] (
    [id_user] VARCHAR(50) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [avatar] VARCHAR(MAX) NULL,
    [tieu_su] NVARCHAR(500) NULL,
    [email] NVARCHAR(100) UNIQUE NOT NULL,
    [mat_khau] VARCHAR(255) ,
    [gioi_tinh] BIT  NULL, -- 1: Nam, 0: Nữ
    [ngay_sinh] DATE  NULL,
    [kieu_dang_nhap] VARCHAR(20) DEFAULT 'LOCAL', -- LOCAL / GOOGLE
    [ma_xac_nhan] VARCHAR(6) NULL,       -- mã xác nhận email
    [thoi_gian_het_han] DATETIME NULL,   -- thời gian hết hạn mã
    [trang_thai] BIT DEFAULT 1,          -- 1: hoạt động, 0: bị khóa
    [ngay_tao] DATETIME DEFAULT GETDATE()
);
GO

-- ==============================
--  BẢNG KẾT BẠN
-- ==============================
CREATE TABLE [friends] (
    [ma_yeu_cau] VARCHAR(50) PRIMARY KEY,
    [ma_nguoi_gui] VARCHAR(50) NOT NULL,
    [ma_nguoi_nhan] VARCHAR(50) NOT NULL,
    [trang_thai] VARCHAR(20) DEFAULT 'XAC_NHAN', -- CHO, DONG_Y, TU_CHOI
    [ngay_gui] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([ma_nguoi_gui]) REFERENCES [nguoi_dung]([id_user]),
    FOREIGN KEY ([ma_nguoi_nhan]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG DANH SÁCH CHẶN
-- ==============================
CREATE TABLE [block] (
    [ma_chan] VARCHAR(50) PRIMARY KEY,
    [ma_nguoi_chan] VARCHAR(50) NOT NULL,
    [ma_nguoi_bi_chan] VARCHAR(50) NOT NULL,
    [ngay_chan] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([ma_nguoi_chan]) REFERENCES [nguoi_dung]([id_user]),
    FOREIGN KEY ([ma_nguoi_bi_chan]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG BÀI ĐĂNG
-- ==============================
CREATE TABLE [post] (
    [id_post] VARCHAR(50) PRIMARY KEY,
    [id_user] VARCHAR(50) NOT NULL,
    [noi_dung] NVARCHAR(MAX) NULL,
    [duong_dan_anh] VARCHAR(MAX) NULL,
    [che_do_rieng_tu] VARCHAR(20) DEFAULT 'CONG_KHAI', -- CONG_KHAI, BAN_BE, RIENG_TU
    [ngay_dang] DATETIME DEFAULT GETDATE(),
    [ngay_cap_nhat] DATETIME NULL,
    [trang_thai] BIT DEFAULT 1,
    FOREIGN KEY ([id_user]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG THÍCH BÀI ĐĂNG
-- ==============================
CREATE TABLE [like] (
    [id_post] VARCHAR(50) NOT NULL,
    [id_user] VARCHAR(50) NOT NULL,
    [ngay_thich] DATETIME DEFAULT GETDATE(),
    PRIMARY KEY ([id_post], [id_user]),
    FOREIGN KEY ([id_post]) REFERENCES [post]([id_post]),
    FOREIGN KEY ([id_user]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG LƯU BÀI ĐĂNG
-- ==============================
CREATE TABLE [save_post] (
    [id_post] VARCHAR(50) NOT NULL,
    [id_user] VARCHAR(50) NOT NULL,
    [ngay_luu] DATETIME DEFAULT GETDATE(),
    PRIMARY KEY ([id_post], [id_user]),
    FOREIGN KEY ([id_post]) REFERENCES [post]([id_post]),
    FOREIGN KEY ([id_user]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG CHIA SẺ BÀI ĐĂNG
-- ==============================
CREATE TABLE [share_post] (
    [ma_chia_se] VARCHAR(50) PRIMARY KEY,
    [id_post] VARCHAR(50) NOT NULL,
    [id_user] VARCHAR(50) NOT NULL,
    [ghi_chu] NVARCHAR(255) NULL,
    [ngay_chia_se] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([id_post]) REFERENCES [post]([id_post]),
    FOREIGN KEY ([id_user]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG BÌNH LUẬN
-- ==============================
CREATE TABLE [comment] (
    [ma_binh_luan] VARCHAR(50) PRIMARY KEY,
    [id_post] VARCHAR(50) NOT NULL,
    [id_user] VARCHAR(50) NOT NULL,
    [noi_dung] NVARCHAR(MAX) NOT NULL,
    [ngay_binh_luan] DATETIME DEFAULT GETDATE(),
    [ma_tra_loi] VARCHAR(50) NULL, -- để trả lời bình luận khác
    FOREIGN KEY ([id_post]) REFERENCES [post]([id_post]),
    FOREIGN KEY ([id_user]) REFERENCES [nguoi_dung]([id_user]),
    FOREIGN KEY ([ma_tra_loi]) REFERENCES [comment]([ma_binh_luan])
);
GO

-- ==============================
--  BẢNG TIN NHẮN CÁ NHÂN
-- ==============================
CREATE TABLE [tin_nhan_ca_nhan] (
    [ma_tin_nhan] VARCHAR(50) PRIMARY KEY,
    [ma_nguoi_gui] VARCHAR(50) NOT NULL,
    [ma_nguoi_nhan] VARCHAR(50) NOT NULL,
    [noi_dung] NVARCHAR(MAX) NULL,
    [tep_dinh_kem] VARCHAR(MAX) NULL,
    [ngay_gui] DATETIME DEFAULT GETDATE(),
    [da_doc] BIT DEFAULT 0,
    [da_xoa] BIT DEFAULT 0,
    FOREIGN KEY ([ma_nguoi_gui]) REFERENCES [nguoi_dung]([id_user]),
    FOREIGN KEY ([ma_nguoi_nhan]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG NHÓM CHAT
-- ==============================
CREATE TABLE [group_chat] (
    [ma_nhom] VARCHAR(50) PRIMARY KEY,
    [ten_nhom] NVARCHAR(100) NOT NULL,
    [anh_nhom] VARCHAR(MAX) NULL,
    [mo_ta] NVARCHAR(255) NULL,
    [nguoi_tao] VARCHAR(50) NOT NULL,
    [ngay_tao] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([nguoi_tao]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG THÀNH VIÊN NHÓM
-- ==============================
CREATE TABLE [thanh_vien_nhom] (
    [ma_nhom] VARCHAR(50) NOT NULL,
    [id_user] VARCHAR(50) NOT NULL,
    [vai_tro] VARCHAR(20) DEFAULT 'THANH_VIEN', -- QUAN_TRI / THANH_VIEN
    [ngay_tham_gia] DATETIME DEFAULT GETDATE(),
    PRIMARY KEY ([ma_nhom], [id_user]),
    FOREIGN KEY ([ma_nhom]) REFERENCES [group_chat]([ma_nhom]),
    FOREIGN KEY ([id_user]) REFERENCES [nguoi_dung]([id_user])
);
GO

-- ==============================
--  BẢNG TIN NHẮN NHÓM
-- ==============================
CREATE TABLE [chatting_group] (
    [ma_tin_nhan] VARCHAR(50) PRIMARY KEY,
    [ma_nhom] VARCHAR(50) NOT NULL,
    [ma_nguoi_gui] VARCHAR(50) NOT NULL,
    [noi_dung] NVARCHAR(MAX) NULL,
    [tep_dinh_kem] VARCHAR(MAX) NULL,
    [ngay_gui] DATETIME DEFAULT GETDATE(),
    [da_xoa] BIT DEFAULT 0,
    FOREIGN KEY ([ma_nhom]) REFERENCES [group_chat]([ma_nhom]),
    FOREIGN KEY ([ma_nguoi_gui]) REFERENCES [nguoi_dung]([id_user])
);
GO
CREATE TABLE [notification] (
    id_thong_bao VARCHAR(50) PRIMARY KEY,
    id_nguoi_nhan VARCHAR(50) NOT NULL,
    loai_thong_bao NVARCHAR(50) NOT NULL, -- tin_nhan, ket_ban, thich, binh_luan, post, tag, ...
    noi_dung NVARCHAR(500) NULL,
    lien_ket VARCHAR(255) NULL, -- link tới bài viết hoặc người gửi
    trang_thai BIT DEFAULT 0, -- 0: chưa đọc, 1: đã đọc
    ngay_tao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_nguoi_nhan) REFERENCES [nguoi_dung](id_user)
);
SELECT*FROM nguoi_dung