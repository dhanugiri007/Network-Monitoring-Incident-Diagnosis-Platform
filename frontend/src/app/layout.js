import "./globals.css";

export const metadata = {
  title: "NetPulse",
  description: "Network monitoring dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="page-nav">
  <a href="/">HOME</a>
  <a href="/monitors">MONITORS</a>
  <a href="/incidents">INCIDENTS</a>
  <a href="/topology">TOPOLOGY</a>
</nav>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}