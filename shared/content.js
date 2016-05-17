(function () {
    'use strict';

    extensionMessage('ping', function (response) {
        log("ping response:", response);
    });

    addExtensionMessageListener('timeout', function (response) {
        log('timeout', response);
    });

    extensionMessage('setTimeout', 3000);
})();
