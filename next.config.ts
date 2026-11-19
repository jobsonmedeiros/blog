import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/livros/**': ['./data/darby/originais/*.txt'],
    '/admin/livros/**': ['./data/darby/originais/*.txt'],
    '/api/livros/**': ['./data/darby/originais/*.txt'],
  },
  outputFileTracingExcludes: {
    '/*': ['./data/darby/artigos/**/*', './data/darby/livros/**/*'],
  },
};

export default nextConfig;
