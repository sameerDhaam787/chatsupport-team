import React from "react";
import { Toaster } from "react-hot-toast";
import AgentSystemComponent from "./components/AgentSystem";
import { ReduxProvider } from "./store/ReduxProvider";
import "./index.css";

const App = () => {
  return (
    <ReduxProvider>
      <div className="h-full">
        <Toaster position="top-right" />
        <AgentSystemComponent />
      </div>
    </ReduxProvider>
  );
};

export default App;
