'use strict';
const fs = require('fs')
const zmq = require('zeromq');
const Tail = require('tail').Tail;
const yml = require('js-yaml');


const CONFIG_PATH = 'config/cyrin.yml'
const config = yml.safeLoad(fs.readFileSync(CONFIG_PATH, 'utf-8'));

const logfiles = config.logfiles;

const regex = /ERR|err|WARN|warn|fail|incorrect/;

const publisher = zmq.socket('pub');

const setLevel = data => {
  const error_re = /ERR|err/;
  const warn_re = /WARN|warn/;
  if(error_re.test(data) === true) {
    return 'error';
  } else if(warn_re.test(data) === true) {
    return 'warn';
  } else {
    return 'info';
  }
}

logfiles.forEach(log => {
  let logtail = new Tail(log);

  logtail.on('line', data => {
    let level = setLevel(data);
    if(level === 'error' || level === 'warn') {
      publisher.send(JSON.stringify({
        log: log,
        level: level,
        logline: data,
        msg_time: Date.now()
      }));
    };
  });
});

publisher.bind('tcp://127.0.0.1:4260', err => {
  if(err) {
    throw err;
  }
  console.log('Listening for zmq subscribers...');
});
