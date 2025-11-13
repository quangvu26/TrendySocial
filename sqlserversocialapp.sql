CREATE DATABASE [TRENDYSOCIALAPP];
GO
USE [TRENDYSOCIALAPP];
GO
--ALTER DATABASE TRENDYSOCIALAPP SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--DROP database TRENDYSOCIALAPP

-- ==============================
--  BẢNG NGƯỜI DÙNG
-- ==============================
CREATE TABLE [nguoi_dung] (
    [id_user] VARCHAR(100) PRIMARY KEY,
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
    trang_thai BIT NOT NULL DEFAULT 1,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
	is_deleted BIT DEFAULT 0
);
GO

-- ==============================
--  BẢNG KẾT BẠN
-- ==============================
CREATE TABLE dbo.friends (
    ma_yeu_cau VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    ma_nguoi_gui VARCHAR(100) NOT NULL,
    ma_nguoi_nhan VARCHAR(100) NOT NULL,
	trang_thai NVARCHAR(20) NOT NULL DEFAULT 'CHO_DUYET',
	CHECK (trang_thai IN ('CHO_DUYET','XAC_NHAN','TU_CHOI')),
    ngay_gui DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_friends_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_friends_receiver FOREIGN KEY (ma_nguoi_nhan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
CREATE INDEX IX_friends_sender ON dbo.friends(ma_nguoi_gui);
CREATE INDEX IX_friends_receiver ON dbo.friends(ma_nguoi_nhan);
GO

CREATE TABLE dbo.block_list (
    ma_chan VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    ma_nguoi_chan VARCHAR(100) NOT NULL,
    ma_nguoi_bi_chan VARCHAR(100) NOT NULL,
    ngay_chan DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_block_blocker FOREIGN KEY (ma_nguoi_chan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_block_blocked FOREIGN KEY (ma_nguoi_bi_chan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
GO

CREATE TABLE dbo.post (
    id_post VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    id_user VARCHAR(100) NOT NULL,
    noi_dung NVARCHAR(MAX) NULL,
    duong_dan_anh NVARCHAR(MAX) NULL,
    che_do_rieng_tu NVARCHAR(20) NOT NULL DEFAULT 'CONG_KHAI',
    ngay_dang DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ngay_cap_nhat DATETIME2 NULL,
    views_count INT DEFAULT 0,
    CONSTRAINT FK_post_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
CREATE INDEX IX_post_user ON dbo.post(id_user);
GO

CREATE TABLE dbo.post_like (
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ngay_thich DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (id_post, id_user),
    CONSTRAINT FK_post_like_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE NO ACTION,
    CONSTRAINT FK_post_like_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
GO

CREATE TABLE dbo.save_post (
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ngay_luu DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (id_post, id_user),
    CONSTRAINT FK_save_post_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE NO ACTION,
    CONSTRAINT FK_save_post_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
GO

CREATE TABLE dbo.share_post (
    ma_chia_se VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ghi_chu NVARCHAR(255) NULL,
    ngay_chia_se DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_share_post_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE NO ACTION,
    CONSTRAINT FK_share_post_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
GO

CREATE TABLE dbo.comment (
    ma_binh_luan VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    id_post VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    noi_dung NVARCHAR(MAX) NOT NULL,
    ngay_binh_luan DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ma_tra_loi VARCHAR(100) NULL,
    CONSTRAINT FK_comment_post FOREIGN KEY (id_post) REFERENCES dbo.post(id_post) ON DELETE NO ACTION,
    CONSTRAINT FK_comment_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_comment_reply FOREIGN KEY (ma_tra_loi) REFERENCES dbo.comment(ma_binh_luan) ON DELETE NO ACTION
);
CREATE INDEX IX_comment_post ON dbo.comment(id_post);
GO

CREATE TABLE dbo.comment_like (
    ma_binh_luan VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    ngay_thich DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (ma_binh_luan, id_user),
    CONSTRAINT FK_comment_like_comment FOREIGN KEY (ma_binh_luan) REFERENCES dbo.comment(ma_binh_luan) ON DELETE CASCADE,
    CONSTRAINT FK_comment_like_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
CREATE INDEX IX_comment_like_comment ON dbo.comment_like(ma_binh_luan);
GO

CREATE TABLE dbo.solo_chat (
    ma_nhom_solo VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    id_user_1 VARCHAR(100) NOT NULL,
    id_user_2 VARCHAR(100) NOT NULL,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_solo_user1 FOREIGN KEY (id_user_1) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_solo_user2 FOREIGN KEY (id_user_2) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT UQ_solo_pair UNIQUE (id_user_1, id_user_2)
);
CREATE INDEX IX_solo_user1 ON dbo.solo_chat(id_user_1);
CREATE INDEX IX_solo_user2 ON dbo.solo_chat(id_user_2);
GO
CREATE TABLE dbo.tin_nhan_ca_nhan (
    ma_tin_nhan VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    ma_nguoi_gui VARCHAR(100) NOT NULL,
    ma_nguoi_nhan VARCHAR(100) NOT NULL,
    ma_nhom_solo VARCHAR(100) NULL, 
    noi_dung NVARCHAR(MAX) NULL,
    tep_dinh_kem NVARCHAR(MAX) NULL,
    ngay_gui DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    da_doc BIT NOT NULL DEFAULT 0,
    da_xoa BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_msg_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_msg_receiver FOREIGN KEY (ma_nguoi_nhan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_msg_solo FOREIGN KEY (ma_nhom_solo) REFERENCES dbo.solo_chat(ma_nhom_solo) ON DELETE CASCADE
);
CREATE INDEX IX_msg_sender_receiver ON dbo.tin_nhan_ca_nhan(ma_nguoi_gui, ma_nguoi_nhan, ngay_gui);
CREATE INDEX IX_msg_solo ON dbo.tin_nhan_ca_nhan(ma_nhom_solo);
GO

CREATE TABLE dbo.group_chat (
    ma_nhom VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    ten_nhom NVARCHAR(100) NOT NULL,
    anh_nhom NVARCHAR(MAX) NULL,
    mo_ta NVARCHAR(255) NULL,
    nguoi_tao VARCHAR(100) NULL,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_group_creator FOREIGN KEY (nguoi_tao) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
GO
CREATE TABLE dbo.thanh_vien_nhom (
    ma_nhom VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    vai_tro NVARCHAR(20) NOT NULL DEFAULT 'THANH_VIEN',
    ngay_tham_gia DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (ma_nhom, id_user),
    CONSTRAINT FK_group_member_group FOREIGN KEY (ma_nhom) REFERENCES dbo.group_chat(ma_nhom) ON DELETE NO ACTION,
    CONSTRAINT FK_group_member_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
GO

CREATE TABLE dbo.chatting_group (
    ma_tin_nhan VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    ma_nhom VARCHAR(100) NOT NULL,
    ma_nguoi_gui VARCHAR(100) NOT NULL,
    noi_dung NVARCHAR(MAX) NULL,
    tep_dinh_kem NVARCHAR(MAX) NULL,
    ngay_gui DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    da_xoa BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_chatgroup_group FOREIGN KEY (ma_nhom) REFERENCES dbo.group_chat(ma_nhom) ON DELETE NO ACTION,
    CONSTRAINT FK_chatgroup_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
CREATE INDEX IX_chatgroup_nhom ON dbo.chatting_group(ma_nhom, ngay_gui);
GO

CREATE TABLE dbo.notification (
    id_thong_bao VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
    id_nguoi_nhan VARCHAR(100) NOT NULL,
    ma_nguoi_gui VARCHAR(100) NULL,
    sender_name NVARCHAR(255) NULL,
    loai_thong_bao NVARCHAR(50) NOT NULL,
    noi_dung NVARCHAR(500) NULL,
    post_id VARCHAR(100) NULL,
    lien_ket NVARCHAR(255) NULL,
    trang_thai BIT NOT NULL DEFAULT 0,
    ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_notification_user FOREIGN KEY (id_nguoi_nhan) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION,
    CONSTRAINT FK_notification_sender FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION
);
CREATE INDEX IX_notification_user ON dbo.notification(id_nguoi_nhan, trang_thai);
-- Bảng solo_chat thiếu FOREIGN KEY constraints
-- Bảng tin_nhan_ca_nhan thiếu FOREIGN KEY đến solo_chat

-- 1. Người dùng
SELECT * FROM dbo.nguoi_dung;

-- 2. Kết bạn
SELECT * FROM dbo.friends;

-- 3. Danh sách chặn
SELECT * FROM dbo.block_list;

-- 4. Bài viết
SELECT * FROM dbo.post;

-- 5. Lượt thích bài viết
SELECT * FROM dbo.post_like;

-- 6. Bài viết đã lưu
SELECT * FROM dbo.save_post;

-- 7. Bài viết chia sẻ
SELECT * FROM dbo.share_post;

-- 8. Bình luận
SELECT * FROM dbo.comment;

-- 9. Tin nhắn cá nhân
SELECT * FROM dbo.tin_nhan_ca_nhan;

-- 10. Nhóm chat
SELECT * FROM dbo.group_chat;

-- 11. Chat 1-1 (solo)
SELECT * FROM dbo.solo_chat;

-- 12. Thành viên nhóm
SELECT * FROM dbo.thanh_vien_nhom;

-- 13. Tin nhắn nhóm
SELECT * FROM dbo.chatting_group;

-- 14. Thông báo
SELECT * FROM dbo.notification;
-- Add reply and pin features to messages
USE [TRENDYSOCIALAPP];
GO

-- Add reply and pin columns
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.tin_nhan_ca_nhan') AND name = 'ma_tin_nhan_tra_loi')
BEGIN
    ALTER TABLE dbo.tin_nhan_ca_nhan ADD ma_tin_nhan_tra_loi VARCHAR(100) NULL;
    ALTER TABLE dbo.tin_nhan_ca_nhan ADD CONSTRAINT FK_tin_nhan_reply FOREIGN KEY (ma_tin_nhan_tra_loi) REFERENCES dbo.tin_nhan_ca_nhan(ma_tin_nhan);
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.tin_nhan_ca_nhan') AND name = 'ghim')
BEGIN
    ALTER TABLE dbo.tin_nhan_ca_nhan ADD ghim BIT DEFAULT 0;
END

-- Create reactions table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tin_nhan_reaction')
BEGIN
    CREATE TABLE dbo.tin_nhan_reaction (
        id VARCHAR(100) PRIMARY KEY DEFAULT NEWID(),
        ma_tin_nhan VARCHAR(100) NOT NULL,
        id_user VARCHAR(100) NOT NULL,
        loai_reaction VARCHAR(20) NOT NULL,
        ngay_tao DATETIME2 DEFAULT SYSDATETIME(),
        CONSTRAINT FK_reaction_message FOREIGN KEY (ma_tin_nhan) REFERENCES dbo.tin_nhan_ca_nhan(ma_tin_nhan) ON DELETE CASCADE,
        CONSTRAINT FK_reaction_user FOREIGN KEY (id_user) REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE,
        CONSTRAINT UQ_reaction_user_message UNIQUE(ma_tin_nhan, id_user)
    );
END

GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.notification') AND name = 'id_nguoi_nhan')
BEGIN
    ALTER TABLE dbo.notification ADD id_nguoi_nhan VARCHAR(100) NOT NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.notification') AND name = 'loai_thong_bao')
BEGIN
    ALTER TABLE dbo.notification ADD loai_thong_bao NVARCHAR(50) NOT NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.notification') AND name = 'noi_dung')
BEGIN
    ALTER TABLE dbo.notification ADD noi_dung NVARCHAR(500) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.notification') AND name = 'lien_ket')
BEGIN
    ALTER TABLE dbo.notification ADD lien_ket NVARCHAR(255) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.notification') AND name = 'trang_thai')
BEGIN
    ALTER TABLE dbo.notification ADD trang_thai BIT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.notification') AND name = 'ngay_tao')
BEGIN
    ALTER TABLE dbo.notification ADD ngay_tao DATETIME2 NOT NULL DEFAULT SYSDATETIME();
END

GO
-- CLEAN SQL MIGRATION FOR MESSAGE ACTIONS
-- Run this in SQL Server Management Studio

USE [TRENDYSOCIALAPP];
GO

-- 1. Add reply and pin columns to tin_nhan_ca_nhan
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.tin_nhan_ca_nhan') AND name = 'ma_tin_nhan_tra_loi')
BEGIN
    ALTER TABLE dbo.tin_nhan_ca_nhan ADD ma_tin_nhan_tra_loi VARCHAR(100) NULL;
    ALTER TABLE dbo.tin_nhan_ca_nhan ADD CONSTRAINT FK_tin_nhan_reply 
        FOREIGN KEY (ma_tin_nhan_tra_loi) REFERENCES dbo.tin_nhan_ca_nhan(ma_tin_nhan);
    PRINT '✅ Added ma_tin_nhan_tra_loi column';
END
ELSE
BEGIN
    PRINT '⚠️ Column ma_tin_nhan_tra_loi already exists';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.tin_nhan_ca_nhan') AND name = 'ghim')
BEGIN
    ALTER TABLE dbo.tin_nhan_ca_nhan ADD ghim BIT DEFAULT 0;
    PRINT '✅ Added ghim column';
END
ELSE
BEGIN
    PRINT '⚠️ Column ghim already exists';
END

-- 2. Create reactions table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tin_nhan_reaction')
BEGIN
    CREATE TABLE dbo.tin_nhan_reaction (
        id VARCHAR(100) PRIMARY KEY,
        ma_tin_nhan VARCHAR(100) NOT NULL,
        id_user VARCHAR(100) NOT NULL,
        loai_reaction VARCHAR(20) NOT NULL,
        ngay_tao DATETIME2 DEFAULT SYSDATETIME(),
        CONSTRAINT FK_reaction_message FOREIGN KEY (ma_tin_nhan) 
            REFERENCES dbo.tin_nhan_ca_nhan(ma_tin_nhan) ON DELETE CASCADE,
        CONSTRAINT FK_reaction_user FOREIGN KEY (id_user) 
            REFERENCES dbo.nguoi_dung(id_user) ON DELETE CASCADE,
        CONSTRAINT UQ_reaction_user_message UNIQUE(ma_tin_nhan, id_user)
    );
    PRINT '✅ Created tin_nhan_reaction table';
END
ELSE
BEGIN
    PRINT '⚠️ Table tin_nhan_reaction already exists';
END

-- 3. Verify changes
PRINT '';
PRINT '📊 Verification:';
SELECT 
    'tin_nhan_ca_nhan' AS TableName,
    name AS ColumnName,
    TYPE_NAME(system_type_id) AS DataType
FROM sys.columns 
WHERE object_id = OBJECT_ID(N'dbo.tin_nhan_ca_nhan') 
    AND name IN ('ma_tin_nhan_tra_loi', 'ghim');

SELECT 
    'tin_nhan_reaction' AS TableName,
    COUNT(*) AS ColumnCount
FROM sys.columns 
WHERE object_id = OBJECT_ID(N'dbo.tin_nhan_reaction');

PRINT '✅ Migration complete!';
GO
-- PERFORMANCE INDEXES FOR MESSAGE FEATURES
-- Run this AFTER main migration

USE [TRENDYSOCIALAPP];
GO

-- Indexes for tin_nhan_reaction (faster reaction queries)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_reaction_message' AND object_id = OBJECT_ID('dbo.tin_nhan_reaction'))
BEGIN
    CREATE INDEX IX_reaction_message ON dbo.tin_nhan_reaction(ma_tin_nhan);
    PRINT '✅ Created IX_reaction_message index';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_reaction_user' AND object_id = OBJECT_ID('dbo.tin_nhan_reaction'))
BEGIN
    CREATE INDEX IX_reaction_user ON dbo.tin_nhan_reaction(id_user);
    PRINT '✅ Created IX_reaction_user index';
END

-- Index for pinned messages (faster pinned queries)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_msg_pinned' AND object_id = OBJECT_ID('dbo.tin_nhan_ca_nhan'))
BEGIN
    CREATE INDEX IX_msg_pinned ON dbo.tin_nhan_ca_nhan(ghim, ma_nhom_solo) 
    WHERE ghim = 1;
    PRINT '✅ Created IX_msg_pinned filtered index';
END

-- Index for reply threads (faster reply lookups)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_msg_reply' AND object_id = OBJECT_ID('dbo.tin_nhan_ca_nhan'))
BEGIN
    CREATE INDEX IX_msg_reply ON dbo.tin_nhan_ca_nhan(ma_tin_nhan_tra_loi) 
    WHERE ma_tin_nhan_tra_loi IS NOT NULL;
    PRINT '✅ Created IX_msg_reply filtered index';
END

PRINT '';
PRINT '📊 Index Statistics:';
SELECT 
    i.name AS IndexName,
    t.name AS TableName,
    COL_NAME(ic.object_id, ic.column_id) AS ColumnName,
    i.type_desc AS IndexType
FROM sys.indexes i
INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
INNER JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.name IN ('tin_nhan_reaction', 'tin_nhan_ca_nhan')
  AND i.name LIKE 'IX_%'
ORDER BY t.name, i.name;

PRINT '✅ Performance indexes created!';
GO

-- Thêm columns vào tin_nhan_ca_nhan
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'tin_nhan_ca_nhan' 
              AND COLUMN_NAME = 'reply_to_id')
    ALTER TABLE tin_nhan_ca_nhan ADD reply_to_id VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'tin_nhan_ca_nhan' 
              AND COLUMN_NAME = 'reply_to_content')
    ALTER TABLE tin_nhan_ca_nhan ADD reply_to_content NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'tin_nhan_ca_nhan' 
              AND COLUMN_NAME = 'reply_to_sender')
    ALTER TABLE tin_nhan_ca_nhan ADD reply_to_sender VARCHAR(100) NULL;

-- Thêm columns vào chatting_group
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'chatting_group' 
              AND COLUMN_NAME = 'reply_to_id')
    ALTER TABLE chatting_group ADD reply_to_id VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'chatting_group' 
              AND COLUMN_NAME = 'reply_to_content')
    ALTER TABLE chatting_group ADD reply_to_content NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'chatting_group' 
              AND COLUMN_NAME = 'reply_to_sender')
    ALTER TABLE chatting_group ADD reply_to_sender VARCHAR(100) NULL;

SELECT 'Migration completed' as [Status];

-- Nếu chưa chạy V2__AddReplyFields.sql
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'tin_nhan_ca_nhan' 
              AND COLUMN_NAME = 'reply_to_id')
BEGIN
    ALTER TABLE tin_nhan_ca_nhan ADD reply_to_id VARCHAR(100) NULL;
    ALTER TABLE tin_nhan_ca_nhan ADD reply_to_content NVARCHAR(MAX) NULL;
    ALTER TABLE tin_nhan_ca_nhan ADD reply_to_sender VARCHAR(100) NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'chatting_group' 
              AND COLUMN_NAME = 'reply_to_id')
BEGIN
    ALTER TABLE chatting_group ADD reply_to_id VARCHAR(100) NULL;
    ALTER TABLE chatting_group ADD reply_to_content NVARCHAR(MAX) NULL;
    ALTER TABLE chatting_group ADD reply_to_sender VARCHAR(100) NULL;
END

ALTER TABLE chatting_group 
ADD ghim BIT DEFAULT 0;

-- Add index for performance
CREATE INDEX idx_chatting_group_ghim 
ON chatting_group(ghim);
-- Add new columns to post table for hide settings
USE [TRENDYSOCIALAPP];
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'post' 
              AND COLUMN_NAME = 'hide_comments')
BEGIN
    ALTER TABLE post ADD hide_comments BIT DEFAULT 0;
    PRINT '✅ Added hide_comments column';
END
ELSE
BEGIN
    PRINT '⚠️ Column hide_comments already exists';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'post' 
              AND COLUMN_NAME = 'hide_likes')
BEGIN
    ALTER TABLE post ADD hide_likes BIT DEFAULT 0;
    PRINT '✅ Added hide_likes column';
END
ELSE
BEGIN
    PRINT '⚠️ Column hide_likes already exists';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'post' 
              AND COLUMN_NAME = 'hide_views')
BEGIN
    ALTER TABLE post ADD hide_views BIT DEFAULT 0;
    PRINT '✅ Added hide_views column';
END
ELSE
BEGIN
    PRINT '⚠️ Column hide_views already exists';
END

PRINT '✅ Post table migration complete!';
GO
DECLARE @ConstraintName NVARCHAR(200);
SELECT @ConstraintName = Name
FROM sys.default_constraints
WHERE parent_object_id = OBJECT_ID('dbo.post')
  AND parent_column_id = (
      SELECT column_id 
      FROM sys.columns 
      WHERE object_id = OBJECT_ID('dbo.post') 
        AND name = 'trang_thai'
  );

IF @ConstraintName IS NOT NULL
BEGIN
    EXEC('ALTER TABLE dbo.post DROP CONSTRAINT ' + @ConstraintName);
    PRINT '✅ Đã xoá default constraint cho cột trang_thai';
END

-- Xóa cột trang_thai
IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'trang_thai' AND Object_ID = Object_ID(N'dbo.post'))
BEGIN
    ALTER TABLE dbo.post DROP COLUMN trang_thai;
    PRINT '✅ Đã xoá cột trang_thai khỏi bảng post';
END
ELSE
BEGIN
    PRINT '⚠️ Cột trang_thai không tồn tại hoặc đã bị xoá trước đó';
END
GO

-- Add hidden column to comment table for hide functionality
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'comment' 
              AND COLUMN_NAME = 'an_binh_luan')
BEGIN
    ALTER TABLE dbo.comment ADD an_binh_luan BIT DEFAULT 0;
    PRINT '✅ Added an_binh_luan column to comment table';
END
ELSE
BEGIN
    PRINT '⚠️ Column an_binh_luan already exists';
END
GO
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'post' 
              AND COLUMN_NAME = 'hide_comments')
BEGIN
    ALTER TABLE post ADD hide_comments BIT DEFAULT 0;
    PRINT '✅ Added hide_comments column';
END
ELSE
BEGIN
    PRINT '⚠️ Column hide_comments already exists';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'post' 
              AND COLUMN_NAME = 'hide_likes')
BEGIN
    ALTER TABLE post ADD hide_likes BIT DEFAULT 0;
    PRINT '✅ Added hide_likes column';
END
ELSE
BEGIN
    PRINT '⚠️ Column hide_likes already exists';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'post' 
              AND COLUMN_NAME = 'hide_views')
BEGIN
    ALTER TABLE post ADD hide_views BIT DEFAULT 0;
    PRINT '✅ Added hide_views column';
END
ELSE
BEGIN
    PRINT '⚠️ Column hide_views already exists';
END

-- Verify columns
SELECT 
    'post' AS TableName,
    name AS ColumnName,
    TYPE_NAME(system_type_id) AS DataType,
    is_nullable AS IsNullable
FROM sys.columns 
WHERE object_id = OBJECT_ID(N'dbo.post')
ORDER BY column_id;

PRINT '✅ Post table migration complete!';
GO




USE [TRENDYSOCIALAPP];
GO

-- Thêm cột ma_nguoi_gui
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'notification' 
              AND COLUMN_NAME = 'ma_nguoi_gui')
BEGIN
    ALTER TABLE dbo.notification ADD ma_nguoi_gui VARCHAR(100) NULL;
    PRINT '✅ Thêm cột ma_nguoi_gui';
END

-- Thêm cột sender_name
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'notification' 
              AND COLUMN_NAME = 'sender_name')
BEGIN
    ALTER TABLE dbo.notification ADD sender_name NVARCHAR(255) NULL;
    PRINT '✅ Thêm cột sender_name';
END

-- Thêm cột post_id (thay thế lien_ket để lưu ID post)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'notification' 
              AND COLUMN_NAME = 'post_id')
BEGIN
    ALTER TABLE dbo.notification ADD post_id VARCHAR(100) NULL;
    PRINT '✅ Thêm cột post_id';
END

-- Rename loai_thong_bao thành type (hoặc giữ nguyên tùy bạn)
-- Nếu muốn giữ nguyên loai_thong_bao thì không cần chạy dòng này

-- Thêm Foreign Key cho ma_nguoi_gui
IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
              WHERE name = 'FK_notification_sender')
BEGIN
    ALTER TABLE dbo.notification 
    ADD CONSTRAINT FK_notification_sender 
    FOREIGN KEY (ma_nguoi_gui) REFERENCES dbo.nguoi_dung(id_user) ON DELETE NO ACTION;
    PRINT '✅ Thêm Foreign Key cho ma_nguoi_gui';
END

PRINT '✅ Migration hoàn tất!';
GO

-- Verify
SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'notification'
ORDER BY ORDINAL_POSITION;

USE [TRENDYSOCIALAPP];
GO

-- Xóa cột hide_comments nếu tồn tại
IF EXISTS (SELECT * FROM sys.columns 
           WHERE Name = N'hide_comments' 
           AND Object_ID = Object_ID(N'dbo.post'))
BEGIN
    ALTER TABLE dbo.post DROP COLUMN hide_comments;
    PRINT '✅ Đã xóa cột hide_comments';
END
ELSE
BEGIN
    PRINT '⚠️ Cột hide_comments không tồn tại hoặc đã bị xóa trước đó';
END

-- Xóa cột hide_likes nếu tồn tại
IF EXISTS (SELECT * FROM sys.columns 
           WHERE Name = N'hide_likes' 
           AND Object_ID = Object_ID(N'dbo.post'))
BEGIN
    ALTER TABLE dbo.post DROP COLUMN hide_likes;
    PRINT '✅ Đã xóa cột hide_likes';
END
ELSE
BEGIN
    PRINT '⚠️ Cột hide_likes không tồn tại hoặc đã bị xóa trước đó';
END

-- Xóa cột hide_views nếu tồn tại
IF EXISTS (SELECT * FROM sys.columns 
           WHERE Name = N'hide_views' 
           AND Object_ID = Object_ID(N'dbo.post'))
BEGIN
    ALTER TABLE dbo.post DROP COLUMN hide_views;
    PRINT '✅ Đã xóa cột hide_views';
END
ELSE
BEGIN
    PRINT '⚠️ Cột hide_views không tồn tại hoặc đã bị xóa trước đó';
END
GO



DECLARE @ConstraintName NVARCHAR(200);

SELECT @ConstraintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c 
    ON dc.parent_object_id = c.object_id 
    AND dc.parent_column_id = c.column_id
WHERE dc.parent_object_id = OBJECT_ID('dbo.post')
  AND c.name = 'hide_comments';

IF @ConstraintName IS NOT NULL
BEGIN
    EXEC('ALTER TABLE dbo.post DROP CONSTRAINT ' + @ConstraintName);
    PRINT '✅ Đã xoá default constraint cho hide_comments';
END

ALTER TABLE dbo.post DROP COLUMN hide_comments;
PRINT '✅ Đã xoá cột hide_comments khỏi bảng post';

USE [TRENDYSOCIALAPP];
GO

DECLARE @table NVARCHAR(128) = 'dbo.post';
DECLARE @column NVARCHAR(128);
DECLARE @constraint NVARCHAR(128);
DECLARE @sql NVARCHAR(MAX);

-- Danh sách các cột cần xóa
DECLARE @cols TABLE (col NVARCHAR(128));
INSERT INTO @cols (col) VALUES ('hide_likes'), ('hide_views');

DECLARE col_cursor CURSOR FOR SELECT col FROM @cols;
OPEN col_cursor;

FETCH NEXT FROM col_cursor INTO @column;
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Tìm constraint nếu có
    SELECT @constraint = dc.name
    FROM sys.default_constraints dc
    JOIN sys.columns c 
        ON dc.parent_object_id = c.object_id 
        AND dc.parent_column_id = c.column_id
    WHERE dc.parent_object_id = OBJECT_ID(@table)
      AND c.name = @column;

    -- Nếu có constraint -> xóa
    IF @constraint IS NOT NULL
    BEGIN
        SET @sql = N'ALTER TABLE ' + @table + ' DROP CONSTRAINT [' + @constraint + ']';
        EXEC sp_executesql @sql;
        PRINT '🧹 Đã xóa constraint ' + @constraint + ' của cột ' + @column;
    END

    -- Sau đó xóa cột
    IF EXISTS (SELECT * FROM sys.columns WHERE Name = @column AND Object_ID = Object_ID(@table))
    BEGIN
        SET @sql = N'ALTER TABLE ' + @table + ' DROP COLUMN [' + @column + ']';
        EXEC sp_executesql @sql;
        PRINT '✅ Đã xóa cột ' + @column;
    END
    ELSE
    BEGIN
        PRINT '⚠️ Cột ' + @column + ' không tồn tại hoặc đã bị xóa trước đó';
    END

    SET @constraint = NULL;
    FETCH NEXT FROM col_cursor INTO @column;
END

CLOSE col_cursor;
DEALLOCATE col_cursor;

PRINT '🎯 Hoàn tất xóa cột hide_likes và hide_views khỏi bảng post';
GO

ALTER TABLE post
ADD likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    views_count INT DEFAULT 0;