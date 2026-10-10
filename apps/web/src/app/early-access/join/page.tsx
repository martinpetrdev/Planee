import Image from "next/image";
import { JoinForm } from "./join-form";

// Written by AI (Claude Opus 5.5)
export default async function Page({
  searchParams,
}: PageProps<"/early-access/join">) {
  const { code, email } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <Image
          src="/assets/images/logo_base_monochromatic.svg"
          alt="Planee logo"
          width={128}
          height={128}
          className="size-16"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-4xl">Welcome to Planee</h1>
          <p className="text-muted-foreground">
            Enter the e-mail you were invited with and we'll send you the
            registration link.
          </p>
        </div>
        {typeof code === "string" ? (
          <JoinForm
            inviteId={code}
            email={typeof email === "string" ? email : undefined}
          />
        ) : (
          <p className="text-sm text-destructive">
            This invite link is invalid. Ask for a new one.
          </p>
        )}
      </div>
    </main>
  );
}
