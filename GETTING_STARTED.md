# 🚀 Getting Started with Sola XR

Welcome to Sola! This guide covers everything you need to install and configure Sola on your **Meta Quest 3 / Quest 3S** or **Windows PCXR workstation**.

---

## 🥽 Installation for Meta Quest 3 / Quest 3S

You have three simple methods to install Sola on your Quest headset:

### Method 1: Sideloading via SideQuest (Recommended)
1. Download `SolaXR-Quest3.apk` from the [Latest Release](https://github.com/AndreiLAB/Sola/releases/latest).
2. Connect your Quest 3 to your computer via a USB-C cable.
3. Open [SideQuest](https://sidequestvr.com/) (Advanced or Web installer).
4. Click the **Install APK file from computer** icon in the top toolbar.
5. Select `SolaXR-Quest3.apk` and wait for the "Task Successful" green confirmation badge.

### Method 2: Meta Quest Developer Hub (MQDH)
1. Launch **Meta Quest Developer Hub** on your PC or Mac.
2. Ensure your headset is connected via USB or Wi-Fi.
3. Navigate to **Device Manager > Apps**.
4. Drag and drop `SolaXR-Quest3.apk` onto the window to install.

### Method 3: Command Line (ADB)
If you have the Android SDK or platform-tools installed:
```bash
adb install -r SolaXR-Quest3.apk
```

---

## 🎙️ Crucial: Microphone Permissions on Quest 3

When sideloading applications outside the official Meta Horizon Store, the Android system microphone authorization pop-up may occasionally be hidden behind the VR view.

**To verify microphone access:**
1. Put on your Quest 3.
2. Open the **Universal Menu** and select **Settings** (gear icon).
3. Navigate to **Apps > Installed Apps > Sola XR**.
4. Select **Permissions** and ensure **Microphone** is toggled to **Allowed**.

---

## 💻 Installation for Windows Desktop PCXR

You can also run Sola directly on your Windows PC:
1. Download `SolaXR-Win64.zip` from [Releases](https://github.com/AndreiLAB/Sola/releases/latest).
2. Extract the archive into a folder of your choice.
3. Double-click `SolaXR.exe`.
4. Ensure your default desktop microphone is active in Windows Sound Settings.

---

## 🔑 First-Time Setup & API Key Pairing

Sola operates on a **Zero-Cloud Bring-Your-Own-Key (BYOK)** model. You never have to pay a subscription or share your data with third parties.

### Step 1: Obtain a Free Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** and select **Create API key in new project**.
4. Copy your key (`AIzaSy...`).

### Step 2: Optical QR Code Pairing (Frictionless)
1. On your phone, tablet, or desktop computer, open the [**Sola Web Companion**](https://andreilab.github.io/Sola/).
2. Paste your Gemini API key into the input field.
3. The companion will generate a high-contrast QR code.
4. Put on your Quest 3 headset and launch Sola.
5. Look at your screen with the QR code. Sola's optical scanner will decode your key in less than a second and store it securely on your device!

*(Alternatively, you can pair over local Wi-Fi by entering the headset IP shown on Sola's pairing panel).*
