"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Camera,
  CheckCircle2,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  RefreshCw,
  Timer,
  XCircle,
} from "lucide-react";
import { actionClockIn, actionClockOut } from "@/lib/actions";
import { uploadToBucket, getBrowserClient } from "@/lib/upload";
import { formatTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { Attendance } from "@/types";

interface ClockCardProps {
  userId: string;
  todayRecord?: Attendance | null;
  skipGeolocation?: boolean;
}

type Stage = "idle" | "locating" | "error" | "ready" | "busy" | "done";

export function ClockCard({ userId, todayRecord, skipGeolocation = false }: ClockCardProps) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [stage, setStage] = useState<Stage>("idle");
  const [message, setMessage] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [camError, setCamError] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const posRef = useRef<{ latitude: number; longitude: number; accuracy: number }>({ latitude: 0, longitude: 0, accuracy: 0 });

  const clockedIn = !!todayRecord?.clock_in;
  const clockedOut = !!todayRecord?.clock_out;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => stopCamera, []);
  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setPreviewing(false);
    setShowCamera(false);
  }

  async function startCamera() {
    setCamError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      setPreviewing(true);
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      setCamError("Camera unavailable. Allow camera access in your browser, or refresh the page.");
    }
  }

  function getPosition(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy }),
        () => reject(new Error("Location permission denied. Enable location access to clock in/out.")),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 1000 }
      );
    });
  }

  async function capturePhoto(): Promise<Blob> {
    const video = videoRef.current;
    if (!video || !video.videoWidth) throw new Error("Camera not ready. Please use the Clock In/Out without photo or retry.");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not capture photo"))), "image/jpeg", 0.85);
    });
  }

  async function submit(direction: "in" | "out") {
    let pos = posRef.current;
    if (!skipGeolocation) {
      setStage("locating");
      setMessage("Verifying your location...");
      try {
        pos = await getPosition();
        posRef.current = pos;
      } catch (e) {
        setStage("error");
        setMessage(e instanceof Error ? e.message : "Could not get your location.");
        return;
      }
    }

    if (direction === "in" && !showCamera) {
      setStage("idle");
      startCamera();
      toast.info("Camera started", { description: "Take a selfie to complete clock-in." });
      return;
    }

    setStage("busy");
    setMessage(direction === "in" ? "Taking your selfie and clocking you in..." : "Clocking you out...");

    let photoPath: string | null = null;
    if (showCamera) {
      try {
        const blob = await capturePhoto();
        const suffix = direction === "in" ? "in" : "out";
        const stamp = Date.now();
        const path = `attendance-photos/${userId}/${suffix}_${stamp}.jpg`;
        const supabase = await getBrowserClient();
        photoPath = await uploadToBucket(supabase, "attendance-photos", path, blob, "image/jpeg");
      } catch (e) {
        setStage("error");
        setMessage(e instanceof Error ? e.message : "Photo capture failed. Try again.");
        return;
      }
    }

    const action = direction === "in" ? actionClockIn : actionClockOut;
    const result = await action({
      photoPath: photoPath ?? "",
      ...pos,
    });
    if (result.success) {
      setStage("done");
      if (direction === "in") setShowCamera(false);
      setPreviewing(false);
      toast.success(direction === "in" ? "Clocked in!" : "Clocked out!");
      router.refresh();
      setTimeout(() => setStage("idle"), 2500);
    } else {
      setStage("error");
      setMessage(result.error ?? "Something went wrong. Try again.");
    }
  }

  function reset() {
    setStage("idle");
    setMessage("");
    setCamError("");
    stopCamera();
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
        <p className="text-xs font-medium uppercase tracking-widest text-blue-100">Today&apos;s Attendance</p>
        <div className="mt-1 flex items-center gap-3">
          <Timer className="h-8 w-8" />
          <span className="font-display text-4xl font-bold tabular-nums">
            {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
          </span>
        </div>
        <p className="mt-1 text-sm text-blue-100">
          {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Clock In</p>
            <p className="font-display text-lg font-bold">{formatTime(todayRecord?.clock_in)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Clock Out</p>
            <p className="font-display text-lg font-bold">{formatTime(todayRecord?.clock_out)}</p>
          </div>
        </div>

        {showCamera || previewing ? (
          <div className="overflow-hidden rounded-xl border bg-navy">
            <video ref={videoRef} playsInline muted className="aspect-video w-full object-cover" />
            {camError ? <p className="px-3 py-2 text-xs text-rose-300">{camError}</p> : null}
            <p className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-300">
              <Camera className="h-3.5 w-3.5" /> {clockedIn ? "Clock-out selfie" : "Clock-in selfie"} · Hold still
            </p>
          </div>
        ) : null}

        {stage === "error" ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="flex items-start gap-2 text-sm font-medium text-rose-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> {message}
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => (message.includes("Location") ? setStage("idle") : reset())}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
            </Button>
          </div>
        ) : null}

        {stage === "busy" || stage === "locating" ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-muted p-4 text-sm font-medium">
            <Loader2 className="h-4 w-4 animate-spin" /> {message}
          </div>
        ) : null}

        {stage === "done" ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> {clockedOut ? "Clock-out recorded" : "Clock-in recorded"} — see you soon!
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="gradient"
            size="lg"
            disabled={clockedIn || clockedOut || stage === "busy" || stage === "locating"}
            onClick={() => submit("in")}
          >
            <LogIn className="mr-2 h-4 w-4" /> Clock In
          </Button>
          <Button
            variant="outline"
            size="lg"
            disabled={!clockedIn || clockedOut || stage === "busy" || stage === "locating"}
            onClick={() => submit("out")}
          >
            <LogOut className="mr-2 h-4 w-4" /> Clock Out
          </Button>
        </div>

        {clockedIn && !clockedOut ? (
          <button onClick={startCamera} className="w-full text-center text-xs font-medium text-primary hover:underline">
            Re-open camera for clock-out selfie
          </button>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {!skipGeolocation ? (
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Live geolocation</span>
          ) : null}
          <span className="inline-flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> Photo verification</span>
        </div>
      </div>
    </div>
  );
}