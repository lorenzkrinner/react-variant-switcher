import { VariantGroup, VariantOption, VariantProvider } from "react-variant-switcher";

const shellStyle = {
  maxWidth: "920px",
  margin: "0 auto",
  padding: "72px 24px 120px",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
};

const titleStyle = {
  margin: "0 0 12px",
  fontSize: "36px",
  fontWeight: 700,
  color: "#111827"
};

const descriptionStyle = {
  margin: "0 0 32px",
  color: "#4a5560"
};

const quoteBaseStyle = {
  background: "#fff",
  borderRadius: "18px",
  padding: "44px",
  border: "1px solid #dde3ea"
};

const quoteTextStyle = {
  margin: 0,
  fontSize: "38px",
  lineHeight: 1.1,
  fontWeight: 700,
  color: "#111827"
};

const citeStyle = {
  display: "block",
  marginTop: "20px",
  fontSize: "14px",
  color: "#59636e"
};

const ctaBaseStyle = {
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
  fontFamily: "inherit"
};

const ctaPillStyle = {
  ...ctaBaseStyle,
  background: "#18181b",
  color: "#fff",
  padding: "12px 32px",
  borderRadius: "9999px"
};

const ctaOutlineStyle = {
  ...ctaBaseStyle,
  background: "transparent",
  color: "#18181b",
  padding: "12px 32px",
  borderRadius: "9999px",
  border: "2px solid #18181b"
};

const ctaTextStyle = {
  ...ctaBaseStyle,
  background: "transparent",
  color: "#18181b",
  padding: 0
};

export function App() {
  return (
    <VariantProvider syncWithUrl>
      <div style={shellStyle}>
        <h1 style={titleStyle}>Quote Variants</h1>
        <p style={descriptionStyle}>Use the switcher at the bottom to compare design directions.</p>

        <VariantGroup name="quote" title="Quote block">
          <VariantOption id="centered" label="Centered quote">
            <section style={{ ...quoteBaseStyle, textAlign: "center" }}>
              <blockquote style={quoteTextStyle}>
                Clarity is a strategy. Restraint is a superpower.
              </blockquote>
              <cite style={citeStyle}>Design team memo</cite>
            </section>
          </VariantOption>

          <VariantOption id="left" label="Editorial quote">
            <section style={{ ...quoteBaseStyle, textAlign: "left" }}>
              <blockquote style={quoteTextStyle}>
                Clarity is a strategy. Restraint is a superpower.
              </blockquote>
              <cite style={citeStyle}>Design team memo</cite>
            </section>
          </VariantOption>

          <VariantOption id="framed" label="Framed quote">
            <section style={{ ...quoteBaseStyle, textAlign: "left", border: "4px solid #18181b" }}>
              <blockquote style={quoteTextStyle}>
                Clarity is a strategy. Restraint is a superpower.
              </blockquote>
              <cite style={citeStyle}>Design team memo</cite>
            </section>
          </VariantOption>
        </VariantGroup>

        <VariantGroup name="cta" title="Call to action">
          <VariantOption id="pill" label="Pill button">
            <div style={{ marginTop: 32 }}>
              <button style={ctaPillStyle}>Get started</button>
            </div>
          </VariantOption>

          <VariantOption id="outline" label="Outline button">
            <div style={{ marginTop: 32 }}>
              <button style={ctaOutlineStyle}>Get started</button>
            </div>
          </VariantOption>

          <VariantOption id="text" label="Text link">
            <div style={{ marginTop: 32 }}>
              <button style={ctaTextStyle}>Get started &rarr;</button>
            </div>
          </VariantOption>
        </VariantGroup>
      </div>
    </VariantProvider>
  );
}
