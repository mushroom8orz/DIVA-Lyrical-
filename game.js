class GameManager {
	constructor() {
		// ステージを作成
		this.gameStage = new createjs.Stage("gameCanvas");

		this.frame = 1000 / 60;

		this.phraseList = [];
		this.notesList = [];

		this.topX = 1280 / 8;
		this.topY = 720 / 3;
		this.bottomX = 1280 / 8 * 2;
		this.bottomY = 720 / 3 * 2;
		this.phraseX = this.topX;
		this.phraseY = this.topY;

		this.mode = "PV";

		this.cool = 0;
		this.fine = 0;
		this.safe = 0;
		this.sad = 0;
		this.wrong = 0;
		this.combo = 0;
		this.maxCombo = 0;

		this.redB1F = false;
		this.redB2F = false;
		this.blueB1F = false;
		this.blueB2F = false;

		// タッチ操作起動
		if (createjs.Touch.isSupported() == true) {
			createjs.Touch.enable(this.gameStage);
		}
		// リサイズイベントを検知してリサイズ処理を実行
		window.addEventListener("resize", () => this.gameResize());

		window.addEventListener("keypress", (e) => this.Keypress(e));
		window.addEventListener("keyup", (e) => this.Keyup(e));

		this.gameResize();
	}

	// 歌詞データセット
	setLyrics(p, c) {
		this.phrase = p;
		this.char = [];

		//英語は単語として登録
		c.forEach((item) => {
			if (item.parent.language === "en") {
				if (item.parent.firstChar === item) {
					this.char.push(item.parent);
				}
			} else {
				this.char.push(item);
			}
		});

		this.notesCtl = this.char[0];
	}

	setMode(m) {
		this.mode = m;
	}

	//ヘッダー作るつもりだった
	setHeader(song, artist) {
		this.song = song;
		this.artist = artist;
	}

	// ゲーム初期処理
	// もし読み取り最小秒より早ければそのフレーズは無視
	initGame(n) {
		if (this.phrase[0].startTime < n) {
			let s = this.phrase[0].text;
			this.setPhrase(n);

			let text = new createjs.Text(s, "50px Meiryo", "black");
			text.shadow = new createjs.Shadow("black", 0, 0, 2);
			this.phraseList[0].addChild(text);

			while (this.char[0].startTime < this.phraseList[0].endTime) {
				this.char.shift();
			}
		}

		//ボタン生成
		this.redB1 = new createjs.Shape();
		this.redB1.graphics.beginFill("crimson")
			.beginStroke("black").setStrokeStyle(2)
			.drawCircle(1280 / 8 - 6, 700, 1280 / 8 - 2);
		this.redB1.alpha = 0.5;
		this.redB1.scaleY = 0.85;
		this.redB1.shadow = new createjs.Shadow("white", 0, 0, 4);
		this.redB2 = new createjs.Shape();
		this.redB2.graphics.beginFill("crimson")
			.beginStroke("black").setStrokeStyle(2)
			.drawCircle(1280 * 3 / 8 - 2, 800, 1280 / 8 - 2);
		this.redB2.alpha = 0.5;
		this.redB2.scaleY = 0.85;
		this.redB2.shadow = new createjs.Shadow("white", 0, 0, 4);
		this.blueB1 = new createjs.Shape();
		this.blueB1.graphics.beginFill("blue")
			.beginStroke("black").setStrokeStyle(2)
			.drawCircle(1280 * 5 / 8 + 2, 800, 1280 / 8 - 2);
		this.blueB1.alpha = 0.5;
		this.blueB1.scaleY = 0.85;
		this.blueB1.shadow = new createjs.Shadow("white", 0, 0, 4);
		this.blueB2 = new createjs.Shape();
		this.blueB2.graphics.beginFill("blue")
			.beginStroke("black").setStrokeStyle(2)
			.drawCircle(1280 * 7 / 8 + 6, 700, 1280 / 8 - 2);
		this.blueB2.alpha = 0.5;
		this.blueB2.scaleY = 0.85;
		this.blueB2.shadow = new createjs.Shadow("white", 0, 0, 4);
		this.gameStage.addChild(this.redB1);
		this.gameStage.addChild(this.redB2);
		this.gameStage.addChild(this.blueB1);
		this.gameStage.addChild(this.blueB2);

		this.redB1.addEventListener("mousedown", (e) => this.redB1D(e));
		this.redB1.addEventListener("pressup", (e) => this.redB1U(e));
		this.redB2.addEventListener("mousedown", (e) => this.redB2D(e));
		this.redB2.addEventListener("pressup", (e) => this.redB2U(e));
		this.blueB1.addEventListener("mousedown", (e) => this.blueB1D(e));
		this.blueB1.addEventListener("pressup", (e) => this.blueB1U(e));
		this.blueB2.addEventListener("mousedown", (e) => this.blueB2D(e));
		this.blueB2.addEventListener("pressup", (e) => this.blueB2U(e));

		this.gameStage.update();
	}

	// ゲーム処理 onTimeUpdateから毎フレーム呼ばれる
	updateGame(nowPos, afterPos) {
		// ノードセット
		this.setPhrase(afterPos);
		this.setChar(nowPos, afterPos);

		// noteの動作処理
		for (let i = 0; i < this.notesList.length; i++) {
			this.notesList[i].move(nowPos);
			this.judgNote(i, this.notesList[i].getTime() - nowPos);
			if (this.notesList[i].getTouch()) {
				this.notesList.shift();
				i--;
			}
		}

		// phraseの動作処理
		if (this.phraseList.length > 0 && this.phraseList[0].endTime <= nowPos) {
			this.store = this.phraseList[0];
			createjs.Tween.get(this.phraseList[0])
				.to({ x: -30, alpha: 0 }, 500, createjs.Ease.cubicOut)
				.call(() => this.phreseRemove());
			this.phraseList.shift(); // 配列から削除
		}

		this.gameStage.update();

		//console.log(nowPos);
	}
	phreseRemove() {
		// 画面から削除
		this.gameStage.removeChild(this.store);
	}

	setPhrase(afterPos) {
		if (!this.phrase[0]) { return; }
		if (this.phrase[0].startTime > afterPos) { return; }

		this.phraseList.push(new createjs.Container());

		let num = this.phraseList.length - 1;
		this.phraseList[num].x = this.phraseX;
		this.phraseList[num].y = this.phraseY;
		this.gameStage.addChild(this.phraseList[num]);
		this.phraseList[num].endTime = this.phrase[0].endTime;
		this.charX = 0;
		this.charY = this.phraseY;

		if (this.phraseX == this.topX) {
			this.phraseX = this.bottomX;
			this.phraseY = this.bottomY;
		} else {
			this.phraseX = this.topX;
			this.phraseY = this.topY;
		}

		this.phrase.shift();
	}

	setChar(nowPos, afterPos) {
		if (!this.char[0]) { return; }
		if (this.char[0].startTime > afterPos) { return; }

		this.notesList.push(new Note(this.char[0], nowPos, this.charX, this.charY));

		let num = this.notesList.length - 1;
		this.charX += this.notesList[num].getSize();
		//重なってもマウスイベント貫通するように
		//this.notesList[num].mouseEnabled = false;
		// ステージに追加
		this.phraseList[this.phraseList.length - 1].addChild(this.notesList[num]);

		// 先頭歌詞削除
		this.char.shift();
	}

	judgNote(i, diff) {
		if (this.notesList[i].getTouch()) { return; }

		let judg = "";
		let push = this.redB1F || this.redB2F || this.blueB1F || this.blueB2F;

		if (this.frame * -15 > diff) {
			judg = "WORST"
			this.wrong++;
			this.combo = 0;
		} else if (diff <= 0 && this.mode == "PV") {
			judg = "COOL"
			this.combo++;
		} else if (push && this.mode != "PV") {
			if (this.frame * 2 > diff && diff > -this.frame) {
				judg = "COOL"
				this.combo++;
			} else if (this.frame * 4 > diff && diff > this.frame * -2) {
				judg = "FINE"
				this.combo++;
			} else if (this.frame * 6 > diff && diff > this.frame * -3) {
				judg = "SAFE"
				this.combo = 0;
			} else if (this.frame * 30 > diff) {
				judg = "SAD"
				this.combo = 0;
			} else { return; }

			if (this.notesList[i].getType() == "top") {
				if (this.blueB1F || this.blueB2F) {
					judg = "WRONG" + judg;
					this.combo = 0;
					if (this.blueB1F) { this.blueB1F = false; }
					else { this.blueB2F = false; }
				} else {
					if (this.redB1F) { this.redB1F = false; }
					else { this.redB2F = false; }
				}
			} else {
				if (this.redB1F || this.redB2F) {
					judg = "WRONG" + judg;
					this.combo = 0;
					if (this.redB1F) { this.redB1F = false; }
					else { this.redB2F = false; }
				} else {
					if (this.blueB1F) { this.blueB1F = false; }
					else { this.blueB2F = false; }
				}
			}
		}
		else { return; }

		if (this.maxCombo < this.combo) {
			this.maxCombo = this.combo
		}
		if (judg == "COOL") {
			this.cool++;
		} else if (judg == "FINE") {
			this.fine++;
		} else if (judg == "SAFE") {
			this.safe++;
		} else if (judg == "SAD") {
			this.sad++;
		} else if (judg.match(/WRONG/)) {
			this.wrong++;
		}

		this.notesList[i].setTouch(judg, this.combo);
	}

	redB1D(e) {
		this.redB1F = true; this.redB1.alpha = 1;
		createjs.Sound.play("se");
	}
	redB1U(e) { this.redB1F = false; this.redB1.alpha = 0.5; }
	redB2D(e) {
		this.redB2F = true; this.redB2.alpha = 1;
		createjs.Sound.play("se");
	}
	redB2U(e) { this.redB2F = false; this.redB2.alpha = 0.5; }
	blueB1D(e) {
		this.blueB1F = true; this.blueB1.alpha = 1;
		createjs.Sound.play("se");
	}
	blueB1U(e) { this.blueB1F = false; this.blueB1.alpha = 0.5; }
	blueB2D(e) {
		this.blueB2F = true; this.blueB2.alpha = 1;
		createjs.Sound.play("se");
	}
	blueB2U(e) { this.blueB2F = false; this.blueB2.alpha = 0.5; }
	Keypress(event) {
		let keyCode = event.keyCode;
		if (keyCode == 115) {// s
			this.redB1F = true;
			this.redB1.alpha = 1;
		} else if (keyCode == 103) {// g
			this.redB2F = true;
			this.redB2.alpha = 1;
		} else if (keyCode == 107) {// k
			this.blueB1F = true;
			this.blueB1.alpha = 1;
		} else if (keyCode == 58) {// :
			this.blueB2F = true;
			this.blueB2.alpha = 1;
		} else {
			return;
		}
		createjs.Sound.play("se");
	}
	Keyup(event) {
		let keyCode = event.keyCode;
		if (keyCode == 83) {// s
			this.redB1F = false;
			this.redB1.alpha = 0.5;
		}
		if (keyCode == 71) {// g
			this.redB2F = false;
			this.redB2.alpha = 0.5;
		}
		if (keyCode == 75) {// k
			this.blueB1F = false;
			this.blueB1.alpha = 0.5;
		}
		if (keyCode == 186) {// :
			this.blueB2F = false;
			this.blueB2.alpha = 0.5;
		}
	}

	resultGame() {
		this.gameStage.removeAllChildren();

		this.result = new createjs.Container();
		this.gameStage.addChild(this.result);

		let buck = new createjs.Shape();
		buck.graphics.beginFill("white").drawRect(0, 0, 1280, 720);
		buck.alpha = 0.5;
		this.result.addChild(buck);

		let song = new createjs.Text("song：" + this.song + " artist：" + this.artist, "bold 30px Meiryo", "springgreen");
		song.textAlign = "center";
		song.x = 1280 / 2;
		song.shadow = new createjs.Shadow("black", 0, 0, 3);
		this.result.addChild(song);
		let title = new createjs.Text("RESULT", "bold 50px Meiryo", "springgreen");
		title.textAlign = "center";
		title.textBaseline = "middle";
		title.x = 1280 / 2;
		title.y = 720 / 5;
		title.shadow = new createjs.Shadow("black", 0, 0, 3);
		this.result.addChild(title);

		let score = new createjs.Container();
		score.x = 1280 / 16;
		score.y = 720 / 3;
		this.result.addChild(score);

		let coolt = new createjs.Text("COOL\t\t\t：" + this.cool, "50px Meiryo", "gold");
		coolt.shadow = new createjs.Shadow("black", 0, 0, 3);
		score.addChild(coolt);
		let finet = new createjs.Text("FINE\t\t\t：" + this.fine, "50px Meiryo", "silver");
		finet.y = 70;
		finet.shadow = new createjs.Shadow("black", 0, 0, 3);
		score.addChild(finet);
		let safet = new createjs.Text("SAFE\t\t\t：" + this.safe, "50px Meiryo", "green");
		safet.y = 70 * 2;
		safet.shadow = new createjs.Shadow("black", 0, 0, 3);
		score.addChild(safet);
		let sadt = new createjs.Text("SAD\t\t\t：" + this.sad, "50px Meiryo", "navy");
		sadt.y = 70 * 3;
		sadt.shadow = new createjs.Shadow("black", 0, 0, 3);
		score.addChild(sadt);
		let worngt = new createjs.Text("WROMG/WORST：" + this.wrong, "50px Meiryo", "purple");
		worngt.y = 70 * 4;
		worngt.shadow = new createjs.Shadow("black", 0, 0, 3);
		score.addChild(worngt);
		let combot = new createjs.Text("COMBO\t\t\t：" + this.maxCombo, "50px Meiryo", "cyan");
		combot.y = 70 * 5;
		combot.shadow = new createjs.Shadow("black", 0, 0, 3);
		score.addChild(combot);

		let modet = new createjs.Text(this.mode + " MODE", "bold 50px Meiryo", "springgreen");
		modet.textAlign = "center";
		modet.textBaseline = "middle";
		modet.x = 1280 * 3 / 4;
		modet.y = 720 / 3;
		modet.shadow = new createjs.Shadow("black", 0, 0, 3);
		this.result.addChild(modet);

		let total = this.cool + this.fine + this.safe + this.sad + this.wrong;
		this.evalate = "";
		let color = "";
		if (this.cool + this.fine == total) {
			this.evalate = "PERFECT!";
			color = "gold";
		} else if ((this.cool + this.fine) / total >= 0.85) {
			this.evalate = "EXCELLENT";
			color = "silver";
		} else if ((this.cool + this.fine) / total >= 0.75) {
			this.evalate = "GREAT";
			color = "green";
		} else if ((this.cool + this.fine) / total >= 0.60) {
			this.evalate = "STANDARD";
			color = "navy";
		} else {
			this.evalate = "NOT CLEAR";
			color = "purple"
		}

		let evalatet = new createjs.Text(this.evalate, "bold 70px Meiryo", color);
		evalatet.textAlign = "center";
		evalatet.textBaseline = "middle";
		evalatet.x = 1280 * 3 / 4;
		evalatet.y = 720 / 2;
		evalatet.shadow = new createjs.Shadow("black", 0, 0, 3);
		this.result.addChild(evalatet);
		let twitter = new TextButton("twitter", 1280 * 5 / 8, 720 * 2 / 3, 1280 / 4);
		this.result.addChild(twitter);
		let retry = new TextButton("RETRY", 1280 * 5 / 8, 720 * 5 / 6, 1280 / 4);
		this.result.addChild(retry);

		twitter.addEventListener("click", (e) => this.setTwitter(e));
		retry.addEventListener("click", (e) => this.retryGame(e));

		this.gameStage.update();
	}

	setTwitter(e) {
		let text = "初音ミク「マジカルミライ 2021」プログラミング・コンテスト 「DIVA:Lyrics」で『" + this.song + "』をプレイ！ " + this.evalate + " を獲得したよ！";
		let url = "https://magicalmirai.com/2021/procon/";

		let hash = "マジカルミライ2021,mm2021procon,初音ミク"

		let turl = "https://twitter.com/intent/tweet?text=" + text + "&url=" + url + "&hashtags=" + hash;
		window.open(turl, '_blank');
	}

	retryGame(e) {
		window.location.reload();
	}

	// リサイズ処理
	gameResize() {
		// 画面幅・高さを取得
		let w = window.innerWidth;
		let h = window.innerHeight;
		if (window.innerWidth / window.innerHeight > 1280 / 720) {
			w = 1280 * h / 720;
		} else {
			h = 720 * w / 1280;
		}
		// Canvas要素の大きさを画面幅・高さに合わせる
		this.gameStage.canvas.width = w;
		this.gameStage.canvas.height = h;
		this.gameStage.scale = w / 1280;

		// 画面更新する
		this.gameStage.update();
	}

}