# ❓ Sola XR: Frequently Asked Questions (FAQ)

---

### 🎙️ Audio & Voice

#### Q: Sola isn't responding to my voice on Meta Quest 3. How do I fix it?
When installing apps outside the official Store via SideQuest or ADB, Meta Horizon OS sometimes suppresses the microphone permission prompt.  
**Solution**:
1. Put on your headset and open **Settings** (gear icon).
2. Go to **Apps > Installed Apps > Sola XR**.
3. Select **Permissions** and confirm that **Microphone** is set to **Allowed**.
4. Restart Sola from your App Library.

#### Q: Can I change Sola's wake word?
Currently, Sola wakes to `"Sola"` and `"Hey Sola"`. You can also trigger Sola manually by tapping its floating core with your hand or VR controller.

#### Q: Does Sola work offline?
* **Offline Systems**: Local emotional valence (`SolaMoodEngine`), facial blink morphing, 24 kHz neural speech synthesis (Kokoro-82M), physical floating drag/bobbing, and spatial countdown timers work **100% offline**.
* **Online Systems**: Deep conversational reasoning, Google Workspace integration, and weather updates require an active Wi-Fi connection to reach the Google Gemini and Open-Meteo APIs.

---

### 📝 Notes & Memory (Obsidian)

#### Q: How does the Obsidian integration work on standalone Quest 3 without a PC?
On standalone Meta Quest 3, Sola operates autonomously without needing a PC or desktop Obsidian installation. It creates an internal markdown vault at:  
`Android/data/com.AndreiLAB.SolaXR/files/Vault/Inbox.md`  
You can read, edit, and sync your daily checklist items wirelessly using the [Sola Web Companion](https://andreilab.github.io/Sola/).

#### Q: Can I connect Sola to my actual desktop Obsidian vault?
Yes! If you run Sola in Desktop PCXR mode (`SolaXR.exe`), Sola reads and writes directly to your local `Vault/` folder in real time.

---

### 🔑 Security, Costs & API Keys

#### Q: How much does it cost to use Sola?
**Sola is completely free.** It uses a Bring-Your-Own-Key (BYOK) model. Google AI Studio provides a free tier for `gemini-3.5-flash-lite`:
* **Rate Limits**: 500 requests per day (RPD) and 15 requests per minute (RPM).
* **Cost**: $0.00 / month.

#### Q: Does Sola record my room or send camera video to private servers?
**No.** Sola is engineered with a **Zero-Cloud Intermediary** architecture:
1. Sola connects directly from your device to Google AI Studio over encrypted HTTPS.
2. There are no middleman servers, telemetry gateways, or proxy databases.
3. Camera frames are only captured momentarily when you ask a visual question (e.g., *"What is this object on my desk?"*), tokenized directly to your private Google AI Studio API key, and never stored.

---

### 🥽 Hardware & Compatibility

#### Q: Does Sola work on Meta Quest 2 or Quest Pro?
Sola is optimized for the color passthrough and NPU performance of the **Meta Quest 3** and **Meta Quest 3S** (Meta Horizon OS v66+). Quest 2 is not officially supported due to monochrome passthrough and memory constraints.

#### Q: Can I run Sola without VR on my PC?
Yes! Download `SolaXR-Win64.zip` from [Releases](https://github.com/AndreiLAB/Sola/releases/latest). Sola runs on Windows with full microphone voice activation, keyboard/mouse orbit controls, and an interactive debug HUD.
