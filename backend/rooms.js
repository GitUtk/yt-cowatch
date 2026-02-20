const rooms = new Map();

export function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      users: new Map(),
      currentVideoId: "dQw4w9WgXcQ",
      currentTime: 0,
      isPlaying: false,
      lastUpdateTime: Date.now()
    });
  }
  return rooms.get(roomId);
}

export function deleteRoomIfEmpty(roomId) {
  const room = rooms.get(roomId);
  if (room && room.users.size === 0) {
    rooms.delete(roomId);
  }
}

export function addUserToRoom(roomId, socketId, username) {
  const room = getOrCreateRoom(roomId);
  const isAdmin = room.users.size === 0;
  const user = { id: socketId, username, isAdmin };
  room.users.set(socketId, user);
  return { room, user };
}

export function removeUserFromRoom(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return null;
  const user = room.users.get(socketId);
  room.users.delete(socketId);

  if (user && room.users.size > 0 && user.isAdmin) {
    const nextUserId = room.users.keys().next().value;
    const nextUser = room.users.get(nextUserId);
    nextUser.isAdmin = true;
  }

  deleteRoomIfEmpty(roomId);
  return { room, user };
}

export function getRoomData(room) {
  if (!room) return null;
  let time = room.currentTime;
  if (room.isPlaying) {
    time += (Date.now() - room.lastUpdateTime) / 1000;
  }
  return {
    id: room.id,
    users: Array.from(room.users.values()).map((user) => ({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      status: user.status || { isSynced: true, currentTime: 0 }
    })),
    currentVideoId: room.currentVideoId,
    currentTime: time,
    isPlaying: room.isPlaying
  };
}

export function updateRoomVideo(roomId, videoId) {
  const room = rooms.get(roomId);
  if (!room) return null;
  room.currentVideoId = videoId;
  room.currentTime = 0;
  room.isPlaying = false;
  room.lastUpdateTime = Date.now();
  return room;
}

export function updateRoomPlayback(roomId, isPlaying, currentTime) {
  const room = rooms.get(roomId);
  if (!room) return null;
  room.isPlaying = isPlaying;
  room.currentTime = currentTime;
  room.lastUpdateTime = Date.now();
  return room;
}
