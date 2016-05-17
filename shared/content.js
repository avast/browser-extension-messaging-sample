(function () {
    'use strict';

    if (!window.location.protocol.toLowerCase().match(/^(http(s)?|file)[:]$/)) {
        return;
    }

    extensionMessage('ping', function (response) {
        log("ping response:", response);
    });

    addExtensionMessageListener('timeout', function (response, id) {
        log('timeout', response, id);
    });

    extensionMessage('setTimeout', 3000);
})();
