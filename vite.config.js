import { defineConfig } from 'vite';

// The built file is consumed unbundled from node_modules, where gluonjs is a
// sibling package. Keep it external and rewrite the import to a relative path.
export default defineConfig({
  publicDir: false,
  build: {
    outDir: '.',
    emptyOutDir: false,
    sourcemap: true,
    minify: true,
    lib: {
      entry: 'src/overwebs-background-data.js',
      formats: ['es'],
      fileName: () => 'overwebs-background-data.js'
    },
    rollupOptions: {
      external: ['gluonjs/gluon.js'],
      output: {
        paths: { 'gluonjs/gluon.js': '../gluonjs/gluon.js' }
      }
    }
  }
});
