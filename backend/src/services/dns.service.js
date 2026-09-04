import dns from "dns/promises";

export const checkDns = async (hostname) => {
  const start = Date.now();
  try {
    const addresses = await dns.resolve4(hostname);
    return {
      success: true,
      responseTimeMs: Date.now() - start,
      addresses,
    };
  } catch (err) {
    return {
      success: false,
      responseTimeMs: Date.now() - start,
      error: err.message,
    };
  }
};