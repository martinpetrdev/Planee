"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { API } from "@repo/shared";
import { Button } from "@repo/web-ui/components/ui/button";
import { Input } from "@repo/web-ui/components/ui/input";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { joinEarlyAccessProgram } from "@/api/modules/users";

// Written by AI (Claude Opus 5.5)
export function JoinForm({
  inviteId,
  email,
}: {
  inviteId: string;
  email?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const autoSubmitted = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string>();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email") as string;

    setStatus("sending");
    setError(undefined);
    try {
      await joinEarlyAccessProgram({ inviteId, email });
      setStatus("sent");
    } catch (e) {
      setStatus("idle");
      setError(API.parseError(e as Error)?.message ?? "Something went wrong.");
    }
  }

  // Auto-submit when e-mail comes prefilled from the link (ref guards Strict Mode double run)
  useEffect(() => {
    if (!email || autoSubmitted.current) return;
    autoSubmitted.current = true;
    formRef.current?.requestSubmit();
  }, [email]);

  if (status === "sent")
    return (
      <p className="text-muted-foreground">
        Done! Check your inbox for the registration link.
      </p>
    );

  return (
    <div className="flex w-full flex-col gap-2">
      <form ref={formRef} onSubmit={onSubmit} className="flex w-full gap-2">
        <Input
          aria-label="E-mail"
          name="email"
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          defaultValue={email}
          required
        />
        <Button type="submit" size="lg" disabled={status === "sending"}>
          Send
          <ArrowRightIcon className="mt-0.5 size-4" />
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
