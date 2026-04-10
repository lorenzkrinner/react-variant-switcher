import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const css = execSync(
  "pnpm dlx @tailwindcss/cli -i src/styles.css --minify",
  { encoding: "utf-8" }
);

mkdirSync("dist", { recursive: true });
writeFileSync("dist/styles.css", css);
