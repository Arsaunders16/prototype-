import { useState } from "react";
import HomePage from "./pages/HomePage";
import WorkspacePage from "./pages/WorkspacePage";

function App() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  if (selectedWorkflow) {
    return (
      <WorkspacePage
        workflowName={selectedWorkflow}
        onBack={() => setSelectedWorkflow(null)}
      />
    );
  }

  return <HomePage onSelectWorkflow={setSelectedWorkflow} />;
}

export default App;