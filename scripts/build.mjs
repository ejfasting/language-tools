import esbuild from 'esbuild';
import console from 'node:console';
import process from 'node:process';

const production = process.argv[2] === '--production';
const watch = process.argv[2] === '--watch';
let desktopContext, browserContext, serverContext;

// This is the base config that will be used by both web and desktop versions of the extension
const baseConfig = {
    entryPoints: ['./clients/vscode/src/extension.ts'], // the entry point of this extension, 📖 -> https://esbuild.github.io/api/#entry-points
    bundle: true,
    external: ['vscode'], // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be packaged, 📖 -> https://esbuild.github.io/api/#external
    sourcemap: !production,
    minify: production,
    target: 'ES2022', // VS Code 1.82 onwards will support ES2022, this also overrides tsconfig.json.
};

// Build both desktop and web versions of the extension in parallel
// By using .context() instead of .build() we can rebuild in watch mode when the source changes
try {
    [browserContext, serverContext] = await Promise.all([
        // https://esbuild.github.io/getting-started/#bundling-for-node
        // esbuild.context({
        //     ...baseConfig,
        //     entryPoints: ['./clients/vscode/src/extension.ts'], // the entry point of this extension, 📖 -> https://esbuild.github.io/api/#entry-points
        //     outfile: './clients/vscode/dist/extension.js',
        //     platform: 'node',
        // }),
        // If you're building for the browser, you'll need to generate a second bundle which is suitable
        // https://esbuild.github.io/getting-started/#bundling-for-the-browser
        esbuild.context({
            ...baseConfig,
            entryPoints: ['./clients/vscode/src/extension.ts'], // the entry point of this extension, 📖 -> https://esbuild.github.io/api/#entry-points
            outfile: './clients/vscode/dist/client.js',
            platform: 'browser',
            format: 'cjs',
        }),
        esbuild.context({
            ...baseConfig,
            entryPoints: ['./server/src/server.ts'], // the entry point of this extension, 📖 -> https://esbuild.github.io/api/#entry-points
            outfile: './clients/vscode/dist/server.js',
            platform: 'browser',
            format: 'cjs',
        }),
    ]);
} catch (e) {
    console.error(e);
    process.exit(1);
}

if (watch) {
    //await desktopContext.watch();
    await browserContext.watch();
    await serverContext.watch();
} else {
    //desktopContext.rebuild();
    browserContext.rebuild();
    serverContext.rebuild();

    //desktopContext.dispose();
    browserContext.dispose();
    serverContext.dispose();
}