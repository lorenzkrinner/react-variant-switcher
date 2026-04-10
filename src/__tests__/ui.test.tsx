import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { VariantGroup, VariantOption, VariantProvider } from "../index";

describe("VariantSwitcher UI", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("cycles options with switcher buttons", async () => {
    const user = userEvent.setup();

    render(
      <VariantProvider>
        <VariantGroup name="hero">
          <VariantOption id="left" label="Left">
            <div data-testid="left-variant">Left</div>
          </VariantOption>
          <VariantOption id="center" label="Centered quote">
            <div data-testid="center-variant">Centered quote</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    await user.click(screen.getByLabelText("Next variant"));
    expect(screen.getByTestId("center-variant")).toBeInTheDocument();
    expect(screen.getByText("2/2")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Previous variant"));
    expect(screen.getByTestId("left-variant")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("supports keyboard arrows and visibility toggle shortcut", async () => {
    const user = userEvent.setup();

    render(
      <VariantProvider>
        <VariantGroup name="hero">
          <VariantOption id="v1">
            <div data-testid="v1-variant">V1</div>
          </VariantOption>
          <VariantOption id="v2">
            <div data-testid="v2-variant">V2</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(screen.getByTestId("v2-variant")).toBeInTheDocument();

    await user.keyboard("{Meta>}h{/Meta}");
    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "Variant switcher" })).not.toBeInTheDocument();
    });

    await user.keyboard("{Meta>}h{/Meta}");
    await waitFor(() => {
      expect(screen.getByRole("region", { name: "Variant switcher" })).toBeInTheDocument();
    });
  });

  it("cycles groups with Alt+S and confirms on Alt release", async () => {
    render(
      <VariantProvider>
        <VariantGroup name="Hero">
          <VariantOption id="h1" label="H1">
            <div data-testid="hero-h1">H1</div>
          </VariantOption>
        </VariantGroup>
        <VariantGroup name="CTA">
          <VariantOption id="c1" label="C1">
            <div data-testid="cta-c1">C1</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    const altSDown = new KeyboardEvent("keydown", {
      key: "s",
      code: "KeyS",
      altKey: true,
      bubbles: true,
    });
    window.dispatchEvent(altSDown);

    await waitFor(() => {
      expect(screen.getByRole("listbox", { name: "Switch group" })).toBeInTheDocument();
    });

    const altUp = new KeyboardEvent("keyup", {
      key: "Alt",
      code: "AltLeft",
      bubbles: true,
    });
    window.dispatchEvent(altUp);

    await waitFor(() => {
      expect(screen.queryByRole("listbox", { name: "Switch group" })).not.toBeInTheDocument();
    });
  });

  it("appends URL param after changing selection", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/");

    render(
      <VariantProvider syncWithUrl>
        <VariantGroup name="hero">
          <VariantOption id="v1">
            <div data-testid="v1-variant">V1</div>
          </VariantOption>
          <VariantOption id="v2">
            <div data-testid="v2-variant">V2</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    expect(window.location.search).toBe("");

    await user.click(screen.getByLabelText("Next variant"));
    await waitFor(() => {
      expect(window.location.search).toBe("?hero=v2");
    });
  });
});
