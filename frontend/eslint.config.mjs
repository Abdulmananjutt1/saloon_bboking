import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Async data fetchers in effects are valid — this rule is too aggressive
      // for patterns like useEffect(() => { fetchData(); }, [fetchData])
      "react-hooks/set-state-in-effect": "off",
      // Static components extracted outside render functions are handled
      "react-hooks/static-components": "off",
    },
  },
]);

export default eslintConfig;
