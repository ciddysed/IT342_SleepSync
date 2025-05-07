// LoginActivity.kt
package com.example.sleepsyncmobile

import android.annotation.SuppressLint
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import com.example.sleepsyncmobile.model.LoginResponse
import com.example.sleepsyncmobile.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import androidx.core.content.edit
import com.example.sleepsyncmobile.model.LoginRequest

class LoginActivity : ComponentActivity() {
    @SuppressLint("UseKtx")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                val context = LocalContext.current
                var email by remember { mutableStateOf("") }
                var password by remember { mutableStateOf("") }

                LoginScreenUI(
                    email = email,
                    password = password,
                    onEmailChange = { email = it },
                    onPasswordChange = { password = it },
                    onLoginClick = {
                        CoroutineScope(Dispatchers.IO).launch {
                            try {
                                val loginRequest = LoginRequest(email, password)
                                val response = RetrofitClient.apiService.loginUser(loginRequest)
                                withContext(Dispatchers.Main) {
                                    if (response.isSuccessful && response.body() != null) {
                                        val loginResponse = response.body() // This is LoginResponse
                                        val firstName = loginResponse?.user?.firstName // Access firstName
                                        val emailFromResponse = loginResponse?.user?.email // Access email

                                        if (firstName != null && emailFromResponse != null) {
                                            Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()

                                            // Save first name and email in SharedPreferences
                                            val sharedPreferences: SharedPreferences = getSharedPreferences("UserPrefs", MODE_PRIVATE)
                                            val editor = sharedPreferences.edit()
                                            editor.putString("first_name", firstName)
                                            editor.putString("email", emailFromResponse)
                                            editor.apply()

                                            // Pass the first name and email to HomeActivity
                                            val intent = Intent(context, HomeActivity::class.java)
                                            context.startActivity(intent)

                                            // Finish LoginActivity to prevent back navigation
                                            (context as? LoginActivity)?.finish()
                                        } else {
                                            Toast.makeText(context, "Error: First name or email not found", Toast.LENGTH_SHORT).show()
                                        }
                                    } else {
                                        Toast.makeText(context, "Invalid credentials", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            } catch (e: Exception) {
                                withContext(Dispatchers.Main) {
                                    Toast.makeText(context, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                                }
                            }
                        }
                    },
                    onRegisterClick = {
                        val intent = Intent(context, RegisterActivity::class.java)
                        context.startActivity(intent)
                    },
                    onForgotPasswordClick = {
                        val intent = Intent(context, ForgotPasswordActivity::class.java)
                        context.startActivity(intent)
                    }
                )
            }
        }
    }
}
