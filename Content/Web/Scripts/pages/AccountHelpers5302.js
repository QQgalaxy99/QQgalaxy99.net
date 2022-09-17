//取得各Provider的帳戶餘額
var culture = "/" + $.cookie("language");
var GetBalance = function (type, callback) {
    var data = {
        providerId: type
    };
    ApiPost("/api/Account/GetBalance", data, callback ,true);
};
var GetSOSPromotion = function (type, balance) {
    var data = {
        providerId: type
    };
    if (data.providerId !== "-") {
        var $this = this;
        var sos = '#SOS_' + type;
        if ($this.ckSOSPromotion(data.providerId, balance)) {
            $(sos).show();
            $(sos).bind("click",
                function () {
                    var cfContinue = false;
                    // bruce: 這裡要做多國語系:
                    cfContinue = confirm(GetMessage("GetSosComfirm"));
                    if (cfContinue) {
                        // Bruce: 確定要領取Promotion, then....
                        var req = {
                            act: "add",
                            providerId: data.providerId
                        }
                        $.until.postJSON({
                            url: culture + '/Account/PromoteSOS?' + Math.random(),
                            data: req,
                            showErrorDefault: false,
                            success: function (rsp) {
                                if (rsp) {
                                    if (rsp.Code === 0) {
                                        $(sos).hide();
                                    } else {
                                        // Bruce: 錯誤的話，顯示錯誤的訊息
                                        popMessage(GetResources(rsp.Code));
                                    }
                                }
                            },
                            error: function (rsp) {
                                popMessage(GetResources(rsp.Code));
                            }
                        });


                    } else {
                        // Bruce: 否定的話，什麼事也不做;
                    }
                });
        } else {
            $(sos).hide();
            $(sos).unbind("click");
            //console.log("This provider dont have any sos promotion: " + data.providerId);
        }
    }
};
var ckSOSPromotion = function ( /*providerId*/id, balance) {
    var data = {
        act: "check",
        providerId: id,
        balance: balance
    };
    var isShowCashBackIcon = false;
    var token = $("#hdnAntiForgeryTokens").val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    $.ajax({
        url: culture + '/Account/PromoteSOS?' + Math.random(),
        data: data,
        type: "post",
        dataType: "json",
        headers: headers,
        showErrorDefault: false,
        async: false,
        success: function (rsp) {
            if (rsp) {
                if (rsp.Code === 0) {
                    isShowCashBackIcon = (rsp.IsShowCashBackIcon != null && rsp.IsShowCashBackIcon);
                } else {
                    isShowCashBackIcon = false;
                }
            } else {
                isShowCashBackIcon = false;
            }
        }
    });
    return isShowCashBackIcon;
};

var GetBankInfoByPaymentMethod = function (bank, mId, callback) {
    var data ;
    if (bank == "") {
        data = {
            methodId: mId
        };
        AjaxPost(culture + "/Account/GetBankInfoByPaymentMethod", true, data, callback);
    }
    else {
        data = {
            bankId: bank,
            methodId: mId
        };
        AjaxPost(culture + "/Account/GetBankInfo", true, data, callback);
    }
};

// 複製至剪貼簿
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}
