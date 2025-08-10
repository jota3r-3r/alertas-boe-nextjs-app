// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // AÑADE ESTA NUEVA SECCIÓN PARA DESACTIVAR LA REGLA @typescript-eslint/no-explicit-any
  {
    // Aplica esta regla solo a archivos TypeScript/TSX
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Desactiva el error de 'any' explícito
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;

