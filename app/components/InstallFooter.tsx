"use client";

import { useEffect, useState } from "react";

// Tambahkan TypeScript event untuk PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallFooter() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler as any);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as any);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 flex items-center justify-between shadow-lg">
      <span className="font-medium">Install aplikasi ini ke perangkat Anda</span>

      <div className="flex gap-3">
        <button
          onClick={installApp}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow"
        >
          Install
        </button>

        <button
          onClick={() => setShow(false)}
          className="bg-blue-800 px-4 py-2 rounded-lg"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
