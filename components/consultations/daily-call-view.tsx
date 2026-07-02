"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Body,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Daily's default export is a factory; importing the type separately keeps the
// call-object type without pulling the runtime into the module scope eagerly.
type DailyCall = {
  join(properties?: {
    url?: string;
    token?: string;
    showLeaveButton?: boolean;
  }): Promise<unknown>;
  leave(): Promise<void>;
  destroy(): Promise<void>;
  isDestroyed(): boolean;
  meetingState(): string;
  setLocalAudio(enabled: boolean): unknown;
  setLocalVideo(enabled: boolean): unknown;
  startScreenShare(): void;
  stopScreenShare(): void;
  iframe(): HTMLIFrameElement | null;
  on?(event: string, handler: (...args: unknown[]) => void): unknown;
  off?(event: string, handler: (...args: unknown[]) => void): unknown;
};

type JoinResponse = {
  token: string;
  roomUrl: string;
  roomName: string;
  provider: string;
};

type Props = {
  consultationId: string;
  isDoctor: boolean;
  onCompleted: () => void;
  onLeft: () => void;
};

type Phase = "idle" | "loading" | "in-call" | "ended" | "error";

/**
 * Browser-side Daily.co call view.
 *
 * Flow: request a meeting token from /join → create a Daily call object →
 * mount its iframe → join the room. Provides mute / camera / screen-share
 * toggles plus leave & (doctor-only) complete. On leave/complete the call
 * object is destroyed to free device resources.
 */
export function DailyCallView({
  consultationId,
  isDoctor,
  onCompleted,
  onLeft,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const callRef = useRef<DailyCall | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);

  const cleanup = useCallback(async () => {
    const call = callRef.current;
    callRef.current = null;
    if (!call) return;
    try {
      if (!call.isDestroyed()) {
        await call.leave();
        await call.destroy();
      }
    } catch {
      // Best-effort teardown.
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  }, []);

  const joinRoom = useCallback(async () => {
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch(
        `/api/consultations/${consultationId}/join`,
        { method: "POST" },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed to join room");
      }
      const data = (await res.json()) as JoinResponse;

      // Dynamic import keeps the (browser-only) SDK out of the server bundle
      // and out of the initial client bundle until the user actually joins.
      const Daily = (await import("@daily-co/daily-js")).default as {
        createCallObject(properties?: {
          url?: string;
          allowMultipleCallInstances?: boolean;
        }): DailyCall;
      };

      const call = Daily.createCallObject({
        url: data.roomUrl,
        allowMultipleCallInstances: false,
      });
      callRef.current = call;

      // Mount Daily's iframe into our container before joining.
      const iframe = call.iframe();
      if (iframe && containerRef.current) {
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        iframe.style.borderRadius = "1rem";
        containerRef.current.appendChild(iframe);
      }

      await call.join({ url: data.roomUrl, token: data.token });
      setPhase("in-call");
    } catch (err) {
      console.error("[daily] join failed", err);
      setError(err instanceof Error ? err.message : "Failed to join call");
      setPhase("error");
      await cleanup();
    }
  }, [consultationId, cleanup]);

  const toggleMic = () => {
    const call = callRef.current;
    if (!call) return;
    const next = !micOn;
    call.setLocalAudio(next);
    setMicOn(next);
  };

  const toggleCam = () => {
    const call = callRef.current;
    if (!call) return;
    const next = !camOn;
    call.setLocalVideo(next);
    setCamOn(next);
  };

  const toggleScreenShare = () => {
    const call = callRef.current;
    if (!call) return;
    if (sharing) {
      call.stopScreenShare();
      setSharing(false);
    } else {
      call.startScreenShare();
      setSharing(true);
    }
  };

  const leave = useCallback(async () => {
    await cleanup();
    setPhase("ended");
    onLeft();
  }, [cleanup, onLeft]);

  const complete = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/consultations/${consultationId}/complete`,
        { method: "POST" },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed to complete consultation");
      }
      await cleanup();
      setPhase("ended");
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete");
      setPhase("error");
    }
  }, [consultationId, cleanup, onCompleted]);

  // Destroy the call object if the component unmounts mid-call.
  useEffect(() => {
    return () => {
      void cleanup();
    };
  }, [cleanup]);

  /* ---------------------------- Idle / pre-join --------------------------- */
  if (phase === "idle") {
    return (
      <div className="space-y-4">
        <Alert variant="info">
          <AlertTitle>Ready to join</AlertTitle>
          <AlertDescription>
            Click below to enter the secure video room. Camera and microphone
            access will be requested by your browser.
          </AlertDescription>
        </Alert>
        <Button onClick={joinRoom}>Join consultation</Button>
      </div>
    );
  }

  /* ------------------------------- Loading -------------------------------- */
  if (phase === "loading") {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-950 text-slate-200">
        <Body className="text-slate-300">Connecting to the room…</Body>
      </div>
    );
  }

  /* -------------------------------- Error --------------------------------- */
  if (phase === "error") {
    return (
      <div className="space-y-4">
        <Alert variant="error">
          <AlertTitle>Could not join</AlertTitle>
          <AlertDescription>{error ?? "Unknown error"}</AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button variant="outline" onClick={joinRoom}>
            Try again
          </Button>
          <Button variant="ghost" onClick={leave}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  /* ------------------------------- In call -------------------------------- */
  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={micOn ? "default" : "outline"} size="sm" onClick={toggleMic}>
          {micOn ? "Mute" : "Unmute"}
        </Button>
        <Button variant={camOn ? "default" : "outline"} size="sm" onClick={toggleCam}>
          {camOn ? "Camera off" : "Camera on"}
        </Button>
        <Button
          variant={sharing ? "default" : "outline"}
          size="sm"
          onClick={toggleScreenShare}
        >
          {sharing ? "Stop sharing" : "Share screen"}
        </Button>
        <Badge variant="success">Live</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={leave}>
            Leave
          </Button>
          {isDoctor && (
            <Button size="sm" onClick={complete}>
              Complete consultation
            </Button>
          )}
        </div>
      </div>
      {!isDoctor && (
        <Body size="sm" muted className={cn("")}>
          Only your doctor can mark the consultation complete and save clinical
          notes.
        </Body>
      )}
    </div>
  );
}
