var self = require('sdk/self');
var pageMod = require('sdk/page-mod');
var setTimeout = require("sdk/timers").setTimeout;

function messageProcessor(worker) {
    worker.port.on('ping', function (msg) {
        worker.port.emit(msg.replyTo, { pong: msg.id, id: msg.id });
    });

    worker.port.on('setTimeout', function (msg) {
        setTimeout(function () {
            worker.port.emit('timeout', { id: msg.id });
        }, msg.detail);
    });
}

pageMod.PageMod({
    include: ['http://*', 'https://*', 'file://*'],
    contentScriptFile: [self.data.url('log.js'), self.data.url('message.js'), self.data.url('content.js')],
    onAttach: messageProcessor
});
