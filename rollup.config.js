import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';


export default [{
  input: 'dist/index.js',
  output: {
    name: "BackendFaker",
    file: "dist/njkremer-backendFaker.min.js",
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    minify({ comments: false })
  ]
}]