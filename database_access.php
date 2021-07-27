<?php
header("Content-type: text/plain; charset=UTF-8");

//ajaxの値を受け取り
$new_data = (string)filter_input(INPUT_POST, 'post_data');

if (isset($new_data)) {

	//jsonファイル読み込み
	$db_url = $_SERVER['DOCUMENT_ROOT'] . '/data/database.json';
	$json = file_get_contents($db_url);
	$json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
	$database = json_decode($json, true);


	//ここで値を追加
	$new_data = json_decode($new_data, true);

	switch (key($new_data)) {
		case 'player_resist':
			array_Push($database['player_list'], $new_data['player_resist']);
			$result = json_encode($database['player_list'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
			echo $result;

			break;

		case 'player_load':
			$result = json_encode($database['player_list'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
			echo $result;
			break;

		case 'player_delete':
			$delete_player_name = $new_data['player_delete'];

			foreach ($database['player_list'] as $index => $val) {
				$name = $val["name"];
				if ($name === $delete_player_name) {
					echo $name;
					unset($database['player_list'][$index]);
					$database['player_list'] = array_values($database['player_list']);
				}
			}


			break;

		default:
			echo 'その条件分岐ないよ';
			break;
	}


	//jsonファイルに保存
	$database_add = json_encode($database, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
	file_put_contents($db_url, $database_add);
} else {

	echo '値が取れてないよ';
}