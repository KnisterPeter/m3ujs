module.exports = function(wallaby) {
  return {
    files: [
      'src/**/*.ts',
      {pattern: 'test/**/*.mp3', instrument: false}
    ],
    tests: [
      'test/**/*-test.ts'
    ],
    env: {
      type: 'node'
    },
    debug: false
  };
}
