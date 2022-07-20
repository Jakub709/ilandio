var connected = false;

var socket = io("http://localhost:3333");
socket.emit("setup", userLoggedIn);

socket.on("connected", () => (connected = true));
socket.on("message received", (newMessage) => messageReceived(newMessage));

// function emitNotification(userId) {
//   if (userId == userLoggedIn._id) return;

//   socket.emit("notification received", userId);
// }
