import "./globals.css";

export const metadata = {
  title: "NetPulse",
  description: "Network monitoring dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}