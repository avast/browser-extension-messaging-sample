(function () {
    'use strict';

    function extensionMessage(type, request, callback) {
        if (typeof request == 'function') {
            callback = request;
            request = null;
        }
        var id = Math.floor(Math.random() * 4096);
        log(type, request, id);
        chrome.runtime.sendMessage({ type: type, detail: request, id: id }, callback);
    };

    var handlers = {};

    chrome.runtime.onMessage.addListener(function (msg, sender) {
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
    };

    window.extensionMessage = extensionMessage;
    window.addExtensionMessageListener = addExtensionMessageListener;
})();
