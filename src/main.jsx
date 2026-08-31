import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ToastProvider from "./components/common/ToastProvider";
import GlobalStyle from "./styles/GlobalStyle";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalStyle />
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>,
);
