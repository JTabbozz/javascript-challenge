/*global $:true, SADTROMBONE:true, buzz:false, smoothScroll:true, WOW:true, CryptoJS:true, Spinner:false */
SADTROMBONE = {};

SADTROMBONE.Action = function () {
    "use strict";
// PRIVATE VARIABLES
    var $body, audioObj, btn, elList,
        data, todayCount, totalCount,
        update = $.Callbacks("once"), classicUpdate,
        thisSound,
        publicKey = '6LcTagITAAAAAFSZKkQVFquffZmfZbPkQlP-AB1t';
// DOM ELEMENTS
    var $play, bAlert, sendLink,
        errorList, $siteIcon, $preloader;

// PRIVATE METHODS?
    const registerDomElements = () => {
        $body = $('body');
        $play = $('span.play');
        bAlert = $('.alert');
        sendLink = $('#sendLink');
        $siteIcon = $('.site-icon');
        $preloader = $('#preloader');
    };

    const addListeners = () => {
        $siteIcon.on('click', function (ev) {
            ev.preventDefault();
            trackOutboundLinkNewWindow($(this).data('href'));
            window.open($(this).data('href'), '_blank');
        });
    };

    $.fn.spin = (opts) => {
        this.each(function () {
            var $this = $(this),
                data = $this.data();
            if (data.spinner) {
                data.spinner.stop();
                delete data.spinner;
            }
            if (opts !== false) {
                data.spinner = new Spinner(opts).spin(this);
            }
        });
        return this;
    };

    const loadAudio = () => {
        if (buzz.isSupported()) {
            audioObj = new buzz.sound(thisSound, {
                formats: ["ogg", "mp3", "aac", "wav"],
                preload: true
            });
            audioObj.bind('ended', function () {
                //updateCount();
                ga('send', 'event', 'Button', 'play', 'sadtrombone-play', 1);
            });
            buildPlayBtn(audioObj);
        } else {
            $play.replaceWith($(bAlert).removeClass('hide'));
        }
    };

    const buildPlayBtn = (audioObj) => {
        btn = $('<a></a>').attr({
            'href': 'click for sad trombone',
            'id': 'trombone'
        }).addClass('btn btn-sadtrombone').html('play!').click(function () {
            audioObj.play();
            return false;
        });
        $play.append(btn);
    };

    const fetchQSAKeys = (qsa) => {
        // returns array of keys from the key|value pairs of the query string attributes
        const key_val = qsa.split('&'),
            keys = [];
        for (let i = 0; i < key_val.length; i = (i + 1)) {
            keys.push(key_val[i].split('=')[0]);
        }
        return keys;
    }

    const fetchQSAPairs = (qsa) => {
        if (qsa) {
            const params = qsa.split('&');
            let _params = {};

            params.forEach((param) => {
                const kv = param.split('=');
                _params[kv[0]] = kv[1];
            });
            return _params;
        }
    };

    const soundPath = () => {
        let soundPath;
        // we have some special days that we can use special sounds on.
        const full_date = new Date().toISOString().split('T')[0];
        const date_parts = full_date.split('-');
        const yyyy = date_parts.shift();
        const date = date_parts.join('-');
        switch (date) {
            case "05-05":
                soundPath = "may5";
                break;
            case "04-08":
                soundPath = "twins";
                break;
            default:
                // default to trombone always
                soundPath = "trombone";
        }

        const url = location.href;
        if (typeof url !== 'undefined' && url.split('?').length > 1) {
            const qsaKeys = fetchQSAPairs(url.split('?')[1]);
            if (qsaKeys.hasOwnProperty('sound')) {
                soundPath = `${qsaKeys.sound}`;
            }
        }

        return `assets/sound/${soundPath}`;
    };

    const autoplaycheck = () => {
        let url = location.href;
        if (typeof url !== 'undefined' && url.split('?').length > 1) {
            const qsaKeys = fetchQSAKeys(url.split('?')[1]);
            if ($.inArray('autoplay', qsaKeys) <= 0) {
                audioObj.play();
            }
        }
    };

    /**
     * Function that tracks a click on an outbound link in Google Analytics.
     * This function takes a valid URL string as an argument, and uses that URL string
     * as the event label.
     */
    const trackOutboundLink = (url, isExternal) => {
            var external = isExternal || false,
                params = {};

            if (!external) {
                params.hitCallback = function () {
                    document.location = url;
                };
            }
            ga('send', 'event', 'outbound', 'click', url, params);
            return external;
        },
        resizeIntro = function () {
            var winHeight = $(window).height();
            $('section.background-image').not('#other-sites').css('min-height', winHeight).find('.overlay').css('min-height', winHeight);
        };

// PUBLIC METHODS

    return {
        init: function () {
            thisSound = soundPath();
            registerDomElements();
            addListeners();
            loadAudio();

            // Preloader
            $(window).load(function () {
                autoplaycheck();
            });
        },
        trackLink: function (url, isExternal) {
            var external = isExternal || false;
            trackOutboundLink(url, external);
        }
    };
}();
