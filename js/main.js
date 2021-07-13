$(function () {
    var isTouchDevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    var eventType = (isTouchDevice) ? 'touchend' : 'click';



    const tabChange = function (params) {
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

    const realtimeResult = function () {
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

    const inputResultSubmit = function () {
        $('.inputSubmit').on(eventType, function () {
            let result = $(".inputRealtimeResultTable").prop('outerHTML');
            const date = `<time>${getDate()}</time>`;
            result = '<li class="inputRealtimeResultList__item">' + date + result + '</li>';
            $('#page2 .inputRealtimeResultList').append(result);
            console.log(getDate());

            alert('結果を反映しました！');
        });
    };

    const playerAdd = function () {
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

        playerResist();
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

    const playerResist = function () {
        $('.playerAddDisplay__resist').on('click', function () {
            const player_name = $('.playerAddDisplay__input').val();

            // const nameList = データベースから名前のリストを取得する関数();
            // if (nameList) {
            //     alert('その名前は既に使われています。');
            //     return false;
            // }

            const playerInfo = {};
            playerInfo.player_name = new PlayerManager(player_name);
            const htmlPlayerList = `
            <li class="playerList__item">
                    <p class="playerList__name">${playerInfo.player_name.name}</p>
                    <div class="playerList__actitonBox">
                        <a class="playerList__rename btn btn-simple">リネーム</a>
                        <a class="playerList__delete btn btn-simple">削除</a>
                        <a class="playerList__record btn">戦績を見る</a>
                    </div>
                </li>
            `;
            $('.playerList').append(htmlPlayerList);

            $('.playerAddDisplay').removeClass('js-active');
        });

        const PlayerManager = class {
            constructor(name) { /* コンストラクタ */
                this.name = name; //プレイヤー名
                this.gameCount = 0; //試合数
                this.totalPoint = 0; //トータルポイント
                this.rankingCount = {
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0
                };
                this.hakoCount = 0;
            }

        }

    }


    $(window).on('load', function (params) {
        $('select').selModal(); //selectboxを使いやすくするプラグイン
        tabChange(); //タブ切り替え
        realtimeResult(); //DOMの監視
        inputResultSubmit(); //結果を反映
        playerAdd();
    });


});
