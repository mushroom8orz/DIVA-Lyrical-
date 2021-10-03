const { Player } = TextAliveApp;

//-- TextAliveの操作 --// 
class TextAlive {
	constructor() {
		this.gameMng = new GameManager();
		// ステージを作成
		this.mainStage = new createjs.Stage("mainCanvas");
		//音の読み込み
		createjs.Sound.registerSound("assets/tamborine.mp3", "se");
		//ゲーム中か
		this.isGame = false;

		this.id = 0;
		this.player = new Player({
			app: {
				appAuthor: "mush",
				appName: "DIVA-Lyrical-",
				token: "bKr9OZJjugpruQ6n"
			},
			mediaElement: document.querySelector("#media"),
			mediaBannerPosition: "top left"
		});
		this.player.addListener({
			onAppReady: (app) => this._onAppReady(app),
			onVideoReady: (v) => this._onVideoReady(v),
			onTimerReady: () => this._onTimerReady(),
			onTimeUpdate: (pos) => this._onTimeUpdate(pos),
			onStop: () => this._onStop()
		});

		// タッチ操作起動
		if (createjs.Touch.isSupported() == true) {
			createjs.Touch.enable(this.mainStage);
		}

		//初期画面表示
		this.initMain();

		// リサイズイベントを検知してリサイズ処理を実行
		window.addEventListener("resize", () => this.mainResize());
		this.mainResize();
	}

	// APIの準備ができたら呼ばれる
	_onAppReady(app) {
		this.changePlayer();
	}

	// 楽曲情報が取れたら呼ばれる
	_onVideoReady(v) {

		if (!v.firstChar) {
			this.readyOk = false;
			return;
		}
		this.readyOk = true;

		//曲名、作者転送
		this.gameMng.setHeader(this.player.data.song.name, this.player.data.song.artist.name);

		// 歌詞のセットアップ
		let phrase = [];
		let p = v.firstPhrase;
		while (p) {
			phrase.push(p);
			p = p.next;
		}
		let char = [];
		let c = v.firstChar;
		while (c) {
			char.push(c);
			c = c.next;
		}
		this.gameMng.setLyrics(phrase, char);

		//読み込みできる最小タイム取得
		this.min = 0;
		while (!this.player.findBeat(this.min)) {
			this.min++;
		}
		let b = this.player.findBeat(this.min);
		this.barTime = b.length * b.duration;
	}

	//再生コントロールができるようになったら呼ばれる
	_onTimerReady() {
		this.player.requestPlay();
		this.readyMain();
	}

	// 再生位置の情報が更新されたら呼ばれる
	_onTimeUpdate(pos) {
		if (!this.isGame) { return; }

		//一小節先のpositionを取得
		let b = this.player.findBeat(pos);
		this.barTime = b.length * b.duration;

		this.position = pos;
		this.updateTime = Date.now();
	}

	// 再生が停止されたときに呼ばれる
	_onStop() {
		if (!this.isGame) { return; }
		this.isGame = false;

		this.gameMng.resultGame();
		// もう一度再生されるようにしたかった
		this.player.requestStop();
		this.player.requestPlay();
	}

	// -- ここからTextAlive関係なし -- //
	initMain() {
		//白ブラー背景
		let buck = new createjs.Shape();
		buck.graphics.beginFill("white").drawRect(0, 0, 1280, 720);
		buck.alpha = 0.5;
		this.mainStage.addChild(buck);

		//楽曲ボタン配置
		let songB0 = new TextButton("First Note", 1280 / 12, 720 / 6, 1280 / 3);
		this.mainStage.addChild(songB0);
		let songB1 = new TextButton("嘘も本当も君だから", 1280 / 12, 720 * 2 / 6, 1280 / 3);
		this.mainStage.addChild(songB1);
		let songB2 = new TextButton("その心に灯る色は", 1280 / 12, 720 * 3 / 6, 1280 / 3);
		this.mainStage.addChild(songB2);
		let songB3 = new TextButton("夏をなぞって", 1280 * 7 / 12, 720 / 6, 1280 / 3);
		this.mainStage.addChild(songB3);
		let songB4 = new TextButton("密かなる交信曲", 1280 * 7 / 12, 720 * 2 / 6, 1280 / 3);
		this.mainStage.addChild(songB4);
		let songB5 = new TextButton("Freedom!", 1280 * 7 / 12, 720 * 3 / 6, 1280 / 3);
		this.mainStage.addChild(songB5);
		let songB6 = new TextButton("初音天地開闢神話", 1280 / 12, 720 * 4 / 6, 1280 / 3);
		this.mainStage.addChild(songB6);
		songB0.addEventListener("click", (e) => this.setSong0(e));
		songB1.addEventListener("click", (e) => this.setSong1(e));
		songB2.addEventListener("click", (e) => this.setSong2(e));
		songB3.addEventListener("click", (e) => this.setSong3(e));
		songB4.addEventListener("click", (e) => this.setSong4(e));
		songB5.addEventListener("click", (e) => this.setSong5(e));
		songB6.addEventListener("click", (e) => this.setSong6(e));

		//テキストボックス
		let songB7 = new createjs.Container();
		songB7.x = 1280 * 7 / 12;
		songB7.y = 720 * 4 / 6;
		this.mainStage.addChild(songB7);
		let rect = new createjs.Shape();
		rect.graphics.beginFill("deepskyblue")
			.drawRoundRect(0, 0, 1280 / 3, 50, 20, 20);
		rect.shadow = new createjs.Shadow("violet", 0, 0, 2);
		songB7.addChild(rect);
		this.input = new createjs.DOMElement("songURL");
		this.input.htmlElement.addEventListener('input', (e) => this.setSong7(e));

		this.frame = new createjs.Shape();
		this.frame.graphics.beginStroke("magenta").setStrokeStyle(5)
			.drawRoundRect(0, 0, 1280 / 3, 50, 20, 20);
		this.frame.x = 1280 / 12;
		this.frame.y = 720 / 6;
		this.mainStage.addChild(this.frame);

		//ゲーム開始ボタン(表示はしない)
		this.pvMode = new TextButton("PV MODE", 1280 / 6 + 20, 720 * 5 / 6, 1280 / 4, "magenta");
		this.playMode = new TextButton("PLAY MODE", 1280 * 7 / 12 - 20, 720 * 5 / 6, 1280 / 4, "magenta");
		this.pvMode.addEventListener("click", (e) => this.setPvMode(e));
		this.playMode.addEventListener("click", (e) => this.setPlayMode(e));

		this.loading = new createjs.Text("NOW LOADING...", "60px Meiryo", "blue");
		this.loading.textAlign = "center";
		this.loading.textBaseline = "middle";
		this.loading.x = 1280 / 2;
		this.loading.y = 720 * 5 / 6;
		this.loading.shadow = new createjs.Shadow("black", 0, 0, 2);
		this.mainStage.addChild(this.loading);

		this.mainStage.update();
	}

	setSong0(e) {
		this.id = 0;
		this.frame.x = 1280 / 12;
		this.frame.y = 720 / 6;
		this.setSong();
	}
	setSong1(e) {
		this.id = 1;
		this.frame.x = 1280 / 12;
		this.frame.y = 720 * 2 / 6;
		this.setSong();
	}
	setSong2() {
		this.id = 2;
		this.frame.x = 1280 / 12;
		this.frame.y = 720 * 3 / 6;
		this.setSong();
	}
	setSong3(e) {
		this.id = 3;
		this.frame.x = 1280 * 7 / 12;
		this.frame.y = 720 / 6;
		this.setSong();
	}
	setSong4(e) {
		this.id = 4;
		this.frame.x = 1280 * 7 / 12;
		this.frame.y = 720 * 2 / 6;
		this.setSong();
	}
	setSong5(e) {
		this.id = 5;
		this.frame.x = 1280 * 7 / 12;
		this.frame.y = 720 * 3 / 6;
		this.setSong();
	}
	setSong6(e) {
		this.id = 6;
		this.frame.x = 1280 / 12;
		this.frame.y = 720 * 4 / 6;
		this.setSong();
	}
	setSong7(e) {
		this.id = 7;
		this.frame.x = 1280 * 7 / 12;
		this.frame.y = 720 * 4 / 6;
		this.songURL = this.input.htmlElement.value;
		this.setSong();
	}
	setSong() {
		this.loading.visible = true;
		this.mainStage.removeChild(this.pvMode);
		this.mainStage.removeChild(this.playMode);
		this.loading.text = "NOW LOADING...";
		this.changePlayer();
		this.mainStage.update();
	}

	readyMain() {
		if (!this.readyOk) {
			this.loading.text = "歌詞情報がありません";
			this.mainStage.update();
			return;
		}
		this.loading.visible = false;

		this.mainStage.addChild(this.pvMode);
		this.mainStage.addChild(this.playMode);

		this.mainStage.update();
	}

	setPvMode(e) {
		this.gameMng.setMode("PV");
		this.endMain();
	}
	setPlayMode(e) {
		this.gameMng.setMode("PLAY");
		this.endMain();
	}

	endMain() {
		createjs.Sound.play("se");
		this.mainStage.clear();
		this.mainStage.removeAllChildren();
		this.mainStage.removeAllEventListeners();
		document.getElementById('mainCanvas').style.zIndex = 1;
		document.getElementById('songURL').remove();

		this.player.requestStop();
		//少し待たないとrequestStopが遅れる
		createjs.Tween.get(this.mainStage)
			.wait(1000)
			.call(() => this.curtainCall());
	}
	curtainCall() {
		this.gameMng.initGame(this.min);

		this.player.requestPlay();
		this.update();
		this.isGame = true;
	}

	//毎フレーム読み込み
	update() {
		if (this.player.isPlaying && 0 <= this.updateTime && 0 <= this.position && this.isGame) {
			let t = (Date.now() - this.updateTime) + this.position;
			this.gameMng.updateGame(t, this.barTime + t);
		}
		window.requestAnimationFrame(() => this.update());
	}

	// 楽曲変更を行う
	changePlayer() {

		if (this.id == 0) {
			// ---
			// blues / First Note
			// https://piapro.jp/t/FDb1/20210213190029

			this.player.createFromSongUrl("https://piapro.jp/t/FDb1/20210213190029", {
				video: {
					// 音楽地図訂正履歴: https://songle.jp/songs/2121525/history
					beatId: 3953882,
					repetitiveSegmentId: 2099561,
					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FFDb1%2F20210213190029
					lyricId: 52065,
					lyricDiffId: 5414
				}
			});

		} else if (this.id == 1) {
			// ---
			// 真島ゆろ / 嘘も本当も君だから

			this.player.createFromSongUrl("https://www.youtube.com/watch?v=Se89rQPp5tk", {
				video: {
					// 音楽地図訂正履歴: https://songle.jp/songs/2123488/history
					beatId: 3978203,
					repetitiveSegmentId: 2099661,
					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3DSe89rQPp5tk
					lyricId: 52061,
					lyricDiffId: 5123,
				},
			});

		} else if (this.id == 2) {
			// ---
			// ラテルネ / その心に灯る色は

			this.player.createFromSongUrl("http://www.youtube.com/watch?v=bMtYf3R0zhY", {
				video: {
					// 音楽地図訂正履歴: https://songle.jp/songs/2121404/history
					beatId: 3953902,
					repetitiveSegmentId: 2099660,
					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=bMtYf3R0zhY
					lyricId: 52093,
					lyricDiffId: 5177,
				},
			});

		} else if (this.id == 3) {
			// ---
			// シロクマ消しゴム / 夏をなぞって

			this.player.createFromSongUrl("https://www.youtube.com/watch?v=3wbZUkPxHEg", {
				video: {
					// 音楽地図訂正履歴: https://songle.jp/songs/2123489/history
					beatId: 3953764,
					repetitiveSegmentId: 2099662,
					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3D3wbZUkPxHEg
					lyricId: 52062,
					lyricDiffId: 5133,
				},
			});

		} else if (this.id == 4) {
			// ---
			// 濁茶 / 密かなる交信曲

			this.player.createFromSongUrl("http://www.youtube.com/watch?v=Ch4RQPG1Tmo", {
				video: {
					// 音楽地図訂正履歴: https://songle.jp/songs/2121407/history
					beatId: 3953917,
					repetitiveSegmentId: 2099665,

					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=Ch4RQPG1Tmo
					lyricId: 52063,
					lyricDiffId: 5149,
				},
			});

		} else if (this.id == 5) {
			// ---
			// chiquewa / Freedom!

			this.player.createFromSongUrl("https://www.youtube.com/watch?v=pAaD4Hta0ns", {
				video: {
					// 音楽地図訂正履歴: https://songle.jp/songs/2123487/history
					beatId: 3962874,
					repetitiveSegmentId: 2099586,
					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3DpAaD4Hta0ns
					lyricId: 52094,
					lyricDiffId: 5171,
				},
			});

		} else if (this.id == 6) {
			// ---
			// 初音天地開闢神話 / cosMo@暴走P

			this.player.createFromSongUrl("https://www.youtube.com/watch?v=8J6SMoVd5BY", {
				video: {
					// 音楽地図訂正履歴: https://songle.jp/songs/2141043/history
					beatId: 3978203,
					repetitiveSegmentId: 2125922,
					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3D8J6SMoVd5BY
					// lyricId: ,
					// lyricDiffId: ,
					// 歌詞ー!!!!はやくきてくれーっ!!!!
				},
			});

		} else if (this.id == 7) {
			this.player.createFromSongUrl(this.songURL);
		}
	}

	// リサイズ処理
	mainResize() {
		// 画面幅・高さを取得
		let w = window.innerWidth;
		let h = window.innerHeight;
		if (window.innerWidth / window.innerHeight > 1280 / 720) {
			w = 1280 * h / 720;
		} else {
			h = 720 * w / 1280;
		}
		// Canvas要素の大きさを画面幅・高さに合わせる
		this.mainStage.canvas.width = w;
		this.mainStage.canvas.height = h;
		this.mainStage.scale = w / 1280;

		// 画面更新する
		this.mainStage.update();
	}
}
