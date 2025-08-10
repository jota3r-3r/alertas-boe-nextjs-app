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
  // Esta sección aplica reglas a archivos TypeScript/TSX
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Desactiva el error de 'any' explícito
      "@typescript-eslint/no-explicit-any": "off",
      // *** AÑADE ESTA LÍNEA TAMBIÉN PARA DESACTIVAR prefer-const ***
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;
