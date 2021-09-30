class TextButton extends createjs.Container {

	constructor(s, x, y, w, c = "deepskyblue") {
		super();    // 親クラスのコンストラクタ呼び出し

		this.x = x;
		this.y = y;

		// 角丸四角形
		let rect = new createjs.Shape();
		rect.graphics.beginFill(c)
			.drawRoundRect(0, 0, w, 50, 20, 20);
		rect.shadow = new createjs.Shadow("violet", 0, 0, 2);
		this.addChild(rect);

		let text = new createjs.Text(s, "40px Meiryo", "white");
		text.textAlign = "center";
		text.x = w / 2;
		text.y = 5;
		text.shadow = new createjs.Shadow("black", 0, 0, 2);
		this.addChild(text);
	}
}