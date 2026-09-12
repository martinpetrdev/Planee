import { useAuth } from "@/auth/context";
import { ScreenShell } from "@repo/mobile-ui";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Screen() {
  const [isLoading, setIsLoading] = useState(true);

  const auth = useAuth();

  useEffect(() => {
    // Can be called multiple times, token re-exchange is handled by the function
    auth.exchange().finally(() => setIsLoading(false));
  }, [auth]);

  if (isLoading) return <ScreenShell></ScreenShell>;

  return <Redirect href="/" />;
}
