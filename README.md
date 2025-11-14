# 🌟 TrendySocial - Website mạng xã hội hiện đại

<div align="center">

# TRENDYSOCIAL

**Nền tảng mạng xã hội toàn diện với chat real-time, theo dõi, và chia sẻ nội dung**

[![last commit](https://img.shields.io/badge/last%20commit-today-brightgreen.svg?style=flat)](https://github.com/quangvu26/TrendySocial)
[![vue](https://img.shields.io/badge/vue-54.6%25-green.svg?style=flat&logo=vue.js)](https://vuejs.org)
[![languages](https://img.shields.io/badge/languages-6-orange.svg?style=flat)](https://github.com/quangvu26/TrendySocial)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

---
**Built with the tools and technologies:**

[![JSON](https://img.shields.io/badge/JSON-000?logo=json&logoColor=fff&style=flat)](https://www.json.org)
[![Markdown](https://img.shields.io/badge/Markdown-000?logo=markdown&logoColor=fff&style=flat)](https://www.markdownguide.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff&style=flat)](https://spring.io/projects/spring-boot)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff&style=flat)](https://www.npmjs.com)
[![Autoprefixer](https://img.shields.io/badge/Autoprefixer-0076D6?logo=autoprefixer&logoColor=fff&style=flat)](https://autoprefixer.github.io)
[![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?logo=postcss&logoColor=fff&style=flat)](https://postcss.org)

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=flat)](https://www.javascript.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=fff&style=flat)](https://vuejs.org)
[![XML](https://img.shields.io/badge/XML-000?logo=xml&logoColor=fff&style=flat)](https://www.w3.org/XML)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=flat)](https://vitejs.dev)
[![Axios](https://img.shields.io/badge/Axios-5A2D81?logo=axios&logoColor=fff&style=flat)](https://axios-http.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=fff&style=flat)](https://getbootstrap.com)

</div>

---

## 📋 Mục lục

- [Mô tả](#-mô-tả)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ](#-công-nghệ)
- [Hướng dẫn cài đặt](#-cài-đặt)
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
- 👤 Hồ sơ cá nhân với avatar, bio
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
- 🖼️ Upload ảnh
- 🔒 Kiểm soát quyền riêng tư (công khai/bạn bè/một mình)
- ❤️ Like bài viết
- 💾 Lưu bài viết
- 💬 Bình luận & trả lời bình luận
- 👀 Xem số views - số like - số comment

### 🔔 **Thông báo**

- 📢 Thông báo real-time cho action (like, bình luận, mention)
- 👥 Thông báo khi được thêm vào nhóm
- 🔊 Hỗ trợ WebSocket broadcast

---

## 🛠️ Công nghệ

### **Frontend**

| Công nghệ           | Phiên bản | Mục đích                     |
| ------------------- | --------- | ---------------------------- |
| **Vue.js**          | 3.5.22    | Reactive UI framework        |
| **Vite**            | 7.1.7     | Build tool & dev server      |
| **Vue Router**      | 4.6.3     | Client-side routing          |
| **Axios**           | 1.13.1    | HTTP client                  |
| **Tailwind CSS**    | 3.3.5     | Utility-first CSS framework  |
| **Bootstrap**       | 5.3.8     | Component library            |
| **Bootstrap Icons** | 1.13.1    | Icon set (1000+ icons)       |
| **STOMP.js**        | 7.0.0     | WebSocket messaging protocol |
| **SockJS**          | 1.6.1     | WebSocket fallback           |
| **Autoprefixer**    | 10.4.21   | CSS vendor prefixes          |
| **PostCSS**         | 8.4.31    | CSS transformation           |

### **Backend**

| Công nghệ             | Phiên bản | Mục đích                        |
| --------------------- | --------- | ------------------------------- |
| **Spring Boot**       | 3.5.7     | Framework & autoconfiguration   |
| **Java**              | 17        | Programming language            |
| **Spring Data JPA**   | -         | ORM & database access           |
| **Hibernate**         | (via JPA) | Entity mapping                  |
| **Spring Security**   | -         | Authentication & authorization  |
| **Spring OAuth2**     | -         | OAuth2 client & resource server |
| **Spring WebSocket**  | -         | Real-time communication         |
| **JWT (JJWT)**        | 0.11.5    | Token-based authentication      |
| **Spring Mail**       | -         | Email sending                   |
| **SQL Server**        | 2019+     | Database                        |
| **SQL Server JDBC**   | 12.10.2   | Database driver                 |
| **Lombok**            | 1.18.30   | Boilerplate code reduction      |
| **Spring Validation** | -         | Bean validation                 |
| **Spring DevTools**   | -         | Hot reload                      |
| **Maven**             | 3.8+      | Build tool                      |
| **dotenv**            | 4.0.0     | Environment configuration       |

### **Database**

```sql
SQL Server 2022+
- Transactions & ACID compliance
- Full-text search support
- Stored procedures & triggers
- Connection pooling (HikariCP)
```

### **Tools & Infrastructure**

| Tool              | Sử dụng cho                     |
| ----------------- | ------------------------------- |
| 🐙 **Git/GitHub** | Version control & collaboration |
| 📝 **Postman**    | API testing & documentation     |
| 🔧 **Maven**      | Dependency management           |
| 🎨 **Figma**      | UI/UX design                    |

### **Browser Support**

✅ Chrome (latest)
✅ Edge (latest)

---## 📦 Cài đặt

### **Yêu cầu hệ thống**

- ✅ Node.js 18+ (Frontend)
- ✅ Java 17+ (Backend)
- ✅ SQL Server 2022+
- ✅ Maven 3.8+

### **1️⃣ Clone repository**

```bash
git clone https://github.com/quangvu26/TrendySocial.git
cd TrendySocialWeb
```

### **2️⃣ Khởi tạo Database**

```bash
# Chạy SQL Server
# sqlserversocialweb.sql
```

### **3️⃣ Cài đặt Backend**

```bash
# Vào thư mục backend
cd trendy-back

# Tạo biến môi trường (.env hoặc khai báo trực tiếp)
# Chỉnh sửa application.properties
# - spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=TRENDYSOCIALAPP;encrypt=true;trustServerCertificate=true;
# - spring.datasource.username=sa
# - spring.datasource.password=your_password

# - spring.security.oauth2.client.registration.google.client-id=your_google_client_id
# - spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret
# - spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google
# - spring.security.oauth2.client.registration.google.scope=profile,email

# - jwt.secret=your_jwt_secret
# - jwt.expiration=86400000

# - spring.mail.username=your_email@gmail.com
# - spring.mail.password=your_email_password

# Build & chạy
mvn clean install
mvn spring-boot:run
# Server chạy tại: http://localhost:8080
```

### **4️⃣ Cài đặt Frontend**

```bash
# Vào thư mục frontend
cd trendy-front

# Cài đặt dependencies
npm install

# Cấu hình API
# Sửa .env.development

# Chạy dev server
npm run dev
# Mở: http://localhost:5173
```

## 🚀 Cách sử dụng

### **Bắt đầu**

1. 🌐 Mở http://localhost:5173
2. 📝 Đăng ký tài khoản mới hoặc đăng nhập bằng google
3. ✨ Khám phá các tính năng

### **Các tính năng chính**

#### 👥 **Kết nối bạn bè**

```
1. Tìm người dùng trong phần "Bạn bè"
2. Bấm "Thêm bạn"
3. Tìm bạn bè với id user của họ
3. Gửi lời mời kết bạn
4. Bắt đầu chat!
```

#### 💬 **Chat với bạn bè**

```
1. Bấm icon chat ở sidebar
2. Chọn bạn hoặc tạo nhóm
3. Gửi tin nhắn text/file
4. Reactions: Click emoji icon trên tin nhắn
5. Ghim tin nhắn: Click menu → Ghim
6. Xóa/Thu hồi tin nhắn
```

#### 📝 **Chia sẻ bài viết**

```
1. Bấm nút "Tạo bài viết"
2. Chọn ảnh và viết nội dung
3. Chọn quyền riêng tư (công khai/bạn bè/một mình)
4. Bấm "Đăng"
5. Chỉnh sửa: Click menu → Chỉnh sửa
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

## 👤 Tác giả

**Vũ Ming Quang** - [GitHub](https://github.com/quangvu26)

## 📧 Email: vuquanghanoi2608@gmail.com
