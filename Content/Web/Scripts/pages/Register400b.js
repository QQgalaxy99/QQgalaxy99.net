//快速註冊
var culture = "/" + $.cookie("language");
if (typeof validationAfter !== 'undefined') {
    var validationAfter = false;
}
function FirstMemInfo() {
    $('#FirstMemId').blur(checkFirstUserName);
    $("#FirstRegisterAddsubmit").on('click', function () {
        //資料驗證
        if (FirstValidation()) {
            $(".wait_icon").show();//開啟遮罩
            $("#RegisterUrlHidden").val(window.location.pathname);
            $('#FirstRegisterAddFrm').submit();
        }
    });
    $("[data-event='official_register']").on('click', function () {
        $('[data-area="official_register_area"]').show();
        $('[data-area="First_register_area"]').hide();
    });
    $("[data-event='First_register']").on('click', function () {
        $('[data-area="official_register_area"]').hide();
        $('[data-area="First_register_area"]').show();
    });
}

// 驗證帳號
function checkUserName() {
    if ($(this).val().length === 0) {
        changeCheckimg($('#MemIdCheck'), false);
        return false;
    }
    var s = /^[a-zA-Z][A-Za-z0-9]+$/;
    if (!s.test($(this).val()) || $(this).val().length < 4 || $(this).val().length > 15) {
        popMessage(GetResources("Code_40137"));
        changeCheckimg($('#MemIdCheck'), false);
        return false;
    }
    if (validationAfter == false) {
        AjaxPost(culture + "/Member/CheckUserName",
            false,
            { memId: $('#MemId').val() },
            function(rsp) {
                if (rsp.Code > 0) {
                    changeCheckimg($('#MemIdCheck'), false);
                    //popMessage(rsp.Msg);
                } else {
                    changeCheckimg($('#MemIdCheck'), true);
                }
            },
            false);
    } else {
        $('#MemIdCheck').removeClass("mistake").text("");
    }
    return true;
}
// 驗證快速註冊帳號
function checkFirstUserName() {
    if ($(this).val().length === 0) {
        changeCheckimg($('#FirstMemIdCheck'), false);
        return false;
    }

    var s = /^[a-zA-Z][A-Za-z0-9]+$/;
    if (!s.test($(this).val())) {
        popMessage(GetResources("Code_40001"));
        changeCheckimg($('#FirstMemIdCheck'), false);
        return false;
    }

    AjaxPost(culture + "/Member/CheckUserName", false, { memId: $('#FirstMemId').val() }, function (rsp) {
        if (rsp.Code > 0) {
            changeCheckimg($('#FirstMemIdCheck'), false);
            //popMessage(rsp.Msg);
        } else {
            changeCheckimg($('#FirstMemIdCheck'), true);
        }
    }, false);

    return true;
}

// 驗證Email
function checkEmail() {
    if ($.trim($('#MemEmail').val()).length === 0 || $.trim($('#MemEmail').val()).length > 200) {
        changeCheckimg($('#MemEmailCheck'), false);
        return false;
    }

    var myReg = /^[-_A-Za-z0-9\.]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    if (!myReg.test($(this).val())) {
        changeCheckimg($('#MemEmailCheck'), false);
        return false;
    }
    if (validationAfter == false) {
        AjaxPost(culture + "/Member/CheckEmail",
            false,
            { mail: $.trim($('#MemEmail').val()) },
            function(rsp) {
                if (rsp.Code > 0) {
                    changeCheckimg($('#MemEmailCheck'), false);
                    //alert(rsp.Msg);
                } else {
                    changeCheckimg($('#MemEmailCheck'), true);
                }
            },
            false);
    } else {
        $('#MemEmailCheck').removeClass("mistake").text("");
    }
    return true;
}
// 驗證電話
function checkNumber() {
    if ($.trim($('#ContactNumber').val()).length === 0 || $.trim($('#ContactNumber').val()).length > 15) {
        changeCheckimg($('#ContactNumberCheck'), false);
        return false;
    }
    if (validationAfter == false) {
        AjaxPost(culture + "/Member/CheckNumber",
            false,
            { country: $.trim($('#ContactCountryHidden').val()), number: $.trim($('#ContactNumber').val()) },
            function(rsp) {
                if (rsp.Code > 0) {
                    changeCheckimg($('#ContactNumberCheck'), false);
                    //popMessage(rsp.Msg);
                } else {
                    changeCheckimg($('#ContactNumberCheck'), true);
                }
            },
            false);
    } else {
        $('#ContactNumberCheck').removeClass("mistake").text("");
    }
    return true;
}
// 驗證銀行帳戶
function checkBank() {
    if ($(this).val().length === 0) {
        changeCheckimg($('#BankAcctNoCheck'), false);
        return false;
    }
    if ($(this).val().length > 25) {
        changeCheckimg($('#BankAcctNoCheck'), false);
        return false;
    }
    if (validationAfter == false) {
        AjaxPost(culture + "/Member/CheckBankNo",
            false,
            { acctno: $.trim($('#BankAcctNo').val()), currId: $.trim($('#CurrId').text()) },
            function(rsp) {
                if (rsp.Code > 0) {
                    changeCheckimg($('#BankAcctNoCheck'), false);
                    //alert(rsp.Msg);
                } else {
                    changeCheckimg($('#BankAcctNoCheck'), true);
                }
            },
            false);
    } else {
        $('#BankAcctNoCheck').removeClass("mistake").text("");
    }
    return true;
}

function checkPwd() {
    var memPwd = $.trim($('#MemPwd').val());
    if (memPwd.length < 8 || !/[A-Za-z]/i.test(memPwd) || !/[0-9]/i.test(memPwd)) {
        changeCheckimg($('#MemPwdCheck'), false);
        return false;
    }
    //if (!/[A-Za-z]/i.test(memPwd)) {
    //    changeCheckimg($('#MemPwdCheck'), false);
    //    return false;
    //}
    //if (!/[0-9]/i.test(memPwd)) {
    //    changeCheckimg($('#MemPwdCheck'), false);
    //    return false;
    //}
    changeCheckimg($('#MemPwdCheck'), true);
    return true;
}

// 驗證驗證碼
function checkValidateCode() {
    var isCheckValidateCode;
    AjaxPost(culture + "/Base/CheckValidateCode", false, { code: $('#ValidationCode').val() }, function (rsp) {
        if (rsp.Check == "1") {
            //same
            changeCheckimg($('#ValidationCodeCheck'), true);
            isCheckValidateCode = true;
            return;
        } else if (rsp.Check == "2") {
            //session timeout
            popMessage(GetMessage("errorValidCode"));
            $('#ValidationImg').attr('src', culture + "/Member/VerificationCode?rn=" + Math.random() * 1000);
            isCheckValidateCode = false;
            return false;
        } else {
            //false
            popMessage(GetMessage("errorValidCode"));
            isCheckValidateCode = false;
            return false;
        }
    }, false);
    if (isCheckValidateCode) {
        return true;
    } else {
        return false;
    }
}


function Validation() {
    var reg = /[^\x00-\xff]/g;
    var accountNameReg = /^[\u4E00-\u9FA5]+$/;
    if (reg.test($("#MemId").val())) {
        popMessage(GetResources("Code_40137"));
        return false;
    }
    if ((!isNaN($('#MemId').val()))) {
        popMessage(GetResources("Code_40137"));
        return false;
    }

    if ($.trim($('#MemId').val()).length < 1) {
        popMessage(GetResources("Code_40001"));
        return false;
    }
    if ($('#MemIdCheck').hasClass("mistake")) {
        popMessage(GetResources("Code_40001"));
        return false;
    }
    if ($.trim($('#MemEmail').val()).length < 1) {
        popMessage(GetResources("Code_emailBlank"));
        return false;
    }

    if ($('#MemEmailCheck').hasClass("mistake")) {
        popMessage(GetResources("Code_40000"));
        return false;
    }

    if ($('#MemPwdCheck').hasClass("mistake")) {
        popMessage(GetResources("Code_InvalidPassword"));
        return false;
    }

    var memPwd = $.trim($('#MemPwd').val());
    if (memPwd !== $.trim($('#ConfirmPassword').val())) {
        popMessage(GetResources("Code_CofinPwdError"));
        return false;
    }

    if (memPwd.length < 8 || !/[A-Za-z]/i.test(memPwd) || !/[0-9]/i.test(memPwd)) {
        popMessage(GetResources("Code_InvalidPassword"));
        return false;
    }

    if ($.trim($('#BankId').val()).length < 1) {
        popMessage(GetResources("Code_40133"));
        return false;
    }

    if ($.inArray($.trim($('#BankId').val()), bankList) == '-1') {
        popMessage(GetResources("Code_40050"));
        return false;
    }

    if ($.trim($('#BankAcctNo').val()).length < 1) {
        popMessage(GetResources("Code_10120"));
        return false;
    }

    if ($.trim($('#BankAcctNo').val()).length > 25) {
        popMessage(GetResources("Code_BankAccTooLong"));
        return false;
    }

    if (!/[a-zA-Z0-9]+$/.test($.trim($('#BankAcctNo').val()))) {
        popMessage(GetResources("Code_BankAccIncorrect"));
        return false;
    }

    if ($('#BankAcctNoCheck').hasClass("mistake")) {
        popMessage(GetResources("Code_30071"));
        return false;
    }

    if ($.trim($('#FullName').val()).length < 1) {
        popMessage(GetResources("Code_40120"));
        return false;
    }

    if ($.trim($('#FullName').val()).length > 100) {
        popMessage(GetResources("Code_BankAccNameTooLong"));
        return false;
    }

    if ($.trim($("#CurrId").text()) == 'CNY' && !accountNameReg.test($.trim($('#FullName').val()))) {
        popMessage(GetResources("Code_RegisterAccountNameNotChinese"));
        return false;
    }

    if ($.trim($("#CurrId").text()) == 'IDR' && /[0-9]/i.test($.trim($('#FullName').val()))) {
        popMessage(GetResources("Code_70004"));
        return false;
    }

    if (!/^[A-Z]{3}$/i.test($("#CurridHidden").val())) {
        popMessage(GetResources("Code_30033"));
        return false;
    }

    if ($.trim($('#ProvinceName').val()).length > 100) {
        popMessage(GetMessage("ProvinceNameLetterMsg"));
        return false;
    }

    if ($.trim($('#City').val()).length > 100) {
        popMessage(GetMessage("CityLetterMsg"));
        return false;
    }

    if ($.trim($('#BankBranch').val()).length > 100) {
        popMessage(GetMessage("BankBranchLetterMsg"));
        return false;
    }

    if (!$("#ageCheck").hasClass('on')) {
        popMessage(GetResources("Code_ageIncorrect"));
        return false;
    }

    if (!/^[0-9]+$/.test($.trim($('#ContactCountryHidden').val()))) {
        popMessage(GetResources("Code_50007"));
        return false;
    }

    if ($.trim($('#ContactNumber').val()).length < 1) {
        popMessage(GetResources("Code_40127"));
        return false;
    }

    if (!/^[0-9\.]+$/.test($.trim($('#ContactNumber').val()))) {
        popMessage(GetResources("Code_50007"));
        return false;
    }

    if ($.trim($("#CurrId").text()) == 'IDR' && $.trim($('#ContactNumber').val()).length > 12) {
        popMessage(GetResources("Code_70003"));
        return false;
    }
    
    if ($.trim($('#ReferralId').val()).length > 0) {
        if (!/^[A-Za-z0-9]{8}$/.test($.trim($('#ReferralId').val()))) {
            popMessage(GetMessage("Register_CheckReferral"));
            $.cookie("ReferralId", null, { expires: 365, path: '/' });
            return false;
        } 
    }
    

    if ($('#ContactNumberCheck').hasClass("mistake")) {
        popMessage(GetResources("Code_50007"));
        return false;
    }

    if ($('#ValidationCode').length > 0) {

        if ($.trim($('#ValidationCode').val()).length < 1) {
            popMessage(GetMessage("ValidCodeblank"));
            return false;
        }

        if (!checkValidateCode()) {
            return false;
        }
    }

    $('#MemPwd').val(base64encode($('#MemPwd').val()));
    $('#ConfirmPassword').val(base64encode($('#ConfirmPassword').val()));
    return true;
}
function FirstValidation() {
    var reg = /[^\x00-\xff]/g;
    if (reg.test($("#FirstMemId").val())) {
        popMessage(GetResources("Code_40137"));
        return false;
    }
    if ((!isNaN($('#FirstMemId').val()))) {
        popMessage(GetResources("Code_40137"));
        return false;
    }

    if ($.trim($('#FirstMemId').val()).length < 1) {
        popMessage(GetResources("Code_40001"));
        return false;
    }

    if ($('#FirstMemIdCheck').hasClass("mistake")) {
        popMessage(GetResources("Code_40001"));
        return false;
    }

    var memPwd = $.trim($('#FirstMemPwd').val());
    if (memPwd !== $.trim($('#FirstConfirmPassword').val())) {
        popMessage(GetResources("Code_CofinPwdError"));
        return false;
    }
    if (!/[A-Za-z]/i.test(memPwd)) {
        popMessage(GetResources("Code_40135"));
        return false;
    }
    if (!/[0-9]/i.test(memPwd)) {
        popMessage(GetResources("Code_40136"));
        return false;
    }

    $('#FirstMemPwd').val(base64encode($('#FirstMemPwd').val()));
    return true;
}

function resetLi() {
    $("#BankInfoListli > li").click(function () {
        $("#BankId").val($(this).attr('value'));
        $("#BankName").text($(this).html());
    });
}

function resetProvinceLi() {
    $("#Provinceli > li").click(function () {
        $("#ProvinceNameli").text($(this).html());
        $("#ProvinceName").val($(this).attr('value'));
        reloadCityData();
    });
}

function resetCityLi() {
    $("#Cityli > li").click(function () {
        $("#CityName").text($(this).html());
        $("#City").val($(this).attr('value'));
    });
}

function reGetBankName() {
    bankList = [];
    $("#BankId").val("");
    $("#BankName").text(GetMessage('inputSelectBank'));
    AjaxPost(culture + "/Member/GetBankInfoList", true, { currId: $("#CurrId").text() }, function (data) {
        $('.conlist#BankInfoListli').html("");
        $.each(data, function (i, item) {
            $('.conlist#BankInfoListli').append('<li value=' + item.BankId + '>' + item.BankName + '</li>');
            bankList.push(item.BankId);
        });
        //$("#BankId").val($('#BankInfoListli > li').first().attr('value'));
        //$("#BankName").text($('#BankInfoListli > li').first().html());
        resetLi();
    });
}

function changeBankCity() {
    var currId = $.trim($('#CurrId').text());
    if (currId == "CNY") {
        AjaxPost(culture + "/Member/GetBankProvinceList", true, { currId: $("#CurrId").text() }, function (data) {
            $('.conlist#Provinceli').html("");
            $.each(data, function (i, item) {
                $('.conlist#Provinceli').append('<li value=' + item.ProvinceId + '>' + item.ProvinceName + '</li>');
                bankList.push(item.ProvinceId);
            });
            resetProvinceLi();
        });
        $('div[id^="BankCityCheck"]').hide();
        $('div[id^="CNYBankCityCheck"]').show();
        $('div[id^="BankBranchCheck"]').show();
    } else
    {
        $('div[id^="BankCityCheck"]').hide();
        $('div[id^="CNYBankCityCheck"]').hide();
        $('div[id^="BankBranchCheck"]').hide();
    }
}
//依照所選幣別變更電話國碼
function changePhoneCode() {
    var currId = $.trim($('#CurrId').text());
    var phoneCode;
    switch (currId) { 
        case "IDR":
            phoneCode = 62;
            break;
        case "CNY":
            phoneCode = 86;
            break;
        case "VND":
            phoneCode = 84;
            break;
        case "MYR":
            phoneCode = 60;
            break;
        case "THB":
            phoneCode = 66;
            break;
        case "KRW":
            phoneCode = 82;
            break;
        case "USD":
            phoneCode = 1;
            break;
        default:
            phoneCode = 1;
            break;
    }
    $("#ContactCountry").text('+' + phoneCode);
    $("#ContactCountryHidden").val(phoneCode);
    checkNumber();
}

function reloadCityData() {
    var provincev = $("#ProvinceName").val();
    $("#Cityli").empty();
    $("#City").val("");
    $("#CityName").text(GetMessage('pleaseselect'));
    AjaxPost(culture + "/Member/GetBankCityList", true, {ProvinceId: provincev}, function (data) {
        $('.conlist#Cityli').html("");
        $.each(data, function (i, item) {
            $('.conlist#Cityli').append('<li value=' + item.CityId + '>' + item.CityName + '</li>');
            bankList.push(item.BankId);
        });
        resetCityLi();
    });
}

function changeCheckimg(/*控制項*/ cotroller, /*是否驗證成功*/ istrue) {
    if (istrue) {
        cotroller.removeClass("mistake");
        cotroller.addClass("correct").text("correct");
    } else {
        cotroller.removeClass("correct");
        cotroller.addClass("mistake").text("mistake");
    }
}
