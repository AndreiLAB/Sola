# 📱 Sola XR Companion Web App // Spatial Intelligence Onboarding

🌐 **Live Deployed App:** [https://andreilab.github.io/SolaUnity/](https://andreilab.github.io/SolaUnity/)

The Sola Companion App is a cinematic, zero-infrastructure multi-step onboarding wizard designed to solve the VR text-entry bottleneck: **typing API keys and completing OAuth loops inside a VR headset is painful.**

Built with Sola's authentic **Solar Eclipse** visual identity (deep space void `#070709`, solar corona `#FF6B00`, and eclipse gold `#FFD23F`), this web application prepares your credentials and pairs with your **Meta Quest 3** in seconds.

---

## 🧭 Multi-Step Onboarding Wizard Flow

```text
[Screen 0: Universal Auth Gateway] ── (Google, Apple, Meta, Email, or Guest)
         │
         ▼
[Screen 1: Eclipse Genesis Intro] ── (3.5s pure CSS cinematic eclipse flare & emote check)
         │
         ▼
[Screen 2: Brain Engine (BYOK)] ─── (Gemini 2.5 Flash key entry & live test)
         │
         ▼
[Screen 3: Workspace Link] ──────── (Google Calendar & Tasks tool-calling sync)
         │
         ▼
[Screen 4: Calibrate Mind] ──────── (Persona chips: Architect / Companion / Brainstormer + pitch)
         │
         ▼
[Screen 5: Optical Handshake] ───── (High-contrast live QR scan with Quest 3 Passthrough 👀)
```

---

## ⚡ Pairing Methods

### 1. 📸 Instant Optical QR Code Scan (Recommended & Zero-Network Configuration)
* Open the wizard on your phone, laptop, or tablet: [https://andreilab.github.io/SolaUnity/](https://andreilab.github.io/SolaUnity/)
* Follow the steps to paste your Gemini API key and select your persona.
* The app renders a high-contrast QR code with a solar corona flare halo.
* Look directly at the screen through your **Meta Quest 3 passthrough camera** — Sola automatically ingests the configuration with zero network configuration or router firewall issues.

### 2. 📡 Local Wi-Fi LAN Sync (HTTP Fallback)
* If optical scan is unavailable, expand the **Local Wi-Fi LAN** accordion on Screen 5.
* Enter your Quest 3 local IP address and pairing code (`SOLA-XX`).
* Deliver credentials directly to `SolaPairingServer.cs` on port `8080`.

---

## 🚀 Automated Deployment & Configuration

### Decoupled Config Architecture
- **Local Development**: Copy `companion/config.example.json` to `companion/config.json` and set your `googleClientId`. `companion/config.json` is git-ignored to prevent credential leaks.
- **GitHub Pages CI/CD**: The workflow `.github/workflows/deploy-companion.yml` dynamically generates `companion/config.json` from the repository secret `${{ secrets.GOOGLE_CLIENT_ID }}` during the artifact upload step.

### Local Testing
```bash
# Serve locally via Python:
python -m http.server 3000 --directory companion
# Or using Node:
npx serve companion
```

---

## 🔒 Security & Privacy Architecture

- **Zero External Proxy:** Credentials never touch developer servers or third-party cloud proxies.
- **Client-Side Synthesis:** The QR code payload is serialized entirely inside the user's browser runtime.
- **On-Device Storage:** Keys are written directly to Quest 3 persistent storage (`PlayerPrefs` / `SolaEnv.cs`).
