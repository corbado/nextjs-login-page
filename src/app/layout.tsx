import "./globals.css";
import ClientProvider from "@/components/ClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the children with ClientProvider to manage session state */}
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
