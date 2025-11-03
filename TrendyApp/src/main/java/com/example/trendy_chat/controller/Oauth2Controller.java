package com.example.trendy_chat.controller;

import com.example.trendy_chat.dto.UserResponse;
import com.example.trendy_chat.entity.User;
import com.example.trendy_chat.repository.UserRepository;
import com.example.trendy_chat.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Controller
@RequestMapping("/trendy/auth/oauth2")
public class Oauth2Controller {
    @Autowired
    private JwtService jwtService;
    @Autowired
    UserRepository userRepository;
    // Read frontend URL from application.properties (default to http://localhost:5173)
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;
    @GetMapping("/success")
    public ResponseEntity<?> success(OAuth2AuthenticationToken authenticationToken){
        Map<String, Object> userInfo = authenticationToken.getPrincipal().getAttributes();
        String email = (String)  userInfo.get("email");
        String name = (String) userInfo.get("name");
        String picture = (String) userInfo.get("picture");
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // User doesn't exist yet. Redirect to frontend with user info in fragment
            // so frontend can show a completion form (id, password, birthday, ...).
            // Put non-sensitive public fields into the fragment: email, name, avatar
            String fragment = String.format("email=%s&name=%s&avatar=%s&new=true",
                    urlEncode(email), urlEncode(name), urlEncode(picture));
            String redirectUrl = frontendUrl + "/trendy/auth/oauth2/redirect#" + fragment;
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, redirectUrl)
                    .build();
        } else {
            String jwtToken = jwtService.genToken(email);
            UserResponse response = new UserResponse();
            response.setEmail(email);
            response.setTen(name);
            response.setAvatar(picture);
            response.setToken(jwtToken);
            response.setKieuDangNhap("GOOGLE");
            // Redirect to frontend and pass token in URL fragment (hash) to avoid sending token to server logs
            // Example: http://localhost:5173/trendy/auth/oauth2/redirect#token=...
            String redirectUrl = frontendUrl + "/trendy/auth/oauth2/redirect#token=" + jwtToken;
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, redirectUrl)
                    .build();
        }
    }
    @GetMapping("/fail")
    public ResponseEntity<String> fail() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Google login failed");
    }

    // Helper URL-encode values for fragment
    private String urlEncode(String s) {
        if (s == null) return "";
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return s;
        }
    }
}
