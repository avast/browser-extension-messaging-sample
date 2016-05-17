(function () {
    'use strict';

    var MAX_WAIT = 300000; // 5 min

    function extensionMessage(type, request, callback) {
        var e = { detail: request };

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
        safari.self.tab.dispatchMessage(type, e);
    }

    var handlers = {};

    safari.self.addEventListener("message", function (msg) {
        if (msg && msg.type && handlers[msg.type]) {
            handlers[msg.type](msg.detail, msg.id);
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

    window.extensionMessage = function () { };//extensionMessage;
    window.addExtensionMessageListener = function () { };//addExtensionMessageListener;
})();
