var culture = "/" + $.cookie("language");
$(document).ready(function () {
    $('#Amount').on('keypress', isNumberKey);
    function isNumberKey(event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (($(this).val().length == 0 && charCode == 48) || charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    $(document).on('click', 'input:checkbox[name="RESET_ShowPromotion"]', function (e) {
        var isChecked = 1;
        if ($(this).is(':checked')) {
            isChecked = 0;
        }
        $("#DoNotShowPage").val(isChecked);
    });
    $(document).on('click', function (e) {
        if ($("#transferGroupFrom").has(e.target).length === 0) {
            $("#transferGroupFrom").removeClass('active');
        }
        else if ($('#TransferFromName').is(e.target)) {
            $("#transferGroupFrom").toggleClass('active');
        }
        if ($("#transferGroupTo").has(e.target).length === 0) {
            $("#transferGroupTo").removeClass('active');
        }
        else if ($('#TransferToName').is(e.target)) {
            $("#transferGroupTo").toggleClass('active');
        }

    });

    $('.transicon a').on('click',
        function (e) {
            e.preventDefault();
            var temp = $('#TransferFrom').val();
            $('#TransferFrom').val($('#TransferTo').val());
            $('#TransferTo').val(temp);

            temp = $('#LastTransferFrom').val();
            $('#LastTransferFrom').val($('#LastTransferTo').val());
            $('#LastTransferTo').val(temp);

            temp = $('#TransferFromName').text();
            $("#TransferFromName").text($("#TransferToName").text());
            $("#TransferToName").text(temp);
            temp = $('#FromCash').html();
            $('#FromCash').html($('#ToCash').html());
            $('#ToCash').html(temp);
            var lastAmt = !$('#Amount').attr('lastAmt') ? (!$.cookie('the_last_transfer_amt') ? 0 : $.cookie('the_last_transfer_amt')) : $('#Amount').attr('lastAmt');
            var amount = (parseFloat(lastAmt) !== 0 && parseFloat($('#FromCash').html()) >= parseFloat(lastAmt)) ? lastAmt : $('#FromCash').html();
            $('#Amount').val(AppendComma(Math.floor(parseFloat(amount)), false));
            if ($('#TransferTo').val() == '-') {
                $('#promotionlistDiv').hide();
                initPromoteId();
            } else {
                getPromotions($('#TransferTo').val());
            }

            var fromPosition = $('#LastTransferFrom').val().split('-')[0];
            var toPosition = $('#LastTransferTo').val().split('-')[0];
            $('div .select_group').find('ol li').removeClass('active');
            $('div .select_group').find('.provider_name li').hide();
            MainMenuClick($('#ProviderFrom').find('ol a[position=' + fromPosition + ']'));
            MainMenuClick($('#ProviderTo').find('ol a[position=' + toPosition + ']'));
        });

    $('#TransferSubmit').click(function () {
        TransferFormSubmit();
    });

    $(document).on("click", "#ProviderFrom a", function (e) {
        e.preventDefault();
        MainMenuClick($(this));
        if ($(this).attr('value') == null) {
            return false;
        }
        ProviderFromClick($(this));
        $("#transferGroupFrom").removeClass('active');
    });

    $(document).on("click", "#ProviderTo a", function (e) {
        e.preventDefault();
        MainMenuClick($(this));
        if ($(this).attr('value') == null) {
            return false;
        }
        ProviderToClick($(this));
        $("#transferGroupTo").removeClass('active');
    });

    $(document).on("keyup blur", "#Amount", function () {
        if ($("#PromoteId").val() != "") {
            PreviewBonus($(this).val());
        }
    });

    $(document).on("click", "#NoPromotion", function () {
        initPromoteId();
        $("#PreviewBonus").text("");
        $("#PreviewBonusBox").hide();
    });

    if ($('#LastTransferFrom').length > 0 && $('#LastTransferTo').length > 0) {
        initTransferEvent($('#LastTransferFrom'), $('#LastTransferTo'));
    }
});

function initTransferEvent(from, to) {
    const transFrom = $(from).val();
    const transTo = $(to).val();
    const categoryFrom = transFrom != "-" ? transFrom.split('-')[0] : "";
    const categoryTo = transTo != "-" ? transTo.split('-')[0] : "";
    const providerIdFrom = transFrom != "-" ? transFrom.split('-')[1] : "-";
    const providerIdTo = transTo != "-" ? transTo.split('-')[1] : "-";
    const providerTypeFrom = transFrom != "-" ? transFrom.split('-')[2] : "";
    const providerTypeTo = transTo != "-" ? transTo.split('-')[2] : "";

    if (!$('#trans_pop').length) {
        if (providerIdFrom == "-") {
            $('#ProviderFrom a[value=' + providerIdFrom + ']').click();
        } else {
            $("#ProviderFrom a[position=" + categoryFrom + "][value=" + providerIdFrom + "][provider-type=" + providerTypeFrom + "]").click();
        }
        if (providerIdTo == "-") {
            $('#ProviderTo a[value=' + providerIdTo + ']').click();
        } else {
            $("#ProviderTo a[position=" + categoryTo + "][value=" + providerIdTo + "][provider-type=" + providerTypeTo + "]").click();
        }
    }
}
function ProviderToClick(obj) {
    var toId = $(obj).attr('value');
    var toPosition = $(obj).attr('position') ? $(obj).attr('position') : "";
    var toType = $(obj).attr('provider-type') ? $(obj).attr('provider-type') : "";
    var lastTo = toId != "-" ? toPosition.concat('-', toId, '-', toType) : "-";

    $("#TransferTo").val(toId);
    $("#LastTransferTo").val(lastTo);
    $("#TransferToName").text($(obj).text());
    getPromotions(toId);
    //取得餘額
    GetBalance(toId,
        function (response) {
            $("#ToCash").html(parseFloat(response.data.Data.Balance).toFixed(2));
        });
}
function ProviderFromClick(obj) {
    var fromId = $(obj).attr('value');
    var fromPosition = $(obj).attr('position') ? $(obj).attr('position') : "";
    var fromType = $(obj).attr('provider-type') ? $(obj).attr('provider-type') : "";
    var lastFrom = fromId != "-" ? fromPosition.concat('-', fromId, '-', fromType) : "-";

    $("#TransferFrom").val(fromId);
    $("#LastTransferFrom").val(lastFrom);
    $("#TransferFromName").text($(obj).text());

    //取得餘額
    GetBalance(fromId,
        function (response) {
            $("#FromCash").html(parseFloat(response.data.Data.Balance).toFixed(2));
            var lastAmt = !$('#Amount').attr('lastAmt') ? (!$.cookie('the_last_transfer_amt') ? 0 : $.cookie('the_last_transfer_amt')) : $('#Amount').attr('lastAmt');
            var amount = (parseFloat(lastAmt) !== 0 && parseFloat(response.data.Data.Balance) >= parseFloat(lastAmt)) ? lastAmt : response.data.Data.Balance;
            $('#Amount').val(AppendComma(Math.floor(parseFloat(amount), false)));
        });
}
function MainMenuClick(obj) {
    const position = $(obj).attr('position');
    if (position == null) {
        $(obj).closest('div .select_group').find('ol li').removeClass('active');
        $(obj).closest('div .select_group').find('.provider_name li').hide();
        return false;
    }
    var target = $(obj).closest('div .select_group').find('ol a[position=' + position + ']')[0];
    const activePosition = $(target).closest('li');
    const gridType = $(target).closest('div').siblings('.provider_name').find('ul');
    const providersList = $(target).closest('div').siblings('.provider_name').find('li');
    const showProvider = $(target).closest('div').siblings('.provider_name').find('li > a[position=' + position + ']').closest('li');

    activePosition.siblings('li').removeClass('active');
    activePosition.addClass('active');
    providersList.hide();
    gridType.removeClass();
    if (showProvider.length > 6) {
        gridType.addClass('grid-5');
    } else {
        gridType.addClass('grid-3');
    }
    showProvider.show();
}

function TransferFormSubmit(autotransfer) {
    var pass = false;
    var transferFrom = $('#TransferFrom').attr('value');
    var transferTo = $('#TransferTo').attr('value');

    // 判斷是否登入
    if (ckLogin == 'FALSE') {
        window.location.reload(true);
        return false;
    }

    if (transferFrom === '') {
        popMessage(GetMessage('fromProviderBlank'));
        return false;
    }
    if (transferTo === '') {
        popMessage(GetMessage('toProviderBlank'));
        return false;
    }
    if (transferFrom === transferTo) {
        popMessage(GetMessage('differProvider'));
        return false;
    }
    var pureAmount = 0
    if (autotransfer == true) {
        pureAmount = RemoveComma($("#Amount").text());
    }
    else {
        pureAmount = RemoveComma($("#Amount").val());
    }
    var reg = /^[1-9][0-9]*$/;
    if (!reg.test(pureAmount)) {
        popMessage(GetResources('Code_tranInt'));
        return false;
    }
    var fromValue = parseFloat($('#FromCash').html()).toFixed(2);
    var amount = parseFloat(pureAmount).toFixed(2);
    if (parseFloat(fromValue) < parseFloat(amount)) {
        popMessage(GetMessage('CashInsufficient'));
        return false;
    }
    if (isNaN(amount) || amount < 0) {
        popMessage(GetResources('validAmount'));
        return false;
    }
    if (amount.length < 1) {
        popMessage(GetResources('amtBlank'));
        return false;
    }
    if (transferFrom !== "-" && transferTo !== "-") {
        GetBalance("-",
            function (data) {
                var mwamount = data;
                if (parseFloat(mwamount) < 0) {
                    var r = confirm(GetMessage('MainWalletMinus'));
                    if (r == true) {
                        $(".wait_icon").show(); //開啟遮罩
                        $('#TransferSubmitFrm').submit();
                        pass = true;
                    } else {
                        pass = false;
                    }
                }
                else {
                    $(".wait_icon").show(); //開啟遮罩
                    $('#TransferSubmitFrm').submit();
                }
            });
    }
    else {
        $(".wait_icon").show();//開啟遮罩
        $('#TransferSubmitFrm').submit();

        pass = true;
    }
    return pass;
}
function initPromoteId() {
    $("#PromoteId").val('');
    $("#PromoteId").attr("data-promotion-rate", "");
    $("#PromoteId").attr("data-formula", "");
    $("#PromoteId").attr("data-max-amt", "");
    $("#PromoteId").attr("data-min-amt", "");
    $("#PromoteId").attr("data-times", "");
}

function PreviewBonus(amount) {
    var transferAmt = Number(RemoveComma(amount));
    var rate = Number($("#PromoteId").attr("data-promotion-rate"));
    var maxAmt = Number($("#PromoteId").attr("data-max-amt"));
    var minAmt = Number($("#PromoteId").attr("data-min-amt"));
    var times = Number($("#PromoteId").attr("data-times"));
    var bonus = transferAmt * rate;
    var formula = $("#PromoteId").attr("data-formula");
    if (formula != "" && formula) {
        formula = formula.toLowerCase();
        var r = rate;
        var mi = minAmt;
        var mx = maxAmt;
        var t = times;
        var to = transferAmt;
        var wl = transferAmt;
        try {
            bonus = eval(formula);
        }
        catch (e) {
            bonus = 0;
        }
    }
    if (bonus > maxAmt) {
        bonus = maxAmt;
    }

    if (bonus < minAmt) {
        bonus = 0;
    }
    bonus = bonus.toFixed(2);
    var promotionBonus = AppendComma(bonus, true);
    $("#PreviewBonus").text(promotionBonus);
}

function getPromotions(toId) {
    //選擇的內容改變時，動態更新可選擇的PromotionList
    var data = {
        ProviderId: toId
    }
    var url = "/api/Account/GetTransferPromotions";
    ApiPost(url, data, function (rsp) {
        if (rsp.data.Code == 0 && rsp.data.Data.PromotionList.length > 0) {
            $("#Promotionli").empty();
            $("#Promotionli").append(' <li id="NoPromotion" value="">' + GetMessage('NoThanks') + '</li>');
            $.each(rsp.data.Data.PromotionList,
                function (i, o) {
                    var content = "";
                    if (o.IsCustom) {
                        content = o.CustomContent;
                    }
                    $("#Promotionli")
                        .append(' <li data-promotion-rate="' + o.Rate +
                            '" data-max-amt="' + o.MaxAmt +
                            '" data-min-amt="' + o.MinAmt + '" data-times="' + o.Times +
                            '" data-formula="' + content + '" value="' + o.PromoteId + '">' + o.PromoteTitle + '</li>');
                });
            $('#promotionlistDiv').show();
            $("#Promotionli > li").off('click');
            $("#Promotionli > li").on('click',
                function () {
                    var fromId = $(this).attr('value');
                    $("#PromoteId").val(fromId);
                    $("#PromotionName").text($(this).html());
                    $("#PromoteId").attr("data-promotion-rate", $(this).attr("data-promotion-rate"));
                    $("#PromoteId").attr("data-formula", $(this).attr("data-formula"));
                    $("#PromoteId").attr("data-max-amt", $(this).attr("data-max-amt"));
                    $("#PromoteId").attr("data-min-amt", $(this).attr("data-min-amt"));
                    $("#PromoteId").attr("data-times", $(this).attr("data-times"));
                    $("#PreviewBonusBox").show();
                    var amount = Number(RemoveComma($("#Amount").val()));
                    PreviewBonus(amount);
                });
            $('#NoPromotion').click();
        } else {
            $("#Promotionli").empty();
            $('#promotionlistDiv').hide();
            initPromoteId();
            $('#PreviewBonusBox').hide();
            $("#PromotionName").text(GetMessage('NoThanks'));
        }
    },
        true);
}