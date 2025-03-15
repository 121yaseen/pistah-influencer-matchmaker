package com.matchmaking.influencer

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import android.util.Log

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    
    try {
      // Check if Firebase is already initialized
      if (FirebaseApp.getApps(this).isEmpty()) {
        // Initialize Firebase manually if needed
        val options = FirebaseOptions.Builder()
          .setProjectId("influencer-matchmaking")
          .setApplicationId("1:92911660088:android:3855a3192bfc30fef44acd")
          .setApiKey("AIzaSyB8THaw-3vcd40c8tK5I8GufxzpK21Wb3s")
          .setStorageBucket("influencer-matchmaking.firebasestorage.app")
          .build()
          
        FirebaseApp.initializeApp(this, options)
        Log.d("Firebase", "Firebase initialized successfully")
      } else {
        Log.d("Firebase", "Firebase was already initialized")
      }
    } catch (e: Exception) {
      Log.e("Firebase", "Firebase initialization failed: ${e.message}")
    }
    
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
} 