package com.example.sleepsyncmobile

import android.content.Intent
import android.widget.Toast
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.IOException

@Composable
fun LoginScreen() {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current

    // UI Handling (passing states and actions to the UI)
    LoginScreenUI(
        email = email,
        password = password,
        onEmailChange = { email = it },
        onPasswordChange = { password = it },
        onLoginClick = {
            // Handle Login action here
            CoroutineScope(Dispatchers.IO).launch {
                val client = OkHttpClient()
                val url = "${ApiConstants.BASE_URL}/users/login?email=$email&password=$password"
                val request = Request.Builder().url(url).build()

                try {
                    val response = client.newCall(request).execute()
                    val body = response.body?.string()

                    CoroutineScope(Dispatchers.Main).launch {
                        if (response.isSuccessful && body != null) {
                            Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()
                            // TODO: Navigate to HomeActivity
                        } else {
                            Toast.makeText(context, "Invalid email or password.", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: IOException) {
                    CoroutineScope(Dispatchers.Main).launch {
                        Toast.makeText(context, "Network error!", Toast.LENGTH_SHORT).show()
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
