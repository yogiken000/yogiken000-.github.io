$(function () {
    var isTouchDevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    var eventType = (isTouchDevice) ? 'touchend' : 'click';

    tabChange(); //タブ切り替え

    function tabChange(params) {
        $('.navList__item').on(eventType, function () {
            $('.navList__item').removeClass('current');
            $(this).addClass('current');

            var index = $(this).index();

            $('.display').removeClass('js-current');
            $('.display').eq(index).addClass('js-current');

            $('.wrap').css({
                transform: 'translateX(-' + index + '00vw)'
            });
        });
    }




});
