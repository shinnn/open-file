'use strict';

const openFile = require('.');
const test = require('tape');

test('openFile()', t => {
  t.plan(10);

  openFile(__filename, 'r').then(fd => {
    t.ok(Number.isSafeInteger(fd), 'should resolve with a file descriptor.');
  })
  .catch(t.fail);

  openFile().then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected 2 or 3 arguments (path: <string>, flags: <string> | <integer>[, mode: <integer>]), ' +
      'but got no arguments.',
      'should fail when it takes no arguments.'
    );
  });

  openFile('0', 1, 2, 3).then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected 2 or 3 arguments (path: <string>, flags: <string> | <integer>[, mode: <integer>]), ' +
      'but got 4 arguments.',
      'should fail when it takes too many arguments.'
    );
  });

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
      'Expected a file path to open and resolve its file descriptor, but got \'\' (empty string).',
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
      'Expected valid file open flag, for example \'r\' & \'ax+\', but got [ \'foo\' ] (array).',
      'should fail when it takes invalid type flags.'
    );
  });

  openFile(__filename, '').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected valid file open flag, for example \'r\' & \'ax+\', but got \'\' (empty string).',
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
