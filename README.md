# YouTube Co-Watch

A real-time co-watching platform that allows synchronized YouTube video playback and interactive group chat. The system features latency compensation, active synchronization diagnostics, administrative control structures, and a premium dark-themed user interface.

## Technologies Used

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![YouTube API](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)

---

## Key Features

*   **Real-time Playback Synchronization**: Simultaneous video play, pause, and seek events across all viewers in a room.
*   **Latency-Compensated Time Alignment**: Epoch-time offset logic automatically positions joining or buffering users to the exact playback frame of the active room.
*   **Active Sync Diagnostics**: Clients report status (timestamp, state) periodically, and the server computes synchronization health to show real-time green/red connection badges for active viewers.
*   **Role-Based Authority (Admin Controls)**: The room creator acts as the administrator with exclusive playback control (via standard player timeline/bar). Joined members are locked to watch-only mode with custom overlay restrictions.
*   **Integrated Group Chat**: Seamless real-time chat updates to communicate during video sessions, including system notification events.
*   **Modern Dark Theme**: Styled with a minimal, dark-themed Shadcn-inspired CSS structure using high contrast, custom inputs, borders, and slider thumbs.


---

## Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Protocol & Synchronisation Mechanics

### Time Drift Calculation
When updates are received, the target room coordinate is adjusted to account for network transmission time:
```javascript
targetTime = roomTime + (Date.now() - roomUpdateTimestamp) / 1000;
```
If the local player is playing and deviates by more than `1.0` seconds (or immediately when paused), the client issues a native `seekTo` correction.

### Diagnostics Polling
Clients run a 3-second diagnostic reporting tick:
*   Client reports state to server: `report-status` -> `{ videoId, isPlaying, currentTime }`.
*   Server evaluates alignment with expected room state:
    $$\text{Synced} = (\text{videoId} == \text{roomVideoId}) \land (|\text{clientTime} - \text{roomTime}| < 3\text{s})$$
*   Server updates viewer attributes and broadcasts the status list to update the visual sync health lights.
