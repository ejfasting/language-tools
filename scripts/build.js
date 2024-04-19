require('esbuild').context({
	entryPoints: {
		client: '../packages/superoffice-vscode-client/src/client.ts',
		server: '../packages/superoffice-vscode-languageserver/src/server.ts',
	},
	sourcemap: true,
	bundle: true,
	metafile: process.argv.includes('--metafile'),
	outdir: '../packages/superoffice-vscode-client/dist',
	external: ['vscode'],
	format: 'cjs',
	platform: 'node',
	tsconfig: '../packages/superoffice-vscode-client/tsconfig.json',
	define: { 'process.env.NODE_ENV': '"production"' },
	minify: process.argv.includes('--minify'),
	plugins: [
		{
			name: 'umd2esm',
			setup(build) {
				build.onResolve({ filter: /^(vscode-.*-languageservice|jsonc-parser)/ }, args => {
					const pathUmdMay = require.resolve(args.path, { paths: [args.resolveDir] });
					// Call twice the replace is to solve the problem of the path in Windows
					const pathEsm = pathUmdMay.replace('/umd/', '/esm/').replace('\\umd\\', '\\esm\\');
					return { path: pathEsm };
				});
			},
		},
	],
}).then(async ctx => {
	console.log('building...');
	if (process.argv.includes('--watch')) {
		await ctx.watch();
		console.log('watching...');
	} else {
		await ctx.rebuild();
		await ctx.dispose();
		console.log('finished.');
	}
});