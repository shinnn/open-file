/*!
 * open-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/open-file
*/
'use strict';

var inspect = require('util').inspect;

var fs = require('graceful-fs');
var PinkiePromise = require('pinkie-promise');

var PATH_ERROR = 'Expected a file path (string) to open and resolve its file descriptor';
var FLAG_ERROR = 'Expected valid file open flag, for example \'r\' & \'ax+\'';

module.exports = function openFile(filePath, flags, mode) {
  if (typeof filePath !== 'string') {
    return PinkiePromise.reject(new TypeError(PATH_ERROR + ', but got ' + inspect(filePath) + '.'));
  }

  if (filePath.length === 0) {
    return PinkiePromise.reject(new Error(PATH_ERROR + ', but got an empty string.'));
  }

  var typeOfFlags = typeof flags;

  if (typeOfFlags !== 'string' && typeOfFlags !== 'number') {
    return PinkiePromise.reject(new TypeError(FLAG_ERROR + ', but got ' + inspect(flags) + '.'));
  }

  if (flags === '') {
    return PinkiePromise.reject(new Error(FLAG_ERROR + ', but got an empty string.'));
  }

  return new PinkiePromise((resolve, reject) => {
    fs.open(filePath, flags, mode, (err, fileDescriptor) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(fileDescriptor);
    });
  });
};
