//validator.js
var validator = {};
validator.event = {};
var checkAllTagsItem = {}; //for checkall tags
function setTagsItem(tag, item) {
    checkAllTagsItem[tag] = checkAllTagsItem[tag] || [];
    checkAllTagsItem[tag].push(item);
}

// ������������
validator.event.number = function(e) {
    return e.which == 0 || e.which == 8 ? true : (/[\d]/.test(String.fromCharCode(e.which)));
};
// ����С������
validator.event.decimel = function(e) {
    return e.which == 0 || e.which == 8 ? true : (/[\d.-]/.test(String.fromCharCode(e.which)));
};
// �ַ������
validator.event.character = function(e) {
    return e.which == 0 || e.which == 8 ? true : (/^[A-Za-z0-9]+$/.test(String.fromCharCode(e.which)));
};

validator.event.validName = function(e) {
    return e.which == 0 || e.which == 8 ? true : (/[^。~!@#$%\^\+\*&\\\/\?\|:\.<>{}()';=",\d]/).test(String.fromCharCode(e.which));
};
validator.event.bcode = function(e) {
    var key = e.which;
    if (key == 0 || key == 8 || key == 9) return true;
    //if(e.shiftKey && (key != 51 && key != 56 )) return false;
    return (/\d{1,3}/.test(String.fromCharCode(key)));
};

validator.event.bcodeCom = function(e) {
    var key = e.which;
    if (key == 0 || key == 8 || key == 9) return true;
    //if(e.shiftKey && (key != 51 && key != 56 )) return false;
    return (/[\d]/.test(String.fromCharCode(key)));
};

validator.isNumber = function(s) { return /^[0-9\.]+$/.test(s); }; //�������
validator.isMoney = function(s) { return /^[\+-]?\d+(\.?\d+)?$/.test(s); }; //���С�� (��)
validator.isEmail = function(s) { return /^[0-9a-z_A-Z\.]+@[0-9a-zA-Z]+(\.[0-9a-zA-Z]+)+$/.test(s); };
validator.isCharacter = function(s) { return /^[A-Za-z0-9]+$/.test(s); };
validator.isBCode = function(s) { return /^\d{1,3}$/.test(s); };

validator.initInput = function() {
    $("input.v_validName").on("keypress", function(e) {
        return validator.event.validName(e);
    }).on("change", function(e) {
        this.value = this.value.replace(/[\u4E00-\u9FA5]/g, '');
    });
    $("input.v_decimel").on("keypress", function(e) {
        return validator.event.decimel(e);
    }).on("change", function() {
        this.value = this.value.replace(/[\u4E00-\u9FA5]/g, '');
    });

    $("input.v_number").on("keypress", function(e) {
        return validator.event.number(e);
    }).on("change", function() {
        this.value = this.value.replace(/[\u4E00-\u9FA5]/g, '');
    });

    $("input.v_character").on("keypress", function(e) {
        return validator.event.character(e);
    }).on("change", function() {
        this.value = this.value.replace(/[\u4E00-\u9FA5]/g, '');
    });

    //comm calendar
    $("input.txt_calendar").each(function(i, o) {
        var id = o.id;
        var maxDate = $(this).attr("maxDate") || "",
            minDate = $(this).attr("minDate") || "";
        //var isTime = $(this).attr("isTime") == "true" ? true : false;
        Calendar.setup({
            inputField: id,
            button: "btn_" + id,
            //ifFormat : isTime ? "%Y-%m-%d %H:%M" : "%Y-%m-%d",
            ifFormat: "%Y-%m-%d",
            weekNumbers: false,
            //showsTime: isTime,
            maxDate: maxDate,
            minDate: minDate
        });
        o = $(o);
        if (o.val() == "") $(o).val(today);
        $(o).attr("readonly", "true");
    });
    $("input.txt_time").each(function(i, o) {
        var id = o.id;
        o = $(o);
        if (o.val() == '') {
            var time = o.attr("time") || "";
            if (time != '') o.val(time);
            else o.val(id == "timeFrom" ? "12:00" : "11:59");
        }
        o.timePicker({ step: 1, endTime: new Date(0, 0, 0, 23, 59, 0) }).prop("readonly", true);
    });
    $(":checkbox.ckAll[tag]").change(function() {
        var forItem = function(t) {
            var os = $(":text[tag=" + t + "]");
            if (os.length == 0) os = $("select[tag=" + t + "]");
            os.val(os.eq(0).val());
        };
        var forItems = function(t) {
            $.each(checkAllTagsItem[t], function(i, _t) {
                var _tag = t + _t;
                forItem(_tag);
            });
        };
        var forLike = function(t, me) {
            var p = $(me).parents("table");

            checkAllTagsItem[t] = checkAllTagsItem[t] || [t];

            $.each(checkAllTagsItem[t], function(i, _t) {
                var os = p.find(":text[tag*=" + _t + "]");
                if (os.length == 0) os = p.find("select[tag*=" + _t + "]");
                os.val(os.eq(0).val());
            });
        };


        if (!$(this)[0].checked) return true;
        var tag = $(this).attr("tag").split(",");

        var type = tag.length > 1 ? tag[1] : "item";
        tag = tag[0];
        var fn = function() {};
        switch (type) {
        case "item":
            fn = forItem;
            break;
        case "items":
            fn = forItems;
            break;
        case "like":
            fn = forLike;
            break;
        }

        fn(tag, this);
    });


    //comm btn
    $("#btnAdd").click(function() {
        if (addUrl) {
            window.location.href = addUrl;
        }
    });
    $("#btnCancel").click(function() {
        if (addUrl) {
            window.location.href = listUrl;
        }
    });
    $('#btnClose').click(function() {
        window.close();
    });
    $("#btnReset").click(function() {
        this.form.reset();
    });

    $("#btnBack").click(function() {
        window.history.back();
    });

    $("#btnPrint").click(function() {
        print.print();
    });


    $("input.err, select.err, textarea.err")
        .on("focus", function() {
            $(this).removeClass("err");
        });
};

validator.isSubmit = function(s) {
    var res = {};
    var initRes = function(v, tag, id, f) {
        if (!f(v)) {
            res[id] = tag;
        }
    };

    s = s ? "#" + s + " " : "";
    $(s).find(".v_required, .v_decimel, .v_number, .v_character, .v_email").each(function() {
        var v = $(this).val();
        var id = this.id;
        var css = $(this).attr("class");

        var f_reg = function(s) { return true; };
        var isEmpty = v == "";
        $.each(css.split(" "), function(i, c) {
            switch (c) {
            case "v_decimel":
                f_reg = isEmpty ? f_reg : validator.isMoney;
                break;
            case "v_number":
                f_reg = isEmpty ? f_reg : validator.isNumber;
                break;
            case "v_character":
                f_reg = isEmpty ? f_reg : validator.isCharacter;
                break;
            case "v_email":
                f_reg = isEmpty ? f_reg : validator.isEmail;
                break;
            case "v_required":
                f_reg = function() { return !isEmpty; };
                break;
            }
            initRes(v, c, id, f_reg);
        });
    });

    var counter = 0, ids = [];;
    $.each(res, function(id, tag) {
        counter++;
        ids.push(id);
    });

    return { length: counter, list: res, ids: ids };
};

validator.checkForm = function(formId) {
    var list = validator.isSubmit(formId);
    if (list.length > 0) {
        $("#" + list["ids"].join(",#")).addClass("err");
        return false;
    }
    return true;
};


//base set
$(document).bind("mobileinit", function() {
    $.mobile.ajaxEnabled = false;
});

//zw
//get the public form post event
function ajaxSubmit( /*String*/formId, /*function*/fn) {
    if (!validator.checkForm(formId)) return false;

    var form = $('#' + formId);
    if (!form) {
        window.alert('form not found: ' + formId);
        return false;
    }
    var data = $(form).serialize();
    var url = $(form).attr('action');
    ajax(data, fn, url);
}

function ajax( /*Object*/data, /*function*/fn, /*string*/url) {
    $.until.postJSON({
        url: url || document.location.href,
        data: data,
        showErrorDefault: true,
        showloading: {
            obj: $("body"),
            mask: true
        },
        success: fn
    });
}


//$.until 
$.until = {};
$.until.debug = false;
$.until.log = function(str, obj) {
    if (!$.until.debug) {
        return;
    }
    if (typeof (console) == "undefined") {
        return;
    }
    if (typeof (console.log) == "undefined") {
        return;
    }
    if (console && console.log) {
        var d = new Date();
        if (typeof (str) != "object") {
            //window.console.log("$.until.log@" + d.toLocaleString() + "#" + str);
            if (obj != undefined) {
                window.console.log(obj);
            }
        } else {
            window.console.log("$.until.log@" + d.toLocaleString());
            window.console.log(str);
            if (obj != undefined) {
                window.console.log(obj);
            }
        }
    }
};

//jquery extend
$.until.serialize = function(formobj) {
    var fdata = formobj.serializeArray();
    for (var i = fdata.length; i--;) {
        var name = fdata[i].name;
        var value = fdata[i].value;
        if (value) {
            if (fdata[name]) {
                fdata[name] += ',' + value;
            } else {
                fdata[name] = value;
            }
        }
    }
    return fdata;
};


$.until.getJSON = function(options) {
    var getJsonDefaults = {
        url: "",
        type: "get",
        dataType: "json",
        data: {},
        cache: false, //是否使用离线缓存
        cacheTime: 1000 * 60 * 24, //离线缓存时间  单位毫秒
        success: undefined,
        error: undefined,
        showloading: undefined, //是否加载loadding 格式{/*要遮罩的对象*/obj:$(body),/*是否遮罩层*/mask:false}
        showErrorDefault: false, //是否显示默认的错误信息
        debug: false //开始调试
    };
    options = $.extend(getJsonDefaults, options);
    $.until._ajax(options);
};

$.until.postJSON = function(options) {
    var postJsonDefaults = {
        url: "",
        type: "post",
        dataType: "json",
        data: {},
        headers: {},
        cache: false, //是否使用离线缓存
        cacheTime: 1000 * 60 * 24, //离线缓存时间  单位毫秒
        success: undefined,
        error: undefined,
        showloading: undefined, //是否加载loadding 格式{/*要遮罩的对象*/obj:$(body),/*是否遮罩层*/mask:false}
        showErrorDefault: false, //是否显示默认的错误信息
        debug: false //开始调试
    };
    options = $.extend(postJsonDefaults, options);
    if (options.url == undefined) {
        options.url = document.location.href;
    }
    if (options.url == "") {
        options.url = document.location.href;
    }
    $.until._ajax(options);
};



$.until._ajaxpools = new Array();
$.until._ajax = function(options) {
    if (options.debug) {
        $.until.log(options);
    }

    //对cache进行预处理
    //注意：所有的缓存都会拥有一个默认的有效期 不会长期保留 设置的参数
    if (options.cache) {
        var tmpCacheData = $.local.getLocalData(options.url, options.cacheTime);
        if (tmpCacheData != undefined) {
            $.until.msg.pre(tmpCacheData, options);
            return null;
        }
    }
    if (options.showloading) {
        $.until.showloading(options.showloading);
    }
    var currentRequest = $.ajax({
        url: options.url,
        type: options.type,
        dataType: options.dataType,
        data: options.data,
        headers: options.headers,
        cache: options.cache,
        success: function(rsp) {
            if (options.debug) {
                $.until.log("success", rsp);
            }
            //对cache进行预处理
            if (options.cache) {
                $.local.setLocalData(options.url, rsp, options.cacheTime);
            }
            $.until.msg.pre(rsp, options);
            if (options.showloading) {
                $.until.hideloading(options.showloading);
            }
        },
        error: function(rsp) {
            if (options.debug) {
                $.until.log("error", rsp);
            }
            $.until.msg.error(rsp, options);
            if (options.showloading) {
                $.until.hideloading(options.showloading);
            }
        }
    });
    $.until._ajaxpools.push({ xhr: currentRequest, options: options });
    return currentRequest;
};


$.fn.serialize = function() {
    return $.until.serialize($(this));
};

$.fn.postForm = function(success, error, options) {
    var thisFrom = $(this);
    var url = thisFrom.attr("action");
    if (url == undefined) {
        url = document.location.href;
    }
    if (url == "") {
        url = document.location.href;
    }

    var data = this.serialize();
    options = $.extend({ url: url, data: data, success: success, error: error, showloading: { obj: $("body"), mask: true }, showErrorDefault: true }, options);
    $.until.postJSON(options);
};


//about all not post ajax
//is not safe :zw
$.until.abortallajax = function() {
    $.each($.until._ajaxpools, function(i, obj) {
        if (obj.xhr.readyState != 4) {
            obj.xhr.abort();
            $.until.log("abort a ajax", obj);
        }
    });
};

$.until.hasstr = function(formstr, hasstr) {
    return ("," + formstr + ",").indexOf("," + hasstr + ",") != -1;
};

//message 
$.until.msg = function() {};

$.until.msg.pre = function(rsp, options) {
    if (typeof (rsp) == "undefined") {
        if (options.error == undefined) {
            if (options.showErrorDefault) {
                $.until.msg.show("don't get the request");
                return;
            }
        } else {
            $.until.msg.error(rsp, options.error);
            return;
        }
    }
    var errorIsNull = false;
    if (options.error == undefined) {
        errorIsNull = true;
    }

    if (options.dataType == "json") {
        //ck is has code
        if (rsp.hasOwnProperty("Code")) {
            var code = rsp.Code;
            //pre to ck the code
            if (!$.until.msg.parseMsg(code)) {
                return;
            }
            if ($.until.hasstr("0,50000,50001", code)) { //ck ok code 
                options.success(rsp);
            } else {
                if (errorIsNull) {
                    if (options.showErrorDefault) {
                        $.until.msg.show(rsp.Msg);
                    }
                } else {
                    options.error(rsp);
                }
            }
        } else {
            if (errorIsNull) {
                options.success(rsp);
            } else {
                if (options.showErrorDefault) {
                    $.until.msg.show("don't get the reponse code!");
                }
            }
        }
    } else if (options.dataType == "script") {
        //type=script don't add
        alert("error base.until._ajax don't add script type");
        //...
    } else {
        alert("error base.until._ajax don't add other type");
        //....
    }
};

$.until.msg.show = function( /*string*/msg, /*bool*/isSuccess) {
    var flag = false;
    if (typeof isSuccess == 'undefined' || isSuccess == null)
        flag = false;
    else
        flag = true;

    if (flag)
        $.modaldialog.success(msg, { width: 325 });
    else
        $.modaldialog.error(msg, { width: 325 });
};

$.until.msg.error = function(rsp, options) {
    if (rsp.hasOwnProperty("Code")) {
        if (options.error == undefined) {
            if (options.showErrorDefault) {
                $.until.msg.show(rsp.Msg);
            }
        } else {
            options.error(rsp);
        }
    } else {
        switch (rsp.status) {
        case 300:
        case 301:
        case 302:
        case 303:
        case 304:
        case 305:
            $.user.showloginView(); //call back?
        case 500:
            $.until.log("ajax get a 500 error");
            $.until.log(rsp.responseText);
            $.until.msg.show("Server Error!");
            return;
        case 502:
            $.until.log("ajax get a 502 error");
            $.until.log(rsp.responseText);
            //$.until.msg.show("Server Error!");
            return;
        case 503:
            $.until.log("ajax get a 503 error");
            $.until.log(rsp.responseText);
            //$.until.msg.show("Server Error!");
            return;
        default:
            $.until.log(rsp.responseText);
            break;
        }

        if (options.success != undefined) {
            switch (options.dataType) {
            case "json":
                options.success(eval(rsp.responseText));
            default:
                options.success(rsp);
            }
        } else {
            if (options.showErrorDefault) {
                $.until.msg(rsp.responseText);
            }
        }
    }
};

$.until.msg.parseMsg = function(code) {
    switch (code) {
    case 39999:
        $(".vCode_img").reloadimg();
        break;
    case 1:
        $.user.logoutEvent();
        return false;
        break;
    default:

        break;
    }
    return true;
};


//loading model
$.until.loading_defaults = {
    obj: null,
    mask: null,
    zIndex: 800,
    hide: true //if false don't hide must reloadpage
};
$.until.cache_loading_img = null;
$.until.cache_loading_mask = null;
$.until.cache_loading_pool = 0;
$.until.cache_loading_hide = true;
$.until.showloading = function(options) {
    $.until.log("show_loading:" + $.until.cache_loading_pool);
    options = $.extend({}, $.until.loading_defaults, options);
    if (options.mask) {
        $.until.cache_loading_pool++;;
    }
    if (!options.hide) {
        $.until.cache_loading_hide = false;
    }
    var container = options.obj;
    if (container != undefined) {
        if (container.length == 0) {
            $.until.log("Error#Please don't select a msg!");
            return;
        }

        var width = container.outerWidth();
        width = width > 0 ? width : "0px";
        var height = container.outerHeight();
        height = height > 0 ? height : "0px";
        if ($.until.cache_loading_img == null) {
            $("body").append('<div class="loading"></div>');
            $.until.cache_loading_img = $(".loading");

        }
        if ($.until.cache_loading_mask == null) {
            $("body").append('<div class="loading_mask"></div>');
            $.until.cache_loading_mask = $(".loading_mask").css({
                zIndex: options.zIndex
            }).bgiframe();
            if (!$.support.leadingWhitespace) {
                $.until.cache_loading_mask.css({
                    width: container.outerWidth(),
                    height: container.outerHeight()
                });
            }
        }

        $.until.cache_loading_img.css({
            position: "absolute",
            top: container.offset().top,
            left: container.offset().left,
            "z-index": options.zIndex + 1,
            width: width,
            height: height
        });

        if (options.mask) {
            $.until.cache_loading_img.css("display", "block");
            $.until.cache_loading_mask.css("display", "block");
        } else {
            $.until.cache_loading_img.css("display", "block");
            $.until.cache_loading_mask.css("display", "none");
        }
    }
};

$.until.hideloading = function(options) {
    options = $.extend({}, $.until.loading_defaults, options);
    if (options.mask) {
        $.until.cache_loading_pool--;
    }
    $.until.log("hide_loading:" + $.until.cache_loading_pool);
    if ($.until.cache_loading_pool == 0 && $.until.cache_loading_hide) {
        $(".loading_mask").hide();
        $(".loading").hide();
    }

};

$.fn.showloading = function(options) {
    if (options != undefined) {
        options = $.extend($.until.loading_defaults, options);
    } else {
        options = $.extend($.until.loading_defaults);
    }
    $.until.showloading({ obj: $(this), mask: options.mask });
};

$.fn.hideloading = function() {
    $.until.hideloading();
};

$.until.url = function() {

};

$.until.url.getFirstPathWithOutLanguage = function() {
    var tmpUrlList = document.location.pathname.split("/");
    if (tmpUrlList.length == 0) {
        return "Home";
    }
    if (tmpUrlList[0] == "" && tmpUrlList[1].indexOf("-") > 0) {
        return tmpUrlList[2];
    }
    return tmpUrlList[1];
};

$.until.url.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null)
        return unescape(r[2]);
    return null; //返回参数值
};


/*--------------------------------------------------------------------
* local   本地缓存
*         本地语言


* -------------------------------------------------------------------
*/
$.local = function() {};

$.local.getLocalData = function(key, cacheTime, defaultValue) {
    if (typeof (cacheTime) == "undefined") {
        cacheTime = 1000 * 60 * 5; //default 5min
    }
    var tmpTtl = $.jStorage.getTTL(key);
    $.until.log("cache time#" + tmpTtl);
    if (tmpTtl > 0) {
        var tmpValue = $.jStorage.get(key, cacheTime);
        tmpValue = tmpValue == undefined ? defaultValue : tmpValue;
        $.until.log("$.local.getLocalData  @key=" + key + "  @cacheTime=" + cacheTime + "  @value=" + tmpValue);
        return tmpValue;
    } else {
        $.until.log("$.local.getLocalData cacheTime Out return defaultValue @value=" + defaultValue);
        return defaultValue;
    }
};

$.local.setLocalData = function(key, value, cacheTime) {
    if (typeof (cacheTime) == "undefined") {
        cacheTime = 1000 * 60 * 5; //default 5min
    }
    $.until.log("$.local.setLocalData  @key=" + key + " @value=" + value + "@cacheTime=" + cacheTime);
    $.jStorage.set(key, value, { TTL: cacheTime });
    if (!$.until.debug) {
        $.local.getLocalData(key, cacheTime);
    }
};

$.local.delLocalData = function(key) {
    $.until.log("$.local.delLocalData  @key=" + key);
    $.jStorage.deleteKey(key);
    if (!$.until.debug) {
        $.local.getLocalData(key);
    }
};


$.local.getKeyStr = function(str) {
    return str.replaceAll("\\\\", "").replaceAll("\/", "").replaceAll("#", "");
};

$.local.getLanguage = function() {
    var lanstr = location.pathname.split("/")[1];
    return lanstr;
};

$.local.setLanguage = function(locale) {
    var data = { language: locale };
    $.until.postJSON({
        url: "/SetLanaguage",
        data: data,
        showloading: { obj: $("body"), mask: true, hide: false },
        success: function(rsp) {
            var url = location.href;
            var paramArr = url.split("/");
            var preLang = paramArr[paramArr.length - 2];
            location.href = "/" + rsp.language + "/" + $.until.url.getFirstPathWithOutLanguage();
        }
    });
};

$.local.getLocalUrl = function(url) {
    //try to pare the url
    return "/" + $.local.getLanguage() + "/" + url;
};
$.local._siteConfig = null;
$.local.getWebConfig = function() {
    //ck the siteconfig is change
    if (_siteConfig != null) {
        if ($.local.getLocalLang() != _siteConfig.userLanguage) {
            flushWebConfig();
        }
    }
    //get siteconfig
    if (_siteConfig == null) {
        if (window.localStorage) {
            if (localStorage.SiteConfig == undefined) {
                $.ajaxSettings.async = false;
                $.getJSON($.getLocalUrl("/GetWebConfig"), function(data) {
                    localStorage.SiteConfig = JSON.stringify(data);
                    $.local._siteConfig = data;
                    return data;
                });
            }
            $.local._siteConfig = JSON.parse(localStorage.SiteConfig);
            return _siteConfig;
        } else {
            $.ajaxSettings.async = false;
            $.getJSON($.getLocalUrl("/GetWebConfig"), function(data) {
                localStorage.SiteConfig = JSON.stringify(data);
                $.local._siteConfig = data;
                return data;
            });
        }
    } else {
        return _siteConfig;
    }
    return null;
};

$.flushWebConfig = function() {
    $.local._siteConfig = null;
    if (window.localStorage) {
        localStorage.removeItem("SiteConfig");
    }
};


$.local.getlang = function() {
    return $.cookie("language"); //"en-US"
};

$.fn.ajaxCheckValid = function(data) {
    var obj = $(this).tooltip('destroy');
    $.until.postJSON({
        data: data,
        success: function(rsp) {
            obj.tipsuccess();
        },
        error: function(rsp) {
            obj.tiperror();
        }
    });
};

$.fn.ajaxCheckValidWithUrl = function(data) {
    var obj = $(this).tooltip('destroy');
    $.until.postJSON({
        data: data,
       url: $.local.getLocalUrl("Register"),
        success: function(rsp) {
            console.log(1);
            obj.tipsuccess();
        },
        error: function(rsp) {
          console.log(0);
            obj.tiperror();
        }
    });
};

$.fn.tipsuccess = function() {
    $(this).tooltip({
        placement: "right",
        html: true,
        selector: $(this),
        title: "<span class='success'></span>",
        trigger: "manual"
    }).tooltip('show');
};
$.fn.tiperror = function() {
    $(this).tooltip({
        placement: "right",
        html: true,
        selector: $(this),
        title: "<span class='error'></span>",
        trigger: "manual"
    }).tooltip('show');
};


/*--------------------------------------------------------------------
*  绑定 data到select
* -------------------------------------------------------------------
*/

$.fn.bindListData = function(data, name, value, defaultvalue, appendvalue, appendText) {
    var $this = $(this);
    var $thisOptions = $this;
    if ($this.find("optgroup").length > 0) {
        $thisOptions = $this.find("optgroup");
    }

    $thisOptions.empty();
    for (var i = 0; i <= data.length - 1; i++) {
        $thisOptions.append("<option value='" + data[i][value] + "'>" + data[i][name] + "</option>");
    }

    if (appendvalue != undefined) {
        if (appendText == undefined) {
            appendText = appendvalue;
        }
        if ($this.find("options").find("[value='" + appendvalue + "']").length == 0) {
            $thisOptions.append("<option value='" + appendvalue + "'>" + appendText + "</option>");
        }
        $this.val(appendvalue);
    }

    if (defaultvalue != undefined) {
        $this.val(defaultvalue);
    }

    //jquery mobile 
};


$.until.getBankList = function(currId, aboutobj, defaultvalue, appendtext) {
    $.until.emptyselectlist(aboutobj);
    $.until.postJSON({
        url: $.local.getLocalUrl("Register"),
        data: { "act": 'GetBank', "CurrId": currId },
        showloading: { obj: $("body"), mask: true },
        success: function(rsp) {
            if (aboutobj == undefined) {
                return rsp.BankList;
            } else {
                $(aboutobj).bindListData(rsp.BankList, "BankName", "BankId", defaultvalue);
                return null;
            }
        }
    });
};


$.until.emptyselectlist = function(aboutobj) {
    var $bindObject = $(aboutobj);
    if ($bindObject) {
        if ($bindObject.find("optgroup").length > 0) {
            $bindObject = $bindObject.find("optgroup");
        }
        $bindObject.empty();
    }
};


$.until.getProviderList = function(currId, aboutobj, defaultvalue, appendtext) {
    $.until.emptyselectlist(aboutobj);
    $.until.postJSON({
        url: $.local.getLocalUrl("Register"),
        data: { "act": "GetProvider", "CurrId": currId },
        showloading: { obj: $("body"), mask: true },
        success: function(rsp) {
            if (aboutobj == undefined) {
                return rsp.ProviderList;
            } else {
                $(aboutobj).bindListData(rsp.ProviderList, "ProviderName", "ProviderId", defaultvalue, "-", appendtext);
            }
        }
    });
};

/*--------------------------------------------------------------------
*   重新加载图片
* -------------------------------------------------------------------
*/
$.fn.reloadimg = function() {
    var $this = $(this);
    $this.attr("ref", $this.attr("src"));
    $this.attr("src", $this.attr("ref") + "?" + Math.random());
};

/*--------------------------------------------------------------------
*  获得单字宽度
* -------------------------------------------------------------------
*/
var $TMP_TEXT_OBJ_DIV = null;
$.until.getTextWidth = function(str) {
    if ($TMP_TEXT_OBJ_DIV == null) {
        $("body").append('<div id="until_getTextWidth_box" style="height:0px!important;overflow:hidden;white-space:nowrap;display:inline-block;"></div>');
        $TMP_TEXT_OBJ_DIV = $("#until_getTextWidth_box");
    }
    return $TMP_TEXT_OBJ_DIV.text(str).width();
};

/*--------------------------------------------------------------------
*  消息
* -------------------------------------------------------------------
*/
function popMessage( /*string*/msg, /*bool*/isSuccess) {
    var flag = false;
    if (typeof isSuccess == 'undefined' || isSuccess == null)
        flag = false;
    else
        flag = true;

    if (flag)
        $.modaldialog.success(msg, { width: 325 });
    else
        $.modaldialog.error(msg, { width: 325 });
}


/*--------------------------------------------------------------------
* 滚动到到锚点
* -------------------------------------------------------------------
*/
function gotoAnchor(fn) {
    var urlhash = window.location.hash;
    if (urlhash) {
        fn(urlhash);
        var t = $(urlhash).offset().top;
        $(window).scrollTop(t);

    }
}


//文本框在失去焦点的时候去除"千分号"和"空格"
function removeThousandSign( /*文本框ID*/selector) {
    $('#' + selector).blur(function() {
        return $(this).val($(this).val().replace(/[,\s]/g, ""));
    });
}

/*--------------------------------------------------------------------
* 日期控件辅助模块
* -------------------------------------------------------------------
*/
/*anytime picker*/
var dateAndTime = {
    format: "%d/%m/%Y %H:%i",
    monthAbbreviations: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    leftOffset: "100",
    labelTitle: 'Select a Date and Time',
    labelMonth: 'Month',
    labelDayOfMonth: 'Day Of Month',
    labelHour: 'Hour',
    labelMinute: 'Minute'
};


//根据Id触发日历显示
function showCalendar( /*文本框ID*/inputId, /*图片ID*/imgId, /*优惠*/prom) {
    if (inputId == "From" && prom != "prom") {
        ReportDateFromCalendar(inputId, inputId);
        if ($('#' + imgId).length > 0)
            ReportDateFromCalendar(inputId, imgId);
    } else {
        BuildCalendar(inputId, inputId);
        if ($('#' + imgId).length > 0)
            BuildCalendar(inputId, imgId);
    }
}

function BuildCalendar( /*输入框*/inputField, /*触发ID*/trigger) {
    Calendar.setup({
        inputField: inputField,
        trigger: trigger,
        bottomBar: true,
        weekNumbers: true,
        dateFormat: "%d/%m/%Y",
        showTime: false,
        onSelect: function() { this.hide(); }
    });
}

function showDateLimitCalendar( /*文本框ID*/inputId, /*图片ID*/imgId) {
    DateLimitCalendar(inputId, inputId);
    if ($('#' + imgId).length > 0)
        DateLimitCalendar(inputId, imgId);
}

function DateLimitCalendar( /*输入框*/inputField, /*触发ID*/trigger) {
    Calendar.setup({
        inputField: inputField,
        trigger: trigger,
        bottomBar: false,
        weekNumbers: true,
        dateFormat: "%d/%m/%Y",
        showTime: false,
        max: getMaxDate(), //日历控件允许选择的最大日期，如20130505
        onSelect: function() { this.hide(); }
    });
}

function getMaxDate() {
    var dateSpan = -1 * (365 * 18);
    var oldDate = new Date().getTime() + dateSpan * 24000 * 3600;
    var theday = new Date();
    theday.setTime(oldDate);
    var targetDate = theday.getFullYear() + '' + (1 + theday.getMonth()) + '' + theday.getDate();
    return parseInt(Number(targetDate));
}

/*Date From Calendar, min value:3 months early*/
function ReportDateFromCalendar( /*输入框*/inputField, /*触发ID*/trigger) {
    Calendar.setup({
        inputField: inputField,
        trigger: trigger,
        bottomBar: false,
        weekNumbers: true,
        dateFormat: "%d/%m/%Y",
        showTime: false,
        min: getReportMinDate(),
        //max: getMaxDate(), //日历控件允许选择的最大日期，如20130505
        onSelect: function() { this.hide(); }
    });
}

function getReportMinDate() {
    //三个月前的时间
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    var targetDate = d.getFullYear() + '' + formatMonth(1 + d.getMonth()) + '' + d.getDate();
    return parseInt(Number(targetDate));
}

function formatMonth(currMonth) {
    var dayStr = currMonth.toString();
    if (dayStr.length < 2)
        dayStr = '0' + dayStr;
    return dayStr;
}

/*jQuery DatePicker*/
function DateLimitPicker( /*输入框*/inputField) {
    var currentDate = new Date();
    var currentDateYear = currentDate.getFullYear();
    var currentDateMonth = currentDate.getMonth() + 1;
    var currentDateDay = currentDate.getDate();
    $("#" + inputField).datepicker({
        showOn: 'both',
        buttonImage: '/Css/Images/share/Calendar.gif',
        buttonImageOnly: true,
        changeMonth: true,
        changeYear: true,
        hideIfNoPrevNext: true,
        showMonthAfterYear: true,
        yearRange: "-100:+0",
        dateFormat: 'dd/mm/yy',
        //showAnim: 'slide',
        minDate: '01/01/' + (currentDateYear - 100),
        maxDate: currentDateDay + '/' + currentDateMonth + '/' + (currentDateYear - 18)
    });
}

function showTimePicker( /*输入框*/inputField, /*触发ID*/trigger) {
    $('#' + trigger).click(
        function(e) {
            $('#' + inputField).AnyTime_noPicker().AnyTime_picker(dateAndTime).focus();
            e.preventDefault();
        });
}


/*--------------------------------------------------------------------
* 分页插件 pager
* -------------------------------------------------------------------
*/
function toPagerHtml( /*PageInfo*/pageInfo) {
    var splitSize = 4;
    var pageNow = pageInfo.PageNo;
    var pageMax = 0;
    var pageSize = pageInfo.PageSize;
    var recordCount = pageInfo.ResultCount; //pageInfo.RecordCount
    var returnStr = '';

    //¼ÆËã·ÖÒ³
    //var pageDone = false;
    //if (pageDone) return;
    if (recordCount <= 0) {
        pageNow = 1;
        pageMax = 0;
    }
    //×î´óÒ³Êý
    pageMax = Math.ceil(recordCount / pageSize);
    if (pageNow > pageMax)
        pageNow = pageMax;
    if (pageMax == 0)
        return '';
    var indexStart = pageNow - splitSize;
    var indexEnd = pageNow + splitSize;

    // ÐÞÕý
    if (indexStart < 1) indexStart = 1;
    if (indexEnd > pageMax) indexEnd = pageMax;
    if (pageMax <= (splitSize * 2)) {
        indexStart = 1;
        indexEnd = pageMax;
    }

    for (var i = indexStart; i <= indexEnd; i++) {
        if (i == pageNow)
            returnStr = returnStr + "<a class=\"p_current ui-btn ui-btn-inline ui-state-disabled\">" + i + "</a>";
        else
            returnStr = returnStr + "<a href=\"javascript:TurnPage(" + i + ");\" class=\" ui-btn ui-btn-inline\">" + i + "</a>";
    }
    if (pageNow - 1 >= 1)
        returnStr = "<a  href=\"javascript:TurnPage(" + (pageNow - 1) + ");\" class=\"p_prev ui-btn ui-btn-inline\"></a>" + returnStr;
    else
        returnStr = "<a class=\"p_prev ui-btn ui-btn-inline ui-state-disabled\"></a>" + returnStr;

    if (pageNow + 1 <= pageMax)
        returnStr = returnStr + "<a  href=\"javascript:TurnPage(" + (pageNow + 1) + ");\" class=\"p_next ui-btn ui-btn-inline\"></a>";
    else
        returnStr = returnStr + "<a class=\"p_next ui-btn ui-btn-inline ui-state-disabled\"></a>";

    if (pageNow > 1)
        returnStr = "<a href=\"javascript:TurnPage(" + 1 + ");\" class=\"p_first ui-btn ui-btn-inline\"></a>" + returnStr;
    else
        returnStr = "<a class=\"p_first ui-btn ui-btn-inline ui-state-disabled\"></a>" + returnStr;

    if (pageNow < pageMax)
        returnStr = returnStr + "<a href=\"javascript:TurnPage(" + pageMax + ");\" class=\"p_last ui-btn ui-btn-inline\"></a>";
    else
        returnStr = returnStr + "<a class=\"p_last ui-btn ui-btn-inline ui-state-disabled\"></a>";
    //Êä³ö
    return "<div class=\"pageList\"><fieldset class=\"datebox\" data-role=\"controlgroup\"  data-type=\"horizontal\" data-mini=\"true\">" + returnStr + "</div></fieldset>";
}


function toHtml( /*PageInfo*/pageInfo) {
    var splitSize = 4; // µ±Ç°Ò³×óÓÒÏÔÊ¾Ò³¸öÊý
    var pageNow = pageInfo.PageNo;
    var pageMax = 0; //pageInfo.PageMax
    var pageSize = pageInfo.PageSize;
    var recordCount = pageInfo.ResultCount; //pageInfo.RecordCount
    var returnStr = '';

    //¼ÆËã·ÖÒ³
    //var pageDone = false;
    //if (pageDone) return;
    if (recordCount <= 0) {
        pageNow = 1;
        pageMax = 0;
    }
    //×î´óÒ³Êý
    pageMax = Math.ceil(recordCount / pageSize);
    if (pageNow > pageMax)
        pageNow = pageMax;
    if (pageMax == 0)
        return '';
    var indexStart = pageNow - splitSize;
    var indexEnd = pageNow + splitSize;

    // ÐÞÕý
    if (indexStart < 1) indexStart = 1;
    if (indexEnd > pageMax) indexEnd = pageMax;
    if (pageMax <= (splitSize * 2)) {
        indexStart = 1;
        indexEnd = pageMax;
    }

    for (var i = indexStart; i <= indexEnd; i++) {
        if (i == pageNow)
            returnStr = returnStr + "<a class=\"p_current\">" + i + "</a>";
        else
            returnStr = returnStr + "<a href=\"javascript:TurnPage(" + i + ");\">" + i + "</a>";
    }
    if (pageNow - 1 >= 1)
        returnStr = "<a href=\"javascript:TurnPage(" + (pageNow - 1) + ");\" class=\"p_prev\"><em>Prev</em></a>" + returnStr;
    else
        returnStr = "<a class=\"p_prev\"><em>Prev</em></a>" + returnStr;

    if (pageNow + 1 <= pageMax)
        returnStr = returnStr + "<a href=\"javascript:TurnPage(" + (pageNow + 1) + ");\" class=\"p_next\"><em>Next</em></a>";
    else
        returnStr = returnStr + "<a class=\"p_next\"><em>Next</em></a>";

    if (pageNow > 1)
        returnStr = "<a href=\"javascript:TurnPage(1);\" class=\"p_first\"><em>First</em></a>" + returnStr;
    else
        returnStr = "<a class=\"p_first\"><em>First</em></a>" + returnStr;

    if (pageNow < pageMax)
        returnStr = returnStr + "<a href=\"javascript:TurnPage(" + pageMax + ");\" class=\"p_last\"><em>Last</em></a>";
    else
        returnStr = returnStr + "<a class=\"p_last\"><em>Last</em></a>";
    //Êä³ö
    return "<div class=\"pageList\">" + returnStr + "</div>";
}

/*
//Á½ÖÖµ÷ÓÃ·½Ê½
var template1="ÎÒÊÇ{0}£¬½ñÄê{1}ÁË";
var template2="ÎÒÊÇ{name}£¬½ñÄê{age}ÁË";
var result1=template1.format("loogn",22);
var result2=template2.format({name:"loogn",age:22});
//Á½¸ö½á¹û¶¼ÊÇ"ÎÒÊÇloogn£¬½ñÄê22ÁË"
*/
//¸ñÊ½»¯×Ö·û´®Êä³ö
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var rege1 = new RegExp("({" + key + "})", "g");
                    result = result.replace(rege1, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var rege2 = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(rege2, arguments[i]);
                }
            }
        }
    }
    return result;
};
String.prototype.trimStart = function(trimStr) {
    if (!trimStr) {
        return this;
    }
    var temp = this;
    while (true) {
        if (temp.substr(0, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(trimStr.length);
    }
    return temp;
};

String.prototype.trimEnd = function(trimStr) {
    if (!trimStr) {
        return this;
    }
    var temp = this;
    while (true) {
        if (temp.substr(temp.length - trimStr.length, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(0, temp.length - trimStr.length);
    }
    return temp;
};


function htmlSpecialChars(str) {
    var s = "";
    if (str.length == 0) return "";

    for (var i = 0; i < str.length; i++) {
        switch (str.substr(i, 1)) {
        case "<":
            s += "&lt;";
            break;
        case ">":
            s += "&gt;";
            break;
        case "&":
            s += "&amp;";
            break;
        case " ":
            s += "&nbsp;";
            break;
        case "\'":
            s += "&#39;";
            break;
        case "\"":
            s += "&quot;";
            break;
        case "\n":
            s += "<br>";
            break;
        default:
            s += str.substr(i, 1);
            break;
        }
    }
    return s;
}

/*--------------------------------------------------------------------
*----
*----如下代码使用状态未知!!!! 有时间清理下
*----
*-------------------------------------------------------------------
*/

//Number
var _Number = {};
_Number.isNumber = function(s) {
    return /^\d+$/.test(s);
};
_Number.valueOf = function(s) {
    return _Number.isNumber(s) ? parseInt(s) : 0;
};
Number.prototype.toFixedFloor = function(dig) {
    dig = dig || 2;
    var pow = Math.pow(10, dig);
    var s = Math.round(this * 10000) / (10000 / pow);
    s = Math.floor(s) / 100;
    return s.toString();
};

String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2); //g全局   
};

String.prototype.replaceAll2Excep = function(s1, s2) {
    var temp = this;
    while (temp.indexOf(s1) != -1) {
        temp = temp.replace(s1, s2);
    }
    return temp;
};
String.prototype.toFixedFloor = function(dig) {
    dig = dig || 2;
    var pow = Math.pow(10, dig);
    var s = Math.round(this * 10000) / (10000 / pow);
    s = Math.floor(s) / 100;
    return s.toString();
};

//Float
var _Float = {};
_Float.isFloat = function(s) {
    return /^[\+-]?\d+(\.?\d+)?$/.test(s);
};
_Float.valueOf = function(s) {
    if (typeof (s) == 'string') s = s.replace(/,/g, '');
    return _Float.isFloat(s) ? parseFloat(s) : 0;
};

_Float.whichColor = function(s) {
    //return s < 0 ? "red" : "blue" ;
    return s < 0 ? "check" : "money";
};

_Float.setColor = function(s) {
    s = _Float.valueOf(s);
    return "<span class='" + _Float.whichColor(s) + "'>" + s + "</span>";
};

_Float.toSpecial = function(s, dig, isCor) {
    if (typeof dig == 'undefined' || !dig) {
        dig = typeof DecimalDigital == 'undefined' ? 2 : DecimalDigital;
    }
    dig = Math.abs(_Float.valueOf(dig));
    var amt = _Float.valueOf(s).toFixed(dig);
    isCor = typeof isCor == "undefined" ? true : isCor;
    var css = isCor ? _Float.whichColor(s) : "";

    var chr = amt.charAt(0), flag = "", temp = amt;
    if (/^[\+-]$/.test(chr)) {
        flag = chr;
        temp = temp.substr(1);
    }
    var reg = /\d{3}/ig;
    var arr = temp.split(".");
    var idx = arr[0].length % 3;
    var s1 = arr[0].substr(0, idx);
    var list = arr[0].substr(idx).match(reg);

    s1 = s1 != "" && s1 != arr[0] ? s1 + "," : s1;
    var tempAmt = flag + s1;
    if (list) tempAmt += list.join(",");

    if (arr[1]) {
        tempAmt = tempAmt + "." + arr[1];
    }
    if (isNullOrWhitespace(css)) return tempAmt;
    return "<span class='" + css + "'>" + tempAmt + "</span>";
};

//·µ»Ø²»´øÊ±¼äµÄÈÕÆÚ
function dateString( /*Date*/d) {
    if (typeof d == "undefined" || d == null) return '';
    var date = dateValueOf(d);
    if (typeof date == "undefined" || date == null) return '';
    return date.dateFormat('d/m/Y');
}

//·µ»Ø´øÊ±¼äµÄÈÕÆÚ
function dateTimeString( /*Date*/d) {
    if (typeof d == "undefined" || d == null) return '';
    var dd = dateValueOf(d);
    if (typeof dd == "undefined" || dd == null) return '';
    return dd.dateFormat('d/m/Y H:i:s');
}

function dateValueOf( /*object*/d) {
    var t = typeof d;
    if (t == 'number') {
        return new Date(d);
    }
    try { // "2013-01-19T00:00:00"
        var s = d.replace('T', ' ');
        return Date.parseDate(s, 'Y-m-d H:i:s');
    } catch (e) {
    }

    // "/Date(1358438400000)/"
    var s = d.replace("/Date(", "").replace(")/", "");
    return new Date(parseInt(s));
}

// comm function
var com_Function = {};
com_Function.fn_date_comm = function(d1, d2, fn) {
    var from = d1.dateFormat('Y-m-d');
    var to = d2.dateFormat('Y-m-d');

    $("input.dateFrom").val(from);
    $("input.dateTo").val(to);

    fn(from, to);
};
com_Function.fn_date_thisWeek = function(fn) {
    var d1 = new Date();
    var d2 = new Date();

    var day = d1.getDay();
    d1.setDate(d1.getDate() - day + 1);
    d2.setDate(d1.getDate() + 6);

    com_Function.fn_date_comm(d1, d2, fn);
};

com_Function.fn_date_lastWeek = function(fn) {
    var d1 = new Date();
    var d2 = new Date();

    var day = d1.getDay();

    d1.setDate(d1.getDate() - day - 6);

    var d = d1.getDate() + 6, monthDays = d2.getDaysInMonth();
    d = d > monthDays ? d - monthDays : d;

    d2.setDate(d);
    com_Function.fn_date_comm(d1, d2, fn);
};

com_Function.fn_date_yesterday = function(fn) {
    var d = new Date();
    d.setDate(d.getDate() - 1);

    com_Function.fn_date_comm(d, d, fn);
};

com_Function.fn_date_today = function(fn) {
    var d = new Date();

    com_Function.fn_date_comm(d, d, fn);
};

com_Function.fn_date_thisMonth = function(fn) {
    var d1 = new Date();
    var d2 = new Date();
    d1.setDate(1);
    d2.setMonth(d2.getMonth() + 1, 0);

    com_Function.fn_date_comm(d1, d2, fn);
};

com_Function.fn_date_lastMonth = function(fn) {
    var d1 = new Date();
    var d2 = new Date();
    d1.setMonth(d1.getMonth() - 1, 1);
    d2.setDate(0);

    com_Function.fn_date_comm(d1, d2, fn);
};

com_Function.fn_date_months = function(m, fn) {
    var d1 = new Date();
    var d2 = new Date();
    m--;
    d2.setDate(d2.getDaysInMonth());
    d1.setMonth(d2.getMonth() - m, 1);

    com_Function.fn_date_comm(d1, d2, fn);
};

com_Function.fn_timer_fresh = function(ranger, obj, fn) {
    $(obj).click(function() {
        var ranger = ranger || 60;
        var temp = ranger;
        var obj = $(this);

        if (obj.val().indexOf("Stop") > -1) {
            obj.val("Start");
            $("body").stopTime("_timer");
            return;
        }

        obj.val("Stop " + "(" + ranger + ")");

        $("body").everyTime("1s", "_timer", function() {
            temp--;
            obj.val("Stop " + "(" + temp + ")");

            if (temp == 0) {
                temp = ranger + 1;
                if (fn) fn();
            }
        }).trigger("click");
    });
};

com_Function.fn_enter = function(obj, fn) {
    $(obj).keydown(function(e) {
        var key = e.which;
        if (key == 13) {
            if (fn) fn(this);
        }
    });
};

com_Function.fn_state_save = function(name, params) {
    var dat = [];
    $.each(params, function(n, v) {
        dat.push(n + ":'" + v + "'");
    });

    dat = "{" + dat.join(",") + "}";
    $.cookie("data_store_" + name, dat, { expires: 30, path: "/" });
};

com_Function.fn_state_store = function(name, fn) {
    if (location.href.indexOf("?restore") < 0) return true;

    var dat = $.cookie("data_store_" + name);
    dat = eval("(" + dat + ")");
    return fn(dat);
};

function checkSMSContent(content) {
    return /<[a-zA-Z]+|[\{\}\|]+/g.test(content);
}

//È¥³ýÇ§·ÖºÅ
function removeSign(str) {
    return str.replace(/,/g, "");
}

function TimeString( /*Date*/d) {
    if (typeof d == "undefined" || d == null) return '';
    var dd = dateValueOf(d);
    if (typeof dd == "undefined" || dd == null) return '';
    return dd.dateFormat('Y-m-d H:i:s');
}

/*  年月日为全格式:yyyy-MM-dd HH:mm:ss
使用：GetTimeDiff("2013-11-01 16:00:00", "2013-11-03 00:00:00");
*/
function GetTimeDiff(startTime, endTime) {
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间
    return parseInt((eTime.getTime() - sTime.getTime()));
}

Date.parseFunctions = { count: 0 };
Date.parseRegexes = [];
Date.formatFunctions = { count: 0 };

Date.prototype.dateFormat = function(format) {
    if (Date.formatFunctions[format] == null) {
        Date.createNewFormat(format);
    }
    var func = Date.formatFunctions[format];
    return this[func]();
};
Date.createNewFormat = function(format) {
    var funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    var code = "Date.prototype." + funcName + " = function(){return ";
    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        } else if (special) {
            special = false;
            code += "'" + String.escape(ch) + "' + ";
        } else {
            code += Date.getFormatCode(ch);
        }
    }
    eval(code.substring(0, code.length - 3) + ";}");
};
Date.getFormatCode = function(character) {
    switch (character) {
    case "d":
        return "String.leftPad(this.getDate(), 2, '0') + ";
    case "D":
        return "Date.dayNames[this.getDay()].substring(0, 3) + ";
    case "j":
        return "this.getDate() + ";
    case "l":
        return "Date.dayNames[this.getDay()] + ";
    case "S":
        return "this.getSuffix() + ";
    case "w":
        return "this.getDay() + ";
    case "z":
        return "this.getDayOfYear() + ";
    case "W":
        return "this.getWeekOfYear() + ";
    case "F":
        return "Date.monthNames[this.getMonth()] + ";
    case "m":
        return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
    case "M":
        return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
    case "n":
        return "(this.getMonth() + 1) + ";
    case "t":
        return "this.getDaysInMonth() + ";
    case "L":
        return "(this.isLeapYear() ? 1 : 0) + ";
    case "Y":
        return "this.getFullYear() + ";
    case "y":
        return "('' + this.getFullYear()).substring(2, 4) + ";
    case "a":
        return "(this.getHours() < 12 ? 'am' : 'pm') + ";
    case "A":
        return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
    case "g":
        return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
    case "G":
        return "this.getHours() + ";
    case "h":
        return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
    case "H":
        return "String.leftPad(this.getHours(), 2, '0') + ";
    case "i":
        return "String.leftPad(this.getMinutes(), 2, '0') + ";
    case "s":
        return "String.leftPad(this.getSeconds(), 2, '0') + ";
    case "O":
        return "this.getGMTOffset() + ";
    case "T":
        return "this.getTimezone() + ";
    case "Z":
        return "(this.getTimezoneOffset() * -60) + ";
    default:
        return "'" + String.escape(character) + "' + ";
    }
};
Date.parseDate = function(input, format) {
    if (Date.parseFunctions[format] == null) {
        Date.createParser(format);
    }
    var func = Date.parseFunctions[format];
    return Date[func](input);
};
Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;

    var code = "Date." + funcName + " = function(input){\n"
        + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n"
        + "var d = new Date();\n"
        + "y = d.getFullYear();\n"
        + "m = d.getMonth();\n"
        + "d = d.getDate();\n"
        + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
        + "if (results && results.length > 0) {";
    var regex = "";

    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        } else if (special) {
            special = false;
            regex += String.escape(ch);
        } else {
            obj = Date.formatCodeToRegex(ch, currentGroup);
            currentGroup += obj.g;
            regex += obj.s;
            if (obj.g && obj.c) {
                code += obj.c;
            }
        }
    }

    code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
        + "{return new Date(y, m, d, h, i, s);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
        + "{return new Date(y, m, d, h, i);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n"
        + "{return new Date(y, m, d, h);}\n"
        + "else if (y > 0 && m >= 0 && d > 0)\n"
        + "{return new Date(y, m, d);}\n"
        + "else if (y > 0 && m >= 0)\n"
        + "{return new Date(y, m);}\n"
        + "else if (y > 0)\n"
        + "{return new Date(y);}\n"
        + "}return null;}";

    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
    eval(code);
};
Date.formatCodeToRegex = function(character, currentGroup) {
    switch (character) {
    case "D":
        return {
            g: 0,
            c: null,
            s: "(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"
        };
    case "j":
    case "d":
        return {
            g: 1,
            c: "d = parseInt(results[" + currentGroup + "], 10);\n",
            s: "(\\d{1,2})"
        };
    case "l":
        return {
            g: 0,
            c: null,
            s: "(?:" + Date.dayNames.join("|") + ")"
        };
    case "S":
        return {
            g: 0,
            c: null,
            s: "(?:st|nd|rd|th)"
        };
    case "w":
        return {
            g: 0,
            c: null,
            s: "\\d"
        };
    case "z":
        return {
            g: 0,
            c: null,
            s: "(?:\\d{1,3})"
        };
    case "W":
        return {
            g: 0,
            c: null,
            s: "(?:\\d{2})"
        };
    case "F":
        return {
            g: 1,
            c: "m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n",
            s: "(" + Date.monthNames.join("|") + ")"
        };
    case "M":
        return {
            g: 1,
            c: "m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n",
            s: "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
        };
    case "n":
    case "m":
        return {
            g: 1,
            c: "m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
            s: "(\\d{1,2})"
        };
    case "t":
        return {
            g: 0,
            c: null,
            s: "\\d{1,2}"
        };
    case "L":
        return {
            g: 0,
            c: null,
            s: "(?:1|0)"
        };
    case "Y":
        return {
            g: 1,
            c: "y = parseInt(results[" + currentGroup + "], 10);\n",
            s: "(\\d{4})"
        };
    case "y":
        return {
            g: 1,
            c: "var ty = parseInt(results[" + currentGroup + "], 10);\n"
                + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
            s: "(\\d{1,2})"
        };
    case "a":
        return {
            g: 1,
            c: "if (results[" + currentGroup + "] == 'am') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s: "(am|pm)"
        };
    case "A":
        return {
            g: 1,
            c: "if (results[" + currentGroup + "] == 'AM') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s: "(AM|PM)"
        };
    case "g":
    case "G":
    case "h":
    case "H":
        return {
            g: 1,
            c: "h = parseInt(results[" + currentGroup + "], 10);\n",
            s: "(\\d{1,2})"
        };
    case "i":
        return {
            g: 1,
            c: "i = parseInt(results[" + currentGroup + "], 10);\n",
            s: "(\\d{2})"
        };
    case "s":
        return {
            g: 1,
            c: "s = parseInt(results[" + currentGroup + "], 10);\n",
            s: "(\\d{2})"
        };
    case "O":
        return {
            g: 0,
            c: null,
            s: "[+-]\\d{4}"
        };
    case "T":
        return {
            g: 0,
            c: null,
            s: "[A-Z]{3}"
        };
    case "Z":
        return {
            g: 0,
            c: null,
            s: "[+-]\\d{1,5}"
        };
    default:
        return {
            g: 0,
            c: null,
            s: String.escape(character)
        };
    }
};
Date.prototype.getTimezone = function() {
    return this.toString().replace(
        /^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(
        /^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
};
Date.prototype.getGMTOffset = function() {
    return (this.getTimezoneOffset() > 0 ? "-" : "+")
        + String.leftPad(Math.floor(this.getTimezoneOffset() / 60), 2, "0")
        + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
};
Date.prototype.getDayOfYear = function() {
    var num = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (var i = 0; i < this.getMonth(); ++i) {
        num += Date.daysInMonth[i];
    }
    return num + this.getDate() - 1;
};
Date.prototype.getWeekOfYear = function() {
    // Skip to Thursday of this week
    var now = this.getDayOfYear() + (4 - this.getDay());
    // Find the first Thursday of the year
    var jan1 = new Date(this.getFullYear(), 0, 1);
    var then = (7 - jan1.getDay() + 4);
    document.write(then);
    return String.leftPad(((now - then) / 7) + 1, 2, "0");
};
Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    return ((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
};
Date.prototype.getFirstDayOfMonth = function() {
    var day = (this.getDay() - (this.getDate() - 1)) % 7;
    return (day < 0) ? (day + 7) : day;
};
Date.prototype.getLastDayOfMonth = function() {
    var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return (day < 0) ? (day + 7) : day;
};
Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()];
};
Date.prototype.getSuffix = function() {
    switch (this.getDate()) {
    case 1:
    case 21:
    case 31:
        return "st";
    case 2:
    case 22:
        return "nd";
    case 3:
    case 23:
        return "rd";
    default:
        return "th";
    }
};
String.escape = function(string) {
    return string.replace(/('|\\)/g, "\\$1");
};
String.leftPad = function(val, size, ch) {
    var result = new String(val);
    if (ch == null) {
        ch = " ";
    }
    while (result.length < size) {
        result = ch + result;
    }
    return result;
};
Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.monthNames =
[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
Date.dayNames =
[
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
Date.y2kYear = 50;
Date.monthNumbers = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
};
Date.patterns = {
    ISO8601LongPattern: "Y-m-d H:i:s",
    ISO8601ShortPattern: "Y-m-d",
    ShortDatePattern: "n/j/Y",
    LongDatePattern: "l, F d, Y",
    FullDateTimePattern: "l, F d, Y g:i:s A",
    MonthDayPattern: "F d",
    ShortTimePattern: "g:i A",
    LongTimePattern: "g:i:s A",
    SortableDateTimePattern: "Y-m-d\\TH:i:s",
    UniversalSortableDateTimePattern: "Y-m-d H:i:sO",
    YearMonthPattern: "F, Y"
};


/*
* 加密解密
* */
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
    63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4)
                | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            // 0xxxxxxx
            out += str.charAt(i - 1);
            break;
        case 12:
        case 13:
            // 110x xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
        case 14:
            // 1110 xxxx 10xx xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            char3 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x0F) << 12)
                | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
            break;
        }
    }
    return out;
}


//user.js
$.user = $(window);
$.user.getcurrent = function() {
    return $.local.getLocalData("userinfo", 1000 * 60 * 10);
};
$.user.logoutEvent = function() {
    $.user.trigger("user.logout.success");
};
$.user.getCurrency = function() {
    return $.user.ckloginstatu() ? $("#lbCurrency").text() : "";
};
$.user.login = function(formname, fn) {
    $.user.trigger("user.login.before");
    $.until.postJSON({
        url: '/Login',
        data: { UID: $("#UID").val(), PWD: $("#PWD").val() },
        showloading: {
            obj: $("body"),
            mask: true
        },
        success: function(rsp) {
            $(formname).find("input[type='text'], input[type='password']").val("");
            $.local.setLocalData("userinfo", rsp, 1000 * 60 * 10);
            fn(rsp);
            $.user.trigger("user.login.success", rsp);
        },
        error: function(rsp) {
            $.until.msg.show(rsp.Msg);
            $(formname).find("input[type='text'], input[type='password']").val("");
        }
    });
};

$.user.fastlogin = function(formname, fn) {
    $.user.trigger("user.login.before");
    $.until.postJSON({
        url: '/Login',
        data: { UID: $("#userid").val(), PWD: $("#password").val() },
        showloading: {
            obj: $("body"),
            mask: true
        },
        success: function(rsp) {
            $(formname).find("input[type='text'], input[type='password']").val("");
            $.local.setLocalData("userinfo", rsp, 1000 * 60 * 10);
            fn(rsp);
            $.user.trigger("user.login.success", rsp);
            $(".cd-user-modal").click();
        },
        error: function(rsp) {
            $.until.msg.show(rsp.Msg);
            $(formname).find("input[type='text'], input[type='password']").val("");
        }
    });
};
$.user.fastRegister = function(formname, fn) {

    $.until.postJSON({
        url: '/FastRegister',
        data: { FirstMemId: $("#FirstMemId").val(), FirstPassword: $("#FirstPassword").val(), FirstCurrId: $("#FirstCurrId").val() },
        showloading: {
            obj: $("body"),
            mask: true
        },
        success: function(rsp) {
            $(formname).find("input[type='text'], input[type='password']").val("");
            fn(rsp);
        },
        error: function(rsp) {
            $.until.msg.show(rsp.Msg);
            $(formname).find("input[type='text'], input[type='password']").val("");
        }
    });
};


$.user.ckloginstatu = function() {
    //临时简单
    return $(".userinfo-top-view").is(":visible");
};

$.user.gohome = function() {
    if (typeof (isdilogwin) != "undefined") {
        window.opener.document.location.reload();
        window.close();
    }
    document.location.reload();
};

$.user.logout = function(obj) {
    $(".ad-right-content").show();
    $(".mini-games").hide();
    $.user.trigger("user.logout.before");
    $.until.getJSON({
        url: "/Logout?" + Math.random(),
        showloading: { obj: $("body"), mask: true },
        success: function() {
            $.user.trigger("user.logout.success");
        },
        error: function() { //add for some time return -1
            $.user.trigger("user.logout.success");
        },
    });
};

$.user.reg = function(formname, fn) {
    $(formname).postForm(function(rsp) {
        $.local.setLocalData("userinfo", rsp.Model); //save
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};

$.user.showloginView = function() {
    //临时处理
    $.until.msg.show(needLoginMsg);
};

$.user.getnew = function() {
};

$.user.cgpwd = function(formname, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};
$.user.cguserinfo = function(formname, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};
$.user.disposit = function() {
};
$.user.findpwd = function() {
};

$.user.resetpwd = function(formname, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};

$.user.transfer = function(formname, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};

$.user.withdrawal = function(formname, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};


$.user.getmsg = function() {
};

$(document).ready(function() {
    //extend event
    $("[event='user.logout']").unbind("click").on("click", function() {
        $.user.logout($(this));
    });
});


$.user.report = function() {};
$.user.report.PromotionBonus = function(formname, page, size, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};

$.user.report.TransactionList = function(formname, page, size, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};

$.user.report.TransferList = function(formname, page, size, fn) {
    $(formname).postForm(function(rsp) {
        fn(rsp);
    }, function(rsp) {
        $.until.msg.show(rsp.Msg);
    });
};

//reg currency
$.user.GetCurrencyList = function() {
    $.ajax({
        url: '/CurrencyList?' + Math.random(),
        data: { act: 'queryCurrency' },
        dataType: "json",
        success: function(rsp) {
            bindCurrencyList(rsp);
        }
    });
};
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

function bindCurrencyList(rsp) {
    var list = rsp.List;
    var shtml = [];
    var lang = $.cookie("language").toLocaleLowerCase(); //"en-US"
    if (list.length < 1) {
        shtml.push("<option value=''>No Currency</option>");
    } else {
        $.each(list, function(i, item) {
            if ((lang == "en-us" || lang == "id-id") && item.CurrId == "IDR") {
                shtml.push("<option value=" + item.CurrId + " selected='selected'>" + item.CurrId + "</option>");
            } else if (lang == "zh-cn" && item.CurrId == "CNY") {
                shtml.push("<option value=" + item.CurrId + " selected='selected'>" + item.CurrId + "</option>");
            } else {
                shtml.push("<option value=" + item.CurrId + ">" + item.CurrId + "</option>");
            }
        });
    }
    $('#FirstCurrId').html(shtml.join(''));
}
function isNullOrWhitespace(input) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}
function searchDropdawn(inputId, ulid) {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(ulid);
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i];
        //if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        //    li[i].style.display = "";
        //} else {
        //    li[i].style.display = "none";
        //}
        if (a.innerHTML.toUpperCase().substring(0, filter.length) == filter) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}