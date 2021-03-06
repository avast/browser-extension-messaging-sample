(function () {
    'use strict';

    var MAX_WAIT = 300000; // 5 min

    function extensionMessage(type, request, callback) {
        if (typeof request == 'function') {
            callback = request;
            request = null;
        }

        var id = Math.floor(Math.random() * 4096);
        var e = { detail: request, id: id };

        if (callback) {
            var timeoutId;

            var replyListener = function (result) {
                if (result.name == e.replyTo) {
                    safari.self.removeEventListener("message", replyListener);
                    clearTimeout(timeoutId);
                    callback(result.message);
                }
            };

            timeoutId = setTimeout(function () {
                callback(null);
                safari.self.removeEventListener("message", replyListener);
            }, MAX_WAIT);

            e.replyTo = timeoutId.toString();

            safari.self.addEventListener("message", replyListener);
        }

        log(type, request, id);
        safari.self.tab.dispatchMessage(type, e);
    }

    var handlers = {};

    safari.self.addEventListener("message", function (msg) {
        if (msg && msg.name && handlers[msg.name]) {
            handlers[msg.name](msg.message.detail, msg.message.id);
        }
    });

    function addExtensionMessageListener(type, callback) {
        if (!type) {
            throw new ReferenceError('type is not defined');
        }
        if (!callback) {
            throw new ReferenceError('callback is not defined');
        }
        handlers[type] = callback;
    }

    window.extensionMessage = extensionMessage;
    window.addExtensionMessageListener = addExtensionMessageListener;
})();
