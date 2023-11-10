let main_distance; // 円の中心同士の距離
let sab_distance; // 円の内側に接する正四角形への中点からの最短距離
let correction; // 円の被っている距離

// 配列をシャッフルする
function arrangement(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // 0〜(i+1)の範囲で値を取得
        let r = Math.floor(Math.random() * (i + 1));

        // 要素の並び替えを実行
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
}

function firstposion() {
    // ボールの初期配置の決定
    firstXarray = arrangement(firstXarray);
    for (let i = 0; i < balls.length; i++) {
        balls[i].x = firstXarray[i];
        balls[i].y = Math.floor(Math.random() * (canvas.height - (balls[i].radius * 2))) + balls[i].radius;
        // ランダムに選んだYの値が奇数なら-X軸方向に動かす
        if (balls[i].y % 2 == 1) {
            balls[i].speedx *= -1;
        }

        // ランダムに選んだYの10の位がが奇数なら-Y軸方向に動かす
        if (Math.floor(balls[i].y / 10) % 2 == 1) {
            balls[i].speedy *= -1;
        }
    }
}

// ボールを動かす
function move(i) {
    balls[i].x += balls[i].speedx;
    // 厳密に壁の当たり判定を実施
    if (balls[i].x < balls[i].radius) {
        balls[i].x = balls[i].radius
    } else if (balls[i].x > canvas.width - balls[i].radius) {
        balls[i].x = canvas.width - balls[i].radius
    }

    // 厳密に壁の当たり判定を実施
    balls[i].y += balls[i].speedy;
    if (balls[i].y < balls[i].radius) {
        balls[i].y = balls[i].radius
    } else if (balls[i].y > canvas.height - balls[i].radius) {
        balls[i].y = canvas.height - balls[i].radius
    }
}

// ボール同士の当たり判定
function ball_bound(array, i, j) {
    // 円の内側に接する正方形に対する中点からの最短距離
    sab_distance = balls[i].radius / Math.sqrt(2);

    // X方向の運動を主として考える
    if (balls[j].x + balls[j].radius < balls[i].x - sab_distance) { // balls[i]の左側に当たった場合
        if (balls[i].speedx < 0 && balls[j].speedx > 0) {
            balls[i].speedx *= -1;
            balls[j].speedx *= -1;
        } else if (balls[i].speedx > 0 && balls[j].speedx > 0) {
            balls[j].speedx *= -1;
        } else if (balls[i].speedx < 0 && balls[j].speedx < 0) {
            balls[i].speedx *= -1;
        }

    } else if (balls[j].x - balls[j].radius > balls[i].x + sab_distance) { // balls[i]の右側に当たった場合
        if (balls[i].speedx > 0 && balls[j].speedx < 0) {
            balls[i].speedx *= -1;
            balls[j].speedx *= -1;
        } else if (balls[i].speedx > 0 && balls[j].speedx > 0) {
            balls[i].speedx *= -1;
        } else if (balls[i].speedx < 0 && balls[j].speedx < 0) {
            balls[j].speedx *= -1;
        }

    } else if (balls[j].y + balls[j].radius <= balls[i].y - sab_distance) { // balls[i]の上側に当たった場合
        if (balls[i].speedy < 0 && balls[j].speedy > 0) {
            balls[i].speedy *= -1;
            balls[j].speedy *= -1;
        } else if (balls[i].speedy < 0 && balls[j].speedy < 0) {
            balls[i].speedy *= -1;
        } else if (balls[i].speedy > 0 && balls[j].speedy > 0) {
            balls[j].speedy *= -1;
        }

    } else if (balls[j].y - balls[j].radius >= balls[i].y + sab_distance) { // balls[i]の下側に当たった場合
        if (balls[i].speedy > 0 && balls[j].speedy < 0) {
            balls[i].speedy *= -1;
            balls[j].speedy *= -1;
        } else if (balls[i].speedy < 0 && balls[j].speedy < 0) {
            balls[j].speedy *= -1;
        } else if (balls[i].speedy > 0 && balls[j].speedy > 0) {
            balls[i].speedy *= -1;
        }
    }

    if (color_count[$.inArray(array[i], color)] < count_upper) {
        // 衝突回数カウント
        color_count[$.inArray(array[i], color)]++;
    }
    if (color_count[$.inArray(array[i], color)] >= count_upper) {
        balls[i].x += canvas.width
    }
    if (color_count[$.inArray(array[j], color)] < count_upper) {
        color_count[$.inArray(array[j], color)]++;
    }
    if (color_count[$.inArray(array[j], color)] >= count_upper) {
        balls[j].x += canvas.width
    }
}

// キャンバスの壁の当たり判定
function wall_bound(array, i) {
    if (balls[i].x + balls[i].radius >= canvas.width || balls[i].x - balls[i].radius <= 0) {
        balls[i].speedx *= -1;

        if (color_count[$.inArray(array[i], color)] < count_upper) {
            // 衝突回数カウント
            color_count[$.inArray(array[i], color)]++;
        }
        if (color_count[$.inArray(array[i], color)] >= count_upper) {
            balls[i].x += canvas.width
        }
    }
    
    if (balls[i].y + balls[i].radius >= canvas.height || balls[i].y - balls[i].radius <= 0) {
        balls[i].speedy *= -1;
        
        if (color_count[$.inArray(array[i], color)] < count_upper) {
            // 衝突回数カウント
            color_count[$.inArray(array[i], color)]++;
        }
        if (color_count[$.inArray(array[i], color)] >= count_upper) {
            balls[i].x += canvas.width
        }
    }
}

// 描画時にボールがめり込んだ状態であったら描画する前に補正
function correctionback(array) {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            // 各円のそれぞれの中点の距離
            main_distance = Math.sqrt((balls[i].x - balls[j].x) ** 2 + (balls[i].y - balls[j].y) ** 2);
            // 当たり判定がTrueの場合
            if (main_distance < balls[i].radius + balls[j].radius) {
                do {
                    correction = balls[i].radius + balls[j].radius - main_distance;
                    balls[i].x -= Math.ceil(correction / Math.sqrt(2)) * 1.1 * balls[i].speedx / Math.abs(balls[i].speedx);
                    balls[i].y -= Math.ceil(correction / Math.sqrt(2)) * 1.1 * balls[i].speedy / Math.abs(balls[i].speedy);
                    main_distance = Math.sqrt((balls[i].x - balls[j].x) ** 2 + (balls[i].y - balls[j].y) ** 2);
                } while (main_distance < balls[i].radius + balls[j].radius);
                // ボール同士の当たり判定
                if (color_count[$.inArray(array[i], color)] < count_upper) {
                    ball_bound(array, i, j);
                }
            }
        }
    }
}

function drawArc(array, i) {
    // 衝突上限に達したら描かないし動かさない
    if (color_count[$.inArray(array[i], color)] < count_upper) {
        ctx.beginPath();
        // 補正
        correctionback(array);
        wall_bound(array, i);
        ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = array[i];
        ctx.stroke();
        ctx.fillStyle = array[i];
        ctx.fill();
        ctx.closePath();
        move(i);
    }
}