import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { VariantGroup, VariantOption, VariantProvider } from "../index";

describe("VariantProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("renders only the active option", () => {
    render(
      <VariantProvider>
        <VariantGroup name="hero">
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b">
            <div data-testid="option-b">Option B</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    expect(screen.getByTestId("option-a")).toBeInTheDocument();
    expect(screen.queryByTestId("option-b")).not.toBeInTheDocument();
  });

  it("persists active selection to localStorage after user change", async () => {
    render(
      <VariantProvider>
        <VariantGroup name="hero">
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b">
            <div data-testid="option-b">Option B</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    screen.getByLabelText("Next variant").click();

    await waitFor(() => {
      const storedValue = window.localStorage.getItem("react_variant_switcher_config");
      expect(storedValue).not.toBeNull();
      if (!storedValue) {
        return;
      }

      const parsedValue = JSON.parse(storedValue) as Record<string, string>;
      expect(Object.values(parsedValue)).toContain("b");
    });
  });

  it("hydrates active selection from query params when syncWithUrl is on", async () => {
    window.history.replaceState(null, "", "/?hero=b");

    render(
      <VariantProvider syncWithUrl>
        <VariantGroup name="hero">
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b">
            <div data-testid="option-b">Option B</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("option-b")).toBeInTheDocument();
    });
  });

  it("uses option default flag before falling back to first option", () => {
    render(
      <VariantProvider>
        <VariantGroup name="hero">
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b" default>
            <div data-testid="option-b">Option B</div>
          </VariantOption>
          <VariantOption id="c">
            <div data-testid="option-c">Option C</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    expect(screen.getByTestId("option-b")).toBeInTheDocument();
    expect(screen.queryByTestId("option-a")).not.toBeInTheDocument();
    expect(screen.queryByTestId("option-c")).not.toBeInTheDocument();
  });

  it("does not auto-populate URL params on initial render", () => {
    render(
      <VariantProvider syncWithUrl>
        <VariantGroup name="hero">
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b">
            <div data-testid="option-b">Option B</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    expect(window.location.search).toBe("");
  });

  it("renders only the default option when provider is disabled", () => {
    render(
      <VariantProvider disabled>
        <VariantGroup name="hero">
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b" default>
            <div data-testid="option-b">Option B</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    expect(screen.getByTestId("option-b")).toBeInTheDocument();
    expect(screen.queryByTestId("option-a")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Variant switcher" })).not.toBeInTheDocument();
  });

  it("renders only the default option when a group is disabled", () => {
    render(
      <VariantProvider>
        <VariantGroup name="hero" disabled>
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b" default>
            <div data-testid="option-b">Option B</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    expect(screen.getByTestId("option-b")).toBeInTheDocument();
    expect(screen.queryByTestId("option-a")).not.toBeInTheDocument();
  });

  it("does not render a disabled option", () => {
    render(
      <VariantProvider>
        <VariantGroup name="hero">
          <VariantOption id="a">
            <div data-testid="option-a">Option A</div>
          </VariantOption>
          <VariantOption id="b" disabled>
            <div data-testid="option-b">Option B</div>
          </VariantOption>
        </VariantGroup>
      </VariantProvider>
    );

    expect(screen.getByTestId("option-a")).toBeInTheDocument();
    expect(screen.queryByTestId("option-b")).not.toBeInTheDocument();
  });
});
