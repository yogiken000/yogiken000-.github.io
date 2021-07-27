$(function () {

    const playerLoad = function () {
        var def = $.Deferred();

        const player_load = {
            "player_load": 1
        }
        ajaxDataSave(player_load).done(function (result, textStatus, jqXHR) {
            const players = $.parseJSON(result);
            let page3_players_list = '';
            let page1_players_select = '';
            $(players).each(function (index, player) {
                page3_players_list += `
                    <li class="playerList__item">
                        <p class="playerList__name">${player.name}</p>
                        <div class="playerList__actitonBox">
                            <a class="playerList__rename btn btn-simple">リネーム</a>
                            <a class="playerList__delete btn btn-simple">削除</a>
                            <a class="playerList__record btn">戦績を見る</a>
                        </div>
                    </li>
                `;

                page1_players_select += `
                    <option value="${player.name}">${player.name}</option>
                `;
            });
            $('.playerList').html(page3_players_list);


            $('.inputList__select').each(function (index, val) {
                $(this).append(page1_players_select);
            });

            $('select').selModal(); // セレクトボックスを使いやすくするプラグインの起動
            $('.loading').fadeOut(); //ローディングを解除


        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert('データベースへの接続に失敗しました。');
        }).always(function () {
            def.resolve();
        });

        return def.promise();
    };

    const tabChange = function (params) {
        $('.navList__item').on('click', function () {
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

                let input_flag = false;
                $('#page1 input').each(function () {
                    if (!$(this).val()) {
                        input_flag = false;
                        return false;
                    }

                    if ($(this).val()) {
                        input_flag = true;
                    }

                });

                //持ち点の入力が終わったら得点計算
                if (input_flag) {
                    pointCalc();
                }


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
    const pointCalc = function () {
        const point_array = [];
        $('#page1 .inputList__input').each(function () {
            point_array.push(Math.round($(this).val() / 10) * 10); //1桁目を四捨五入
        });
        function compareFunc(a, b) {
            return b - a;
        }
        point_array.sort(compareFunc);
    };

    const inputResultSubmit = function () {
        $('.inputSubmit').on('click', function () {
            let result = $(".inputRealtimeResultTable").prop('outerHTML');
            result = `
            <li class="resultList__item">
            <div class="resultList__info">
            <time class="resultList__date">${getDate()}</time>
            <a class="btn btn-simple resultList__delete">削除</a>
            </div>
            ${result}
            </li>
            `;
            $('#page2 .resultList').append(result);
            console.log(getDate());

            alert('結果を反映しました！');

            const result_obj = {
                "date": getDate(),

            }
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
        $(document).on('click', '.playerAddDisplay__resist', function () {
            const player_name = $('.playerAddDisplay__input').val();

            // const nameList = データベースから名前のリストを取得する関数();
            // if (nameList) {
            //     alert('その名前は既に使われています。');
            //     return false;
            // }

            const player = {

            };
            player["player_resist"] = new PlayerManager(player_name);
            const htmlPlayerList = `
            <li class="playerList__item">
                    <p class="playerList__name">${player_name}</p>
                    <div class="playerList__actitonBox">
                        <a class="playerList__rename btn btn-simple">リネーム</a>
                        <a class="playerList__delete btn btn-simple">削除</a>
                        <a class="playerList__record btn">戦績を見る</a>
                    </div>
                </li>
            `;
            $('.playerList').append(htmlPlayerList);
            $('.playerAddDisplay').removeClass('js-active');

            ajaxPlayerSave(player); //jsonファイルにプレイヤー情報を格納

            $('.inputList__select').each(function (index, val) {
                $(this).append(`<option value="${player_name}">${player_name}</option>`);
            });
            $('select').selModal();
            alert(player_name + 'が追加されました。');


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

        const ajaxPlayerSave = function (player) {
            var def = $.Deferred();

            ajaxDataSave(player).done(function (result, textStatus, jqXHR) {


            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                alert('データベースへの接続に失敗しました。');
            }).always(function () {
                def.resolve();
            });

            return def.promise();
        };


    }

    const playerDelete = function () {
        let delete_player_name = '';
        let delete_player_listItem = '';
        $(document).on('click', '.playerList__delete', function () {
            $('.playerDeleteDisplay').addClass('js-active');
            delete_player_listItem = $(this).closest('.playerList__item');
            delete_player_name = delete_player_listItem.find('.playerList__name').text();
        });
        $(document).on('click', '.playerDeleteDisplay__cancel', function () {
            $('.playerDeleteDisplay').removeClass('js-active');
        });
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.playerDeleteDisplay__card').length && !$(e.target).closest('.playerList__delete').length) {
                $('.playerDeleteDisplay').removeClass('js-active');
            } else {

            }
        });


        $(document).on('click', '.playerDeleteDisplay__delete', function () {
            var def = $.Deferred();
            const player_delete = {
                "player_delete": delete_player_name
            }
            ajaxDataSave(player_delete).done(function (result, textStatus, jqXHR) {

                $(delete_player_listItem).remove();
                alert(delete_player_name + 'を削除しました。');
                $('.playerDeleteDisplay').removeClass('js-active');

                //page1 セレクトボックス名前削除
                $('.inputList__select').each(function (index, val) {
                    $(this).find('option').each(function (index, val) {
                        if ($(this).text() === delete_player_name) {
                            $(this).remove();
                        }
                    });
                });
                $('select').selModal();
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                alert('データベースへの接続に失敗しました。');
            }).always(function () {
                def.resolve();
            });

            return def.promise();
        });
    };


    $(window).on('load', function () {
        playerLoad();
        tabChange(); //タブ切り替え
        realtimeResult(); //DOMの監視
        inputResultSubmit(); //結果を反映
        playerAdd();
        playerDelete();
    });



    /***************************************************

    ajax通信

    ***************************************************/
    var jqxhr = null; //ajax連続通信防止
    function ajaxDataSave(data) {

        if (jqxhr) {
            // 通信を中断する
            // ただしfail(), always()は実行される
            jqxhr.abort();
        }

        data = JSON.stringify(data); //オブジェクトを文字列に変換

        jqxhr = $.ajax({
            url: '/database_access.php',
            type: 'POST',
            data: {
                "post_data": data
            }
        });

        return jqxhr;
    }


});
