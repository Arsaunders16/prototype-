import { useState } from "react";

import HomePage from "./pages/HomePage";
import SetupPage from "./pages/SetupPage";
import WorkspacePage from "./pages/WorkspacePage";

type Screen = "home" | "setup" | "workspace";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedWorkflow, setSelectedWorkflow] = useState("");

  if (screen === "home") {
    return (
      <HomePage
        onSelectWorkflow={(workflow) => {
          setSelectedWorkflow(workflow);
          setScreen("setup");
        }}
      />
    );
  }

  if (screen === "setup") {
    return (
      <SetupPage
        workflowName={selectedWorkflow}
        onBack={() => setScreen("home")}
        onContinue={() => setScreen("workspace")}
      />
    );
  }

  return (
    <WorkspacePage
      workflowName={selectedWorkflow}
      onBack={() => setScreen("home")}
    />
  );
}

export default App;