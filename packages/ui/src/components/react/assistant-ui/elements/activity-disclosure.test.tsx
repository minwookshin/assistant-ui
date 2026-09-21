import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActivityDisclosure, type ActivityStatus } from "./activity-disclosure";

afterEach(cleanup);

function Run({
  status = "running",
  label = "Working",
  latest = "Reading sources",
  duration = "12s",
}: {
  status?: ActivityStatus;
  label?: string;
  latest?: string;
  duration?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ActivityDisclosure
        status={status}
        statusLabel={label}
        durationLabel={duration}
        latestActivity={latest}
        open={open}
        onOpenChange={setOpen}
        attention={<button type="button">Approve search</button>}
      >
        <a href="#source">Read source</a>
        <p>Public tool activity</p>
      </ActivityDisclosure>
      <p>Final answer stays here</p>
    </>
  );
}

describe("ActivityDisclosure proposal", () => {
  it("keeps activity compact while approval and answer remain available", () => {
    render(<Run />);
    expect(
      screen
        .getByRole("button", { name: "Working 12s" })
        .getAttribute("aria-expanded"),
    ).toBe("false");
    expect(screen.queryByRole("link", { name: "Read source" })).toBeNull();
    expect(screen.getByRole("button", { name: "Approve search" })).toBeTruthy();
    expect(screen.getByText("Final answer stays here")).toBeTruthy();
    expect(screen.getByText("Reading sources")).toBeTruthy();
  });

  it("preserves explicit expansion across streamed updates and completion", () => {
    const { rerender } = render(<Run />);
    fireEvent.click(screen.getByRole("button", { name: "Working 12s" }));
    const link = screen.getByRole("link", { name: "Read source" });
    link.focus();
    rerender(<Run latest="Checking results" duration="20s" />);
    expect(document.activeElement).toBe(link);
    rerender(<Run status="completed" label="Worked for" duration="24s" />);
    expect(
      screen
        .getByRole("button", { name: "Worked for 24s" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    expect(document.activeElement).toBe(link);
  });

  it("respects manual collapse when new activity arrives", () => {
    const { rerender } = render(<Run />);
    const trigger = screen.getByRole("button", { name: "Working 12s" });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    rerender(<Run latest="Searching again" />);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("Searching again")).toBeTruthy();
  });

  it.each([
    ["awaiting-input", "Needs your input"],
    ["failed", "Failed"],
    ["cancelled", "Stopped"],
  ] as const)(
    "exposes %s independently of disclosure state",
    (status, label) => {
      render(<Run status={status} label={label} />);
      expect(screen.getByRole("status").textContent).toBe(label);
      expect(
        screen.getByRole("button", { name: "Approve search" }),
      ).toBeTruthy();
    },
  );

  it("does not announce every elapsed second or streamed activity fragment", () => {
    const { rerender } = render(<Run />);
    const announcement = screen.getByRole("status");
    rerender(<Run latest="A new token" duration="13s" />);
    expect(announcement.textContent).toBe("Working");
  });

  it("uses persisted duration without restarting a clock on remount", () => {
    const { unmount } = render(
      <Run status="completed" label="Worked for" duration="2m 14s" />,
    );
    unmount();
    render(<Run status="completed" label="Worked for" duration="2m 14s" />);
    expect(
      screen.getByRole("button", { name: "Worked for 2m 14s" }),
    ).toBeTruthy();
  });

  it("reports user intent through the existing controlled disclosure API", () => {
    const onOpenChange = vi.fn();
    render(
      <ActivityDisclosure
        status="running"
        statusLabel="작업 중"
        open={false}
        onOpenChange={onOpenChange}
      >
        <p>기록</p>
      </ActivityDisclosure>,
    );
    fireEvent.click(screen.getByRole("button", { name: "작업 중" }));
    expect(onOpenChange.mock.calls.map(([open]) => open)).toEqual([true]);
  });
});
