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

logfiles.forEach(log => {
  let logtail = new Tail(log);

  logtail.on('line', data => {
    if(regex.test(data) === true) {
      publisher.send(JSON.stringify({
        log: log,
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
