# Sola: Universal Cloud-AI Assistant for Mixed Reality

![Unity](https://img.shields.io/badge/Unity-2022%2B-black?style=flat-square&logo=unity)
![C#](https://img.shields.io/badge/Language-C%23-blue?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Cross--Platform%20XR-lightgrey?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📌 What is Sola?
**Sola** is a lightweight, hardware-agnostic Voice User Interface (VUI) framework designed for spatial computing. It acts as a "Reality Copilot," allowing users in Extended Reality (XR) to interact with a multimodal Large Language Model using natural voice commands.

Instead of relying on heavy on-device inference that drains mobile headsets (like the Meta Quest 3), Sola offloads the cognitive reasoning and voice synthesis to the cloud. The visual feedback is driven by the "Eclipse UI," a procedural holographic interface that reacts to the AI's emotional metadata and audio amplitude in real-time.

## ⚙️ Core Architecture
Sola utilizes a strictly decoupled, asynchronous Task-based (TAP) pipeline in C#:
1. **Multimodal Inference (Google Gemini 2.5 Flash):** Bypasses traditional Speech-to-Text (STT) bottlenecks by running structural intent reasoning directly on the captured Base64 audio buffer.
2. **Neural Prosody Synthesis (ElevenLabs):** Converts the LLM's text response into high-fidelity spatial audio.
3. **Zero Main-Thread Blocking:** Network operations run in the background, maintaining a rigid 72–90 Hz frame rate for motion sickness prevention.

## 🚀 Key Features
* **Drop-in Unity Integration:** Easily attach the orchestrator script to any XR project.
* **Hardware-Agnostic AI:** Because all heavy processing is cloud-native, Sola runs smoothly on any XR device supported by Unity.
* **Procedural Eclipse UI:** A non-intrusive, shader-based visual representation of the AI that changes color based on intent (e.g., green for happy, blue for analytical) and pulses with voice volume.

## 📂 Repository Contents
* `GeminiApiClient.cs` — The primary orchestrator script handling the bidirectional data flow between the Unity client, Google Gemini, and ElevenLabs.

## 🛠️ Installation & Scene Setup Guide
### 1. Unity Environment Setup
1. Open your Unity project (recommended: **Unity 2022.3 LTS** with the **Universal Render Pipeline**).
2. Ensure you have the **XR Interaction Toolkit** (or Meta XR Core SDK) configured if deploying directly to the Meta Quest 3 headset.
3. Import the `Newtonsoft.Json` library via the Unity Package Manager.

### 2. Scene Hierarchy Configuration
To deploy the **Sola Core Interface** in your scene, construct the following hierarchy structure:
* 🟢 **Sola_Assistant (GameObject)** — *Attach the `GeminiApiClient.cs` script here. An `AudioSource` component will be added automatically.*
    * 🔹 **Eclipse_Core (3D Sphere)** — *Acts as the anchor disk. Assign this to the `emotionRenderer` field in the Inspector to drive real-time emission color shifts.*
    * 🔹 **Glow_Ring (3D Torus/Particles)** — *The emissive outer ring layer. Assign this Transform component to the `glowTransform` field to animate real-time volume scaling.*
    * 📦 **UI_Canvas (World Space Canvas)**
        * 📝 **Transcript_Text (TextMeshPro)** — *Assign this to the `outputText` field to display live bidirectional text updates.*
        * 🖼️ **Settings_Panel (GameObject)** — *Contains the optional UI sliders (`opacitySlider`, `volumeSlider`, `sensitivitySlider`) linked to the internal state controllers.*

### 3. Execution
Paste your validated API credentials into the designated `geminiApiKey` and `elevenLabsApiKey` Inspector fields. Trigger the `ToggleRecording()` method via any standard XR UI interaction event (such as a canvas button click or an input action component mapped to your controllers) to initiate the live conversational loop.

## 🎓 Academic Context
The Sola architecture was developed as a technical proof-of-concept for the engineering thesis: 
*"Development of a Universal Cloud-Based AI Assistant for Mixed Reality Environments"* by Andrei Ziber (LAB University of Applied Sciences, 2022).

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
