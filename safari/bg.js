(function () {
    var handlers = {
        'ping': function (request, msgid, sender, callback) {
            callback({ pong: msgid, id: msgid });
        },

        'setTimeout': function (request, msgid, sender, callback) {
            setTimeout(function () {
                sender.page.dispatchMessage('timeout', { id: msgid });
            }, request);
        }
    };

    safari.application.addEventListener("message", function (msg) {
        if (!msg.name) {
            return;
        }

        var handler = handlers[msg.name];

        if (!handler) {
            return;
        }

        var callback = null;
        if (msg.message.replyTo) {
            callback = function (response) {
                msg.target.page.dispatchMessage(msg.message.replyTo, response);
            };
        }

        handler(msg.message.detail, msg.message.id, msg.target, callback);
    });
})();
