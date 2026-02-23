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
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,        // allow devtools
            debugProtectionInterval: 0,    // allow devtools
            disableConsoleOutput: false,   // allow devtools / console
            identifierNamesGenerator: "hexadecimal",
            log: false,
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: false,
            simplify: true,
            splitStrings: false,
            stringArray: true,
            stringArrayCallsTransform: false,
            stringArrayEncoding: ["base64"],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: "variable",
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false,
          },
          []
        )
      );
    }

    return config;
  },
};

export default nextConfig;
