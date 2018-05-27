ready = function () {
    try {
        window.plugins.intent.setNewIntentHandler(function (intent) {}, function (e) {});

        window.plugins.intent.getCordovaIntent(function (intent) {
            try {
                intent_handler(intent);
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
    
    var _config = {
        action: "android.intent.action.EDIT",
        type: "vnd.android.cursor.item/event",
    };
    
    if (typeof(_calendar_extras.title) === "string") {
        _config.extras = _calendar_extras;
    }

    window.plugins.webintent.startActivity(_config,
            function () {
                navigator.app.exitApp();
            },
            function () {
                alert('Failed:' + JSON.stringify(_calendar_extras, null, 2));
                navigator.app.exitApp();
            }
    );
};

intent_handler_timer = undefined;