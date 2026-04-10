import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Option, VariantGroup, VariantProvider } from "../index";

describe("VariantSwitcher UI", () => {
  it("cycles options with switcher buttons", async () => {
    const user = userEvent.setup();

    render(
      <VariantProvider>
        <VariantGroup id="hero">
          <Option id="left" label="Left">
            <div data-testid="left-variant">Left</div>
          </Option>
          <Option id="center" label="Centered quote">
            <div data-testid="center-variant">Centered quote</div>
          </Option>
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
        <VariantGroup id="hero">
          <Option id="v1">
            <div data-testid="v1-variant">V1</div>
          </Option>
          <Option id="v2">
            <div data-testid="v2-variant">V2</div>
          </Option>
        </VariantGroup>
      </VariantProvider>
    );

    await user.keyboard("{ArrowRight}");
    expect(screen.getByTestId("v2-variant")).toBeInTheDocument();

    await user.keyboard("{Shift>}v{/Shift}");
    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "Variant switcher" })).not.toBeInTheDocument();
    });

    await user.keyboard("{Shift>}v{/Shift}");
    await waitFor(() => {
      expect(screen.getByRole("region", { name: "Variant switcher" })).toBeInTheDocument();
    });
  });
});
