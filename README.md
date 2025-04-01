📌 Project Overview
SleepSync Mobile is an Android application designed to help users manage their sleep schedules efficiently. Built using Kotlin in Android Studio, the app provides a seamless login system, a user-friendly UI, and smooth navigation.

🚀 Features
Gradient UI with a modern and user-friendly interface.
User authentication (Login, Registration, Remember Me, Forgot Password).
Secure API integration for user data.
Smooth navigation between screens.

🔧 Setup Instructions

1. Clone the Repository
  git clone https://github.com/james-wolfe-04/SleepSyncMobile.git
  cd SleepSyncMobile

2. Open in Android Studio
  Launch Android Studio.
  Click on Open an Existing Project.
  Navigate to the cloned SleepSyncMobile directory and select it.

3. Install Dependencies
  Android Studio will automatically detect missing dependencies. If prompted, click Sync Now.
  Manually, you can sync dependencies by going to: File > Sync Project with Gradle Files

4. Enable USB Debugging (For Real Devices)
  Enable Developer Mode on your Android device.
  Turn on USB Debugging under Developer Options.
  Allow installation via USB if prompted.

5. Run the Application
  For Emulator: Click ▶️ Run in Android Studio.
  For Physical Device: Connect your device via USB and select it from the Run menu.

📦 Dependencies
This project uses the following dependencies:
  // Kotlin Core Libraries
  implementation "androidx.core:core-ktx:1.9.0"

  // AppCompat & Material Design
  implementation "androidx.appcompat:appcompat:1.6.1"
  implementation "com.google.android.material:material:1.8.0"

  // Constraint Layout for UI
  implementation "androidx.constraintlayout:constraintlayout:2.1.4"
Run Sync Project with Gradle Files after modifying dependencies.

📖 Usage Guide
Login Flow:
  Click "Get Started" to navigate to the login page.
  Enter Email and Password.
  Click "LOGIN".
  Use "Remember Me?" to keep your session active.
  Click "Forgot Password" to recover your account.
  If you don’t have an account, click "Register Here."
Navigation:
  MainActivity.kt: Home screen with "Get Started" button.
  LoginActivity.kt: Handles user login.
  RegisterActivity.kt: Allows new users to sign up (Coming soon).

⚡ Contributing
If you’d like to contribute:
  Fork the repository.
  Create a new branch: git checkout -b feature-branch.
  Make your changes and commit: git commit -m "Added new feature".
  Push changes: git push origin feature-branch.
  Submit a Pull Request.
