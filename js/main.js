const x = 2; // 1描写当たりにX軸に進む
const y = 2; // 1描写当たりにY軸に進む
const count_upper = 30; // 衝突回数の上限
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let result; // ボールが残り一つかどうかの判定用
let choice = 0; // クリックできるボールを一つに絞る用

// 円の初期配置のX軸候補
let firstXarray = [70, 210, 350, 490, 630, 770, 910];

// それぞれのボール
let balls = [];
for (let i = 0; i < 7; i++) {
    balls.push({ x: 0, y: 0, radius: 50, speedx: x, speedy: y });
}

let rank = balls.length; // 順番付け用

// ボールの色
const color = ["#070707", "#ffff00", "#006400", "#eb2142", "#eb8d21", "#800080", "#0000cd"];
const color_id = ["#black_count", "#yellow_count", "#green_count", "#red_count", "#orange_count", "#purple_count", "#blue_count"];

// 衝突回数管理用
let color_count = [0, 0, 0, 0, 0, 0, 0];

$("#bomb").text("ボールの衝突上限回数は" + count_upper + "回");
$("#start").hide();
// ボールを選択した際の処理
$(".balls_box").on("click", function () {
    if (choice === 0) {
        $(this).css("border", "5px #eb2142 solid");
        $("#start").show();
        choice++;
    }
});

// スタートボタンをクリックしたら
$("#start").on("click", function () {
    $("#start").text("どのボールが生き残る？");
    // ボールの色をシャッフルする
    let color_shuffle = ["#070707", "#ffff00", "#006400", "#eb2142", "#eb8d21", "#800080", "#0000cd"];
    arrangement(color_shuffle);

    // ボールを初期配置
    firstposion();

    // キャンバス内を動き回る描写
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバス内の描画をすべてクリアする（X始点, Y始点, 横幅, 高さ）
        for (let i = 0; i < balls.length; i++) {
            drawArc(color_shuffle, i);
        }

        // 衝突回数の表示
        for (let i = 0; i < color.length; i++) {
            if (color_count[i] < count_upper) {
                $(color_id[i]).text(color_count[i] + "回");
                $(color_id[i]).css("font-weight", "bold");
                $(color_id[i]).css("font-size", "20px");
            } else if (color_count[i] === count_upper) {
                $(color_id[i]).text(rank + "位");
                $(color_id[i]).css("font-size", "30px");
                $(color_id[i]).css("color", color[i]);
                $(color_id[i]).css("line-height", 0.8);
                color_count[i] = count_upper ** 2;
                rank--;
            }
        }

        // ボールが最後の一つになったときに描画を止める
        result = 0;
        for (let i = 0; i < color_count.length; i++) {
            if (color_count[i] < count_upper) {
                result++;
            }
        }
        if (result === 1) {
            // 描画を一回進めて最後から2番目のボールを消す
            ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバス内の描画をすべてクリアする（X始点, Y始点, 横幅, 高さ）
            for (let i = 0; i < balls.length; i++) {
                if (color_count[i] < count_upper) {
                    $(color_id[i]).text(rank + "位");
                    $(color_id[i]).css("font-size", "30px");
                    $(color_id[i]).css("color", color[i]);
                    $(color_id[i]).css("line-height", 0.8);
                    let champion = color[i];
                }
                drawArc(color_shuffle, i);
            }
            clearInterval(drawset) // 描画終了
        }
    }
    
    // 結果が出そろったらキャンバスをトグルで非表示にできる
    if (result === 1) {
        $("canvas").slideToggle(300);
    }

    // 10ミリ秒間隔で描き続ける
    let drawset = setInterval(draw, 10);
});

// 画面をリロード
$(document).ready(function () {
    $("#submit").click(function () {
        $(location).prop("href", location.href);
    })
});
