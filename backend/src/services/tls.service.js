import tls from "tls";

export const checkTls = (host, port = 443, timeoutMs = 5000) => {
  return new Promise((resolve) => {
    const start = Date.now();
    let settled = false;

    const socket = tls.connect(
      { host, port, servername: host, timeout: timeoutMs },
      () => {
        const cert = socket.getPeerCertificate();
        const result = {
          success: true,
          responseTimeMs: Date.now() - start,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          authorized: socket.authorized,
        };
        settled = true;
        socket.end();
        resolve(result);
      }
    );

    socket.on("timeout", () => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({ success: false, responseTimeMs: Date.now() - start, error: "TLS handshake timeout" });
    });

    socket.on("error", (err) => {
      if (settled) return;
      settled = true;
      resolve({ success: false, responseTimeMs: Date.now() - start, error: err.message });
    });
  });
};