'use strict';
const zmq = require('zeromq');

const eventPublisher = 'tcp://127.0.0.1:4260';
const eventCollector = 'tcp://10.202.41.148:4261';

// Channel for listening to reportable events
const watcher = zmq.socket('sub');
watcher.subscribe(''); // specify if watching only one kind of event

// Channel for passing on reportable events to central server or hub
const reporter = zmq.socket('req');

// Pass reportable events on to server
watcher.on('message', data => {
  reporter.send(data);
}

// Do stuff w/ server replies
reporter.on('message', data => {
  console.log(`Received response: ${data}`);
});

watcher.connect(eventPublisher);
reporter.connect(eventCollector);
