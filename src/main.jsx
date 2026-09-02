import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { setupAuthInterceptor } from "./apis/setupAuthInterceptor";
import App from "./App";
import ToastProvider from "./components/common/ToastProvider";
import { AuthProvider } from "./hooks/useAuth";
import GlobalStyle from "./styles/GlobalStyle";

setupAuthInterceptor();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalStyle />
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>,
);
