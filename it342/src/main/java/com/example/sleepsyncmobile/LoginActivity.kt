package com.example.sleepsyncmobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val loginButton: Button = findViewById(R.id.loginButton)
        val registerText: TextView = findViewById(R.id.registerHere)
        val forgotPasswordText: TextView = findViewById(R.id.forgotPassword)

        loginButton.setOnClickListener {
            // TODO: Add login authentication logic
        }

        registerText.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }

        forgotPasswordText.setOnClickListener {
            // TODO: Handle forgot password logic
        }
    }
}
