import { Routes, Route } from "react-router";
import { SetupPage } from "@/pages/SetupPage";
import { TimerPage } from "@/pages/TimerPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SetupPage />} />
      <Route path="/timer" element={<TimerPage />} />
    </Routes>
  );
}

export default App;
