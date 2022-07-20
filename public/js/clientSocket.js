var connected = false;

var socket = io("http://localhost:3333");

socket.emit("setup", userLoggedIn);

socket.on("connected", () => (connected = true));
socket.on("message received", (newMessage) => messageReceived(newMessage));

// tato funkce je zde kvůli tomu, že jinak by socket io nefungoval, respektive
// zprávy by se zobrazovaly až po aktualizaci okna
// tato funkce je ještě v souboru commonMessages.js
// pokud bych odstranil možnost přidat uživatele do již existujícího chatu, nebyla by zde potřeba
function messageReceived(newMessage) {
  if ($(`[data-room="${newMessage.chat._id}"]`).length == 0) {
    // Show popup notification
    showMessagePopup(newMessage);
  } else {
    addChatMessageHtml(newMessage);
  }

  refreshMessagesBadge();
}
// function emitNotification(userId) {
//   if (userId == userLoggedIn._id) return;

//   socket.emit("notification received", userId);
// }
