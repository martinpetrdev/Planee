import { useAuth } from "@/auth/context";
import { ScreenShell } from "@repo/mobile-ui";
import { Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function Screen() {
  const [isLoading, setIsLoading] = useState(true);
  const isExchanging = useRef<boolean>(false);

  const auth = useAuth();

  const exchange = async () => {
    await auth.exchange();
  };

  useEffect(() => {
    if (isExchanging.current) return;
    isExchanging.current = true;

    exchange().finally(() => {
      setIsLoading(false);
      isExchanging.current = false;
    });
  }, [auth]);

  if (isLoading) return <ScreenShell></ScreenShell>;

  return <Redirect href="/" />;
}
