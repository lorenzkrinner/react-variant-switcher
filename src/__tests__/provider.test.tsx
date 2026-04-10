import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Option, VariantGroup, VariantProvider } from "../index";

describe("VariantProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("renders only the active option", () => {
    render(
      <VariantProvider>
        <VariantGroup id="hero">
          <Option id="a">
            <div data-testid="option-a">Option A</div>
          </Option>
          <Option id="b">
            <div data-testid="option-b">Option B</div>
          </Option>
        </VariantGroup>
      </VariantProvider>
    );

    expect(screen.getByTestId("option-a")).toBeInTheDocument();
    expect(screen.queryByTestId("option-b")).not.toBeInTheDocument();
  });

  it("hydrates active selection from localStorage", async () => {
    window.localStorage.setItem("test-key", JSON.stringify({ hero: "b" }));

    render(
      <VariantProvider storageKey="test-key">
        <VariantGroup id="hero">
          <Option id="a">
            <div data-testid="option-a">Option A</div>
          </Option>
          <Option id="b">
            <div data-testid="option-b">Option B</div>
          </Option>
        </VariantGroup>
      </VariantProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("option-b")).toBeInTheDocument();
    });
  });

  it("hydrates active selection from query params when syncWithUrl is on", async () => {
    window.history.replaceState(null, "", "/?rvs_hero=b");

    render(
      <VariantProvider syncWithUrl>
        <VariantGroup id="hero">
          <Option id="a">
            <div data-testid="option-a">Option A</div>
          </Option>
          <Option id="b">
            <div data-testid="option-b">Option B</div>
          </Option>
        </VariantGroup>
      </VariantProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("option-b")).toBeInTheDocument();
    });
  });
});
