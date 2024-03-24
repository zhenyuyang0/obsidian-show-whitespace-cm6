import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules';
import { sassPlugin } from 'esbuild-sass-plugin'
import { config } from "dotenv";

config();

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === 'production');
const dir = prod || !process.env.OUTDIR ? "./" : process.env.OUTDIR;

const parameters = {
    banner: {
        js: banner,
    },
    entryPoints: ['src/main.ts', 'src/styles.scss'],
    bundle: true,
    external: [
        'obsidian',
        'electron',
        "codemirror",
        '@codemirror/language',
        '@codemirror/state',
        '@codemirror/view',
        ...builtins
    ],
    format: 'cjs',
    logLevel: 'info',
    target: 'es2020',
    treeShaking: true,
    sourcemap: prod ? false : 'inline',
    minify: prod,
    outdir: dir,
    plugins: [
        sassPlugin()
    ]
};

if (prod) {
    await esbuild.build(parameters).catch((x) => {
        if (x.errors) {
            console.error(x.errors);
        } else {
            console.error(x);
        }
        process.exit(1)
    });
} else {
    let ctx = await esbuild.context(parameters);
    await ctx.watch()
}
