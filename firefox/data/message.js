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
            var timeoutId = setTimeout(function () {
                callback(null);
                self.port.removeListener(e.replyTo);
            }, MAX_WAIT);

            e.replyTo = timeoutId.toString();
            self.port.on(e.replyTo, function (result) {
                self.port.removeListener(e.replyTo);
                clearTimeout(timeoutId);
                callback(result);
            });
        }

        log(type, request, id);
        self.port.emit(type, e);
    }

    function extensionMessageInitializer(type, request, callback) {
        // yield so that main.js has a chance to start listening
        setTimeout(function () {
            extensionMessage(type, request, callback);
            window.extensionMessage = extensionMessage;
        }, 20);
    }

    function addExtensionMessageListener(type, callback) {
        if (!type) {
            throw new ReferenceError('type is not defined');
        }
        if (!callback) {
            throw new ReferenceError('callback is not defined');
        }
        self.port.on(type, callback);
    }

    window.extensionMessage = extensionMessageInitializer;
    window.addExtensionMessageListener = addExtensionMessageListener;
})();
