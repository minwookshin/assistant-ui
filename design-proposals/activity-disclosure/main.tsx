import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ActivityDisclosure,
  type ActivityStatus,
} from "../../packages/ui/src/components/react/assistant-ui/elements/activity-disclosure";
import { Button } from "../../packages/ui/src/components/react/ui/base/button";
import "../../apps/registry/app/globals.css";

const labels: Record<ActivityStatus, string> = {
  running: "Working",
  "awaiting-input": "Needs your input",
  completed: "Worked for",
  failed: "Search failed",
  cancelled: "Stopped",
};

function App() {
  const [status, setStatus] = useState<ActivityStatus>("running");
  const [open, setOpen] = useState(false);
  const [latest, setLatest] = useState("Checking the API reference");
  const [dark, setDark] = useState(false);
  const [duration, setDuration] = useState("12s");
  return (
    <div className={dark ? "dark" : ""}>
      <main className="bg-background text-foreground min-h-screen px-5 py-12 sm:px-10">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <header className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Interaction proposal · assistant-ui #7527
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Progress you can inspect
            </h1>
            <p className="text-muted-foreground text-sm">
              A compact activity row, with decisions and the answer always in
              reach.
            </p>
          </header>
          <section
            aria-label="Conversation"
            className="border-border rounded-xl border p-5 sm:p-7"
          >
            <p className="mb-8 font-medium">Which API change should we ship?</p>
            <ActivityDisclosure
              status={status}
              statusLabel={labels[status]}
              durationLabel={duration}
              latestActivity={status === "running" ? latest : undefined}
              open={open}
              onOpenChange={setOpen}
              attention={
                status === "awaiting-input" ? (
                  <div className="border-border mt-2 rounded-lg border p-4">
                    <p className="mb-3 text-sm">
                      Search the public issue tracker to check for duplicates?
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => setStatus("running")}>
                        Allow once
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setStatus("cancelled")}
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                ) : status === "failed" ? (
                  <div className="flex items-center gap-3">
                    <p className="text-sm">
                      The source could not be reached. Your draft is saved.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStatus("running")}
                    >
                      Retry
                    </Button>
                  </div>
                ) : undefined
              }
            >
              <ol className="text-muted-foreground space-y-3 text-sm">
                <li>Read the current API reference</li>
                <li>
                  <a
                    href="#source"
                    className="text-foreground underline underline-offset-4"
                  >
                    Inspect the source
                  </a>
                </li>
                <li>{latest}</li>
              </ol>
            </ActivityDisclosure>
            {status === "completed" && (
              <article
                aria-label="Final answer"
                className="mt-7 space-y-3 text-sm leading-relaxed"
              >
                <p className="font-medium">
                  Ship the narrow, backward-compatible API first.
                </p>
                <p>
                  Keep the current default, document the new option, and add a
                  regression test for runtime updates.
                </p>
              </article>
            )}
          </section>
          <section aria-label="Scenario controls" className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Explore the states. Changing state preserves your disclosure
              choice.
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(labels) as ActivityStatus[]).map((value) => (
                <Button
                  key={value}
                  variant={status === value ? "default" : "outline"}
                  aria-pressed={status === value}
                  onClick={() => setStatus(value)}
                >
                  {value}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setLatest(
                    "Compared the current implementation with the proposed API",
                  );
                  setDuration("24s");
                }}
              >
                Receive activity
              </Button>
              <Button variant="outline" onClick={() => setDark(!dark)}>
                Toggle theme
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Scripted states; no model or backend is connected. Duration is
              supplied by the caller.
            </p>
          </section>
          <footer id="source" className="text-muted-foreground text-sm">
            Public activity only. No private model reasoning is inferred or
            displayed.
          </footer>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
