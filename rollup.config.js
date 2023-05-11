import dts from 'rollup-plugin-dts';

const watchFiles = ['lib/**'];

export default [
  {
    input: 'lib/mapbox-gl-entities.js',
    output: {
      file: 'dist/mapbox-gl-entities.js',
      sourcemap: true,
      format: 'es',
      name: 'MapboxGLEntities',
    },
    watch: {
      include: watchFiles,
    },
  },
  {
    input: './lib/mapbox-gl-entities.d.ts',
    output: {
      file: 'dist/mapbox-gl-entities.d.ts',
      format: 'es',
      name: 'MapboxGLEntities',
    },
    plugins: [dts()],
  },
];
