function popLiveChat(url) {
    event.preventDefault();
    var chat;
    var w = 475;
    var h = 465;
    var winX = (screen.availWidth - w) / 2;
    var winY = 50;
    var paras = 'width=' + w + 'px,height=' + h + 'px,left=' + winX + 'px,top=' + winY + 'px,scrollbars=yes,resizable=yes';
    chat = window.open(url, 'LiveChat', paras);
    chat.focus();
    return false;
}