package com.it342.sleepsync.Util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;

public class JwtUtil {

    private static final String SECRET_KEY = "MDQ0ZmRhNjMzNmJjZTcwMDE1MDZlNDcyMWQ2OTUxM2E3NWExOGMxOWU3ZjVjOWQxNzFkZTA4M2IzYmM0ZTY3Mgo=";

    // Static method with default expiration time
    public static String generateToken(String email) {
        long defaultExpirationTime = 1000 * 60 * 60 * 10; // 10 hours
        return generateToken(email, defaultExpirationTime);
    }

    // Static method with custom expiration time
    public static String generateToken(String email, long expirationTime) {
        Key key = new SecretKeySpec(SECRET_KEY.getBytes(), SignatureAlgorithm.HS256.getJcaName());
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
