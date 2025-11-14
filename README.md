# 🌟 TrendySocial - Website mạng xã hội hiện đại

<div align="center">

**Nền tảng mạng xã hội toàn diện với chat real-time, theo dõi, và chia sẻ nội dung**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

</div>

---

## 📋 Mục lục

- [Mô tả](#-mô-tả)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ](#-công-nghệ)
- [Cài đặt](#-cài-đặt)
- [Cách sử dụng](#-cách-sử-dụng)
- [Tác giả](#-tác-giả)

---

## 💬 Mô tả

**TrendySocial** là một ứng dụng mạng xã hội hiện đại được xây dựng với:

- ✅ Frontend: **Vue 3 + Vite + Tailwind CSS**
- ✅ Backend: **Spring Boot + WebSocket + SQL Server**
- ✅ Real-time: Cập nhật tin nhắn, thông báo tức thời
- ✅ Responsive: Hoạt động tốt trên mọi thiết bị

Cho phép người dùng kết nối với bạn bè, chia sẻ nội dung, chat real-time và tương tác qua like, bình luận.

---

## 🎯 Tính năng chính

### 👥 **Quản lý tài khoản & bạn bè**

- 📱 Đăng ký/Đăng nhập (hỗ trợ OAuth2 Google)
- 🔐 Quản lý mật khẩu & khôi phục tài khoản
- 👤 Hồ sơ cá nhân với avatar, bio, thống kê
- ➕ Thêm/Xóa bạn bè
- 🚫 Chặn người dùng

### 💬 **Tin nhắn & Chat**

- ⚡ Chat real-time qua WebSocket (STOMP)
- 👥 Tạo nhóm chat với nhiều thành viên
- 📎 Chia sẻ file/ảnh trong chat
- ⭐ Ghim tin nhắn quan trọng
- 😊 Biểu cảm emoji reaction
- 🔄 Auto-sync chat list (polling 3 giây)

### 📝 **Bài viết & Nội dung**

- ✍️ Tạo/Sửa/Xóa bài viết
- 🖼️ Upload ảnh đa tệp
- 🔒 Kiểm soát quyền riêng tư (công khai/bạn bè/một mình)
- ❤️ Like bài viết
- 💬 Bình luận & trả lời bình luận
- 📌 Lưu bài viết
- 👀 Xem số views

### 🔔 **Thông báo**

- 📢 Thông báo real-time cho action (like, bình luận, mention)
- 👥 Thông báo khi được thêm vào nhóm
- 🔊 Hỗ trợ WebSocket broadcast

---

## 🛠️ Công nghệ

### **Frontend**

```
Vue 3 (Composition API)
Vite (Build tool)
Tailwind CSS (Styling)
Axios (HTTP client)
STOMP (WebSocket protocol)
Bootstrap Icons (Icons)
```

### **Backend**

```
Spring Boot 3.x
Spring Data JPA/Hibernate
Spring WebSocket (STOMP)
Spring Security (JWT)
SQL Server
Maven
```

### **Công cụ khác**

```
Git/GitHub (Version control)
Postman (API testing)
```

## 📦 Cài đặt

### **Yêu cầu hệ thống**

- ✅ Node.js 18+ (Frontend)
- ✅ Java 17+ (Backend)
- ✅ SQL Server 2019+
- ✅ Maven 3.8+

### **1️⃣ Clone repository**

```bash
git clone https://github.com/quangvu26/TrendySocial.git
cd TrendySocialWeb
```

### **2️⃣ Cài đặt Backend**

```bash
# Vào thư mục backend
cd trendy-back

# Cấu hình database
# Chỉnh sửa application.properties
# - spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=trendy_db
# - spring.datasource.username=sa
# - spring.datasource.password=your_password

# Build & chạy
mvn clean install
mvn spring-boot:run
# Server chạy tại: http://localhost:8080
```

### **3️⃣ Cài đặt Frontend**

```bash
# Vào thư mục frontend
cd trendy-front

# Cài đặt dependencies
npm install

# Cấu hình API
# Sửa .env.development
# VITE_API_BASE_URL=http://localhost:8080

# Chạy dev server
npm run dev
# Mở: http://localhost:5173
```

### **4️⃣ Khởi tạo Database**

```bash
# Chạy SQL Server
# Tạo database
CREATE DATABASE trendy_db;

# Chạy script database (nếu có)
# sqlserversocialapp.sql
```

---

## 🚀 Cách sử dụng

### **Bắt đầu**

1. 🌐 Mở http://localhost:5173
2. 📝 Đăng ký tài khoản mới hoặc đăng nhập
3. ✨ Khám phá các tính năng

### **Các tính năng chính**

#### 💬 **Chat với bạn bè**

```
1. Bấm icon chat ở sidebar
2. Chọn bạn hoặc tạo nhóm
3. Gửi tin nhắn text/file
4. Reactions: Click emoji icon trên tin nhắn
5. Ghim tin nhắn: Click menu → Ghim
```

#### 📝 **Chia sẻ bài viết**

```
1. Bấm nút "Tạo bài viết"
2. Viết nội dung & chọn ảnh
3. Chọn quyền riêng tư (công khai/bạn bè/một mình)
4. Bấm "Đăng"
5. Chỉnh sửa: Click menu → Chỉnh sửa
```

#### 👥 **Kết nối bạn bè**

```
1. Tìm người dùng trong search
2. Bấm "Thêm bạn"
3. Chấp nhận lời mời kết bạn
4. Bắt đầu chat!
```

#### 🔔 **Nhận thông báo**

```
- Like/Bình luận: Thông báo tức thời
- Tin nhắn mới: Cập nhật chat list
- Thành viên nhóm: Khi được thêm vào
```

### **Tính năng nâng cao**

| Tính năng              | Mô tả                                |
| ---------------------- | ------------------------------------ |
| 🔒 **Privacy Control** | Chọn ai được xem bài viết            |
| 🌐 **OAuth2**          | Đăng nhập qua Google                 |
| 💾 **Lưu bài viết**    | Bookmark bài yêu thích               |
| 📌 **Ghim tin nhắn**   | Tin nhắn quan trọng luôn ở trên      |
| 🚫 **Chặn người dùng** | Không nhận tin nhắn từ người bị chặn |
| 😊 **Emoji Reactions** | Like, Love, Haha, Wow, Sad, Angry    |

---

## 📂 Cấu trúc dự án

```
TrendySocialWeb/
├── trendy-back/              # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/example/trendy_chat/
│   │       ├── controller/   # REST API endpoints
│   │       ├── entity/       # Database entities
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── repository/   # JPA repositories
│   │       └── service/      # Business logic
│   └── pom.xml
│
├── trendy-front/             # Frontend (Vue 3)
│   ├── src/
│   │   ├── components/       # Vue components
│   │   ├── api/              # API services
│   │   ├── utils/            # Utility functions
│   │   ├── router/           # Vue Router config
│   │   └── App.vue
│   ├── package.json
│   └── vite.config.js
│
└── README.md                 # Tài liệu này
```

---

## 🔗 API Endpoints (Các endpoint chính)

### **Authentication**

```
POST   /trendy/auth/register    - Đăng ký
POST   /trendy/auth/login       - Đăng nhập
GET    /trendy/user/{id}        - Lấy thông tin user
```

### **Chat & Messages**

```
GET    /trendy/chat/solo        - Lấy danh sách chat cá nhân
GET    /trendy/chat/group       - Lấy danh sách nhóm
POST   /trendy/chat/solo        - Tạo chat
POST   /trendy/chat/group/create - Tạo nhóm
```

### **Posts**

```
GET    /trendy/posts?userId=    - Lấy bài viết user
POST   /trendy/posts            - Tạo bài viết
PUT    /trendy/posts/{id}       - Sửa bài viết
DELETE /trendy/posts/{id}       - Xóa bài viết
```

### **Friends**

```
POST   /trendy/friends/add      - Gửi lời kết bạn
GET    /trendy/friends/list     - Danh sách bạn bè
DELETE /trendy/friends/{id}     - Xóa bạn
```

---

## 🐛 Troubleshooting

| Vấn đề                   | Giải pháp                                    |
| ------------------------ | -------------------------------------------- |
| ❌ Backend không kết nối | Kiểm tra SQL Server chạy & connection string |
| ❌ Chat không sync       | Xóa localStorage, reload trang               |
| ❌ OAuth2 lỗi            | Kiểm tra Google Client ID & Redirect URI     |
| ❌ Ảnh không upload      | Kiểm tra quyền thư mục `/uploads`            |
| ❌ WebSocket disconnect  | Kiểm tra CORS & firewall                     |

---

## 📊 Performance & Optimization

✅ **Frontend Optimization:**

- Code splitting với Vite
- Lazy loading components
- Image optimization
- CSS Tailwind purging

✅ **Backend Optimization:**

- Indexed database queries
- WebSocket pooling (3-second polling fallback)
- DTO caching
- Connection pooling (HikariCP)

---

## 🤝 Đóng góp

Để đóng góp:

1. Fork repository
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 👤 Tác giả

**Vũ Ming Quang** - [GitHub](https://github.com/quangvu26)

📧 Email: vuquanghanoi2608@gmail.com  
🔗 LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---
