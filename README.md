# Automated Pet Care System (APCS) - Frontend

The mobile application frontend for the Automated Pet Care System, a comprehensive IoT solution for remote pet care monitoring and control.

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:
```bash
https://github.com/DavidAoGuo/APCS_frontend.git
cd APCS_frontend/APCSMobileApp
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL:

Open the file `src/utils/constants.js` and modify the API URLs to point to your local backend:

```javascript
// Change these lines:
export const API_BASE_URL = 'https://apcs-backend.onrender.com/api';
export const SOCKET_URL = 'https://apcs-backend.onrender.com';

// For web browser testing on the same computer as your backend:
export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';

// OR for testing on mobile devices with Expo Go:
// Replace 192.168.1.223 with your computer's actual IP address on your network
export const API_BASE_URL = 'http://192.168.1.223:5000/api';
export const SOCKET_URL = 'http://192.168.1.223:5000';
```

**Important notes**: 
- When testing on mobile devices, use your computer's IP address (like 192.168.1.223) instead of localhost
- You can find your computer's IP address by running `ipconfig` (Windows) or `ifconfig` (Mac/Linux) in a terminal
- Make sure your mobile device and computer are on the same WiFi network
- The default port is 5000, but if you've changed it in your backend `.env` file, update it here too

4. Start the app:
```bash
npm start
```

This will display a QR code that you can scan with the Expo Go app on your phone, or you can press:
- `w` to open in a web browser
- `a` to open in an Android emulator
- `i` to open in an iOS simulator

## Troubleshooting

- **API Connection Issues**: Make sure your backend server is running and the API URL is correct in `constants.js`.
- **Socket Connection Issues**: Verify that the SOCKET_URL is correct in `constants.js`.
- **App Not Loading**: Try clearing the Expo cache with `expo r -c`.
- **Network Issues**: Ensure both your device and backend server are on the same network when testing locally.