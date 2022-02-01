import { SignInForm } from "@medplum/ui";
import { useNavigate } from "react-router-dom";

export function SignInPage() {
  const navigate = useNavigate();
  return (
    <SignInForm onSuccess={() => navigate('/')} />
  );
}

