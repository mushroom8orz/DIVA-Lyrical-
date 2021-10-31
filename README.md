# DIVA-Lyrical-
[初音ミク「マジカルミライ 2021」プログラミング・コンテスト](https://magicalmirai.com/2021/procon/)応募作品です
![img](/preview.gif)
## 概要
音楽情報が取れるならあのリズムゲームを作れるじゃん！ということで7月からWebアプリを学んで作りました。  
途中友人の思い付きでゲームデザインを変更しましたが、よりリリックアプリらしい独自性を出せたと思います。  

---ゲーム説明---  
タイミングよく同じ色のボタンを押して歌詞を完成させよう！  
クリック、キーボードでも遊べます 「s」「g」=赤 「k」「:」=青  

[ゲームプレイはこちらから](https://mushroom8orz.github.io/DIVA-Lyrical-/)

## 振り返り
惜しくも落選しましたが、今後のため個人的に考えた落選理由と改善点をリストアップ
- **不具合が残っている**  
 piapro曲だとクリア画面が表示されない、ノードが画面から出る等
 
- **PCでしか遊べない**  
 時間がなくスマホでデバックしたことがなかったんや…  
 今自分でスマホからURL開いて驚いてる始末。開発環境を改める必要あり(VisualStudioCodeだけでやった)
 
- **クオリティが低い**  
 同じゲーム作品投稿と比べると操作性、UI、説明書きなど節々で質がよくない  
 ゲームを題材にするなら磨きたいところ
 
- **その他**  
 悪く言うとパクリ まねるなら完璧か独自性を加えたい  
 TextAriveの性能を引き出せていない サビ、コード進行など取得できる要素で機能を増やしたい  
 投稿が遅い 締切10分前はよくない ご迷惑をおかけしてすみません。

Webアプリ初心が3カ月(学習に2カ月使ったため製作期間は実質1カ月)でやれたこととしては  
正直満足だと思ってます。ﾎﾒﾃ

## 来年に向けて
参加するなら以下を更新したい
- ゲームのブラッシュアップ (必須)
- 歌詞エディット機能 (できれば)
- 譜面エディット機能 (やりたい)
- PVエディット機能 （再来年ぐらい）

## 使用したライブラリなど
音源は[ここ](https://github.com/pentamania/sukuphina)から拝借しています。  
自由に利用・再配布可能とのこと。

### CreateJS
<p align="center">
  <a href="https://createjs.com">
    <img alt="createjs" src="https://raw.githubusercontent.com/createjs/createjs/master/assets/github-header.png" width="546">
  </a>
</p>
CreateJSは、HTML5でリッチコンテンツを制作するためのJavaScriptライブラリのスイート（特定用途のソフトウェアを詰め合わせたパッケージ）です。

[入門サイト](https://mushroom8orz.github.io/DIVA-Lyrical-/)

### TextAlive App API

![TextAlive](https://i.gyazo.com/thumb/1000/5301e6f642d255c5cfff98e049b6d1f3-png.png)

TextAlive App API は、音楽に合わせてタイミングよく歌詞が動くWebアプリケーション（リリックアプリ）を開発できるJavaScript用のライブラリです。

TextAlive App API について詳しくはWebサイト [TextAlive for Developers](https://developer.textalive.jp/) をご覧ください。