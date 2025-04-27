package com.example.sleepsyncmobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class ForgotPasswordActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forgot_password)

        val emailInput: EditText = findViewById(R.id.editTextEmail)
        val sendButton: Button = findViewById(R.id.sendButton)
        val backToSignInButton: Button = findViewById(R.id.backToSignInButton)

        sendButton.setOnClickListener {
            val email = emailInput.text.toString().trim()

            if (email.isEmpty()) {
                Toast.makeText(this, "Please enter your email address", Toast.LENGTH_SHORT).show()
            } else {
                // TODO: Implement password reset logic (e.g., send a reset link via email)
                Toast.makeText(this, "Password reset link sent to $email", Toast.LENGTH_SHORT).show()
            }
        }

        backToSignInButton.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}
