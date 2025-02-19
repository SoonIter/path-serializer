import { expect, test } from 'vitest';
import { transformCodeToPosixPath } from './transformCodeToPosixPath';

test('should serialize webpack dist', () => {
  const code = transformCodeToPosixPath(`
  ;// CONCATENATED MODULE: ../../../../node_modules/.pnpm/@swc+helpers@0.5.11/node_modules/@swc/helpers/esm/_class_private_method_get.js
function _class_private_method_get(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");

    return fn;
}
`);
  expect(code).toMatchInlineSnapshot(`
    "
      ;// CONCATENATED MODULE: ../../../../node_modules/.pnpm/@swc+helpers@0.5.11/node_modules/@swc/helpers/esm/_class_private_method_get.js
    function _class_private_method_get(receiver, privateSet, fn) {
        if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");

        return fn;
    }
    "
  `);
});

test('should serialize loader path', () => {
  const code = transformCodeToPosixPath(`
  {
      loader: 'D:\\Users\\user\\Documents\\code\\user\\fe-dev-scripts\\src\\utils.ts',
  }
  `);
  expect(code).toMatchInlineSnapshot(`
    "
      {
          loader: '/d/Users/user/Documents/code/user/fe-dev-scripts/src/utils.ts',
      }
      "
  `);
});
