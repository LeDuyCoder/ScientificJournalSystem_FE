import { Routes, Route } from "react-router-dom";
import ActivationSuccess from "./features/auth/pages/ActivationSuccess";

function Dashboard() {
  return <h1>Dashboard</h1>;
}

function Home() {
  return <h1>Home</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/activation-success"
        element={<ActivationSuccess />}
      />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;