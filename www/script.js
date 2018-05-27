ready = function () {
    try {
        window.plugins.intent.setNewIntentHandler(function (intent) {}, function (e) {});

        window.plugins.intent.getCordovaIntent(function (intent) {
            try {
                test_handler(intent);
            } catch (e) {
                alert(e);
                navigator.app.exitApp();
            }
        });
    } catch (e) {
        alert("ready fail: " + e);
    }
};

intent_handler = function (intent) {
    if (intent_handler_timer !== undefined) {
        clearTimeout(intent_handler_timer);
    }

    var _calendar_extras = {};
    if (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.MAIN") {
        // 單純開啟日曆
    }

    if (typeof (intent.extras) === "object") {
        var _extras = intent.extras;
        if (typeof (_extras["android.intent.extra.SUBJECT"]) === "string") {
            _calendar_extras.title = _extras["android.intent.extra.SUBJECT"];
        }
        if (typeof (_extras["android.intent.extra.TEXT"]) === "string") {
            _calendar_extras.description = _extras["android.intent.extra.TEXT"];
        }
    }

    if (typeof (_calendar_extras.title) === "undefined"
            && typeof (_calendar_extras.description) === "string") {
        _calendar_extras.title = _calendar_extras.description;
        delete _calendar_extras.description;
    }

    // 對付feedly的操作
    if (typeof (_calendar_extras.title) === "string"
            && typeof (_calendar_extras.description) === "undefined") {
        var _title = _calendar_extras.title.trim();
        var _last_space = _title.lastIndexOf(" ");
        var _last_segment = _title.substring(_last_space + 1, _title.length).trim();
        if (_last_segment.substr(0, 7) === "http://"
                || _last_segment.substr(0, 8) === "https://") {
            // 是feedly模式
            _calendar_extras.title = _title.substr(0, _last_space);
            _calendar_extras.description = _last_segment;
        }
    }
    
    //alert(_search);
    var _navigation_url = "https://www.google.com/maps?api=1";
    if (typeof(_calendar_extras.title) === "string") {
        var _search = _calendar_extras.title;

        if (_search !== undefined 
                    && _search.indexOf("pgfu") > -1 
                    && _search.indexOf("n.tw") > -1) {
                //alert(decodeURIComponent(_search));
                _search = "?" + decodeURIComponent(_search).split("?")[1];

                var _lat = getQueryVariable("lat", _search);
                var _lon = getQueryVariable("lon", _search);
                _search = _lat + "," + _lon;
        }
        else {
            _search = encodeURIComponent(_search);
        }

        _navigation_url = "https://www.google.com/maps/dir/?api=1&destination=" + _search;
        //alert(_navigation_url);
    }
    window.open(_navigation_url, "_system");
    navigator.app.exitApp();
};

intent_handler_timer = undefined;