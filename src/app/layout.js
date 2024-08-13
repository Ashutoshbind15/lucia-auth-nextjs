import "./globals.css";

export const metadata = {
  title: "Auth template",
  description: "Trying to generate an auth template",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
