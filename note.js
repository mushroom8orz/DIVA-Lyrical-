class Note extends createjs.Container {
	constructor(char, time, x, y) {
		super();    // 親クラスのコンストラクタ呼び出し

		this.text = char.text;
		this.initTime = time;	//生成タイム
		this.finishTime = char.startTime;	//発声タイム
		this.duration = char.duration;
		this.isTouch = false;	//タッチ判定

		//描画の位置
		if (y < 720 / 2) {
			this.type = "top"
		} else {
			this.type = "bottom"
		}
		this.x = x;

		//ターゲットアイコン
		this.targets = new createjs.Container();
		this.addChild(this.targets);

		let bTarget = new createjs.Text(this.text, "bold 50px Meiryo", "white");
		bTarget.textBaseline = "middle";
		let fTarget = new createjs.Text(this.text, "50px Meiryo", "black");
		fTarget.textBaseline = "middle";
		fTarget.shadow = new createjs.Shadow("white", 0, 0, 4);

		this.arrow = new createjs.Shape();
		this.arrow.graphics.beginStroke("white").setStrokeStyle(2)
			.beginFill("black").drawRect(-4, 4, 8, -44)
			.beginFill("black").drawPolyStar(0, -44, 10, 3, 0, -90);
		this.arrow.shadow = new createjs.Shadow("black", 0, 0, 2);
		this.arrow.x = fTarget.getMeasuredWidth() / 2;

		createjs.Tween.get(this.targets)
			.wait(93.75).to({ scale: 1.2 }, 0)
			.wait(187.5).to({ scale: 1 }, 0);

		this.targets.addChild(bTarget);
		this.targets.addChild(fTarget);
		this.targets.addChild(this.arrow);

		//メロディアイコン
		this.melodys = new createjs.Container();
		let color = "black";
		if (this.type == "top") {
			this.melodys.y = 500;
			color = "crimson";
		} else {
			this.melodys.y = -500;
			color = "blue";
		}
		this.addChild(this.melodys);

		let shadow = new createjs.Text(this.text, "50px Meiryo", "black");
		shadow.textBaseline = "middle";
		shadow.x = 4;
		shadow.y = 4;
		shadow.alpha = 0.5;
		let back = new createjs.Text(this.text, "bold 50px Meiryo", "black");
		back.textBaseline = "middle";
		this.front = new createjs.Text(this.text, "50px Meiryo", color);
		this.front.textBaseline = "middle";

		this.melodys.addChild(shadow);
		this.melodys.addChild(back);
		this.melodys.addChild(this.front);

		this.size = this.front.getMeasuredWidth();
		this.distance = this.melodys.y;
	}

	getSize() {
		return this.size;
	}

	getTime() {
		return this.finishTime;
	}

	getTouch() {
		return this.isTouch;
	}

	setTouch(judg, combo) {
		this.removeChild(this.targets);

		let s = judg;
		if (combo != 0) {
			s = s + " " + combo;
		}

		let c = "";
		if (judg == "COOL") {
			c = "gold";
		} else if (judg == "FINE") {
			c = "silver";
		} else if (judg == "SAFE") {
			c = "green";
		} else if (judg == "SAD") {
			c = "navy";
		} else if (judg.match(/WRONG/)) {
			if (judg.match(/COOL/)) {
				c = "red";
			} else if (judg.match(/FINE/)) {
				c = "black";
			} else if (judg.match(/SAFE/)) {
				c = "green";
			} else if (judg.match(/SAD/)) {
				c = "navy";
			}
			s = "WRONG";
		} else if (judg == "WORST") {
			c = "purple"
		}

		this.front.color = c;

		let line = new createjs.Container();
		line.y = -40
		let b = new createjs.Text(s, "bold 30px Meiryo", "black");
		b.textAlign = "center";
		b.textBaseline = "middle";
		let f = new createjs.Text(s, "30px Meiryo", c);
		f.textAlign = "center";
		f.textBaseline = "middle";
		f.shadow = new createjs.Shadow("black", 0, 0, 1);
		line.addChild(b);
		line.addChild(f);
		this.addChild(line);

		createjs.Tween.get(line)
			.wait(this.duration).to({ alpha: 0 }, 100);

		this.isTouch = true;
	}

	getType() {
		return this.type;
	}

	move(pos) {
		if (this.isTouch) { return; }

		this.melodys.y = this.distance - (this.distance / (this.finishTime - this.initTime) * (pos - this.initTime));

		this.arrow.rotation = 360 / (this.finishTime - this.initTime) * (pos - this.initTime);


		let frame = 1000 / 60;
		if (this.finishTime + frame * 4 < pos) {
			this.targets.scale *= 0.9;
			this.melodys.scale *= 0.9;
		}
	}
}