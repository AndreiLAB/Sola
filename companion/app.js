/**
 * Sola XR Companion App & Spatial Key Vault
 * Multi-Step Onboarding Wizard with Solar Eclipse Aesthetic & Optical QR Handshake.
 */

// Storage Keys
const STORAGE = {
  CURRENT_SCREEN: 'sola_current_screen',
  USER_NAME: 'sola_user_name',
  GEMINI_KEY: 'sola_gemini_key',
  GOOGLE_TOKEN: 'sola_google_token',
  USER_PROFILE: 'sola_user_profile',
  PERSONA: 'sola_persona',
  VOICE_PITCH: 'sola_voice_pitch',
  HEADSET_IP: 'sola_headset_ip',
  GOOGLE_CLIENT_ID: 'sola_google_client_id',
  DEMO_MODE: 'sola_demo_mode',
  QR_SIZE: 'sola_qr_size',
  QR_INVERTED: 'sola_qr_inverted',
  // Cognitive & Telemetry Subsystems
  FAST_REFLEX: 'sola_fast_reflex',
  MICRO_VOCAL: 'sola_micro_vocal',
  HEARTBEAT_ENABLED: 'sola_heartbeat_enabled',
  HEARTBEAT_INTERVAL: 'sola_heartbeat_interval',
  SHOW_THOUGHTS: 'sola_show_thoughts',
  MASTER_VOLUME: 'sola_master_volume',
  // Tactile & Spatial Subsystems
  POKE_ENABLED: 'sola_poke_enabled',
  GRAB_ENABLED: 'sola_grab_enabled',
  FLICK_DISMISS: 'sola_flick_dismiss',
  GAZE_AWAKEN: 'sola_gaze_awaken',
  GAZE_DWELL: 'sola_gaze_dwell',
  ZONES_ENABLED: 'sola_zones_enabled',
  ZONE_RADIUS: 'sola_zone_radius',
  // Product Tier Profile (Sola vs SolaP)
  SOLA_PROFILE: 'sola_profile'
};

// Wizard State
const state = {
  currentScreen: 0,
  userName: localStorage.getItem(STORAGE.USER_NAME) || '',
  geminiKey: localStorage.getItem(STORAGE.GEMINI_KEY) || '',
  googleToken: localStorage.getItem(STORAGE.GOOGLE_TOKEN) || '',
  userProfile: null,
  persona: localStorage.getItem(STORAGE.PERSONA) || 'architect',
  voicePitch: parseFloat(localStorage.getItem(STORAGE.VOICE_PITCH)) || 1.0,
  headsetIp: localStorage.getItem(STORAGE.HEADSET_IP) || '192.168.1.120',
  googleClientId: '',
  demoMode: localStorage.getItem(STORAGE.DEMO_MODE) === 'true',
  solaProfile: localStorage.getItem('sola_profile') || 'personal', // default personal for playground experience
  qrSize: localStorage.getItem(STORAGE.QR_SIZE) || 'normal',
  qrInverted: localStorage.getItem(STORAGE.QR_INVERTED) === 'true',
  qrInstance: null,
  gisTokenClient: null,
  // Cognitive State
  fastReflex: localStorage.getItem('sola_fast_reflex') !== 'false', // default true
  microVocal: localStorage.getItem('sola_micro_vocal') === 'true', // default false
  heartbeatEnabled: localStorage.getItem('sola_heartbeat_enabled') !== 'false', // default true
  heartbeatInterval: parseInt(localStorage.getItem('sola_heartbeat_interval') || '15', 10), // default 15
  showThoughts: localStorage.getItem('sola_show_thoughts') !== 'false', // default true
  masterVolume: parseFloat(localStorage.getItem('sola_master_volume') || '1.0'), // default 1.0
  // Tactile & Spatial State
  pokeEnabled: localStorage.getItem('sola_poke_enabled') !== 'false', // default true
  grabEnabled: localStorage.getItem('sola_grab_enabled') !== 'false', // default true
  flickDismiss: localStorage.getItem('sola_flick_dismiss') !== 'false', // default true
  gazeAwaken: localStorage.getItem('sola_gaze_awaken') === 'true', // default false (opt-in)
  gazeDwell: parseFloat(localStorage.getItem('sola_gaze_dwell') || '0.6'), // default 0.6s
  zonesEnabled: localStorage.getItem('sola_zones_enabled') === 'true', // default false (opt-in)
  zoneRadius: parseFloat(localStorage.getItem('sola_zone_radius') || '2.0') // default 2.0m
};

// DOM Elements
const ui = {
  brandHomeBtn: document.getElementById('brandHomeBtn'),
  btnOpenSettings: document.getElementById('btnOpenSettings'),
  stepperNav: document.getElementById('stepperNav'),
  stepPills: document.querySelectorAll('.step-pill'),
  headsetStatusPill: document.getElementById('headsetStatusPill'),
  statusPillLabel: document.getElementById('statusPillLabel'),

  screens: {
    0: document.getElementById('screen-0'),
    1: document.getElementById('screen-1'),
    2: document.getElementById('screen-2'),
    3: document.getElementById('screen-3'),
    4: document.getElementById('screen-4'),
    5: document.getElementById('screen-5')
  },

  // Screen 0: Profile Setup
  btnGoogleSignInGlobal: document.getElementById('btnGoogleSignInGlobal'),
  profileSetupForm: document.getElementById('profileSetupForm'),
  userNameInput: document.getElementById('userNameInput'),
  btnStartSetup: document.getElementById('btnStartSetup'),
  btnQuickGuest: document.getElementById('btnQuickGuest'),

  // Screen 1: Genesis Animation
  btnGenesisStart: document.getElementById('btnGenesisStart'),
  btnSkipGenesis: document.getElementById('btnSkipGenesis'),

  // Screen 2: Brain / Gemini API Key
  geminiApiKeyInput: document.getElementById('geminiApiKeyInput'),
  toggleKeyVisibility: document.getElementById('toggleKeyVisibility'),
  keyStatusBar: document.getElementById('keyStatusBar'),
  keyStatusIcon: document.getElementById('keyStatusIcon'),
  keyStatusText: document.getElementById('keyStatusText'),
  btnTestKey: document.getElementById('btnTestKey'),
  demoModeCard: document.getElementById('demoModeCard'),
  btnToggleDemoMode: document.getElementById('btnToggleDemoMode'),
  demoModeBtnLabel: document.getElementById('demoModeBtnLabel'),
  btnStep2Back: document.getElementById('btnStep2Back'),
  btnStep2Continue: document.getElementById('btnStep2Continue'),

  // Screen 3: Workspace Link
  workspaceConnectedBadge: document.getElementById('workspaceConnectedBadge'),
  workspaceUserAvatar: document.getElementById('workspaceUserAvatar'),
  workspaceUserName: document.getElementById('workspaceUserName'),
  workspaceUserEmail: document.getElementById('workspaceUserEmail'),
  btnDisconnectWorkspace: document.getElementById('btnDisconnectWorkspace'),
  workspaceUnconnectedCard: document.getElementById('workspaceUnconnectedCard'),
  btnConnectWorkspaceGoogle: document.getElementById('btnConnectWorkspaceGoogle'),
  workspaceAuthFeedback: document.getElementById('workspaceAuthFeedback'),
  btnStep3Back: document.getElementById('btnStep3Back'),
  btnSkipWorkspace: document.getElementById('btnSkipWorkspace'),
  btnStep3Continue: document.getElementById('btnStep3Continue'),

  // Screen 4: Persona Tuning & Voice
  personaChips: document.querySelectorAll('.persona-chip'),
  voicePitchSlider: document.getElementById('voicePitchSlider'),
  voicePitchValue: document.getElementById('voicePitchValue'),
  btnPreviewVoice: document.getElementById('btnPreviewVoice'),
  fastReflexToggle: document.getElementById('fastReflexToggle'),
  microVocalToggle: document.getElementById('microVocalToggle'),
  heartbeatToggle: document.getElementById('heartbeatToggle'),
  heartbeatIntervalSelect: document.getElementById('heartbeatIntervalSelect'),
  showThoughtsToggle: document.getElementById('showThoughtsToggle'),
  tactileCoreToggle: document.getElementById('tactileCoreToggle'),
  gazeAwakenToggle: document.getElementById('gazeAwakenToggle'),
  zonesEnabledToggle: document.getElementById('zonesEnabledToggle'),
  btnStep4Back: document.getElementById('btnStep4Back'),
  btnSkipPersona: document.getElementById('btnSkipPersona'),
  btnStep4Continue: document.getElementById('btnStep4Continue'),

  // Screen 5: Optical Sync & QR Controls
  btnQrSizeNormal: document.getElementById('btnQrSizeNormal'),
  btnQrSizeLarge: document.getElementById('btnQrSizeLarge'),
  btnQrInvert: document.getElementById('btnQrInvert'),
  btnQrInvertLabel: document.getElementById('btnQrInvertLabel'),
  qrOpticalStage: document.getElementById('qrOpticalStage'),
  qrSolarHalo: document.getElementById('qrSolarHalo'),
  qrTargetBox: document.getElementById('qrTargetBox'),
  qrcodeCanvas: document.getElementById('qrcodeCanvas'),
  qrStatusLabel: document.getElementById('qrStatusLabel'),
  qrPayloadDisclosure: document.getElementById('qrPayloadDisclosure'),
  qrFieldKey: document.getElementById('qrFieldKey'),
  qrFieldToken: document.getElementById('qrFieldToken'),
  qrFieldPersona: document.getElementById('qrFieldPersona'),
  qrFieldPitch: document.getElementById('qrFieldPitch'),
  qrFieldUser: document.getElementById('qrFieldUser'),
  qrFieldArch: document.getElementById('qrFieldArch'),
  wifiHeadsetIp: document.getElementById('wifiHeadsetIp'),
  wifiPairingCode: document.getElementById('wifiPairingCode'),
  btnPushWifi: document.getElementById('btnPushWifi'),
  wifiPushFeedback: document.getElementById('wifiPushFeedback'),
  btnStep5Back: document.getElementById('btnStep5Back'),
  btnCopyPayload: document.getElementById('btnCopyPayload'),
  btnRestartWizard: document.getElementById('btnRestartWizard'),

  // Global Settings Modal & Live Telemetry
  globalSettingsModal: document.getElementById('globalSettingsModal'),
  btnCloseSettingsModal: document.getElementById('btnCloseSettingsModal'),
  settingsModalTabs: document.querySelectorAll('.settings-modal-tabs .tab-btn'),
  settingsTabPanes: document.querySelectorAll('.settings-tab-pane'),
  modalLensBtns: document.querySelectorAll('.lens-btn'),
  modalFastReflexToggle: document.getElementById('modalFastReflexToggle'),
  modalMicroVocalToggle: document.getElementById('modalMicroVocalToggle'),
  modalHeartbeatToggle: document.getElementById('modalHeartbeatToggle'),
  modalHeartbeatInterval: document.getElementById('modalHeartbeatInterval'),
  modalShowThoughtsToggle: document.getElementById('modalShowThoughtsToggle'),
  modalVolumeSlider: document.getElementById('modalVolumeSlider'),
  modalVolumeValue: document.getElementById('modalVolumeValue'),
  modalVoicePitchSlider: document.getElementById('modalVoicePitchSlider'),
  modalVoicePitchValue: document.getElementById('modalVoicePitchValue'),
  modalHeadsetIp: document.getElementById('modalHeadsetIp'),
  // Modal Spatial & Tactile Elements
  modalPokeToggle: document.getElementById('modalPokeToggle'),
  modalGrabToggle: document.getElementById('modalGrabToggle'),
  modalFlickToggle: document.getElementById('modalFlickToggle'),
  modalGazeAwakenToggle: document.getElementById('modalGazeAwakenToggle'),
  modalGazeDwellSlider: document.getElementById('modalGazeDwellSlider'),
  modalGazeDwellValue: document.getElementById('modalGazeDwellValue'),
  modalZonesToggle: document.getElementById('modalZonesToggle'),
  modalZoneRadiusSlider: document.getElementById('modalZoneRadiusSlider'),
  modalZoneRadiusValue: document.getElementById('modalZoneRadiusValue'),
  btnSetDeskAnchor: document.getElementById('btnSetDeskAnchor'),
  btnSetLoungeAnchor: document.getElementById('btnSetLoungeAnchor'),
  zoneAnchorFeedback: document.getElementById('zoneAnchorFeedback'),
  // Product Tier Architecture
  btnTierStandard: document.getElementById('btnTierStandard'),
  btnTierPersonal: document.getElementById('btnTierPersonal'),
  profileTierBadge: document.getElementById('profileTierBadge'),
  btnSimulateThought: document.getElementById('btnSimulateThought'),
  btnClearThoughtStream: document.getElementById('btnClearThoughtStream'),
  thoughtTerminalLog: document.getElementById('thoughtTerminalLog'),
  btnPushSettingsLan: document.getElementById('btnPushSettingsLan'),
  modalPushFeedback: document.getElementById('modalPushFeedback')
};

// Asynchronously load decoupled config
async function loadAppConfig() {
  try {
    const res = await fetch('./config.json', { cache: 'no-store' });
    if (res.ok) {
      const cfg = await res.json();
      if (cfg && cfg.googleClientId && typeof cfg.googleClientId === 'string') {
        state.googleClientId = cfg.googleClientId.trim();
        localStorage.setItem(STORAGE.GOOGLE_CLIENT_ID, state.googleClientId);
        return;
      }
    }
  } catch (err) {
    console.info('Config fetch skipped or unavailable:', err);
  }

  // Fallback to localStorage if available
  const cachedId = localStorage.getItem(STORAGE.GOOGLE_CLIENT_ID);
  if (cachedId) {
    state.googleClientId = cachedId;
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await loadAppConfig();
  restorePersistedData();
  initGoogleIdentityServices();
  bindEventHandlers();

  // Restore screen memory on page refresh
  const savedScreen = parseInt(localStorage.getItem(STORAGE.CURRENT_SCREEN));
  if (!isNaN(savedScreen) && savedScreen >= 0 && savedScreen <= 5) {
    goToScreen(savedScreen);
  } else {
    goToScreen(0);
  }
});

function restorePersistedData() {
  if (state.userName) {
    ui.userNameInput.value = state.userName;
  }

  // Restore Demo Mode or API Key
  if (state.demoMode) {
    applyDemoModeUI(true);
  } else if (state.geminiKey) {
    ui.geminiApiKeyInput.value = state.geminiKey;
    ui.btnStep2Continue.disabled = false;
    updateKeyValidationDisplay(true, 'Key restored from local vault');
  }

  const savedProfile = localStorage.getItem(STORAGE.USER_PROFILE);
  if (savedProfile) {
    try {
      state.userProfile = JSON.parse(savedProfile);
      syncWorkspaceUI();
    } catch { }
  }

  // Restore persona
  ui.personaChips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.preset === state.persona);
  });
  syncModalLensButtons();

  // Restore voice pitch
  ui.voicePitchSlider.value = state.voicePitch;
  ui.voicePitchValue.textContent = `${state.voicePitch.toFixed(2)}x`;

  // Restore Cognitive Settings (Screen 4)
  if (ui.fastReflexToggle) ui.fastReflexToggle.checked = state.fastReflex;
  if (ui.microVocalToggle) ui.microVocalToggle.checked = state.microVocal;
  if (ui.heartbeatToggle) ui.heartbeatToggle.checked = state.heartbeatEnabled;
  if (ui.heartbeatIntervalSelect) ui.heartbeatIntervalSelect.value = state.heartbeatInterval.toString();
  if (ui.showThoughtsToggle) ui.showThoughtsToggle.checked = state.showThoughts;

  // Restore Modal Settings
  if (ui.modalFastReflexToggle) ui.modalFastReflexToggle.checked = state.fastReflex;
  if (ui.modalMicroVocalToggle) ui.modalMicroVocalToggle.checked = state.microVocal;
  if (ui.modalHeartbeatToggle) ui.modalHeartbeatToggle.checked = state.heartbeatEnabled;
  if (ui.modalHeartbeatInterval) ui.modalHeartbeatInterval.value = state.heartbeatInterval.toString();
  if (ui.modalShowThoughtsToggle) ui.modalShowThoughtsToggle.checked = state.showThoughts;
  if (ui.modalVolumeSlider) {
    ui.modalVolumeSlider.value = state.masterVolume;
    if (ui.modalVolumeValue) ui.modalVolumeValue.textContent = `${Math.round(state.masterVolume * 100)}%`;
  }
  if (ui.modalVoicePitchSlider) {
    ui.modalVoicePitchSlider.value = state.voicePitch;
    if (ui.modalVoicePitchValue) ui.modalVoicePitchValue.textContent = `${state.voicePitch.toFixed(2)}x`;
  }
  if (ui.modalHeadsetIp) ui.modalHeadsetIp.value = state.headsetIp;

  // Restore Step 4 Tactile & Spatial Toggles
  if (ui.tactileCoreToggle) ui.tactileCoreToggle.checked = state.pokeEnabled && state.grabEnabled;
  if (ui.gazeAwakenToggle) ui.gazeAwakenToggle.checked = state.gazeAwaken;
  if (ui.zonesEnabledToggle) ui.zonesEnabledToggle.checked = state.zonesEnabled;

  // Restore Modal Spatial & Tactile Settings
  if (ui.modalPokeToggle) ui.modalPokeToggle.checked = state.pokeEnabled;
  if (ui.modalGrabToggle) ui.modalGrabToggle.checked = state.grabEnabled;
  if (ui.modalFlickToggle) ui.modalFlickToggle.checked = state.flickDismiss;
  if (ui.modalGazeAwakenToggle) ui.modalGazeAwakenToggle.checked = state.gazeAwaken;
  if (ui.modalGazeDwellSlider) {
    ui.modalGazeDwellSlider.value = state.gazeDwell.toString();
    if (ui.modalGazeDwellValue) ui.modalGazeDwellValue.textContent = `${state.gazeDwell.toFixed(1)}s`;
  }
  if (ui.modalZonesToggle) ui.modalZonesToggle.checked = state.zonesEnabled;
  if (ui.modalZoneRadiusSlider) {
    ui.modalZoneRadiusSlider.value = state.zoneRadius.toString();
    if (ui.modalZoneRadiusValue) ui.modalZoneRadiusValue.textContent = `${state.zoneRadius.toFixed(1)}m`;
  }

  // Restore Product Tier Profile
  syncProfileTierUI();

  // Restore QR toggles
  if (ui.btnQrSizeNormal && ui.btnQrSizeLarge) {
    ui.btnQrSizeNormal.classList.toggle('active', state.qrSize === 'normal');
    ui.btnQrSizeLarge.classList.toggle('active', state.qrSize === 'large');
  }
  if (ui.qrTargetBox) {
    ui.qrTargetBox.classList.toggle('large', state.qrSize === 'large');
    ui.qrTargetBox.classList.toggle('inverted', state.qrInverted);
  }
  updateInvertButtonUI();

  // Restore Wi-Fi IP
  if (ui.wifiHeadsetIp) {
    ui.wifiHeadsetIp.value = state.headsetIp;
  }
}

// ───────────────────────────────────────────────────────────────
//  Screen Navigation & Memory
// ───────────────────────────────────────────────────────────────

function goToScreen(targetIndex) {
  state.currentScreen = targetIndex;
  // Persist current step in memory so page refresh resumes here
  localStorage.setItem(STORAGE.CURRENT_SCREEN, targetIndex.toString());

  // Toggle screens
  Object.keys(ui.screens).forEach(idx => {
    const screen = ui.screens[idx];
    if (screen) {
      screen.classList.toggle('active', parseInt(idx) === targetIndex);
    }
  });

  // Stepper Header Visibility & Status Label
  if (targetIndex >= 2) {
    ui.stepperNav.classList.remove('hidden');
    updateStepperPills(targetIndex);
    if (targetIndex === 5) {
      ui.statusPillLabel.textContent = 'Pairing Ready';
    } else {
      ui.statusPillLabel.textContent = `Step ${targetIndex - 1}/4`;
    }
  } else {
    ui.stepperNav.classList.add('hidden');
    ui.statusPillLabel.textContent = 'Setup Active';
  }

  // Screen specific hooks
  if (targetIndex === 3) {
    syncWorkspaceUI();
  } else if (targetIndex === 5) {
    renderOpticalQRCode();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepperPills(activeScreenIdx) {
  ui.stepPills.forEach(pill => {
    const pillStep = parseInt(pill.dataset.step);
    if (pillStep === activeScreenIdx) {
      pill.className = 'step-pill active';
    } else if (pillStep < activeScreenIdx) {
      pill.className = 'step-pill completed';
    } else {
      pill.className = 'step-pill';
    }
  });
}

// ───────────────────────────────────────────────────────────────
//  Event Handlers
// ───────────────────────────────────────────────────────────────

function bindEventHandlers() {
  // Brand Home Button (Acts as Home button like standard websites)
  if (ui.brandHomeBtn) {
    ui.brandHomeBtn.addEventListener('click', () => {
      goToScreen(0);
    });
    ui.brandHomeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        goToScreen(0);
      }
    });
  }

  // Stepper Nav Slider/Pills (Clickable to jump directly between steps)
  ui.stepPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const target = parseInt(pill.dataset.step);
      if (!isNaN(target)) {
        goToScreen(target);
      }
    });
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = parseInt(pill.dataset.step);
        if (!isNaN(target)) {
          goToScreen(target);
        }
      }
    });
  });

  // Screen 0: Google One-Click Auth Action (Direct GIS popup)
  if (ui.btnGoogleSignInGlobal) {
    ui.btnGoogleSignInGlobal.addEventListener('click', launchGoogleOAuthFlow);
  }

  // Screen 0: Profile Setup
  ui.profileSetupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitProfileSetup();
  });
  ui.btnQuickGuest.addEventListener('click', () => {
    setProfileName('Guest Explorer');
    goToScreen(1);
  });

  // Screen 1: Genesis Animation
  ui.btnGenesisStart.addEventListener('click', () => goToScreen(2));
  ui.btnSkipGenesis.addEventListener('click', () => goToScreen(2));

  // Screen 2: Brain / Gemini API Key
  ui.geminiApiKeyInput.addEventListener('input', onKeyInputChanged);
  ui.toggleKeyVisibility.addEventListener('click', togglePasswordVisibility);
  ui.btnTestKey.addEventListener('click', validateGeminiKeyLive);
  if (ui.btnToggleDemoMode) {
    ui.btnToggleDemoMode.addEventListener('click', toggleDemoMode);
  }
  if (ui.btnStep2Back) {
    ui.btnStep2Back.addEventListener('click', () => goToScreen(0));
  }
  ui.btnStep2Continue.addEventListener('click', () => goToScreen(3));

  // Screen 3: Workspace Link (Triggers Google popup)
  ui.btnConnectWorkspaceGoogle.addEventListener('click', launchGoogleOAuthFlow);
  if (ui.btnDisconnectWorkspace) {
    ui.btnDisconnectWorkspace.addEventListener('click', disconnectGoogleWorkspace);
  }
  if (ui.btnStep3Back) {
    ui.btnStep3Back.addEventListener('click', () => goToScreen(2));
  }
  ui.btnSkipWorkspace.addEventListener('click', () => goToScreen(4));
  ui.btnStep3Continue.addEventListener('click', () => goToScreen(4));

  // Global Settings Modal Open/Close & Tabs
  if (ui.btnOpenSettings) {
    ui.btnOpenSettings.addEventListener('click', openGlobalSettingsModal);
  }
  if (ui.btnCloseSettingsModal) {
    ui.btnCloseSettingsModal.addEventListener('click', closeGlobalSettingsModal);
  }
  if (ui.globalSettingsModal) {
    ui.globalSettingsModal.addEventListener('click', (e) => {
      if (e.target === ui.globalSettingsModal) closeGlobalSettingsModal();
    });
  }

  ui.settingsModalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ui.settingsModalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetPane = tab.dataset.tab;
      ui.settingsTabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === targetPane);
      });
    });
  });

  ui.modalLensBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setPersonaLens(btn.dataset.lens);
    });
  });

  // Screen 4: Persona Selection & Voice Preview
  ui.personaChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setPersonaLens(chip.dataset.preset);
    });
  });

  ui.voicePitchSlider.addEventListener('input', (e) => {
    state.voicePitch = parseFloat(e.target.value);
    ui.voicePitchValue.textContent = `${state.voicePitch.toFixed(2)}x`;
    if (ui.modalVoicePitchSlider) ui.modalVoicePitchSlider.value = state.voicePitch;
    if (ui.modalVoicePitchValue) ui.modalVoicePitchValue.textContent = `${state.voicePitch.toFixed(2)}x`;
    localStorage.setItem(STORAGE.VOICE_PITCH, state.voicePitch.toString());
  });

  if (ui.btnPreviewVoice) {
    ui.btnPreviewVoice.addEventListener('click', playVoicePreview);
  }

  // Cognitive Subsystem Toggles (Screen 4)
  if (ui.fastReflexToggle) {
    ui.fastReflexToggle.addEventListener('change', (e) => {
      state.fastReflex = e.target.checked;
      localStorage.setItem(STORAGE.FAST_REFLEX, state.fastReflex.toString());
      if (ui.modalFastReflexToggle) ui.modalFastReflexToggle.checked = state.fastReflex;
    });
  }
  if (ui.microVocalToggle) {
    ui.microVocalToggle.addEventListener('change', (e) => {
      state.microVocal = e.target.checked;
      localStorage.setItem(STORAGE.MICRO_VOCAL, state.microVocal.toString());
      if (ui.modalMicroVocalToggle) ui.modalMicroVocalToggle.checked = state.microVocal;
    });
  }
  if (ui.heartbeatToggle) {
    ui.heartbeatToggle.addEventListener('change', (e) => {
      state.heartbeatEnabled = e.target.checked;
      localStorage.setItem(STORAGE.HEARTBEAT_ENABLED, state.heartbeatEnabled.toString());
      if (ui.modalHeartbeatToggle) ui.modalHeartbeatToggle.checked = state.heartbeatEnabled;
    });
  }
  if (ui.heartbeatIntervalSelect) {
    ui.heartbeatIntervalSelect.addEventListener('change', (e) => {
      state.heartbeatInterval = parseInt(e.target.value, 10);
      localStorage.setItem(STORAGE.HEARTBEAT_INTERVAL, state.heartbeatInterval.toString());
      if (ui.modalHeartbeatInterval) ui.modalHeartbeatInterval.value = state.heartbeatInterval.toString();
    });
  }
  if (ui.showThoughtsToggle) {
    ui.showThoughtsToggle.addEventListener('change', (e) => {
      state.showThoughts = e.target.checked;
      localStorage.setItem(STORAGE.SHOW_THOUGHTS, state.showThoughts.toString());
      if (ui.modalShowThoughtsToggle) ui.modalShowThoughtsToggle.checked = state.showThoughts;
    });
  }
  if (ui.tactileCoreToggle) {
    ui.tactileCoreToggle.addEventListener('change', (e) => {
      const active = e.target.checked;
      state.pokeEnabled = active;
      state.grabEnabled = active;
      localStorage.setItem(STORAGE.POKE_ENABLED, active.toString());
      localStorage.setItem(STORAGE.GRAB_ENABLED, active.toString());
      if (ui.modalPokeToggle) ui.modalPokeToggle.checked = active;
      if (ui.modalGrabToggle) ui.modalGrabToggle.checked = active;
    });
  }
  if (ui.gazeAwakenToggle) {
    ui.gazeAwakenToggle.addEventListener('change', (e) => {
      state.gazeAwaken = e.target.checked;
      localStorage.setItem(STORAGE.GAZE_AWAKEN, state.gazeAwaken.toString());
      if (ui.modalGazeAwakenToggle) ui.modalGazeAwakenToggle.checked = state.gazeAwaken;
    });
  }
  if (ui.zonesEnabledToggle) {
    ui.zonesEnabledToggle.addEventListener('change', (e) => {
      state.zonesEnabled = e.target.checked;
      localStorage.setItem(STORAGE.ZONES_ENABLED, state.zonesEnabled.toString());
      if (ui.modalZonesToggle) ui.modalZonesToggle.checked = state.zonesEnabled;
    });
  }

  // Modal Settings Sync Handlers
  if (ui.modalFastReflexToggle) {
    ui.modalFastReflexToggle.addEventListener('change', (e) => {
      state.fastReflex = e.target.checked;
      localStorage.setItem(STORAGE.FAST_REFLEX, state.fastReflex.toString());
      if (ui.fastReflexToggle) ui.fastReflexToggle.checked = state.fastReflex;
    });
  }
  if (ui.modalMicroVocalToggle) {
    ui.modalMicroVocalToggle.addEventListener('change', (e) => {
      state.microVocal = e.target.checked;
      localStorage.setItem(STORAGE.MICRO_VOCAL, state.microVocal.toString());
      if (ui.microVocalToggle) ui.microVocalToggle.checked = state.microVocal;
    });
  }
  if (ui.modalHeartbeatToggle) {
    ui.modalHeartbeatToggle.addEventListener('change', (e) => {
      state.heartbeatEnabled = e.target.checked;
      localStorage.setItem(STORAGE.HEARTBEAT_ENABLED, state.heartbeatEnabled.toString());
      if (ui.heartbeatToggle) ui.heartbeatToggle.checked = state.heartbeatEnabled;
    });
  }
  if (ui.modalHeartbeatInterval) {
    ui.modalHeartbeatInterval.addEventListener('change', (e) => {
      state.heartbeatInterval = parseInt(e.target.value, 10);
      localStorage.setItem(STORAGE.HEARTBEAT_INTERVAL, state.heartbeatInterval.toString());
      if (ui.heartbeatIntervalSelect) ui.heartbeatIntervalSelect.value = state.heartbeatInterval.toString();
    });
  }
  if (ui.modalShowThoughtsToggle) {
    ui.modalShowThoughtsToggle.addEventListener('change', (e) => {
      state.showThoughts = e.target.checked;
      localStorage.setItem(STORAGE.SHOW_THOUGHTS, state.showThoughts.toString());
      if (ui.showThoughtsToggle) ui.showThoughtsToggle.checked = state.showThoughts;
    });
  }
  if (ui.modalPokeToggle) {
    ui.modalPokeToggle.addEventListener('change', (e) => {
      state.pokeEnabled = e.target.checked;
      localStorage.setItem(STORAGE.POKE_ENABLED, state.pokeEnabled.toString());
      if (ui.tactileCoreToggle) ui.tactileCoreToggle.checked = state.pokeEnabled && state.grabEnabled;
    });
  }
  if (ui.modalGrabToggle) {
    ui.modalGrabToggle.addEventListener('change', (e) => {
      state.grabEnabled = e.target.checked;
      localStorage.setItem(STORAGE.GRAB_ENABLED, state.grabEnabled.toString());
      if (ui.tactileCoreToggle) ui.tactileCoreToggle.checked = state.pokeEnabled && state.grabEnabled;
    });
  }
  if (ui.modalFlickToggle) {
    ui.modalFlickToggle.addEventListener('change', (e) => {
      state.flickDismiss = e.target.checked;
      localStorage.setItem(STORAGE.FLICK_DISMISS, state.flickDismiss.toString());
    });
  }
  if (ui.modalGazeAwakenToggle) {
    ui.modalGazeAwakenToggle.addEventListener('change', (e) => {
      state.gazeAwaken = e.target.checked;
      localStorage.setItem(STORAGE.GAZE_AWAKEN, state.gazeAwaken.toString());
      if (ui.gazeAwakenToggle) ui.gazeAwakenToggle.checked = state.gazeAwaken;
    });
  }
  if (ui.modalGazeDwellSlider) {
    ui.modalGazeDwellSlider.addEventListener('input', (e) => {
      state.gazeDwell = parseFloat(e.target.value);
      localStorage.setItem(STORAGE.GAZE_DWELL, state.gazeDwell.toString());
      if (ui.modalGazeDwellValue) ui.modalGazeDwellValue.textContent = `${state.gazeDwell.toFixed(1)}s`;
    });
  }
  if (ui.modalZonesToggle) {
    ui.modalZonesToggle.addEventListener('change', (e) => {
      state.zonesEnabled = e.target.checked;
      localStorage.setItem(STORAGE.ZONES_ENABLED, state.zonesEnabled.toString());
      if (ui.zonesEnabledToggle) ui.zonesEnabledToggle.checked = state.zonesEnabled;
    });
  }
  if (ui.modalZoneRadiusSlider) {
    ui.modalZoneRadiusSlider.addEventListener('input', (e) => {
      state.zoneRadius = parseFloat(e.target.value);
      localStorage.setItem(STORAGE.ZONE_RADIUS, state.zoneRadius.toString());
      if (ui.modalZoneRadiusValue) ui.modalZoneRadiusValue.textContent = `${state.zoneRadius.toFixed(1)}m`;
    });
  }
  if (ui.btnSetDeskAnchor) {
    ui.btnSetDeskAnchor.addEventListener('click', () => pushZoneAnchor('set_desk_zone'));
  }
  if (ui.btnSetLoungeAnchor) {
    ui.btnSetLoungeAnchor.addEventListener('click', () => pushZoneAnchor('set_lounge_zone'));
  }
  if (ui.btnTierStandard) {
    ui.btnTierStandard.addEventListener('click', () => setProfileTier('standard'));
  }
  if (ui.btnTierPersonal) {
    ui.btnTierPersonal.addEventListener('click', () => setProfileTier('personal'));
  }
  if (ui.modalVolumeSlider) {
    ui.modalVolumeSlider.addEventListener('input', (e) => {
      state.masterVolume = parseFloat(e.target.value);
      localStorage.setItem(STORAGE.MASTER_VOLUME, state.masterVolume.toString());
      if (ui.modalVolumeValue) ui.modalVolumeValue.textContent = `${Math.round(state.masterVolume * 100)}%`;
    });
  }
  if (ui.modalVoicePitchSlider) {
    ui.modalVoicePitchSlider.addEventListener('input', (e) => {
      state.voicePitch = parseFloat(e.target.value);
      localStorage.setItem(STORAGE.VOICE_PITCH, state.voicePitch.toString());
      if (ui.modalVoicePitchValue) ui.modalVoicePitchValue.textContent = `${state.voicePitch.toFixed(2)}x`;
      if (ui.voicePitchSlider) ui.voicePitchSlider.value = state.voicePitch;
      if (ui.voicePitchValue) ui.voicePitchValue.textContent = `${state.voicePitch.toFixed(2)}x`;
    });
  }
  if (ui.modalHeadsetIp) {
    ui.modalHeadsetIp.addEventListener('change', (e) => {
      state.headsetIp = e.target.value.trim();
      localStorage.setItem(STORAGE.HEADSET_IP, state.headsetIp);
      if (ui.wifiHeadsetIp) ui.wifiHeadsetIp.value = state.headsetIp;
    });
  }
  if (ui.btnPushSettingsLan) {
    ui.btnPushSettingsLan.addEventListener('click', pushSettingsOverWifi);
  }
  if (ui.btnSimulateThought) {
    ui.btnSimulateThought.addEventListener('click', simulateSampleThought);
  }
  if (ui.btnClearThoughtStream) {
    ui.btnClearThoughtStream.addEventListener('click', () => {
      if (ui.thoughtTerminalLog) {
        ui.thoughtTerminalLog.innerHTML = `
          <div class="thought-log-entry info">
            <span class="thought-timestamp">[CLEARED]</span>
            <span class="thought-content">Telemetry stream cleared. Standing by...</span>
          </div>`;
      }
    });
  }

  if (ui.btnStep4Back) {
    ui.btnStep4Back.addEventListener('click', () => goToScreen(3));
  }
  ui.btnSkipPersona.addEventListener('click', () => {
    setPersonaLens('architect');
    state.voicePitch = 1.0;
    goToScreen(5);
  });
  ui.btnStep4Continue.addEventListener('click', () => goToScreen(5));

  // Screen 5: Optical Sync & QR Controls
  if (ui.btnQrSizeNormal) {
    ui.btnQrSizeNormal.addEventListener('click', () => setQrSize('normal'));
  }
  if (ui.btnQrSizeLarge) {
    ui.btnQrSizeLarge.addEventListener('click', () => setQrSize('large'));
  }
  if (ui.btnQrInvert) {
    ui.btnQrInvert.addEventListener('click', toggleQrInvert);
  }

  if (ui.btnStep5Back) {
    ui.btnStep5Back.addEventListener('click', () => goToScreen(4));
  }
  ui.btnCopyPayload.addEventListener('click', copyPayloadJSON);
  ui.btnRestartWizard.addEventListener('click', () => {
    goToScreen(0);
  });

  // Wi-Fi Push Fallback
  ui.btnPushWifi.addEventListener('click', pushCredentialsOverWifi);
}

function submitProfileSetup() {
  const enteredName = ui.userNameInput.value.trim();
  const finalName = enteredName || 'Explorer';
  setProfileName(finalName);
  goToScreen(1);
}

function setProfileName(name) {
  state.userName = name;
  localStorage.setItem(STORAGE.USER_NAME, name);
  if (!state.userProfile) {
    state.userProfile = { name: name };
  } else {
    state.userProfile.name = name;
  }
  localStorage.setItem(STORAGE.USER_PROFILE, JSON.stringify(state.userProfile));
}

// ───────────────────────────────────────────────────────────────
//  Screen 2: Gemini Key Validation & Demo Mode
// ───────────────────────────────────────────────────────────────

function togglePasswordVisibility() {
  const isPass = ui.geminiApiKeyInput.type === 'password';
  ui.geminiApiKeyInput.type = isPass ? 'text' : 'password';
}

function onKeyInputChanged() {
  if (state.demoMode) return;

  const key = ui.geminiApiKeyInput.value.trim();
  state.geminiKey = key;
  localStorage.setItem(STORAGE.GEMINI_KEY, key);

  if (key.startsWith('AIza') && key.length >= 35) {
    ui.btnStep2Continue.disabled = false;
    updateKeyValidationDisplay(true, 'Valid key format detected');
  } else if (key.length === 0) {
    ui.btnStep2Continue.disabled = true;
    updateKeyValidationDisplay(null, 'Paste your key to validate');
  } else {
    ui.btnStep2Continue.disabled = true;
    updateKeyValidationDisplay(false, 'Key should start with AIza...');
  }
}

async function validateGeminiKeyLive() {
  if (state.demoMode) {
    updateKeyValidationDisplay(true, 'Demo Mode Active: Mock responses will simulate live AI.');
    return;
  }

  const key = ui.geminiApiKeyInput.value.trim();
  if (!key) {
    updateKeyValidationDisplay(false, 'Please paste a valid Gemini API key.');
    return;
  }

  updateKeyValidationDisplay(null, 'Validating against gemini-2.5-flash...');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
    const body = { contents: [{ parts: [{ text: 'Ping' }] }] };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      updateKeyValidationDisplay(true, 'Key verified (Free Tier Active) ✓');
      ui.btnStep2Continue.disabled = false;
    } else {
      let desc = '';
      if (res.status === 400) {
        desc = 'Invalid API Key format or key disabled.';
      } else if (res.status === 403) {
        desc = 'API key permissions error or project blocked.';
      } else if (res.status === 429) {
        desc = 'Gemini API quota exceeded or rate limit reached.';
      } else {
        const errData = await res.json().catch(() => ({}));
        desc = errData?.error?.message || `HTTP ${res.status}: Key validation rejected.`;
      }
      updateKeyValidationDisplay(false, desc);
      ui.btnStep2Continue.disabled = true;
    }
  } catch (err) {
    updateKeyValidationDisplay(false, 'Network unreachable. Check your internet connection.');
    ui.btnStep2Continue.disabled = true;
  }
}

function updateKeyValidationDisplay(isValid, message) {
  const bar = ui.keyStatusBar;
  const icon = ui.keyStatusIcon;
  const text = ui.keyStatusText;

  text.textContent = message;

  if (isValid === true) {
    icon.textContent = '✓';
    bar.querySelector('.status-indicator').className = 'status-indicator valid';
  } else if (isValid === false) {
    icon.textContent = '✕';
    bar.querySelector('.status-indicator').className = 'status-indicator invalid';
  } else {
    icon.textContent = '○';
    bar.querySelector('.status-indicator').className = 'status-indicator';
  }
}

function toggleDemoMode() {
  state.demoMode = !state.demoMode;
  localStorage.setItem(STORAGE.DEMO_MODE, state.demoMode.toString());
  applyDemoModeUI(state.demoMode);
}

function applyDemoModeUI(enabled) {
  if (enabled) {
    if (ui.demoModeCard) ui.demoModeCard.classList.add('active');
    if (ui.demoModeBtnLabel) ui.demoModeBtnLabel.textContent = '✓ Disable Demo Mode';
    ui.geminiApiKeyInput.value = 'DEMO_OFFLINE_MOCK';
    ui.geminiApiKeyInput.disabled = true;
    ui.btnStep2Continue.disabled = false;
    updateKeyValidationDisplay(true, 'Demo Mode Active (Mock Offline Responses) ✓');
  } else {
    if (ui.demoModeCard) ui.demoModeCard.classList.remove('active');
    if (ui.demoModeBtnLabel) ui.demoModeBtnLabel.textContent = '⚡ Enable Demo Mode';
    ui.geminiApiKeyInput.disabled = false;
    ui.geminiApiKeyInput.value = state.geminiKey || '';
    onKeyInputChanged();
  }
}

// ───────────────────────────────────────────────────────────────
//  Google Identity Services (OAuth 2.0 PKCE 1-Click Popup Flow)
// ───────────────────────────────────────────────────────────────

function initGoogleIdentityServices() {
  const clientId = state.googleClientId;
  if (!clientId || typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    return;
  }

  try {
    state.gisTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/tasks.readonly'
      ].join(' '),
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          console.warn('Google Auth Error:', tokenResponse.error);
          if (ui.workspaceAuthFeedback) {
            ui.workspaceAuthFeedback.className = 'status-feedback error';
            ui.workspaceAuthFeedback.textContent = `Auth canceled or failed: ${tokenResponse.error}`;
          }
          return;
        }

        state.googleToken = tokenResponse.access_token;
        localStorage.setItem(STORAGE.GOOGLE_TOKEN, state.googleToken);

        // Fetch user profile info
        await fetchGoogleProfile(state.googleToken);

        // Advance screen
        if (state.currentScreen === 0) {
          goToScreen(1);
        } else if (state.currentScreen === 3) {
          syncWorkspaceUI();
        }
      }
    });
  } catch (err) {
    console.warn('GIS Client Init:', err);
  }
}

function launchGoogleOAuthFlow() {
  if (!state.googleClientId) {
    const msg = 'Google Client ID is not configured. Please supply it in companion/config.json or repository secrets.';
    if (ui.workspaceAuthFeedback) {
      ui.workspaceAuthFeedback.className = 'status-feedback error';
      ui.workspaceAuthFeedback.textContent = msg;
    } else {
      alert(msg);
    }
    return;
  }

  if (!state.gisTokenClient) {
    initGoogleIdentityServices();
  }

  if (state.gisTokenClient) {
    // Launch official Google Account Picker popup window directly
    state.gisTokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Graceful retry in case GIS library is still loading from CDN
    setTimeout(() => {
      initGoogleIdentityServices();
      if (state.gisTokenClient) {
        state.gisTokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        alert('Google Identity Services script is still loading. Please check network connection and try again.');
      }
    }, 400);
  }
}

async function fetchGoogleProfile(token) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const gProfile = await res.json();
      state.userName = gProfile.name || 'Explorer';
      state.userProfile = {
        name: gProfile.name || 'Explorer',
        email: gProfile.email,
        picture: gProfile.picture
      };
      localStorage.setItem(STORAGE.USER_NAME, state.userName);
      localStorage.setItem(STORAGE.USER_PROFILE, JSON.stringify(state.userProfile));
      ui.userNameInput.value = state.userName;
      syncWorkspaceUI();
    }
  } catch (err) {
    console.error('Failed to fetch Google profile:', err);
  }
}

function syncWorkspaceUI() {
  const isGoogle = Boolean(state.userProfile && state.googleToken);

  if (isGoogle) {
    ui.workspaceConnectedBadge.classList.remove('hidden');
    ui.workspaceUnconnectedCard.style.display = 'none';

    ui.workspaceUserName.textContent = state.userProfile.name || 'User';
    if (ui.workspaceUserEmail) {
      ui.workspaceUserEmail.textContent = state.userProfile.email || 'Google Workspace Linked';
    }
    if (state.userProfile.picture) {
      ui.workspaceUserAvatar.src = state.userProfile.picture;
    }
  } else {
    ui.workspaceConnectedBadge.classList.add('hidden');
    ui.workspaceUnconnectedCard.style.display = 'flex';
  }
}

function disconnectGoogleWorkspace() {
  state.googleToken = '';
  localStorage.removeItem(STORAGE.GOOGLE_TOKEN);
  syncWorkspaceUI();
  if (ui.workspaceAuthFeedback) {
    ui.workspaceAuthFeedback.className = 'status-feedback';
    ui.workspaceAuthFeedback.textContent = 'Disconnected.';
  }
}

// ───────────────────────────────────────────────────────────────
//  Screen 4: Interactive Browser Voice Preview
// ───────────────────────────────────────────────────────────────

function playVoicePreview() {
  if (!('speechSynthesis' in window)) {
    alert('Browser Speech Synthesis is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();

  const sampleText = "Hello, I am Sola. Your spatial environment is calibrated.";
  const utterance = new SpeechSynthesisUtterance(sampleText);
  utterance.pitch = Math.max(0.5, Math.min(2.0, state.voicePitch));
  utterance.rate = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  if (ui.btnPreviewVoice) {
    ui.btnPreviewVoice.textContent = '🔊 Playing...';
    utterance.onend = () => { ui.btnPreviewVoice.textContent = '▶ Listen Preview'; };
    utterance.onerror = () => { ui.btnPreviewVoice.textContent = '▶ Listen Preview'; };
  }

  window.speechSynthesis.speak(utterance);
}

// ───────────────────────────────────────────────────────────────
//  Screen 5: Optical QR Handshake Engine & Passthrough Toggles
// ───────────────────────────────────────────────────────────────

function setQrSize(size) {
  state.qrSize = size;
  localStorage.setItem(STORAGE.QR_SIZE, size);
  if (ui.btnQrSizeNormal && ui.btnQrSizeLarge) {
    ui.btnQrSizeNormal.classList.toggle('active', size === 'normal');
    ui.btnQrSizeLarge.classList.toggle('active', size === 'large');
  }
  if (ui.qrTargetBox) {
    ui.qrTargetBox.classList.toggle('large', size === 'large');
  }
  renderOpticalQRCode();
}

function toggleQrInvert() {
  state.qrInverted = !state.qrInverted;
  localStorage.setItem(STORAGE.QR_INVERTED, state.qrInverted.toString());
  updateInvertButtonUI();
  renderOpticalQRCode();
}

function updateInvertButtonUI() {
  if (ui.btnQrInvert) {
    ui.btnQrInvert.classList.toggle('active', state.qrInverted);
    ui.btnQrInvert.setAttribute('aria-pressed', state.qrInverted.toString());
  }
  if (ui.btnQrInvertLabel) {
    ui.btnQrInvertLabel.textContent = state.qrInverted ? 'Invert (Dark-on-Light)' : 'Invert (Light-on-Dark)';
  }
  if (ui.qrTargetBox) {
    ui.qrTargetBox.classList.toggle('inverted', state.qrInverted);
  }
  if (ui.qrSolarHalo) {
    ui.qrSolarHalo.style.opacity = state.qrInverted ? '0' : '0.75';
  }
}

function buildCompactPayload() {
  return {
    v: 2,
    k: state.demoMode ? 'DEMO_OFFLINE' : (state.geminiKey || ''),
    t: state.googleToken || '',
    p: state.persona || 'architect',
    pitch: state.voicePitch || 1.0,
    u: state.userName || state.userProfile?.name || 'Explorer',
    demo: state.demoMode,
    fr: state.fastReflex,
    mv: state.microVocal,
    hb: state.heartbeatEnabled,
    hbi: state.heartbeatInterval,
    st: state.showThoughts,
    vol: state.masterVolume,
    pk: state.pokeEnabled,
    gb: state.grabEnabled,
    fd: state.flickDismiss,
    ga: state.gazeAwaken,
    gd: state.gazeDwell,
    ze: state.zonesEnabled,
    zr: state.zoneRadius,
    sp: state.solaProfile
  };
}

function renderOpticalQRCode() {
  const payload = buildCompactPayload();
  const payloadString = JSON.stringify(payload);

  if (!ui.qrcodeCanvas) return;

  const sizePx = state.qrSize === 'large' ? 320 : 224;
  const darkColor = state.qrInverted ? '#ffffff' : '#000000';
  const lightColor = state.qrInverted ? '#070709' : '#ffffff';

  try {
    ui.qrcodeCanvas.innerHTML = '';
    state.qrInstance = new QRCode(ui.qrcodeCanvas, {
      text: payloadString,
      width: sizePx,
      height: sizePx,
      colorDark: darkColor,
      colorLight: lightColor,
      correctLevel: QRCode.CorrectLevel.M
    });

    ui.qrStatusLabel.textContent = `Payload V2 (${payload.p} // ${payload.pitch.toFixed(2)}x // ${sizePx}px)`;

    // Update Disclosure Breakdown
    updateQrDisclosureFields(payload);
  } catch (err) {
    console.error('QRCode Render Error:', err);
  }
}

function updateQrDisclosureFields(payload) {
  if (ui.qrFieldKey) {
    if (payload.demo) {
      ui.qrFieldKey.textContent = 'DEMO_OFFLINE (Mock)';
    } else if (payload.k) {
      ui.qrFieldKey.textContent = `${payload.k.substring(0, 8)}...${payload.k.slice(-4)}`;
    } else {
      ui.qrFieldKey.textContent = 'Not configured';
    }
  }

  if (ui.qrFieldToken) {
    ui.qrFieldToken.textContent = payload.t ? `Bearer ${payload.t.substring(0, 10)}...` : 'None (Optional)';
  }

  if (ui.qrFieldPersona) {
    const cogDetails = `Reflex: ${payload.fr ? 'ON' : 'OFF'}${payload.mv ? '+Vocal' : ''} | Heartbeat: ${payload.hb ? payload.hbi + 'm' : 'OFF'}`;
    ui.qrFieldPersona.textContent = `${payload.p.charAt(0).toUpperCase() + payload.p.slice(1)} (${cogDetails})`;
  }

  if (ui.qrFieldPitch) {
    ui.qrFieldPitch.textContent = `${payload.pitch.toFixed(2)}x (Vol: ${Math.round((payload.vol || 1.0) * 100)}%)`;
  }

  if (ui.qrFieldUser) {
    ui.qrFieldUser.textContent = payload.u;
  }

  if (ui.qrFieldArch) {
    ui.qrFieldArch.textContent = payload.demo ? 'Mock Offline Sandbox' : 'Zero-Middleman (Direct Google API)';
  }
}

async function copyPayloadJSON() {
  const payload = buildCompactPayload();
  const jsonStr = JSON.stringify(payload, null, 2);

  try {
    await navigator.clipboard.writeText(jsonStr);
    ui.btnCopyPayload.textContent = 'Copied to Clipboard! ✓';
    setTimeout(() => {
      ui.btnCopyPayload.textContent = 'Copy QR Config Data';
    }, 2500);
  } catch {
    alert(jsonStr);
  }
}

// ───────────────────────────────────────────────────────────────
//  Wi-Fi Push & LAN Settings Engine
// ───────────────────────────────────────────────────────────────

async function pushCredentialsOverWifi() {
  const ip = ui.wifiHeadsetIp.value.trim();
  const code = ui.wifiPairingCode.value.trim();
  const feedback = ui.wifiPushFeedback;

  if (!ip || !code) {
    feedback.className = 'status-feedback error';
    feedback.textContent = 'Please enter both IP and Pairing Code.';
    return;
  }

  feedback.className = 'status-feedback';
  feedback.textContent = 'Pushing to headset...';

  const payload = {
    pairingCode: code,
    geminiApiKey: state.demoMode ? 'DEMO_OFFLINE' : state.geminiKey,
    googleOAuthToken: state.googleToken || '',
    userPreferences: {
      userName: state.userName || 'Explorer',
      voicePitch: state.voicePitch,
      persona: state.persona,
      demoMode: state.demoMode,
      fastReflex: state.fastReflex,
      microVocal: state.microVocal,
      heartbeatEnabled: state.heartbeatEnabled,
      heartbeatInterval: state.heartbeatInterval,
      showThoughts: state.showThoughts,
      volume: state.masterVolume,
      pokeEnabled: state.pokeEnabled,
      grabEnabled: state.grabEnabled,
      flickDismiss: state.flickDismiss,
      gazeAwaken: state.gazeAwaken,
      gazeDwell: state.gazeDwell,
      zonesEnabled: state.zonesEnabled,
      zoneRadius: state.zoneRadius,
      solaProfile: state.solaProfile
    }
  };

  try {
    const res = await fetch(`http://${ip}:8080/pair`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      feedback.className = 'status-feedback ok';
      feedback.textContent = `✓ Paired successfully with ${data.deviceName || 'headset'}!`;
      ui.headsetStatusPill.querySelector('.pulse-dot').classList.add('active');
      ui.statusPillLabel.textContent = 'Synced';
      logThoughtTelemetry('SYSTEM', `Pairing successful with ${data.deviceName || 'headset'}.`, 'info');
    } else {
      feedback.className = 'status-feedback error';
      feedback.textContent = `Pairing failed: ${data.error || 'Check pairing code'}`;
    }
  } catch (err) {
    feedback.className = 'status-feedback error';
    feedback.textContent = `Cannot reach headset at ${ip}:8080. Check Wi-Fi.`;
  }
}

async function pushSettingsOverWifi() {
  const ip = ui.modalHeadsetIp ? ui.modalHeadsetIp.value.trim() : state.headsetIp;
  const feedback = ui.modalPushFeedback;

  if (!ip) {
    if (feedback) {
      feedback.className = 'status-feedback error';
      feedback.textContent = 'Please enter headset IP.';
    }
    return;
  }

  state.headsetIp = ip;
  localStorage.setItem(STORAGE.HEADSET_IP, ip);
  if (ui.wifiHeadsetIp) ui.wifiHeadsetIp.value = ip;

  if (feedback) {
    feedback.className = 'status-feedback';
    feedback.textContent = 'Pushing live settings to headset...';
  }

  const payload = {
    persona: state.persona,
    voicePitch: state.voicePitch,
    volume: state.masterVolume,
    fastReflex: state.fastReflex,
    microVocal: state.microVocal,
    heartbeatEnabled: state.heartbeatEnabled,
    heartbeatInterval: state.heartbeatInterval,
    showThoughts: state.showThoughts,
    pokeEnabled: state.pokeEnabled,
    grabEnabled: state.grabEnabled,
    flickDismiss: state.flickDismiss,
    gazeAwaken: state.gazeAwaken,
    gazeDwell: state.gazeDwell,
    zonesEnabled: state.zonesEnabled,
    zoneRadius: state.zoneRadius,
    solaProfile: state.solaProfile
  };

  try {
    const res = await fetch(`http://${ip}:8080/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      if (feedback) {
        feedback.className = 'status-feedback ok';
        feedback.textContent = '✓ Live settings pushed to headset!';
      }
      logThoughtTelemetry('SYSTEM', `Pushed live config to ${ip}:8080. Lens: [${state.persona.toUpperCase()}], Heartbeat: [${state.heartbeatInterval}m].`, 'info');
    } else {
      if (feedback) {
        feedback.className = 'status-feedback error';
        feedback.textContent = `Error: ${data.error || 'Failed to update'}`;
      }
    }
  } catch (err) {
    if (feedback) {
      feedback.className = 'status-feedback error';
      feedback.textContent = `Cannot reach headset at ${ip}:8080. Check Wi-Fi.`;
    }
  }
}

async function pushZoneAnchor(action) {
  const ip = ui.modalHeadsetIp ? ui.modalHeadsetIp.value.trim() : state.headsetIp;
  const feedback = ui.zoneAnchorFeedback;

  if (!ip) {
    if (feedback) {
      feedback.className = 'status-feedback error';
      feedback.textContent = 'Please enter Headset IP in Audio tab.';
    }
    return;
  }

  if (feedback) {
    feedback.className = 'status-feedback';
    feedback.textContent = 'Calibrating anchor on headset...';
  }

  try {
    const res = await fetch(`http://${ip}:8080/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action })
    });

    if (res.ok) {
      if (feedback) {
        feedback.className = 'status-feedback ok';
        feedback.textContent = action === 'set_desk_zone'
          ? '✓ Saved Current Position as Desk Anchor!'
          : '✓ Saved Current Position as Lounge Anchor!';
      }
      logThoughtTelemetry('SPATIAL', `Room anchor calibrated: [${action.toUpperCase()}] at headset coordinates.`, 'intent');
    } else {
      if (feedback) {
        feedback.className = 'status-feedback error';
        feedback.textContent = 'Failed to calibrate anchor.';
      }
    }
  } catch (err) {
    if (feedback) {
      feedback.className = 'status-feedback error';
      feedback.textContent = `Cannot reach headset at ${ip}:8080. Check Wi-Fi.`;
    }
  }
}

// ───────────────────────────────────────────────────────────────
//  Settings Modal & Telemetry Helpers
// ───────────────────────────────────────────────────────────────

function openGlobalSettingsModal() {
  if (!ui.globalSettingsModal) return;
  ui.globalSettingsModal.classList.remove('hidden');
  syncModalLensButtons();
  syncProfileTierUI();
  if (ui.modalFastReflexToggle) ui.modalFastReflexToggle.checked = state.fastReflex;
  if (ui.modalMicroVocalToggle) ui.modalMicroVocalToggle.checked = state.microVocal;
  if (ui.modalHeartbeatToggle) ui.modalHeartbeatToggle.checked = state.heartbeatEnabled;
  if (ui.modalHeartbeatInterval) ui.modalHeartbeatInterval.value = state.heartbeatInterval.toString();
  if (ui.modalShowThoughtsToggle) ui.modalShowThoughtsToggle.checked = state.showThoughts;
  if (ui.modalHeadsetIp) ui.modalHeadsetIp.value = state.headsetIp;
  if (ui.modalVolumeSlider) {
    ui.modalVolumeSlider.value = state.masterVolume;
    if (ui.modalVolumeValue) ui.modalVolumeValue.textContent = `${Math.round(state.masterVolume * 100)}%`;
  }
  if (ui.modalVoicePitchSlider) {
    ui.modalVoicePitchSlider.value = state.voicePitch;
    if (ui.modalVoicePitchValue) ui.modalVoicePitchValue.textContent = `${state.voicePitch.toFixed(2)}x`;
  }

  // Sync Spatial & Tactile
  if (ui.modalPokeToggle) ui.modalPokeToggle.checked = state.pokeEnabled;
  if (ui.modalGrabToggle) ui.modalGrabToggle.checked = state.grabEnabled;
  if (ui.modalFlickToggle) ui.modalFlickToggle.checked = state.flickDismiss;
  if (ui.modalGazeAwakenToggle) ui.modalGazeAwakenToggle.checked = state.gazeAwaken;
  if (ui.modalGazeDwellSlider) {
    ui.modalGazeDwellSlider.value = state.gazeDwell.toString();
    if (ui.modalGazeDwellValue) ui.modalGazeDwellValue.textContent = `${state.gazeDwell.toFixed(1)}s`;
  }
  if (ui.modalZonesToggle) ui.modalZonesToggle.checked = state.zonesEnabled;
  if (ui.modalZoneRadiusSlider) {
    ui.modalZoneRadiusSlider.value = state.zoneRadius.toString();
    if (ui.modalZoneRadiusValue) ui.modalZoneRadiusValue.textContent = `${state.zoneRadius.toFixed(1)}m`;
  }
}

function closeGlobalSettingsModal() {
  if (!ui.globalSettingsModal) return;
  ui.globalSettingsModal.classList.add('hidden');
  if (ui.modalPushFeedback) {
    ui.modalPushFeedback.textContent = '';
    ui.modalPushFeedback.className = 'status-feedback';
  }
}

function setProfileTier(tier) {
  state.solaProfile = tier;
  localStorage.setItem(STORAGE.SOLA_PROFILE, tier);
  syncProfileTierUI();
  logThoughtTelemetry('SYSTEM', `Product Tier switched to: [${tier.toUpperCase()}]. Mood Engine: ${tier === 'personal' ? 'ACTIVE' : 'DORMANT (Calm)'}`, 'info');
}

function syncProfileTierUI() {
  const isPersonal = state.solaProfile === 'personal';
  if (ui.btnTierStandard) ui.btnTierStandard.classList.toggle('active', !isPersonal);
  if (ui.btnTierPersonal) ui.btnTierPersonal.classList.toggle('active', isPersonal);
  if (ui.profileTierBadge) {
    ui.profileTierBadge.textContent = isPersonal ? 'SolaP Playground ⚡' : 'Sola Standard 🏢';
    ui.profileTierBadge.style.color = isPersonal ? 'var(--solar-gold)' : '#00f0ff';
    ui.profileTierBadge.style.borderColor = isPersonal ? 'rgba(255, 140, 0, 0.3)' : 'rgba(0, 240, 255, 0.3)';
  }
}

function setPersonaLens(lens) {
  state.persona = lens;
  localStorage.setItem(STORAGE.PERSONA, lens);
  ui.personaChips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.preset === lens);
  });
  syncModalLensButtons();
}

function syncModalLensButtons() {
  ui.modalLensBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lens === state.persona);
  });
}

function logThoughtTelemetry(type, message, category = 'info') {
  if (!ui.thoughtTerminalLog) return;
  const timeStr = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `thought-log-entry ${category}`;
  entry.innerHTML = `
    <span class="thought-timestamp">[${timeStr} // ${type}]</span>
    <span class="thought-content">${message}</span>
  `;
  ui.thoughtTerminalLog.appendChild(entry);
  ui.thoughtTerminalLog.scrollTop = ui.thoughtTerminalLog.scrollHeight;
}

function simulateSampleThought() {
  logThoughtTelemetry('REFLEX', 'Speech endpoint detected (&lt;100ms). Corona flare ignited. Audio chime dispatched.', 'reflex');
  setTimeout(() => {
    logThoughtTelemetry('THINKING', `[Lens: ${state.persona.toUpperCase()}] Analyzing spatial coordinates & user query intent. Extracting workspace context...`, 'thought');
    setTimeout(() => {
      logThoughtTelemetry('INTENT', 'Resolved Intent: { action: "query_calendar", target: "next_meeting", confidence: 0.98 }', 'intent');
      setTimeout(() => {
        logThoughtTelemetry('ANSWER', 'Sola: "Your next session is Architecture Review in 15 minutes."', 'answer');
      }, 500);
    }, 600);
  }, 300);
}
