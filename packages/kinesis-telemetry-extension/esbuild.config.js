import { build } from "esbuild";
const basePath = process.env.EXTENSION_NAME;
const bundledPath = "./build";

const AllEntries = [];
AllEntries.push(`${basePath}/index.ts`);


build({
    entryPoints: AllEntries,
    entryNames: `[dir]/[name]`,
    outbase:'.',
    bundle: true,
    minify: process.env.NODE_ENV === "dev" ? false : true,
    sourcemap: false,
    outdir: `${bundledPath}`,
    platform: 'node',
    treeShaking: true,
    write: true,
    external: []
}).catch(() => process.exit());
