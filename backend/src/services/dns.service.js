import dns from "dns/promises";

export const checkDns = async (hostname) => {
  const start = Date.now();
  try {
    const result = await dns.lookup(hostname);
    return {
      success: true,
      responseTimeMs: Date.now() - start,
      addresses: [result.address],
    };
  } catch (err) {
    return {
      success: false,
      responseTimeMs: Date.now() - start,
      error: err.message,
    };
  }
};