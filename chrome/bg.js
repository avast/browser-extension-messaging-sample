(function () {
    var handlers = {
        'ping': function (request, msgid, sender, callback) {
            callback({ pong: msgid, id: msgid });
        },

        'setTimeout': function (request, msgid, sender, callback) {
            setTimeout(function () {
                chrome.tabs.sendMessage(sender.tab.id, { type: 'timeout', id: msgid });
            }, request);
        }
    };

    chrome.runtime.onMessage.addListener(function (msg, sender, callback) {

        if (!msg.type) {
            return;
        }

        var handler = handlers[msg.type];

        if (!handler) {
            return;
        }

        handler(msg.detail, msg.id, sender, callback);
    });
})();
