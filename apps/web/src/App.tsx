import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import JobResults from "./pages/JobResults";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />{" "}
        <Route
          path="/jobs/:id"
          element={
            <PrivateRoute>
              <JobResults />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
