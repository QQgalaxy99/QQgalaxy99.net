var lan = 'EN-US';
$(document).ready(function () {
    if ($.cookie('language') != null) {
        lan = $.cookie('language').toUpperCase();
    }
    $("#progressive_jackpot").text("UPDATING");
    var currency;

    $('.bxslider.productadv').bxSlider1({
        auto: true,
        speed: 900,
        controls: false
    });

    $('.bxslider.serviceadv').bxSlider1({
        auto: true,
        autoDelay: 200,
        speed: 800,
        controls: false
    });

    $('.bxslider.banking').bxSlider1({
        mode: 'fade',
        auto: true,
        autoDelay: 100,
        speed: 800,
        controls: false
    });

    switch (lan) {
        case "ZH-CN":
            currency = "CNY";
            break;
        case "KO-KR":
            currency = "KRW";
            break;
        case "EN-US":
            currency = "USD";
            break;
        case "TH-TH":
            currency = "THB";
            break;
        case "VI-VN":
            currency = "VND";
            break;
        case "ID-ID":
            currency = "IDR";
            break;
        case "EN-MY":
            currency = "MYR";
            break;
        default:
            currency = "USD";
    }

    currency = $('#memberCurrId').text() != "" ? $('#memberCurrId').text().trim() : currency;
    var ticker = tickers(currency);
    $("#progressive_jackpot").text(ticker);
    setInterval(
        function () {
            $("#progressive_jackpot").attr("data-value", parseFloat($("#progressive_jackpot").attr("data-value")) + Math.random() / 10),
                $("#progressive_jackpot").html(currency + "&nbsp;" + formatMoney(parseFloat($("#progressive_jackpot").attr("data-value")).toFixed(2)));
        }, 250);

    function tickers(c) {
        var t = "UPDATING";
        $.ajax({
            url: "https://tickers3.playtech.com/jackpots/new_jackpotxml.php?info=1&casino=longsnake88&currency=" + c + "&game=ashfta-1",
            async: true,
            type: "GET",
            dataType :"xml",
            success: function (xml) {
                var jpamt = parseFloat($(xml).find('amount').text()).toFixed(2);
                $("#progressive_jackpot").attr('data-value', jpamt);
                t = c + " " + formatMoney(jpamt);
            },
            error: function () {
                $("#progressive_jackpot").text("UPDATING");
                t = "UPDATING";
            }
        });
        return t;
    }

    function formatMoney(s, type) {
        if (/[^0-9\.]/.test(s)) return "0";
        if (s == null || s == "") return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        if (type == 0) { // 不带小数位(默认是有小数位)
            var a = s.split(".");
            if (a[1] == "00") {
                s = a[0];
            }
        }
        return s;
    }

    $("#main_bg").addClass("home_main_bg");

    serviceCount();
    setInterval(serviceCount, 3600000);
});

function serviceCount() {
    $("#progressbar").progressbar();
    $("#progressbar2").progressbar();
    $.getJSON("/JsonWeb/HomeServiceData.json", {},
        function (data) {
            var tn, dg;
            var today = new Date();
            var hours = today.getHours();
            var minData = parseFloat(data.OnlineUserCount.MinData[hours]);
            var maxData;
            if (hours < 3 || hours > 13) {
                maxData = minData + 52000;
                minData = maxData - 5000;
            } else {
                minData += 20000;
                maxData = minData + 5000;
            }
            var random = randomizator(minData, maxData);
            $('#onlineusercount').text(random);
            var randomdeposit = randomizator(data.AverageDepositTime.MinData, data.AverageDepositTime.MaxData);
            progressbar_setvalue($('#progressbar'), 30, randomdeposit * 10);
            tn = randomdeposit / 10;
            dg = randomdeposit % 10;
            $('#deposittn').attr('class', convertDigitalToWord(tn));
            $('#depositdg').attr('class', convertDigitalToWord(dg));
            var randomwithdrawal = randomizator(data.AverageWithrawlTime.MinData, data.AverageWithrawlTime.MaxData);
            progressbar_setvalue($('#progressbar2'), 30, randomwithdrawal * 10);
            tn = randomwithdrawal / 10;
            dg = randomwithdrawal % 10;
            $('#withdrawaltn').attr('class', convertDigitalToWord(tn));
            $('#withdrawaldg').attr('class', convertDigitalToWord(dg));
        });
}
function progressbar_setvalue(e, time, value) {
    var pGress = setInterval(function () {
        var pVal = e.progressbar('option', 'value');
        var pCnt = !isNaN(pVal) ? (pVal + 1) : 1;
        if (pCnt > value) {
            clearInterval(pGress);
        } else {
            e.progressbar({ value: pCnt });
        }
    }, time);
};
