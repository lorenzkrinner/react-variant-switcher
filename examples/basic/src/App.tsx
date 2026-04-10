import { Option, VariantGroup, VariantProvider } from "react-variant-switcher";

export function App() {
  return (
    <VariantProvider syncWithUrl>
      <div className="shell">
        <h1>Quote Variants</h1>
        <p>Use the switcher at the bottom to compare design directions.</p>

        <VariantGroup id="quote" title="Quote block">
          <Option id="centered" label="Centered quote">
            <section className="quote quote--center">
              <blockquote>
                Clarity is a strategy. Restraint is a superpower.
              </blockquote>
              <cite>Design team memo</cite>
            </section>
          </Option>

          <Option id="left" label="Editorial quote">
            <section className="quote quote--left">
              <blockquote>
                Clarity is a strategy. Restraint is a superpower.
              </blockquote>
              <cite>Design team memo</cite>
            </section>
          </Option>

          <Option id="framed" label="Framed quote">
            <section className="quote quote--framed">
              <blockquote>
                Clarity is a strategy. Restraint is a superpower.
              </blockquote>
              <cite>Design team memo</cite>
            </section>
          </Option>
        </VariantGroup>
      </div>
    </VariantProvider>
  );
}
