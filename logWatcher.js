'use strict';
const fs = require('fs')
const Tail = require('tail').Tail;

const logfile = '/var/log/syslog';

const regex = /ERR|err|WARN|warn/;

const logtail = new Tail(logfile);

logtail.on('line', data => {
  if(regex.test(data) === true) {
    console.log(data);
  };
});
