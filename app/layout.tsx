import { CartProvider } from "./context/CartContext";
import "./globals.css";
import Header from "./components/Header";
import FloatingCart from "./components/FloatingCart";
import GlobalLoader from "./components/GlobalLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <GlobalLoader />
          <Header />
          {children}
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}