package com.it342.sleepsync.Config;


import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.it342.sleepsync.util.JwtUtil; // Adjust the package path if necessary
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    public CustomOAuth2SuccessHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response, 
                                      Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        
        // Generate token with additional claims if needed
        String token = jwtUtil.generateToken(email);
        System.out.println("Generated Token: " + token); // Debugging: Log the token
        
        // URL encode the token for safe redirect
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        
        // Redirect to frontend landing page with token
        response.sendRedirect("http://localhost:3000/user/landing?token=" + encodedToken);
    }
}
