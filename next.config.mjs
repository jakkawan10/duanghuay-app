// next.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
};

export default nextConfig;
