$(function () {
    var isTouchDevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    var eventType = (isTouchDevice) ? 'touchend' : 'click';

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

    function realtimeResult() {
        $('#page1 select, #page1 input').on('change', function () {
            const player_index = $(this).closest('li').index();

            if ($(this).is('select')) {
                const name = $(this).val();
                $('.inputRealtimeResultTable__name').eq(player_index).text(name);
            }

            if ($(this).is('input')) {
                const point = $(this).val();
                $('.inputRealtimeResultTable__point').eq(player_index).text(point);
            }
        });
    };

    tabChange(); //タブ切り替え

    $(window).on('load', function (params) {
        realtimeResult(); //DOMの監視
    });


});
