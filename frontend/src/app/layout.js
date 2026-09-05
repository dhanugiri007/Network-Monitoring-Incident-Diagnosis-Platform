import "./globals.css";

export const metadata = {
  title: "NetPulse",
  description: "Network monitoring dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
  <a href="/monitors">Monitors</a> | <a href="/incidents">Incidents</a> |{" "}
  <a href="/topology">Topology</a>
</nav>
        <hr />
        {children}
      </body>
    </html>
  );
}