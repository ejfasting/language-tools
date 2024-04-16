import esbuild from 'esbuild';
import console from 'node:console';
import process from 'node:process';
import path from 'path';

const production = process.argv[2] === '--production';
const watch = process.argv[2] === '--watch';

// Get the index of '--extension' flag in process.argv
const extensionIndex = process.argv.indexOf('--extension');
const extension = process.argv[extensionIndex + 1];

const entryPoint = path.resolve("packages", extension, 'src/extension.ts');
const outfile = path.resolve("packages", extension, 'dist/client.js');

let browserContext;

// Build web versions of the extension
// By using .context() instead of .build() we can rebuild in watch mode when the source changes
try {
    [browserContext] = await Promise.all([
        esbuild.context({
            entryPoints: [entryPoint], // the entry point of this extension, 📖 -> https://esbuild.github.io/api/#entry-points
            bundle: true,
            external: ['vscode'], // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be packaged, 📖 -> https://esbuild.github.io/api/#external
            sourcemap: !production,
            minify: production,
            target: 'ES2022', // VS Code 1.82 onwards will support ES2022, this also overrides tsconfig.json.
            outfile: outfile,
            platform: 'browser',
            format: 'cjs',
        })
    ]);
} catch (e) {
    console.error(e);
    process.exit(1);
}

if (watch) {
    //await desktopContext.watch();
    await browserContext.watch();
} else {
    //desktopContext.rebuild();
    browserContext.rebuild();

    //desktopContext.dispose();
    browserContext.dispose();
}