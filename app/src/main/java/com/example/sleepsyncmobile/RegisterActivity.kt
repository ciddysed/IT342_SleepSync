package com.example.sleepsyncmobile

import RegisterScreenUI
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.example.sleepsyncmobile.model.User
import com.example.sleepsyncmobile.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RegisterActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            var email by remember { mutableStateOf("") }
            var firstName by remember { mutableStateOf("") }
            var lastName by remember { mutableStateOf("") }
            var password by remember { mutableStateOf("") }

            RegisterScreenUI(
                email = email,
                firstName = firstName,
                lastName = lastName,
                password = password,
                onEmailChange = { email = it },
                onFirstNameChange = { firstName = it },
                onLastNameChange = { lastName = it },
                onPasswordChange = { password = it },
                onRegisterClick = {
                    val user = User(email, firstName, lastName, password)
                    CoroutineScope(Dispatchers.IO).launch {
                        try {
                            val response = RetrofitClient.apiService.registerUser(user)
                            withContext(Dispatchers.Main) {
                                if (response.isSuccessful) {
                                    Toast.makeText(applicationContext, "Registration successful", Toast.LENGTH_SHORT).show()
                                    startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                                    finish()
                                } else {
                                    Toast.makeText(applicationContext, "Registration failed: ${response.code()}", Toast.LENGTH_SHORT).show()
                                }
                            }
                        } catch (e: Exception) {
                            Log.e("RegisterActivity", "Error: ${e.message}")
                            withContext(Dispatchers.Main) {
                                Toast.makeText(applicationContext, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                },
                onCancelClick = {
                    startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                    finish()
                }
            )
        }
    }
}
