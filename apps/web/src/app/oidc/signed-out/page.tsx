"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@repo/web-ui/components/ui/button";
import Link from "next/link";
import { WebConfig } from "@/config";
import { useConfig } from "@/providers/ConfigProvider";

export default function Page() {
  const { isLoading, config } = useConfig();

  if (isLoading) return <></>;

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
      <h1 className="text-3xl">You have been signed out.</h1>
      <Link href={config.marketingWeb.baseUrl} className="fixed bottom-20">
        <Button className="text-md">
          Go to homepage <ArrowRightIcon />
        </Button>
      </Link>
    </div>
  );
}
