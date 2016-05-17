(function () {
    var handlers = {
        'ping': function (request, msgid, sender, callback) {
            callback({ pong: msgid, id: msgid });
        }//,

        //'setTimeout': function (request, msgid, sender, callback) {
        //    setTimeout(function () {
        //        chrome.tabs.sendMessage(sender.tab.id, { type: 'timeout', id: msgid });
        //    }, request);
        //}
    };

    safari.application.addEventListener("message", function (msg) {

        if (!msg.type) {
            return;
        }

        var handler = handlers[msg.type];

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
