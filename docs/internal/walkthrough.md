# SnapMoment Mobile: Elite Native Edition Walkthrough

We have successfully transitioned the SnapMoment core from a Capacitor webview into a high-performance, professional-grade **React Native** mobile application. This architectural pivot ensures the low-latency camera performance and background reliability required for the Google Play Store.

## 🏗️ Architecture & Navigation

The app is built on a modular navigation architecture that scales across three distinct user roles:

- **Root Switcher**: Detects `token` and `role` to route between internal hubs.
- **Photographer Hub**: Bottom-tab navigation for event management, analytics, and VIP monitoring.
- **Admin Mission Control**: High-level platform oversight and financial tracking.
- **Guest Flow**: A streamlined, non-authenticated "Scan -> Selfie -> Gallery" journey.

## 📸 Elite Photographer Workflow

Transforming the mobile device into a field-ready ingestion station:

- **Intelligent Sync Queue**: A persistent background engine in `src/lib/queue.ts` that handles massive photo batches.
- **Neural Ingestion**: Simulated on-device "Neural Scan" HUD during uploads to provide feedback to the photographer.
- **VIP Guard**: Automated matching against registered targets during the sync process.

## 🤳 Smart Guest Experience

A premium "Magical" delivery experience for event guests:

- **Neural Lock UI**: The Selfie screen guides guests to center their faces using a color-coded biometric oval.
- **Instant Vector Mapping**: A high-fidelity "Synchronization" overlay appears while the system matches the selfie against the event's 512-dim cluster matrix.
- **Matix Gallery**: A clean, confidence-scored grid for downloading matched memories.

## 📊 Admin Monitoring

Full platform visibility for global operations:

- **Health Pulse**: Real-time operational status of the ArcFace API and database nodes.
- **User Matrix**: Comprehensive photographer management and subscription oversight.
- **Inbound Protocol**: Integrated message center for handling platform enquiries.

## 🛠 Tech Stack Summary

| Component | Technology |
| :--- | :--- |
| **Framework** | React Native (0.73+) |
| **Styling** | NativeWind (Tailwind CSS) |
| **State** | Zustand + AsyncStorage Persistence |
| **Navigation** | React Navigation v6 |
| **AI Overlay** | Custom Reanimated + Reanimated UI |
| **API** | Axios with Sequential Retry Interceptors |

---

### Verification Results
- [x] **Auth Logic**: Correctly handles Admin vs Photographer vs Guest routing.
- [x] **Store Persistence**: Session survives app reloads.
- [x] **Navigation Depth**: Nested stacks allow deep-linking to Event Uploads and QR codes.
- [x] **Aesthetics**: Fully premium Dark Mode HUD implementation.

> [!TIP]
> **Production Ready**: The structure is now prepared for `react-native-vision-camera` Frame Processors to implement live MediaPipe detection in the next phase.

> [!IMPORTANT]
> **Backend Alignment**: All mobile-native endpoints in `lib/api.ts` are mapped to the FastAPI service. Ensure the backend is listening on the configured Port 8000.
