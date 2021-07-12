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
                const name = $(this).children('option:selected').text();
                $('.inputRealtimeResultTable__name').eq(player_index).text(name);
            }

            if ($(this).is('input')) {
                let point = $(this).val();
                let plusMinusStatus = '';
                if (point > 0) {
                    point = '+' + point;
                    plusMinusStatus = 'plusPoint';
                } else {
                    plusMinusStatus = 'minusPoint';
                }

                $('.inputRealtimeResultTable__point').eq(player_index).text(point).addClass(plusMinusStatus);
            }
        });
    };

    function inputResultSubmit() {
        $('.inputSubmit').on(eventType, function () {
            let result = $(".inputRealtimeResultTable").prop('outerHTML');
            const date = `<time>${getDate()}</time>`;
            result = '<li class="inputRealtimeResultList__item">' + date + result + '</li>';
            $('#page2 .inputRealtimeResultList').append(result);
            console.log(getDate());

            alert('結果を反映しました！');
        });
    };

    function playerAdd() {
        $('.playerAddBtn').on('click', function () {
            $('.playerAddDisplay').addClass('js-active');
        });
        $('.playerAddDisplay__cancel').on('click', function () {
            $('.playerAddDisplay').removeClass('js-active');
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.playerAddDisplay__card').length && !$(e.target).closest('.playerAddBtn').length) {
                $('.playerAddDisplay').removeClass('js-active');
            } else {

            }
        });
    }

    const getDate = function () {
        var today = new Date(); //インスタンスを生成
        var week_array = ["日", "月", "火", "水", "木", "金", "土"]; //曜日の配列を用意

        //dateObjという名前のオブジェクトを作成
        var dateObj = {

            year: today.getFullYear(), //年
            month: today.getMonth() + 1, //月
            day: today.getDate(), //日
            week: week_array[today.getDay()], //曜日
            hours: today.getHours(), //時
            minutes: today.getMinutes(), //分
            seconds: today.getSeconds(), //秒
        }

        //出力のフォーマットを定義
        var display_format = dateObj.year + '/' + dateObj.month + '/' + dateObj.day + '(' + dateObj.week + ')';
        return display_format;

    }

    tabChange(); //タブ切り替え

    $(window).on('load', function (params) {
        $('select').selModal();
        realtimeResult(); //DOMの監視
        inputResultSubmit(); //結果を反映
        playerAdd();
    });


});
