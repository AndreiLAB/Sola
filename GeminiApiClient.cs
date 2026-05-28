using System;
using System.Collections;
using System.IO;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using Newtonsoft.Json.Linq;
using TMPro;

[RequireComponent(typeof(AudioSource))]
public class GeminiApiClient : MonoBehaviour
{
    [Header("Google Gemini Settings")]
    [SerializeField] private string geminiApiKey = ""; // INSERT YOUR GOOGLE GEMINI API KEY HERE
    private string geminiModel = "gemini-2.5-flash";

    [Header("ElevenLabs TTS Settings")]
    [SerializeField] private string elevenLabsApiKey = ""; // INSERT YOUR ELEVENLABS API KEY HERE
    [SerializeField] private string voiceId = "EXAVITQu4vr4xnSDxMaL"; // Default Rachel Voice (Modify as needed)

    [Header("Main UI Elements (3D & Canvas)")]
    public TextMeshProUGUI outputText;
    public Renderer emotionRenderer;   
    public Image mainBackground;       

    [Header("Settings UI")]
    public GameObject settingsPanel;
    public Slider opacitySlider;
    public Slider volumeSlider;
    public Slider sensitivitySlider;

    [Header("Core Animation Settings")]
    public Transform glowTransform;   
    public float voiceSensitivity = 50f;
    public float maxScale = 1.3f;
    private float baseScale = 1.1f;    
    private float animationSpeed = 15f;

    private Color colorNeutral = new Color(0.2f, 0.8f, 1f);
    private Color colorHappy = new Color(0.2f, 1f, 0.4f);
    private Color colorSad = new Color(0.3f, 0.3f, 0.8f);
    private Color colorAngry = new Color(1f, 0.2f, 0.2f);
    private Color colorThinking = new Color(1f, 0.7f, 0f);

    private AudioClip micClip;
    private bool isRecording = false;
    private AudioSource audioSource;
    private int sampleWindow = 256;

    void Start()
    {
        audioSource = GetComponent<AudioSource>();
        if (emotionRenderer != null) emotionRenderer.material.color = colorNeutral;

        if (opacitySlider != null)
        {
            opacitySlider.value = mainBackground != null ? mainBackground.color.a : 0.5f;
            opacitySlider.onValueChanged.AddListener(UpdateOpacity);
        }

        if (volumeSlider != null)
        {
            volumeSlider.value = audioSource.volume;
            volumeSlider.onValueChanged.AddListener(UpdateVolume);
        }

        if (sensitivitySlider != null)
        {
            sensitivitySlider.minValue = 10f;
            sensitivitySlider.maxValue = 150f;
            sensitivitySlider.value = voiceSensitivity;
            sensitivitySlider.onValueChanged.AddListener(UpdateSensitivity);
        }

        if (glowTransform != null) glowTransform.localScale = new Vector3(baseScale, baseScale, baseScale);
    }

    void Update()
    {
        if (glowTransform != null)
        {
            float targetScale = baseScale;

            if (isRecording || audioSource.isPlaying)
            {
                float volume = GetAveragedVolume();
                targetScale = baseScale + (volume * voiceSensitivity);
                targetScale = Mathf.Clamp(targetScale, baseScale, maxScale);
            }

            Vector3 newScale = new Vector3(targetScale, targetScale, targetScale);
            glowTransform.localScale = Vector3.Lerp(glowTransform.localScale, newScale, Time.deltaTime * animationSpeed);
        }
    }

    public void ToggleSettingsPanel()
    {
        if (settingsPanel != null)
        {
            settingsPanel.SetActive(!settingsPanel.activeSelf);
        }
    }

    private void UpdateOpacity(float value)
    {
        if (mainBackground != null)
        {
            Color c = mainBackground.color;
            c.a = value;
            mainBackground.color = c;
        }
    }

    private void UpdateVolume(float value)
    {
        if (audioSource != null)
        {
            audioSource.volume = value;
        }
    }

    private void UpdateSensitivity(float value)
    {
        voiceSensitivity = value;
    }

    public void ToggleRecording()
    {
        if (!isRecording)
        {
            audioSource.Stop();
            micClip = Microphone.Start(null, false, 60, 16000);
            isRecording = true;

            if (outputText != null) outputText.text = "Listening...";
            if (emotionRenderer != null) emotionRenderer.material.color = colorThinking;
        }
        else
        {
            int position = Microphone.GetPosition(null);
            Microphone.End(null);
            isRecording = false;

            if (position <= 0 && micClip != null)
            {
                position = micClip.samples;
            }

            if (position > 0)
            {
                AudioClip trimmedClip = AudioClip.Create("Trimmed", position, 1, 16000, false);
                float[] data = new float[position];
                micClip.GetData(data, 0);
                trimmedClip.SetData(data, 0);

                if (outputText != null) outputText.text = "Analyzing...";
                StartCoroutine(SendAudioToGemini(trimmedClip));
            }
            else
            {
                if (emotionRenderer != null) emotionRenderer.material.color = colorNeutral;
                if (outputText != null) outputText.text = "Tap core to speak";
            }
        }
    }

    private float GetAveragedVolume()
    {
        if (isRecording && micClip != null)
        {
            int currentPosition = Microphone.GetPosition(null);
            if (currentPosition < sampleWindow) return 0f;

            float[] waveData = new float[sampleWindow];
            micClip.GetData(waveData, currentPosition - sampleWindow);
            return CalculateRMS(waveData);
        }
        else if (audioSource.isPlaying)
        {
            float[] waveData = new float[sampleWindow];
            audioSource.GetOutputData(waveData, 0);
            return CalculateRMS(waveData);
        }

        return 0f;
    }

    private float CalculateRMS(float[] waveData)
    {
        float levelMax = 0;
        for (int i = 0; i < sampleWindow; i++)
        {
            float wavePeak = waveData[i] * waveData[i];
            if (levelMax < wavePeak)
            {
                levelMax = wavePeak;
            }
        }
        return Mathf.Sqrt(levelMax);
    }

    private IEnumerator SendAudioToGemini(AudioClip clip)
    {
        byte[] wavData = GetWavBytes(clip);
        string base64Audio = Convert.ToBase64String(wavData);

        string cleanKey = geminiApiKey.Trim();
        string url = $"https://generativelanguage.googleapis.com/v1beta/models/{geminiModel}:generateContent?key={cleanKey}";

        string systemPrompt = "You are Sola, a smart, user-friendly AI assistant inside a Mixed Reality headset. Your visual interface represents a solar eclipse. ALWAYS answer strictly in English. Keep answers conversational and short (1-3 sentences). If the user asks for a complex guide, provide a very brief summary or a joke instead. YOU MUST RESPOND ONLY IN VALID RAW JSON FORMAT (no markdown blocks) with exactly three keys: 'transcript' (what you heard), 'answer' (your reply), and 'emotion' (choose strictly one word: neutral, happy, sad, angry).";
        string jsonData = $@"{{
            ""systemInstruction"": {{ ""parts"": [{{""text"": ""{systemPrompt}""}}] }},
            ""generationConfig"": {{ ""responseMimeType"": ""application/json"" }},
            ""contents"": [{{
                ""parts"": [
                    {{""text"": ""Listen to this audio and respond:""}},
                    {{""inlineData"": {{""mimeType"": ""audio/wav"", ""data"": ""{base64Audio}""}} }}
                ]
            }}]
        }}";

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Gemini Error: " + request.error);
                if (outputText != null) outputText.text = "Connection error. Please try again.";
                if (emotionRenderer != null) emotionRenderer.material.color = colorNeutral;
            }
            else
            {
                try
                {
                    JObject json = JObject.Parse(request.downloadHandler.text);
                    string aiContent = json["candidates"][0]["content"]["parts"][0]["text"].ToString();

                    JObject responseData = JObject.Parse(aiContent);
                    string userSaid = responseData["transcript"]?.ToString();
                    string aiAnswer = responseData["answer"]?.ToString();
                    string emotion = responseData["emotion"]?.ToString().ToLower();

                    if (string.IsNullOrWhiteSpace(userSaid) || string.IsNullOrWhiteSpace(aiAnswer))
                    {
                        if (outputText != null) outputText.text = "Didn't quite catch that. Please repeat.";
                        if (emotionRenderer != null) emotionRenderer.material.color = colorNeutral;
                        yield break;
                    }

                    if (outputText != null) outputText.text = $"<color=#AADDFF>You: {userSaid}</color>\n\n<color=#FFFFFF>Assistant: {aiAnswer}</color>";

                    UpdateEmotionVisuals(emotion);
                    StartCoroutine(SpeakWithElevenLabs(aiAnswer));
                }
                catch (Exception e)
                {
                    Debug.LogWarning("Parsing Warning (Likely unclear speech): " + e.Message);
                    if (outputText != null) outputText.text = "Didn't quite catch that. Please repeat.";
                    if (emotionRenderer != null) emotionRenderer.material.color = colorNeutral;
                }
            }
        }
    }

    private void UpdateEmotionVisuals(string emotion)
    {
        if (emotionRenderer == null) return;

        switch (emotion)
        {
            case "happy":
                emotionRenderer.material.color = colorHappy;
                break;
            case "sad":
                emotionRenderer.material.color = colorSad;
                break;
            case "angry":
                emotionRenderer.material.color = colorAngry;
                break;
            case "neutral":
            default:
                emotionRenderer.material.color = colorNeutral;
                break;
        }
    }

    private IEnumerator SpeakWithElevenLabs(string textToSpeak)
    {
        string cleanKey = elevenLabsApiKey.Trim();
        string url = $"https://api.elevenlabs.io/v1/text-to-speech/{voiceId}";

        string safeText = textToSpeak.Replace("\"", "'").Replace("\n", " ");
        string jsonData = $@"{{
            ""text"": ""{safeText}"",
            ""model_id"": ""eleven_multilingual_v2""
        }}";

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerAudioClip(url, AudioType.MPEG);
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("xi-api-key", cleanKey);
            request.SetRequestHeader("Accept", "audio/mpeg");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                AudioClip clip = ((DownloadHandlerAudioClip)request.downloadHandler).audioClip;
                audioSource.clip = clip;
                audioSource.Play();
            }
            else
            {
                Debug.LogError("<color=orange>ElevenLabs API Error: " + request.responseCode + " - " + request.error + "</color>");
            }
        }
    }

    private byte[] GetWavBytes(AudioClip clip)
    {
        using (MemoryStream stream = new MemoryStream())
        using (BinaryWriter writer = new BinaryWriter(stream))
        {
            float[] samples = new float[clip.samples];
            clip.GetData(samples, 0);
            int hz = clip.frequency;
            int channels = clip.channels;
            int samplesCount = samples.Length;

            writer.Write(Encoding.UTF8.GetBytes("RIFF"));
            writer.Write(36 + samplesCount * 2);
            writer.Write(Encoding.UTF8.GetBytes("WAVE"));
            writer.Write(Encoding.UTF8.GetBytes("fmt "));
            writer.Write(16);
            writer.Write((short)1);
            writer.Write((short)channels);
            writer.Write(hz);
            writer.Write(hz * channels * 2);
            writer.Write((short)(channels * 2));
            writer.Write((short)16);
            writer.Write(Encoding.UTF8.GetBytes("data"));
            writer.Write(samplesCount * 2);

            foreach (float sample in samples)
            {
                writer.Write((short)(sample * short.MaxValue));
            }
            return stream.ToArray();
        }
    }
}
