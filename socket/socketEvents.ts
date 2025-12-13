import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  if (off) {
    socket.off("TestSocketResponse", payload);
    return;
  } else if (typeof payload == "function") {
    socket.on("TestSocketResponse", payload);
  } else {
    socket.emit("TestSocket", payload);
  }
};
