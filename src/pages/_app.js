import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "../../store/store";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Toaster />
      <Component {...pageProps} />
    </Provider>
  );
}
