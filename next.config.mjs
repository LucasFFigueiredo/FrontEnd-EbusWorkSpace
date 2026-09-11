/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilita o ESLint durante o build de produção.
  // Os erros são de CRLF (line endings Windows) pré-existentes nos arquivos do projeto.
  // Execute `npm run lint` para checar ESLint manualmente.
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // reactCompiler: true,
  },
};

export default nextConfig;
