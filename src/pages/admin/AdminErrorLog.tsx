import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, RefreshCw, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorEntry {
  id: string;
  timestamp: string;
  message: string;
  source?: string;
  stack?: string;
  type: "error" | "unhandledrejection" | "network";
}

const AdminErrorLog = () => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const addError = useCallback((entry: Omit<ErrorEntry, "id" | "timestamp">) => {
    setErrors((prev) => [
      { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
      ...prev,
    ].slice(0, 100));
  }, []);

  useEffect(() => {
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      origError.apply(console, args);
      const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ");
      addError({ message: msg, type: "error", source: "console.error" });
    };

    const handleError = (e: ErrorEvent) => {
      addError({ message: e.message, stack: e.error?.stack, type: "error", source: `${e.filename}:${e.lineno}` });
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = e.reason instanceof Error ? e.reason.message : String(e.reason);
      const stack = e.reason instanceof Error ? e.reason.stack : undefined;
      addError({ message: msg, stack, type: "unhandledrejection", source: "Promise" });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.error = origError;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [addError]);

  const typeColors: Record<string, string> = {
    error: "bg-red-100 text-red-800",
    unhandledrejection: "bg-orange-100 text-orange-800",
    network: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Error Monitoring</h1>
          <p className="mt-1 text-xs text-muted-foreground">Live-Fehlererkennung im Admin-Bereich</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-none text-xs" onClick={() => setErrors([])}>
            <Trash2 className="mr-1 h-3 w-3" /> Leeren
          </Button>
          <Button variant="outline" size="sm" className="rounded-none text-xs" onClick={() => addError({ message: "Test-Error: Dies ist ein Testfehler.", type: "error", source: "Admin UI" })}>
            <RefreshCw className="mr-1 h-3 w-3" /> Test-Error
          </Button>
        </div>
      </div>

      {errors.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
          <p className="mt-4 text-sm text-muted-foreground">Keine Fehler erkannt</p>
          <p className="mt-1 text-xs text-muted-foreground">Fehler werden hier in Echtzeit angezeigt</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {errors.map((err) => (
            <div key={err.id} className="border border-border">
              <button
                onClick={() => setExpanded(expanded === err.id ? null : err.id)}
                className="flex w-full items-start gap-3 p-3 text-left hover:bg-muted/50"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${typeColors[err.type] || "bg-muted text-muted-foreground"}`}>
                      {err.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(err.timestamp).toLocaleTimeString("de-DE")}
                    </span>
                    {err.source && <span className="text-[10px] text-muted-foreground">· {err.source}</span>}
                  </div>
                  <p className="mt-1 truncate text-xs text-foreground">{err.message}</p>
                </div>
                {err.stack && (expanded === err.id ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />)}
              </button>
              {expanded === err.id && err.stack && (
                <pre className="max-h-48 overflow-auto border-t border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
                  {err.stack}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminErrorLog;
