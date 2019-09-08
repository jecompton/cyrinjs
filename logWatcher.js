'use strict';
const fs = require('fs')
const zmq = require('zeromq');
const Tail = require('tail').Tail;

const logfile = '/var/log/syslog';

const regex = /ERR|err|WARN|warn/;

const publisher = zmq.socket('pub');

const logtail = new Tail(logfile);

logtail.on('line', data => {
  if(regex.test(data) === true) {
    publisher.send(JSON.stringify({
      log: logfile,
      logline: data,
      msg_time: Date.now()
    }));
  };
});

publisher.bind('tcp://127.0.0.1:4260', err => {
  if(err) {
    throw err;
  }
  console.log('Listening for zmq subscribers...');
});
