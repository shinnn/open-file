/*!
 * open-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/open-file
*/
'use strict';

const {inspect} = require('util');

const fsOpen = require('graceful-fs').open;

const PATH_ERROR = 'Expected a file path (string) to open and resolve its file descriptor';
const FLAG_ERROR = 'Expected valid file open flag, for example \'r\' & \'ax+\'';

module.exports = function openFile(filePath, flags, mode) {
  return new Promise((resolve, reject) => {
    if (typeof filePath !== 'string') {
      throw new TypeError(`${PATH_ERROR}, but got ${inspect(filePath)}.`);
    }

    if (filePath.length === 0) {
      throw new Error(`${PATH_ERROR.replace(' (string)', '')}, but got '' (empty string).`);
    }

    const typeOfFlags = typeof flags;

    if (typeOfFlags !== 'string' && typeOfFlags !== 'number') {
      throw new TypeError(`${FLAG_ERROR}, but got ${inspect(flags)}.`);
    }

    if (flags === '') {
      throw new Error(`${FLAG_ERROR}, but got '' (empty string).`);
    }

    fsOpen(filePath, flags, mode, (err, fileDescriptor) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(fileDescriptor);
    });
  });
};
