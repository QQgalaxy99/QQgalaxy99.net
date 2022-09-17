$(document).ready(function () {
    $('.more_on').click(function () {
        $('#moreList').toggleClass('present');
        $('#moreList').toggleClass('present');
        $(this).next('.navitem').toggle();
    });
});
$(window).load(function () {
    $(window).bind('scroll resize', function () {

        var $this = $(this);
        var $this_Top = $this.scrollTop();

        //當高度小於80時，sidebar_bar向上150px距離
        if ($this_Top < 80) {
            $('#sidebar_bar').stop().animate({ top: "135px" });
        }
        //當高度大於80時，sidebar_bar向上50px距離
        if ($this_Top > 80) {
            $('#sidebar_bar').stop().animate({ top: "50px" });
        }
    }).scroll();
});

function selectBettingRules(path) {
    $("[href='" + path + "']").addClass('present');
    if (path.indexOf('Rules') > -1) {
        $('.more_on').next('.navitem').toggle();
        $('#moreList').addClass('present');
        $("[href='" + path + "']").addClass('selected');
    }
}