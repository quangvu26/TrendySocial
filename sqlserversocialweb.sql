
CREATE DATABASE TRENDYSOCIALAPP
GO

USE TRENDYSOCIALAPP
GO

-- ============================
-- BẢNG: nguoi_dung
-- ============================
CREATE TABLE dbo.nguoi_dung (
    id_user VARCHAR(100) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    avatar VARCHAR(MAX) NULL,
    tieu_su NVARCHAR(500) NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NULL,
    gioi_tinh BIT NULL, -- 1: Nam, 0: Nữ
    ngay_sinh DATE NULL,
    kieu_dang_nhap VARCHAR(20) DEFAULT 'LOCAL', -- LOCAL / GOOGLE
    ma_xac_nhan VARCHAR(6) NULL,
    thoi_gian_het_han DATETIME NULL,
    trang_thai BIT NOT NULL DEFAULT 1,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    is_deleted BIT DEFAULT 0
);
GO

-- ============================
-- BẢNG: friends (kết bạn)
-- ============================
CREATE TABLE dbo.friends (
    ma_yeu_cau VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    ma_nguoi_gui VARCHAR(100) NOT NULL,
    ma_nguoi_nhan VARCHAR(100) NOT NULL,
    trang_thai NVARCHAR(20) NOT NULL DEFAULT 'CHO_DUYET',
    ngay_gui DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CHK_friends_trang_thai CHECK (trang_thai IN ('CHO_DUYET','XAC_NHAN','TU_CHOI')),
    CONSTRAINT FK_friends_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_friends_receiver FOREIGN KEY (ma_nguoi_nhan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT UQ_friends_pair UNIQUE (ma_nguoi_gui, ma_nguoi_nhan)
);
CREATE INDEX IX_friends_sender ON dbo.friends(ma_nguoi_gui);
CREATE INDEX IX_friends_receiver ON dbo.friends(ma_nguoi_nhan);
GO

-- ============================
-- BẢNG: block_list
-- ============================
CREATE TABLE dbo.block_list (
    ma_chan VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    ma_nguoi_chan VARCHAR(100) NOT NULL,
    ma_nguoi_bi_chan VARCHAR(100) NOT NULL,
    ngay_chan DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_block_blocker FOREIGN KEY (ma_nguoi_chan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_block_blocked FOREIGN KEY (ma_nguoi_bi_chan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT UQ_block_pair UNIQUE (ma_nguoi_chan, ma_nguoi_bi_chan)
);
GO

-- ============================
-- BẢNG: post
-- ============================
CREATE TABLE dbo.post (
    id_post VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    id_user VARCHAR(100) NOT NULL,
    noi_dung NVARCHAR(MAX) NULL,
    duong_dan_anh NVARCHAR(MAX) NULL,
    che_do_rieng_tu VARCHAR(20) NOT NULL DEFAULT 'CONG_KHAI',
    ngay_dang DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ngay_cap_nhat DATETIME2 NULL,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    -- hide_* đã được add/xóa trong lịch sử; giữ bản hiện tại không có các cột hide_...
    CONSTRAINT FK_post_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
CREATE INDEX IX_post_user ON dbo.post(id_user);
CREATE INDEX IX_post_newest ON dbo.post(ngay_dang DESC);
GO

-- ============================
-- BẢNG: post_like
-- ============================
CREATE TABLE dbo.post_like (
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ngay_thich DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (id_post, id_user),
    CONSTRAINT FK_post_like_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE CASCADE,
    CONSTRAINT FK_post_like_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE
);
GO

-- ============================
-- BẢNG: save_post
-- ============================
CREATE TABLE dbo.save_post (
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ngay_luu DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (id_post, id_user),
    CONSTRAINT FK_save_post_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE CASCADE,
    CONSTRAINT FK_save_post_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE
);
GO

-- ============================
-- BẢNG: share_post
-- ============================
CREATE TABLE dbo.share_post (
    ma_chia_se VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ghi_chu NVARCHAR(255) NULL,
    ngay_chia_se DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_share_post_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE CASCADE,
    CONSTRAINT FK_share_post_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE
);
GO

-- ============================
-- BẢNG: comment
-- ============================
CREATE TABLE dbo.comment (
    ma_binh_luan VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    noi_dung NVARCHAR(MAX) NOT NULL,
    ngay_binh_luan DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ma_tra_loi VARCHAR(100) NULL,
    an_binh_luan BIT DEFAULT 0,
    CONSTRAINT FK_comment_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE CASCADE,
    CONSTRAINT FK_comment_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_comment_reply FOREIGN KEY (ma_tra_loi) REFERENCES dbo.comment(ma_binh_luan) ON DELETE NO ACTION
);
CREATE INDEX IX_comment_post ON dbo.comment(id_post);
GO

-- ============================
-- BẢNG: comment_like
-- ============================
CREATE TABLE dbo.comment_like (
    ma_binh_luan VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ngay_thich DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (ma_binh_luan, id_user),
    CONSTRAINT FK_comment_like_comment FOREIGN KEY (ma_binh_luan) REFERENCES dbo.comment(ma_binh_luan) ON DELETE CASCADE,
    CONSTRAINT FK_comment_like_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE
);
CREATE INDEX IX_comment_like_comment ON dbo.comment_like(ma_binh_luan);
GO

-- ============================
-- BẢNG: solo_chat (1-1 chat room)
-- - ensure uniqueness independent of order using persisted computed cols
-- ============================
CREATE TABLE dbo.solo_chat (
    ma_nhom_solo VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    id_user_1 VARCHAR(100) NOT NULL,
    id_user_2 VARCHAR(100) NOT NULL,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    -- computed persisted columns for order-agnostic uniqueness
    id_user_small AS (CASE WHEN id_user_1 <= id_user_2 THEN id_user_1 ELSE id_user_2 END) PERSISTED,
    id_user_big   AS (CASE WHEN id_user_1 <= id_user_2 THEN id_user_2 ELSE id_user_1 END) PERSISTED,
    CONSTRAINT FK_solo_user1 FOREIGN KEY (id_user_1) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_solo_user2 FOREIGN KEY (id_user_2) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT UQ_solo_pair UNIQUE (id_user_small, id_user_big)
);
CREATE INDEX IX_solo_user1 ON dbo.solo_chat(id_user_1);
CREATE INDEX IX_solo_user2 ON dbo.solo_chat(id_user_2);
GO

-- ============================
-- BẢNG: tin_nhan_ca_nhan (personal messages)
-- ============================
CREATE TABLE dbo.tin_nhan_ca_nhan (
    ma_tin_nhan VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    ma_nguoi_gui VARCHAR(100) NOT NULL,
    ma_nguoi_nhan VARCHAR(100) NOT NULL,
    ma_nhom_solo VARCHAR(100) NULL, 
    noi_dung NVARCHAR(MAX) NULL,
    tep_dinh_kem NVARCHAR(MAX) NULL,
    ngay_gui DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    da_doc BIT NOT NULL DEFAULT 0,
    da_xoa BIT NOT NULL DEFAULT 0,
    -- reply/pin/attachments fields (keeps both types you added)
    ma_tin_nhan_tra_loi VARCHAR(100) NULL,  -- FK to same table
    reply_to_id VARCHAR(100) NULL,
    reply_to_content NVARCHAR(MAX) NULL,
    reply_to_sender VARCHAR(100) NULL,
    ghim BIT NOT NULL DEFAULT 0,
    attachments NVARCHAR(MAX) NULL,
    CONSTRAINT FK_msg_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_msg_receiver FOREIGN KEY (ma_nguoi_nhan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_msg_solo FOREIGN KEY (ma_nhom_solo) REFERENCES dbo.solo_chat(ma_nhom_solo) ON DELETE CASCADE,
    CONSTRAINT FK_tin_nhan_reply FOREIGN KEY (ma_tin_nhan_tra_loi) REFERENCES dbo.tin_nhan_ca_nhan(ma_tin_nhan) ON DELETE NO ACTION
);
CREATE INDEX IX_msg_sender_receiver ON dbo.tin_nhan_ca_nhan(ma_nguoi_gui, ma_nguoi_nhan, ngay_gui);
CREATE INDEX IX_msg_solo ON dbo.tin_nhan_ca_nhan(ma_nhom_solo, ngay_gui);
CREATE INDEX IX_msg_pinned ON dbo.tin_nhan_ca_nhan(ghim, ma_nhom_solo) WHERE ghim = 1;
CREATE INDEX IX_msg_reply ON dbo.tin_nhan_ca_nhan(ma_tin_nhan_tra_loi) WHERE ma_tin_nhan_tra_loi IS NOT NULL;
GO

-- ============================
-- BẢNG: tin_nhan_reaction (reactions on personal messages)
-- ============================
CREATE TABLE dbo.tin_nhan_reaction (
    id VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    ma_tin_nhan VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    loai_reaction VARCHAR(20) NOT NULL,
    ngay_tao DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_reaction_message FOREIGN KEY (ma_tin_nhan) REFERENCES dbo.tin_nhan_ca_nhan(ma_tin_nhan) ON DELETE CASCADE,
    CONSTRAINT FK_reaction_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE,
    CONSTRAINT UQ_reaction_user_message UNIQUE (ma_tin_nhan, id_user)
);
CREATE INDEX IX_reaction_message ON dbo.tin_nhan_reaction(ma_tin_nhan);
CREATE INDEX IX_reaction_user ON dbo.tin_nhan_reaction(id_user);
GO

-- ============================
-- BẢNG: group_chat
-- ============================
CREATE TABLE dbo.group_chat (
    ma_nhom VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    ten_nhom NVARCHAR(100) NOT NULL,
    anh_nhom NVARCHAR(MAX) NULL,
    mo_ta NVARCHAR(255) NULL,
    nguoi_tao VARCHAR(100) NULL,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_group_creator FOREIGN KEY (nguoi_tao) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
GO

-- ============================
-- BẢNG: thanh_vien_nhom
-- ============================
CREATE TABLE dbo.thanh_vien_nhom (
    ma_nhom VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    vai_tro NVARCHAR(20) NOT NULL DEFAULT 'THANH_VIEN',
    ngay_tham_gia DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (ma_nhom, id_user),
    CONSTRAINT FK_group_member_group FOREIGN KEY (ma_nhom) REFERENCES dbo.group_chat(ma_nhom) ON DELETE CASCADE,
    CONSTRAINT FK_group_member_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE
);
GO

-- ============================
-- BẢNG: chatting_group (group messages)
-- ============================
CREATE TABLE dbo.chatting_group (
    ma_tin_nhan VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    ma_nhom VARCHAR(100) NOT NULL,
    ma_nguoi_gui VARCHAR(100) NOT NULL,
    noi_dung NVARCHAR(MAX) NULL,
    tep_dinh_kem NVARCHAR(MAX) NULL,
    ngay_gui DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    da_xoa BIT NOT NULL DEFAULT 0,
    -- reply/pin/attachments
    reply_to_id VARCHAR(100) NULL,
    reply_to_content NVARCHAR(MAX) NULL,
    reply_to_sender VARCHAR(100) NULL,
    ghim BIT NOT NULL DEFAULT 0,
    attachments NVARCHAR(MAX) NULL,
    CONSTRAINT FK_chatgroup_group FOREIGN KEY (ma_nhom) REFERENCES dbo.group_chat(ma_nhom) ON DELETE CASCADE,
    CONSTRAINT FK_chatgroup_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
CREATE INDEX IX_chatgroup_nhom ON dbo.chatting_group(ma_nhom, ngay_gui);
CREATE INDEX idx_chatting_group_ghim ON dbo.chatting_group(ghim);
GO

-- ============================
-- BẢNG: notification
-- ============================
CREATE TABLE dbo.notification (
    id_thong_bao VARCHAR(100) PRIMARY KEY DEFAULT (NEWID()),
    id_nguoi_nhan VARCHAR(100) NOT NULL,   -- người nhận
    ma_nguoi_gui VARCHAR(100) NULL,        -- người gửi (nullable)
    sender_name NVARCHAR(255) NULL,
    loai_thong_bao NVARCHAR(50) NOT NULL,
    noi_dung NVARCHAR(500) NULL,
    post_id VARCHAR(100) NULL,
    lien_ket NVARCHAR(255) NULL,
    trang_thai BIT NOT NULL DEFAULT 0,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_notification_user FOREIGN KEY (id_nguoi_nhan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE,
    CONSTRAINT FK_notification_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_notification_post FOREIGN KEY (post_id) REFERENCES dbo.post(id_post) ON DELETE SET NULL
);
CREATE INDEX IX_notification_user ON dbo.notification(id_nguoi_nhan, trang_thai);
GO

SELECT * FROM dbo.nguoi_dung;
GO
SELECT * FROM dbo.friends;
GO
SELECT * FROM dbo.block_list;
GO
SELECT * FROM dbo.post;
GO
SELECT * FROM dbo.post_like;
GO
SELECT * FROM dbo.save_post;
GO
SELECT * FROM dbo.share_post;
GO
SELECT * FROM dbo.comment;
GO
SELECT * FROM dbo.comment_like;
GO
SELECT * FROM dbo.solo_chat;
GO
SELECT * FROM dbo.tin_nhan_ca_nhan;
GO
SELECT * FROM dbo.tin_nhan_reaction;
GO
SELECT * FROM dbo.group_chat;
GO
SELECT * FROM dbo.thanh_vien_nhom;
GO
SELECT * FROM dbo.chatting_group;
GO
SELECT * FROM dbo.notification;
GO
