import type { AppProps } from "next/app";
import { PopulationProvider } from "../providers/PopulationProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PopulationProvider>
      <Component {...pageProps} />
    </PopulationProvider>
  );
}

export default MyApp;
