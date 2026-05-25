# 🍎 Apple App Store Readiness Checklist

This guide ensures **Forge** meets ALL Apple App Store requirements before submission.

---

## ✅ **Phase 1: Before You Start Coding** (DO THIS NOW)

### 1.1 Developer Account Setup
- [ ] Apple Developer Account created ($99/year)
- [ ] Team ID obtained
- [ ] Two-factor authentication enabled
- [ ] Apple Developer Program membership active

### 1.2 App Registration
- [ ] Bundle ID reserved (e.g., `com.forgeapp.main`)
- [ ] App name finalized
- [ ] App category selected (Productivity, Utilities, etc.)
- [ ] Primary language set

### 1.3 Legal Documents
- [ ] Privacy Policy written (required by App Store)
  - Must explain: data collection, usage, sharing, deletion
  - Link in Info.plist
  - Publicly accessible website URL
- [ ] Terms of Service created (highly recommended)
- [ ] EULA ready (if applicable)
- [ ] Privacy Policy complies with:
  - GDPR (if EU users)
  - CCPA (if California users)
  - COPPA (if under 13)

---

## ✅ **Phase 2: App Configuration (Info.plist)**

These go in `apps/mobile/app.json` (Expo) and `Info.plist`:

### 2.1 Required Keys
```json
{
  "expo": {
    "name": "Forge",
    "slug": "forge",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "forge",
    "platforms": ["ios", "android", "web"],
    "ios": {
      "supportsTabletMode": true,
      "supportsLandscape": false,
      "bundleIdentifier": "com.forgeapp.main",
      "buildNumber": "1",
      "privacy": {
        "NSCameraUsageDescription": "Camera access for...",
        "NSMicrophoneUsageDescription": "Microphone for...",
        "NSPhotoLibraryUsageDescription": "Photo library for...",
        "NSLocationWhenInUseUsageDescription": "Location for...",
        "NSUserTrackingUsageDescription": "Tracking for analytics..."
      }
    }
  }
}
```

### 2.2 Privacy Manifest (Required - NEW in iOS 17.1+)
Create `apps/mobile/PrivacyInfo.xcprivacy`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <!-- If using UserDefaults -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

---

## ✅ **Phase 3: Code Quality & Standards**

### 3.1 Performance Requirements
- [ ] App launches in <20 seconds on iPhone 14 or older
- [ ] No memory leaks (use Instruments to test)
- [ ] Battery usage optimized (minimize background activity)
- [ ] Network calls timeout properly
- [ ] No hardcoded API keys in code

### 3.2 UI/UX Standards
- [ ] App uses native iOS components (not custom system UI)
- [ ] Status bar visible and readable
- [ ] No crashing on any screen
- [ ] Keyboard dismisses properly
- [ ] All buttons/links are tappable (min 44x44pt)
- [ ] No misleading ads or "fake" UI
- [ ] Proper use of safe area (notch, Dynamic Island)
- [ ] Landscape mode works (if supported)

### 3.3 Accessibility (Required for App Store)
- [ ] VoiceOver compatible (all elements labeled)
- [ ] Text is readable (min font size 11pt)
- [ ] Color not sole way to convey info
- [ ] Contrast ratio ≥4.5:1
- [ ] Motion doesn't flash >3x per second
- [ ] No text rotation

Test with:
```bash
# Enable VoiceOver in Simulator
Cmd+U in Simulator
Settings → Accessibility → VoiceOver → On
```

### 3.4 Security
- [ ] All network calls use HTTPS
- [ ] No SSL pinning without fallback
- [ ] Sensitive data encrypted at rest
- [ ] Biometric auth (Face ID/Touch ID) optional but recommended
- [ ] No storing passwords in UserDefaults
- [ ] API keys from secure backend only

### 3.5 Code Signing
- [ ] Development certificate obtained
- [ ] Distribution certificate obtained
- [ ] Provisioning profiles created (Development & Distribution)
- [ ] Code signing configured in Xcode

```bash
# Check code signing
eas credentials
```

---

## ✅ **Phase 4: Content & Compliance**

### 4.1 App Metadata
- [ ] App name (max 30 chars)
- [ ] Subtitle (max 30 chars)
- [ ] Description (compelling, clear purpose)
- [ ] Keywords (5-10 relevant terms)
- [ ] Category accurate
- [ ] Content rating questionnaire completed
- [ ] Age rating set correctly

### 4.2 Screenshots & Previews
Requirements:
- [ ] 2-5 screenshots per device size
- [ ] Max 5 previews (videos)
- [ ] Show actual app UI (not marketing graphics)
- [ ] Resolutions:
  - iPhone 6.7" (max): 1284×2778px
  - iPhone 6.1": 1170×2532px
  - iPhone 5.5": 1242×2208px

### 4.3 App Preview Video
- [ ] 30 seconds long
- [ ] MP4 format, H.264 codec
- [ ] 1920×1080 or 1080×1920
- [ ] Max 500MB file size
- [ ] No logos, watermarks, or promotional graphics
- [ ] Shows real app functionality

### 4.4 Content Rating
- [ ] Violence: None/Rare/Frequent
- [ ] Sexual Content: None/Mild/Moderate/Strong
- [ ] Language: None/Rare/Frequent/Strong
- [ ] Alcohol/Tobacco: None/Frequent
- [ ] Gambling: Yes/No
- [ ] Medical: Yes/No
- [ ] Unrestricted Web Access: Yes/No

---

## ✅ **Phase 5: Testing Before Submission**

### 5.1 Device Testing
Test on real devices:
- [ ] iPhone 14 Pro Max (newest)
- [ ] iPhone SE 3rd gen (budget)
- [ ] iPad (if supporting)

Or use Simulator minimum:
- [ ] iOS 15 (oldest supported)
- [ ] iOS 17 (latest)
- [ ] All screen sizes

### 5.2 Functional Testing
- [ ] Sign up/login flow works
- [ ] All features functional
- [ ] Navigation doesn't crash
- [ ] Memory usage normal
- [ ] Network errors handled gracefully
- [ ] Offline behavior (if applicable)

### 5.3 TestFlight (Internal Testing)
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Or in Xcode:
# Product → Archive → Distribute App
```

Test with:
- [ ] Testers (10-20 people)
- [ ] Session duration (2-3 days minimum)
- [ ] Crash reports reviewed
- [ ] Battery/performance monitored

### 5.4 Rejection Prevention

**Common rejections:**
- [ ] App crashes on launch
- [ ] Missing privacy policy
- [ ] Misleading screenshots
- [ ] Hidden functionality
- [ ] Plagiarized/copied content
- [ ] Incomplete app (incomplete features)
- [ ] Vague description
- [ ] No clear purpose

---

## ✅ **Phase 6: Build & Submission**

### 6.1 Production Build
```bash
# Build for iOS App Store
eas build --platform ios --profile production

# Wait for build completion (~45 min)
# Download at https://expo.dev/builds
```

### 6.2 App Store Connect Setup
1. Go to https://appstoreconnect.apple.com
2. Create new app → iOS
3. Fill in all required fields
4. Set pricing & availability
5. Add app information
6. Add screenshots (see Phase 4.2)
7. Complete content rating
8. Review privacy policy

### 6.3 Build Upload
```bash
# Option 1: Using Expo
eas submit --platform ios --path <build.ipa>

# Option 2: Using Transporter (Apple's official tool)
# Download from App Store Connect
# Drag build.ipa into Transporter
```

### 6.4 Pre-Submission Checklist
- [ ] All required fields filled
- [ ] Correct version number (1.0.0 for first)
- [ ] Build selected
- [ ] Screenshots uploaded
- [ ] Privacy policy URL valid
- [ ] Contact email correct
- [ ] Support email works
- [ ] Rating correct

---

## ✅ **Phase 7: Submit for Review**

In App Store Connect:

1. Click **"Prepare for Submission"**
2. Review app information
3. Select build
4. Check **"Export Compliance"** (answer crypto questions)
5. Accept App Store Agreements
6. Click **"Submit for Review"**
7. You'll receive email confirmation

**Review time:** 24-48 hours typically

---

## ✅ **Phase 8: Post-Launch**

### 8.1 Monitor
- [ ] Crash reports in Xcode Organizer
- [ ] App Store reviews read daily
- [ ] Analytics reviewed
- [ ] Support emails monitored

### 8.2 Bug Fixes
For urgent bugs:
1. Fix code
2. Increment build number (1.0.1)
3. Build & submit
4. App Store expedited review (request if critical)

### 8.3 New Versions
- [ ] Update version number (semantic versioning)
- [ ] Update screenshots if UI changed
- [ ] Write release notes
- [ ] Submit through standard review

---

## 🚨 **Critical Don'ts**

❌ **Never:**
- Use private APIs
- Copy competitor's app design
- Mislead about functionality
- Change core features after approval
- Submit beta/incomplete features
- Use non-standard UI (system navigation)
- Store user data without consent
- Use UDID or other device identifiers
- Include ads that cover app content
- Change bundle ID after launch

---

## 📱 **Quick Build & Submit Script**

Create `scripts/build-and-submit.sh`:

```bash
#!/bin/bash
set -e

echo "🍎 Building Forge for App Store..."

# Build
eas build --platform ios --profile production

# Get build ID (check at https://expo.dev/builds)
echo "✅ Build created! Check https://expo.dev/builds"

echo ""
echo "📋 Next steps:"
echo "1. Download build when complete"
echo "2. Go to https://appstoreconnect.apple.com"
echo "3. Create new app version"
echo "4. Upload build with Transporter"
echo "5. Fill in metadata"
echo "6. Submit for review"

echo ""
echo "🚀 Or use: eas submit --platform ios"
```

Run:
```bash
chmod +x scripts/build-and-submit.sh
./scripts/build-and-submit.sh
```

---

## 🔗 **Apple's Official Guidelines**

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Privacy Best Practices](https://developer.apple.com/privacy/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Xcode Help](https://help.apple.com/xcode/)

---

## ✅ **Forge Submission Tracker**

Copy this to track your progress:

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 1 | Developer Account | ⬜ | |
| 1 | Bundle ID | ⬜ | |
| 1 | Privacy Policy | ⬜ | |
| 2 | Info.plist | ⬜ | |
| 2 | Privacy Manifest | ⬜ | |
| 3 | Performance Testing | ⬜ | |
| 3 | Accessibility | ⬜ | |
| 4 | Screenshots | ⬜ | |
| 5 | TestFlight | ⬜ | |
| 6 | Production Build | ⬜ | |
| 7 | Submit | ⬜ | Date: |
| 8 | Approved | ⬜ | Date: |

---

**Ready to launch? Start with Phase 1!** 🚀
