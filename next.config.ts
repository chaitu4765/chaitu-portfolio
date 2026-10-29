import type { NextConfig } from 'next';
const config: NextConfig = { output: 'export', outputFileTracingRoot: process.cwd(), trailingSlash: true };
export default config;
