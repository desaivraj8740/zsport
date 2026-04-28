# SportShield OTT Platform - Complete Feature Documentation

This document outlines all core modules, security protocols, and advanced anti-piracy measures implemented within the SportShield Digital Asset Management and OTT ecosystem.

## 🛡️ Security & DRM Infrastructure (Core)

### 1. AES-128 HLS Encryption Engine
- **Dynamic Transcoding**: Automatically converts uploaded `.mp4` files into encrypted HLS (HTTP Live Streaming) streams using `fluent-ffmpeg`.
- **Cryptographic Segmentation**: Fragments video into `.ts` chunks, each secured via the **AES-128 standard**.
- **Unique Key Rotation**: Generates a unique 16-byte decryption key for every single video upload, stored securely in a dedicated `uploads/keys` vault.
- **Key-Server Proxy**: Decryption keys are NEVER served as static files. They are served via an authenticated `/api/videos/keys/:filename` endpoint.

### 2. Intelligent Origin-Based DRM (IOB-DRM)
- **Domain Identity Validation**: The backend enforcer sanitizes the `Origin` and `Referer` headers for every decryption key request.
- **Legitimate Site Whitelisting**: Implicitly trusts the SportShield platform domain and authorized local/public IPs (e.g., `darkcipher.site`, `localhost:6969`).
- **Fake Payload Injection**: Automatically detects foreign or pirated origins. Instead of a 403 error (which reveals the site is blocked), it serves a **Fake Decryption Key** (randomized bytes), causing the pirate player to crash instantly while maintaining the illusion of a working server.

### 3. Blockchain-Style Hash Verification
- **SHA-256 Ledger**: Every uploaded file is analyzed chunk-by-chunk to generate a unique digital fingerprint (Hash).
- **Global Duplication Shield**: Maintains a `blockchain_hashes` table. If a user attempts to upload a file that already exists anywhere else on the platform or its recorded history, the system rejects it instantly with a duplicate-asset violation.

---

## 🚫 Anti-Piracy & User Experience Protection

### 4. Screen Recording & App-Switch Blackout
- **Focus Tracking**: Real-time monitoring of `visibilitychange` and `window.blur` events.
- **Instant Media Suspension**: Autopauses video playback the millisecond the user leaves the tab, switches applications, or triggers a screen-recording UI (e.g., OBS, Snipping Tool).
- **Security Overlay**: Displays a black-out layer with a stylized security warning: *“This app does not support to switch between any apps while watching this...”*
- **Auto-Legacy Resume**: Intelligently resumes video playback from the exact same frame once the user returns focus to the platform.

### 5. Advanced Frontend Player Shielding
- **ContextMenu Hijacking**: Custom `onContextMenu` prevention to block "Save Video As..." right-clicks.
- **nodownload Flag**: Native HTML5 constraint implementation to remove the download button from browser-default controls.
- **CSS Pointer-Lock**: Prevents drag-and-drop or context interactions with the raw video source.
- **playsInline Support**: Enforces mobile-native HLS playback without locking the device into the default OS player, maintaining SportShield's custom security layers on iOS/Android.

---

## 📺 Premium UI/UX Experience

### 6. Glassmorphic Design System
- **Next-Gen Aesthetics**: High-end frosted glass effects (`backdrop-filter`) across all panels, sidebars, and navigation.
- **Dynamic Color Palettes**: Tailored HSL color tokens for a vibrant, premium dark-mode experience.
- **Responsive Animations**: Uses `framer-motion` for smooth skeleton loading, sidebar transitions, and modal pop-ups.

### 7. Custom Video Controls
- **Tabular-Time Tracking**: High-precision duration and current-time display (e.g., `12:45 / 45:00`).
- **Custom Seekbar**: Glassmorphic seekbar with a localized "Glow" thumb and progress-aware gradients.
- **Ping-Ring Live Badges**: Real-time animated indicators for live sports streams.
- **Keyboard Shortcuts**: Fully mapped controls (Space: Play/Pause, Arrows: +/- 10s Seek, M: Mute, F: Fullscreen).

---

## 🏴‍☠️ Pirate Simulation & DMCA Takedown

### 8. PirateFlix (Threat Actor Mock-App)
- **Automatic Scraper**: A dedicated React application that emulates a professional pirated OTT site.
- **Shadow Scrapers**: Silently pings the SportShield backend to automatically "steal" and play the latest HLS streams.
- **Premium Pirate UI**: Designed to look like a legitimate Netflix-style platform to test real-world security efficacy.

### 9. Admin Piracy Command Center (Takedown Suite)
- **Web Radar Scan**: A dedicated "Scan Web" button that simulates an automated security crawler finding pirated hostings.
- **Dynamic Takedown Action**: Admins can hit "Takedown" which triggers the **IOB-DRM key rotation** instantly.
- **Real-Time Crash Simulation**: Shows the PirateFlix app being terminated by a "DRM Protection Triggered" error the moment the admin takes action.
