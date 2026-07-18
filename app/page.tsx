import { Suspense } from "react";
import { OSProvider } from "@/lib/arjun-os/os-context";
import { ArjunOSShell } from "@/components/arjun-os/shell";

function OSFallback() {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center bg-[#071018] text-sm text-white/70">
      Loading Arjun OS…
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<OSFallback />}>
      <OSProvider>
        <ArjunOSShell />
      </OSProvider>
    </Suspense>
  );
}
