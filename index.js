/*!
 * open-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/open-file
*/
'use strict';

const inspect = require('util').inspect;

const fs = require('graceful-fs');

const PATH_ERROR = 'Expected a file path (string) to open and resolve its file descriptor';
const FLAG_ERROR = 'Expected valid file open flag, for example \'r\' & \'ax+\'';

module.exports = function openFile(filePath, flags, mode) {
  if (typeof filePath !== 'string') {
    return Promise.reject(new TypeError(`${PATH_ERROR}, but got ${inspect(filePath)}.`));
  }

  if (filePath.length === 0) {
    return Promise.reject(new Error(`${PATH_ERROR.replace(' (string)', '')}, but got '' (empty string).`));
  }

  const typeOfFlags = typeof flags;

  if (typeOfFlags !== 'string' && typeOfFlags !== 'number') {
    return Promise.reject(new TypeError(`${FLAG_ERROR}, but got ${inspect(flags)}.`));
  }

  if (flags === '') {
    return Promise.reject(new Error(`${FLAG_ERROR}, but got '' (empty string).`));
  }

  return new Promise((resolve, reject) => {
    fs.open(filePath, flags, mode, (err, fileDescriptor) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(fileDescriptor);
    });
  });
};
