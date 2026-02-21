import React from "react";
import { UserProvider } from "./contexts/UserContext";
import AppRoutes from "./routes/Routes.jsx";

const App = () => {
  return <>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </>;
};

export default App;
