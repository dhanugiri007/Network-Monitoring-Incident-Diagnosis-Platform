export const checkHttp = async (url, timeoutMs = 5000) => {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    return {
      success: response.ok, // true if status 200-299
      responseTimeMs: Date.now() - start,
      statusCode: response.status,
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      success: false,
      responseTimeMs: Date.now() - start,
      error: err.name === "AbortError" ? "Request timeout" : err.message,
    };
  }
};