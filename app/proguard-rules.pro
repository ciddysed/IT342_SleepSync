# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Retrofit and Gson
-keep class com.example.sleepsyncmobile.model.** { *; }
-keep class com.google.gson.** { *; }
-keep class retrofit2.** { *; }
-keep interface retrofit2.** { *; }
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Prevent warnings related to okhttp3, retrofit2, okio
-dontwarn okhttp3.**
-dontwarn retrofit2.**
-dontwarn okio.**

# Keep JSON field names and annotations
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod

# Gson SerializedName annotations
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Prevent stripping of ViewModels (if used)
-keep class androidx.lifecycle.ViewModel { *; }
-keepclassmembers class * extends androidx.lifecycle.ViewModel {
    <init>(...);
}

# Keep all Activities (safe default)
-keep class * extends android.app.Activity { *; }

# Keep Retrofit API Service classes and their annotations
-keep class com.example.sleepsyncmobile.network.ApiService { *; }
-keep class com.example.sleepsyncmobile.network.ApiService$* { *; }

# Keep method signatures annotated with @Path, @Query, @Body for Retrofit
-keepattributes *Annotation*
