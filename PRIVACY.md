# 🔒 Sola XR: Privacy Policy & Security Architecture

> **Last Updated**: October 2026  
> **Architecture**: Zero-Cloud Intermediary (Bring-Your-Own-Key)

At Sola, privacy is not a setting—it is a fundamental architectural guarantee. Sola is engineered from the ground up so that **no private servers, proxies, analytics trackers, or middleman databases ever sit between you and your AI model**.

---

## 1. Zero-Cloud Intermediary Guarantee
* **Direct HTTPS Connection**: Sola communicates directly from your Meta Quest 3 headset (or Windows PC) to official Google AI Studio endpoints (`generativelanguage.googleapis.com`) using TLS 1.3 encrypted HTTPS.
* **No Middleman Servers**: We run no telemetry servers, user accounts, or intermediary backends. Your voice audio buffers and text prompts travel directly to Google under your personal Google account.

---

## 2. On-Device Credential Storage
* **Local PlayerPrefs**: When you pair your Google Gemini API key or Google Workspace OAuth token, credentials are saved exclusively to your device's local encrypted sandbox (`PlayerPrefs` or `.env` file).
* **Never Transmitted Elsewhere**: Keys are never transmitted to any third party, logged to public telemetry, or synchronized off your headset.

---

## 3. Optical QR Code Pairing
* When pairing via the [Sola Web Companion](https://andreilab.github.io/Sola/), your API key is converted into a local QR code generated entirely inside your web browser using client-side JavaScript.
* The key travels optically—via light from your phone or monitor directly to your Quest 3's passthrough camera. It is never sent across external networks during pairing.

---

## 4. Microphone & Camera Data Handling
* **Microphone Capture**: The microphone stream is captured in a temporary in-memory rolling buffer solely to detect the wake word and evaluate voice activity. Once the conversational turn concludes, the buffer is freed.
* **Camera Capture**: Passthrough video is never recorded or streamed continuously. Only when you explicitly prompt Sola with a visual question is a single snapshot compressed in memory and sent to Gemini.

---

## 5. Contact & Open Source Verification
Because Sola is completely open source under the MIT License, you can inspect and verify every network request and C# component in our development repository:
👉 [https://github.com/AndreiLAB/SolaDev](https://github.com/AndreiLAB/SolaDev)
