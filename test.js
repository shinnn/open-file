'use strict';

const openFile = require('.');
const test = require('tape');

test('openFile()', t => {
  t.plan(8);

  openFile(__filename, 'r').then(fd => {
    t.ok(Number.isSafeInteger(fd), 'should resolve with a file descriptor.');
  })
  .catch(t.fail);

  openFile(Buffer.from('Hi'), 'w').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected a file path (string) to open and resolve its file descriptor, but got <Buffer 48 69>.',
      'should fail when the first argument is not a string.'
    );
  });

  openFile('', 'wx').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected a file path (string) to open and resolve its file descriptor, but got an empty string.',
      'should fail when the first argument is an empty string.'
    );
  });

  openFile(__filename, '???').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Unknown file open flag: ???',
      'should fail when it takes unknown flags.'
    );
  });

  openFile(__filename, ['foo']).then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected valid file open flag, for example \'r\' & \'ax+\', but got [ \'foo\' ].',
      'should fail when it takes invalid type flags.'
    );
  });

  openFile(__filename, '').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected valid file open flag, for example \'r\' & \'ax+\', but got an empty string.',
      'should fail when the second argument is an empty string.'
    );
  });

  openFile(__filename, 'a', 0.1).then(t.fail, err => {
    t.strictEqual(
      err.message,
      'mode must be an int',
      'should fail when it takes invalid mode.'
    );
  });

  openFile('this_file_does_not_exist', 0).then(t.fail, err => {
    t.strictEqual(err.code, 'ENOENT', 'should fail when it cannot open the file.');
  });
});
