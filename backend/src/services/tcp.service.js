import net from "net";

export const checkTcp = (host, port, timeoutMs = 5000) => {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);

    socket.connect(port, host, () => {
      finish({ success: true, responseTimeMs: Date.now() - start });
    });

    socket.on("timeout", () => {
      finish({ success: false, responseTimeMs: Date.now() - start, error: "TCP connection timeout" });
    });

    socket.on("error", (err) => {
      finish({ success: false, responseTimeMs: Date.now() - start, error: err.message });
    });
  });
};