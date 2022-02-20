/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
// import ffi from 'ffi-napi';
// import ref from 'ref-napi';
// import os from 'os';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

// const Void = ref.types.void;
// const Ptr = ref.refType(Void);

// export type WindowSize = {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   radiusX: number;
//   radiusY: number;
// };

// export const SetWindowRadius = (handle: Buffer) => {
//   const { SetWindowRgn } = ffi.Library('user32.dll', {
//     SetWindowRgn: ['pointer', ['int', Ptr, 'bool']],
//   });
//   const { CreateRoundRectRgn } = ffi.Library('gdi32.dll', {
//     CreateRoundRectRgn: [Ptr, ['int', 'int', 'int', 'int', 'int', 'int']],
//   });

//   SetWindowRgn(
//     os.endianness() === 'BE' ? handle.readInt32BE() : handle.readInt32LE(),
//     CreateRoundRectRgn(0, 0, 300, 300, 75, 75),
//     true
//   );
// };
