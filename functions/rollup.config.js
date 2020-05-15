import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default () => {
  return {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        typescript: require('typescript'),
      }),
      babel({
        exclude: ['node_modules/**'],
      }),
      terser({
        output: {
          comments: /^!/,
        },
      }),
    ],
  };
};
