import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../contexts/AuthContext";
import { Toaster } from "react-hot-toast";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Toaster />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
