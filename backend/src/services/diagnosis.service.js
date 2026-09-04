import { checkDns } from "./dns.service.js";
import { checkTcp } from "./tcp.service.js";
import { checkTls } from "./tls.service.js";
import { checkHttp } from "./http.service.js";

const LATENCY_THRESHOLD_MS = 1000; // above this = "degraded" even if successful

export const runDiagnosis = async (monitor) => {
  const { target, type, port } = monitor;

  // Step 1: DNS — always runs first (needed to even reach the host)
  const dnsResult = await checkDns(target);
  if (!dnsResult.success) {
    return {
      status: "FAILURE",
      failureType: "DNS_FAILURE",
      responseTimeMs: dnsResult.responseTimeMs,
      errorMessage: dnsResult.error,
    };
  }

  // If monitor type is DNS only, stop here — success
  if (type === "DNS") {
    return {
      status: "SUCCESS",
      responseTimeMs: dnsResult.responseTimeMs,
    };
  }

  // Step 2: TCP — connect to host:port
  const tcpPort = port || (type === "HTTP" ? 443 : 80);
  const tcpResult = await checkTcp(target, tcpPort);
  if (!tcpResult.success) {
    return {
      status: "FAILURE",
      failureType: "CONNECTION_FAILURE",
      responseTimeMs: tcpResult.responseTimeMs,
      errorMessage: tcpResult.error,
    };
  }

  if (type === "TCP") {
    return {
      status: "SUCCESS",
      responseTimeMs: tcpResult.responseTimeMs,
    };
  }

  // Step 3: TLS — only relevant for HTTPS/TLS checks
  if (type === "TLS" || type === "HTTP") {
    const tlsResult = await checkTls(target, tcpPort);
    if (!tlsResult.success) {
      return {
        status: "FAILURE",
        failureType: "TLS_FAILURE",
        responseTimeMs: tlsResult.responseTimeMs,
        errorMessage: tlsResult.error,
      };
    }

    if (type === "TLS") {
      return {
        status: "SUCCESS",
        responseTimeMs: tlsResult.responseTimeMs,
      };
    }
  }

  // Step 4: HTTP — final step, full request
  const url = `https://${target}`;
  const httpResult = await checkHttp(url);

  if (!httpResult.success) {
    return {
      status: "FAILURE",
      failureType: httpResult.error === "Request timeout" ? "TIMEOUT" : "HTTP_FAILURE",
      responseTimeMs: httpResult.responseTimeMs,
      httpStatusCode: httpResult.statusCode,
      errorMessage: httpResult.error,
    };
  }

  // Successful, but check latency
  if (httpResult.responseTimeMs > LATENCY_THRESHOLD_MS) {
    return {
      status: "SUCCESS",
      failureType: "LATENCY_DEGRADED",
      responseTimeMs: httpResult.responseTimeMs,
      httpStatusCode: httpResult.statusCode,
    };
  }

  return {
    status: "SUCCESS",
    responseTimeMs: httpResult.responseTimeMs,
    httpStatusCode: httpResult.statusCode,
  };
};