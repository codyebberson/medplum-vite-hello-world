import { useMedplumProfile } from "@medplum/ui";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import { PatientPage } from "./pages/PatientPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignInPage } from "./pages/SignInPage";
import "./App.css";

export function App() {
  const profile = useMedplumProfile();

  if (!profile) {
    // Not signed in
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    );
  } else {
    // Signed in
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/Patient/:id" element={<PatientPage />} />
      </Routes>
    );
  }
}
