# SnapMoment Mobile App - React Native Implementation Plan

Build a professional, cross-platform (iOS/Android) mobile application for **SnapMoment**, transitioning from the current Capacitor proof-of-concept to a high-performance **React Native** architecture. This plan focuses on providing a premium experience for photographers, automated photo delivery for guests, and robust platform management for admins.

## User Review Required

> [!IMPORTANT]
> **Framework Pivot**: This plan assumes a move from the current Capacitor/Vite stack to **React Native CLI**. This is necessary to utilize `react-native-vision-camera` for low-latency AI overlays and `react-native-fs` for high-volume batch uploads as requested in the core prompt.

> [!WARNING]
> **Backend Synchronization**: The mobile app will rely on the existing FastAPI backend. Ensuring the backend endpoints (especially the AI processing and vector search) match the mobile client's expectations is critical.

## Proposed Changes

### 1. Project Infrastructure [NEW]
Establish the foundation of the React Native application.

- **Framework**: React Native 0.73+ (New Architecture enabled).
- **Navigation**: React Navigation with a root `createNativeStackNavigator` and specialized `createBottomTabNavigator` for Photographers and Admins.
- **State Management**: Zustand (porting existing stores from the Capacitor version: `authStore`, `vipStore`).
- **Styling**: NativeWind (Tailwind CSS for React Native) to maintain the "Elite Edition" aesthetic while ensuring native performance.

### 2. Authentication & Onboarding
Implement the unified login and role-based redirect logic.

- **Unified Login**: Support for Admin and Photographer credentials.
- **Guest Access**: OTP-based verification (Twilio/MSG91) for guest sessions; no account required.
- **Onboarding**: Port the "Onboarding Wizard" for Photographers (Studio setup, branding, and billing integration).

### 3. Photographer Experience (Core Feature)
Transform the photographer's mobile device into a powerful event management hub.

- **Event Dashboard**: Grid/List views of active projects with processing status indicators.
- **Intelligent Upload System**:
  - Implement a multi-image picker with batch upload.
  - Integrate a persistent sync queue (Background fetching/uploading) that handles network interruptions gracefully.
- **VIP Neural Guard**:
  - Implement on-device VIP registration.
  - Display "Coverage Alerts" if high-priority guests haven't been captured.
- **QR Access Kit**: Generate and display high-res, shareable QR codes for event access.

### 4. Guest Experience (3-Step Flow)
Optimize the "Scan -> Selfie -> Gallery" journey.

- **Step 1: QR Discovery**: high-speed QR scanner integration using `react-native-vision-camera`.
- **Step 2: Smart Selfie**:
  - **MediaPipe Integration**: On-device face detection HUD that guides the guest ("Hold steady," "Move closer").
  - Automated capture when face quality metrics are met.
- **Step 3: Instant Gallery**:
  - Display AI-matched photos with similarity ranking.
  - Individual and Batch download (ZIP) functionality.

### 5. Admin Mission Control
Mobile-first dashboard for platform oversight.

- **Analytics HUD**: Real-time charts (Victory Native) for revenue, photographer growth, and event volume.
- **User Management**: Approve/Suspend photographers and manage subscription tiers.
- **Enquiry Handling**: Direct reply interface for website contact submissions.

### 6. AI/ML Pipeline
Bridge the mobile client with the AI engine.

- **Client-Side**: MediaPipe (BlazeFace) for real-time selfie centering.
- **Server-Side**: 
  - Integration with **DeepFace (ArcFace)** for 512-dim embedding extraction.
  - **pgvector** search for sub-second similarity matching.

---

## Open Questions

> [!IMPORTANT]
> **Push Notifications**: Should I proceed with **Firebase Cloud Messaging (FCM)** for both iOS and Android to handle "Photos Ready" alerts?

> [!NOTE]
> **Existing Code Reuse**: I plan to port the logic from your Capacitor `src/lib` and `src/store` folders directly. Are there any specific parts of the "Elite Edition" logic you want to change during the transition?

## Verification Plan

### Automated Tests
- **Unit Tests**: Jest tests for Zustand store transitions and API interceptors.
- **Integration Tests**: Verify the "Sync Queue" reliability with mocked network failures.

### Manual Verification
1.  **Photographer Flow**: Create an event -> Upload 10 photos -> Wait for "Ready" status.
2.  **Guest Flow**: Scan QR -> Take Selfie -> Verify if the correct photos appear in the gallery.
3.  **Admin Flow**: Login as admin -> View Photographer stats -> Check invoice list.
