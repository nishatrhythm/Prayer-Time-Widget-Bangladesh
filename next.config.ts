import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebpackObfuscator = require("webpack-obfuscator");

const nextConfig: NextConfig = {
  // keep webpack for production so our custom webpack() callback runs
  // disable browser source maps to prevent easy deobfuscation via maps
  productionBrowserSourceMaps: false,
  webpack(config, { isServer, dev }) {
    // Obfuscate JS in production client-side builds only
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator(
          {
            compact: true,
            controlFlowFlattening: true,
            deadCodeInjection: true,
            debugProtection: false,        // keep false to allow devtools
            debugProtectionInterval: 0,    // keep 0 to allow devtools
            disableConsoleOutput: false,   // keep false to allow console
            identifierNamesGenerator: "hexadecimal",
            log: false,
            numbersToExpressions: true,
            renameGlobals: true,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: ["base64"],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 4,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: "function",
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: true,
          },
          []
        )
      );
    }

    return config;
  },
};

export default nextConfig;
