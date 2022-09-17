//存放每頁共用的的功能
var culture = "/" + $.cookie("language");
var language = $.cookie("language");
axios.defaults.headers.common['__RequestVerificationToken'] = $("#hdnAntiForgeryTokens").val();
//start page ready
$(document).ready(function () {
    $("a").on('click', function (e) {
        var obj = $(this);
        if (obj.attr('href') == '#')
            e.preventDefault();
    });
    //將input加入千分位
    TextBoxNumberToAddComma();
    //登出
    $("#LooutButton").on('click', function () {
        $(".wait_icon").show();//開啟遮罩
        $('#logoutUrlHidden').val(memoryLastUrl);
        $('#LogoutActionFrm').submit();
    });

    //將存在的連絡方式顯示在右方livechat
    //紀錄每個語系的聯絡方式 用在contact us和右方浮動資訊，maintenancet,restrict 請於個別頁面加上
    var siderlist = '';
    var status = '';
    var fLang = language.toUpperCase();
    var contactjson = $.getJSON("../../../Json/ContactList.json", function () {
        status = contactjson.responseJSON;
        if (status[fLang] != null) {
            !(status[fLang].Email1) ? $("[contact-type='email']").parent().hide().remove() : ($("[contact-type='email']").parent().show());
            !(status[fLang].Line1) ? $("[contact-type='line']").parent().hide().remove() : ($("[contact-type='line']").parent().show());
            !(status[fLang].Skype1) ? $("[contact-type='skype']").parent().hide().remove() : ($("[contact-type='skype']").parent().show());
            !(status[fLang].Wechat1) ? $("[contact-type='wechat']").parent().hide().remove() : ($("[contact-type='wechat']").parent().show());
            !(status[fLang].Telephone1) ? $("[contact-type='phone']").parent().hide().remove() : ($("[contact-type='phone']").parent().show());
            !(status[fLang].Whatsapp1) ? $("[contact-type='watsapp']").parent().hide().remove() : ($("[contact-type='watsapp']").parent().show());
            !(status[fLang].Yahoomsg1) ? $("[contact-type='yahoo']").parent().hide().remove() : ($("[contact-type='yahoo']").parent().show());
            !(status[fLang].smsnumber) ? $("[contact-type='smsnumber']").parent().hide().remove() : ($("[contact-type='smsnumber']").parent().show());
            !(status[fLang].Kakaotalk1) ? $("[contact-type='kakaotalk']").parent().hide().remove() : ($("[contact-type='kakaotalk']").parent().show());
            !(status[fLang].Telegram1) ? $("[contact-type='telegram']").parent().hide().remove() : ($("[contact-type='telegram']").parent().show());
            !(status[fLang].Zalo1) ? $("[contact-type='zalo']").parent().hide().remove() : ($("[contact-type='zalo']").parent().show());
            !(status[fLang].Bbm1) ? $("[contact-type='bbm']").parent().hide().remove() : ($("[contact-type='bbm']").parent().show());
            !(status[fLang].Qq1) ? $("[contact-type='qq']").parent().hide().remove() : ($("[contact-type='qq']").parent().show());
            !(status[fLang].Facebook) ? $("[contact-type='facebook']").parent().hide().remove() : ($("[contact-type='facebook']").parent().show(), $("[contact-type='facebook']").attr("href", status[fLang].Facebook).attr("target", "_blank").text(status[fLang].Facebook));
            !(status[fLang].Twitter) ? $("[contact-type='twiter']").parent().hide().remove() : ($("[contact-type='twiter']").parent().show(), $("[contact-type='twiter']").attr("href", status[fLang].Twitter).attr("target", "_blank").text(status[fLang].Twitter));
            !(status[fLang].Linkedin) ? $("[contact-type='linkedin']").parent().hide().remove() : ($("[contact-type='linkedin']").parent().show(), $("[contact-type='linkedin']").attr("href", status[fLang].Linkedin).attr("target", "_blank").text(status[fLang].Linkedin));
            !(status[fLang].Pinterest) ? $("[contact-type='pinterest']").parent().hide().remove() : ($("[contact-type='pinterest']").parent().show(), $("[contact-type='pinterest']").attr("href", status[fLang].Pinterest).attr("target", "_blank").text(status[fLang].Pinterest));
        }
    });

    $("[contact-type='email']").on('click', function () {
        var email = $(this).html();
        window.location = "mailto:" + email + "";
    });
    $("[contact-type='skype']").on('click', function () {
        var skype = $(this).html();
        window.location = "skype:" + skype + "?chat";
    });

    $("a[target='livechat']").on("click", function (e) {
        e.preventDefault();
        var obj = $(this);
        popLiveChat(obj.attr("href"));
    });
    $("#LoginErrorButton").on("click", function () {
        hideMaskByDivID("logRegModal");
    });
    //使用Esc键关闭弹出窗口
    $(document).keyup(function (event) {
        if (event.which == '27') {
            hideMaskByDivID("logRegModal");
        }
    });

    //amount欄位點選後全選
    $(document).on("click", ":input[type=text][data-select=\"all\"]", function () {
        this.focus();
        this.select();
        //兼容safari的全選
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            this.setSelectionRange(0, 9999);
        }
    });

    if ($("#memberMoney").text() === "0") {
        var hasStorage = ("sessionStorage" in window && window.sessionStorage),
            storageKey = "IcBalance",
            now, expiration, data = false, isEnableCache = false;
        try {
            if (hasStorage && isEnableCache) {
                data = sessionStorage.getItem(storageKey);
                if (data) {
                    // extract saved object from JSON encoded string
                    data = JSON.parse(data);

                    // calculate expiration time for content,
                    // to force periodic refresh after 5 seconds
                    now = new Date();
                    expiration = new Date(data.timestamp);
                    expiration.setSeconds(expiration.getSeconds() + 30);
                    if (now.getTime() > expiration.getTime()) {
                        sessionStorage.removeItem(storageKey);
                        PressQueryMainWallet();
                    } else {
                        var templbAmount = $("#lbAmount").html().split('&nbsp;')[0];
                        var money = data.balance;
                        $("#lbAmount").html(templbAmount.concat('&nbsp;', _Float.toSpecial(money, 2, false)));
                    }
                } else {
                    PressQueryMainWallet();
                }
            } else {
                PressQueryMainWallet();
            }
        }
        catch (e) {
            console.log(e);
            PressQueryMainWallet();
        }
    }

    if ($("#memberWallet").length > 0) {
        PressQueryWallet();
    }
});
//end page ready

//檢查系統狀態
function CheckSysState() {
    $.until.postJSON({
        url: culture + "/Base/CheckState?" + Math.random(),
        success: function (rsp) {
            if (rsp.System == 4) {
                document.location.href = culture + "/Home/Maintenance";
            }
        },
        error: function (rsp) {
            window.console.log(rsp.Msg);
        }
    });
}

//顯示popup和背景mask (傳入popup的id)
function showMaskByDivID(divId) {
    $('#dialog-mask').css('display', 'block');
    $("#" + divId).css('display', 'block');
    if (divId == "logRegModal") {
        checkinputvalueisnotnull();
    }
}
//隱藏popup和背景mask (傳入popup的id)
function hideMaskByDivID(divId) {
    $('#dialog-mask').css('display', 'none');
    $("#" + divId).css('display', 'none');
}

//取得各Common Resources 的內容
var GetResources = function (code) {
    var text;
    var data = {
        code: code
    };
    var token = $("#hdnAntiForgeryTokens").val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    $.ajax({
        url: culture + "/Home/GetResources",
        type: 'POST',
        async: false,
        data: data,
        headers: headers,
        success: function (datas) {
            text = datas;
        },
        error: function (e) {
            popMessage(e.responseText);
        },
        cache: false
    });

    return text;
};

//取得Pages Resources 內容
var GetMessage = function (code) {
    var text;
    var data = {
        code: code
    };
    var token = $("#hdnAntiForgeryTokens").val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    var sessionKey = code + culture;
    var isSessionStorage = sessionStorage.getItem(sessionKey);
    if (isSessionStorage) {
        text = isSessionStorage;
    } else {
        $.ajax({
            url: culture + "/Home/GetMessage",
            type: 'POST',
            async: false,
            headers: headers,
            data: data,
            success: function (datas) {
                text = datas;
                sessionStorage.setItem(sessionKey, datas);
            },
            error: function (e) {
                popMessage(e.responseText);
            },
            cache: false
        });
    }

    return text;
};

var memberWin;
function popMember(url) {
    var w = 953;
    var h = 685;
    var winX = (screen.availWidth - w) / 2;
    var winY = 50;
    var paras = 'width=' + w + 'px,height=' + h + 'px,left=' + winX + 'px,top=' + winY + 'px,scrollbars=yes,resizable=yes';
    memberWin = window.open(url, 'Member', paras);
    memberWin.focus();
    $(document).on('click', '#LooutButton', function (e) {
        memberWin.close();
    })
    return false;
}
var UserInfoWin;
function popUserInfo(url) {
    var w = 780;
    var h = 548;
    var winX = (screen.availWidth - w) / 2;
    var winY = 50;
    var paras = 'width=' + w + 'px,height=' + h + 'px,left=' + winX + 'px,top=' + winY + 'px,scrollbars=yes,resizable=yes';
    UserInfoWin = window.open(url, 'UserInfo', paras);
    UserInfoWin.focus();
    return false;
}
var HelpWin;
function popHelp(url) {
    var w = 920;
    var h = 695;
    var winX = (screen.availWidth - w) / 2;
    var winY = 50;
    var paras = 'width=' + w + 'px,height=' + h + 'px,left=' + winX + 'px,top=' + winY + 'px,scrollbars=yes,resizable=yes';
    HelpWin = window.open(url, 'HelpWin', paras);
    HelpWin.focus();
    return false;
}
var chat;
function popLiveChat(url) {
    var w = 475;
    var h = 465;
    var winX = (screen.availWidth - w) / 2;
    var winY = 50;
    //language = !(url.indexOf('?') > 0) ? $.cookie('language') : url.substring(url.indexOf('?') + 1);//判斷是否是由左方contact us 小國旗點擊進來的，如果不是則依當前語系顯示對應livechat視窗
    //if (language != "zh-CN") {
    //    w = 310;
    //    h = 400;
    //}
    var paras = 'width=' + w + 'px,height=' + h + 'px,left=' + winX + 'px,top=' + winY + 'px,scrollbars=yes,resizable=yes';
    chat = window.open(url, 'LiveChat', paras);
    chat.focus();
    return false;
}

//sharethis.js
var shareico = {
    "qzone": "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={picpath}&summary=",
    "tsina": "http://service.weibo.com/share/share.php?title={title}&url={url}&source=bookmark&appkey=2992571369",
    "tqq": "http://v.t.qq.com/share/share.php?title={title}&url={url}&appkey=118cd1d635c44eab9a4840b2fbf8b0fb&pic=",
    "renren": "http://share.renren.com/share/buttonshare.do?link={url}&title={title}",
    //  "xiaoyou": "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url={url}",
    "twitter": "https://twitter.com/intent/tweet?text={title}&url={url}",
    "linkedin": "https://www.linkedin.com/shareArticle?source=&title={title}&armin=armin&summary=&mini=true&url={url}&ro=true",
    "pinterest": "https://www.pinterest.com/pin/create/bookmarklet/?url={url}&media=&title={title}&alt=",
    "facebook": "https://www.facebook.com/sharer/sharer.php?s=100&p%5Btitle%5D={title}&p%5Bsummary%5D={title}&p%5Burl%5D={url}&p%5Bimages%5D"
    //  "pinterest": "http://www.pinterest.com/pin/create/bookmarklet/?url={url}&media={picpath}&title={title}&alt="

};
var title = document.title;
var url = window.location.href;
var shareurl;
var surl;
var media;
//site  类型
//content 内容
//newurl 分享链接
//newimg  图片
function ShareThis(site, content, newurl, newimg) {
    if (site != null && site != "") {
        for (var s in shareico) {
            if (s == site) {
                shareurl = shareico[s];
                break;
            }
        }
        if (content == null || content == "") {
            if (site.length > 5) {
                surl = shareurl.replace("{title}", escape(title));
            } else {
                surl = shareurl.replace("{title}", encodeURI(title));
            }
        } else {
            if (site.length > 5) {
                surl = shareurl.replace("{title}", escape(content));
            } else {
                surl = shareurl.replace("{title}", encodeURI(content));
            }
        }
        if (newurl == null || newurl == "") {
            surl = surl.replace("{url}", url);
        } else {
            surl = surl.replace("{url}", newurl);
        }
        window.open(surl);
    }
};

function ApiPost( /*POST網址*/ url, /*資料*/ data, /*成功之後要處理的函式*/ callback, /*bool 開啟遮罩*/ showMask) {
    if (showMask) {
        $(".wait_icon").eq(0).show();//開啟遮罩
    }
    axios({
        method: 'post',
        url: url,
        data: data,
        responseType: 'json'
    },
        {
            headers: {
                "__RequestVerificationToken": $("#hdnAntiForgeryTokens").val()
            }
        }).then(function (response) {
            if (response.data.Code > 0 || response.data.Code == -1) {

                if (response.data.Message) {
                    popMessage(response.data.Message)
                } else {
                    popMessage(response.data.Msg);
                }

                if (response.data.Code == 6) {
                    $("#dialog-close").bind("click", function () {
                        window.location.href = "/";
                    });
                    $("#dialog-mask").bind("click", function () {
                        window.location.href = "/";
                    });
                }

                $(".wait_icon").hide();
                return;
            }
            callback(response);
            $(".wait_icon").hide();
        }).catch(function (error) {
            if (error.response.status === 403) {
                window.location.replace("/");
            } else {
                console.log(error);
                $(".wait_icon").hide(); //關閉遮罩
            }
        });
};

function AjaxPost(/*POST網址*/url, /*同步處理*/async, /*資料*/ data, /*成功之後要處理的函式*/callback, /*bool 開啟遮罩*/ showMask) {
    if (showMask == null) {
        showMask = true;
    }
    if (showMask) {
        $(".wait_icon").show();//開啟遮罩
    }
    var token = $("#hdnAntiForgeryTokens").val();
    var headers = {
        "__RequestVerificationToken": token
    };

    $.ajax({
        url: url,
        type: 'POST',
        async: async,
        dataType: "json",
        headers: headers,
        data: data,
        success: function (datas) {
            if (datas.code > 0) {
                popMessage(datas.msg);
                return;
            };
            callback(datas);
            $(".wait_icon").hide();
        },
        error: function (e) {
            //alert(e.responseText);
            $(".wait_icon").hide();//關閉遮罩
        },
        cache: false
    });
}

function QueryMainWallet() {
    var token = $("#hdnAntiForgeryTokens").val();
    var headers = {};
    headers["__RequestVerificationToken"] = token;
    var data = {
        providerId: '-'
    };
    $.until.log("start:QueryMainWallet");
    $.until.postJSON({
        url: culture + '/Account/GetBalance',
        data: data,
        headers: headers,
        debug: true,
        success: function (rsp) {
            if (rsp != null) {
                $("#lbAmount").html(_Float.toSpecial(rsp, 2, false));
                $.local.setLocalData("userinfo", $.parseJSON("" + rsp.UserInfo), 1000 * 60 * 10);
            }
        },
        error: function () {
            $.until.log("start:stopQueryMainWallet");
            $(document).stopTime('IndexQueryWallet');
        }
    });
}

var allowClick = true;
$("#lbAmount").on("click", function (e) {
    e.preventDefault();
    if (e.target.dataset.action === "WithdrawBack") {
        if (!allowClick) return;
        allowClick = false;
        setTimeout(function() {
                allowClick = true;
            },
            1000);
        ApiPost('/api/Account/WithdrawBack',
            {},
            function(response) {
                if (response.data.Code == 0) {
                    PressQueryMainWallet();
                }
            },
            false
        );
    } else {
        PressQueryMainWallet();
    }
});

var isReqBalance = false;
var in1Sec = false;

function PressQueryMainWallet() {
    if (isReqBalance || in1Sec)
        return;
    isReqBalance = true;
    in1Sec = true;
    $("#lbAmount").css("cursor", "wait");
    setTimeout(function () {
        in1Sec = false;
        $("#lbAmount").css("cursor", "");
    }, 1000);

    var templbAmount = $("#lbAmount").html().split('&nbsp;')[0];
    var templbAmount_amt = $("#lbAmount").html().split('&nbsp;')[1];
    $("#lbAmount").html('<img src="/Content/Web/common/images/wait_load.gif" alt="" hight="15px" width="15px">');
    var data = {
        "ProviderId": "-"
    };

    axios({
        method: 'post',
        url: '/api/Account/GetBalance',
        data: data,
        responseType: 'json'
    },
        {
            headers: {
                "__RequestVerificationToken": $("#hdnAntiForgeryTokens").val()
            }
        }).then(function (response) {
            isReqBalance = false;
            if (response.data.Code > 0 || response.data.Code == -1) {

                if (response.data.Message) {
                    popMessage(response.data.Message)
                } else {
                    popMessage(response.data.Msg);
                }

                if (response.data.Code == 6) {
                    $("#dialog-close").bind("click", function () {
                        window.location.href = "/";
                    });
                    $("#dialog-mask").bind("click", function () {
                        window.location.href = "/";
                    });
                }
                return;
            }
            var hasStorage = ("sessionStorage" in window && window.sessionStorage);
            if (hasStorage) {
                try {
                    var storageKey = "IcBalance";
                    sessionStorage.setItem(storageKey, JSON.stringify({
                        timestamp: new Date(),
                        balance: response.data.Data.Balance
                    }));
                }
                catch (e) {
                    // silently suppress, it doesn't really matter
                    console.log(e);
                }
            }

            var money = response.data.Data.Balance;
            var amt = $(templbAmount_amt).text(_Float.toSpecial(money, 2, false));
            $("#lbAmount").html(templbAmount.concat('&nbsp;', amt[0].outerHTML));
        }).catch(function (error) {
            isReqBalance = false;
            console.log(error);
        });
}

function PressQueryWallet() {
    var templbAmount = $("#lbAmount").html().split('&nbsp;')[0];
    var templbAmount_amt = $("#lbAmount").html().split('&nbsp;')[1];
    $("#lbAmount").html('<img src="/Content/Web/common/images/wait_load.gif" alt="" hight="15px" width="15px">');

    ApiPost('/api/Account/GetWalletBalance',
        {},
        function (response) {
            var money = response.data.Data.Balance;
            var amt = $(templbAmount_amt).text(_Float.toSpecial(money, 2, false));
            $("#lbAmount").html(templbAmount.concat('&nbsp;', amt[0].outerHTML));
        },
        false
    );
}

//亂數選取a~b之間的數字
function randomizator(a, b) {
    var min = Math.ceil(a);
    var max = Math.floor(b);
    return Math.floor(Math.random() * (max - min)) + min;
}

function checkinputvalueisnotnull() {
    $('#logRegModal input').each(function () {
        var $element = $(this);
        if ($element.val()) {
            $("label[for='" + this.id + "']").addClass("active");
        }
    });

}
function reCheckReferral(currId) {
    var url = culture + "/Base/SupportReferral";
    $.ajax({
        url: url,
        async: false,
        type: "GET",
        success: function (rsp) {
            var supportReferral = rsp.split(',');
            if (supportReferral.indexOf(currId) < 0) {
                $('[data-area="ReferralId"]').hide();
            } else {
                $('[data-area="ReferralId"]').show();
            }
        },
        error: function (rsp) {
        }
    });
}

var memoryLastUrl = function () {
    var href = document.location.href;
    var search = document.location.search;
    var result = "";
    if (href.indexOf(search) >= 0) {
        result = href.replace(search, "");
    }
    var hash = window.top.location.hash;
    if (hash.length < 1) {
        result = result.replace("#", "");
    } else {
        result = result.replace(hash, "");
    }
    return result;
}

//數字處理為有千分位
function AppendComma(n, allowPoint) {
    //^\d+([\.]\d{0,2})?$
    if (n == 0 || n == "0") {
        return 0;
    }
    if (allowPoint) {
        //可以小數點
        var isFloat = /^\d+([\.]\d{0,2})?$/.test(n);
        if (isFloat) {
            if (!Number(n)) {
                return n.slice(0, -1);
            }
        }
    } else {
        if (/^((\d+)|(0))$/.test(n)) {
            var newValue = /^((\d+)|(0))$/.exec(n);
            if (newValue != null) {
                if (parseInt(newValue, 10)) {
                    n = parseInt(newValue, 10).toString();
                } else {
                    return n.slice(0, -1);
                }
            } else {
                return n.slice(0, -1);
            }
        } else {
            return n.toString().slice(0, -1);
        }
    }

    n += '';
    var arr = n.split('.');
    var re = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(re, '$1,') + (arr.length >= 2 ? '.' + arr[1] : '');
}
//將有千分位的數值轉為一般數字
function RemoveComma(n) {
    return n.toString().replace(/[,]+/g, '');
}
//調整千分位
function AdjustComma(item, allowPoint) {
    var originalValue = RemoveComma($.trim($(item).val()));
    if (/\b(0+)/gi.test(originalValue)) {
        originalValue = originalValue.replace(/\b(0+)/gi, "");
        $(item).val(AppendComma(originalValue, allowPoint));
    } else {
        $(item).val(AppendComma(originalValue, allowPoint));
    }
}

function TextBoxNumberToAddComma() {
    $(':input[type=text][data-comma="true"]').each(function (i, item) {
        $(item).blur(function () {
            //加千分位
            if ($(item).attr("data-point") == "true") {
                AdjustComma(this, true);
            } else {
                AdjustComma(this, false);
            }
        }).keyup(function () {
            //加千分位
            if ($(item).attr("data-point") == "true") {
                AdjustComma(this, true);
            } else {
                AdjustComma(this, false);
            }
        });
    });
}

function showRealMoneyWithComma(value) {
    return AppendComma(Number(RemoveComma(value)) * 1000);
}

function checkIsPortable() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

