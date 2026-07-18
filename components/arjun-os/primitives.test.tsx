import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WindowControls } from "./primitives";

describe("WindowControls", () => {
  it("exposes and invokes every window action from the keyboard", async () => {
    const user = userEvent.setup();
    const onMinimize = vi.fn();
    const onMaximize = vi.fn();
    const onClose = vi.fn();

    render(createElement(WindowControls, { onMinimize, onMaximize, onClose }));

    await user.click(screen.getByRole("button", { name: "Minimize" }));
    await user.click(screen.getByRole("button", { name: "Maximize" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onMinimize).toHaveBeenCalledOnce();
    expect(onMaximize).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
