(function () {
    'use strict';

    function makeJSONable(a) {
        var JSONableObj = {};
        for (var k in a) {
            try {
                if (typeof a[k] === 'object') {
                    JSONableObj[k] = JSON.stringify(a[k]);
                }
                else if (typeof a[k] !== 'function') {
                    JSONableObj[k] = a[k];
                }
            }
            catch (e) {

            }
        }

        return JSONableObj;
    }

    function print(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');

        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        document.body.appendChild(frag);
    }

    function log() {
        var line = "";

        Array.prototype.forEach.call(arguments, function (a) {
            if (a == null) {
                line += " null";
            }
            else if (typeof a === 'object') {
                try {
                    if (Array.isArray(a)) {
                        line += "[" + a.map(function (e) { return makeJSONable(a); }).join(", ") + "]";
                    }
                    else {
                        line += " " + JSON.stringify(makeJSONable(a));
                    }
                }
                catch (ex) {
                    line += " cannot log object" + ex.toString();
                }
            }
            else if (!!a && a.toString) {
                line += " " + a.toString();
            }
            else if (typeof a === 'number') {
                line += " " + a;
            }
            else if (typeof a === 'undefined') {
                line += " undefined";
            }
            else {
                line += " cannot log parameter";
            }
        });

        print("<p><span>[" + (new Date()).toISOString() + "]</span> " + line + "</p>");
    }

    window.log = log;
})();
