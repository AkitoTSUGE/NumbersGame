'use strict';

{
  class Panel {//Panelはどのようなもので何をするのかをまとめる
    constructor(game) {//constructor内には初期化するものを入れる（使い始める前の値を入れる箱を設定する）
      this.game = game;
      this.el = document.createElement('li');
      this.el.classList.add('pressed');
      this.el.addEventListener('click', () => {
        this.check();
      });
    }
    //それ以外の処理はメソッドに書き、newした時に呼びたい場合はconstructor()から呼び出す
    getEl() {
      return this.el;
    }

    activate(num) {
      this.el.classList.remove('pressed');
      this.el.textContent = num;
    }

    check() {
      if (this.game.getCurrentNum() === parseInt(this.el.textContent,10)) {//parseInt??
        this.el.classList.add('pressed');
        this.game.addCurrentNum();
        if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          clearTimeout(this.game.getTimeoutId());
          this.game.gameClear();//自分で追加
        }
      }
    }
  }

  class Board {//Boardの責務はpanelをどのようにいくつ配置するか、など
    constructor(game) {
      this.game = game;
      this.panels = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        this.panels.push(new Panel(this.game));
      }
      this.setup();
    }

    setup() {
      const board = document.getElementById('board');
      this.panels.forEach(panel => {
        // board.appendChild(panel.el)
        board.appendChild(panel.getEl());//クラスの内のプロパティに外部から直接アクセスしない方が良いとされているのでメソッド経由でelを取得している。これをオブジェクト指向のカプセル化という。
      });
    }

    activate () {
      const nums = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }
      this.panels.forEach(panel => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.activate(num);//それぞれのpanelに対して０を渡してactivateを渡して実行する
      });
    }
  }

  

  class Game {
    constructor(level) {
      this.level = level;
      this.board = new Board(this);
      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined; //setTimeoutを止めるためにはそれの返り値が必要なので、timeoutIdを変数にして宣言する
      const btn = document.getElementById('btn')
      btn.addEventListener('click', () => {
        this.start();
      });
      this.setup();
    }

    setup() {
      const container = document.getElementById('container');

      const PANEL_WIDTH = 50;
      const BOARD_PADDING = 10;
        /*50px * 2 + 10px * 2*/
      container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
    }

    start() {
      if (typeof this.timeoutId !== 'undefined') {
        
        //typeofは後ろの値の型を調べるもの。timeoutIdに何かが入っていれば、つまりタイマーが作動していればfalseなのでここは通らない。

        clearTimeout(this.timeoutId)
      }
  
      this.currentNum = 0;
      this.board.activate();
  
      this.startTime = Date.now();
      this.runTimer();
    }
    runTimer() {
      const timer = document.getElementById('timer');
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);
  
      this.timeoutId = setTimeout(() => {//setTimeoutの返り値をtimeoutIdに設定
        this.runTimer();
      },10);
    }

    addCurrentNum() {
      this.currentNum++;//これを実行するcheck()では返り値を使っていない（カプセル化にともないこのクラス内のcurrentNumを1増やすためなので）returnは付けなくて良い
    }

    getCurrentNum() {
      return this.currentNum;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }

    addClass() {//自分で追加
      this.listli = document.querySelectorAll('li');
      this.listli.forEach((li) => {
        li.classList.add('displayNone')
      });
    }

    gameClear() {//自分で追加
      const conf = confirm('次のレベルに進みますか？')
      const levelTeller = document.getElementById('level')
      if (conf) {
        this.addClass()
        this.level += 1;
        levelTeller.textContent = `Level:${this.level - 1}`;
        this.setup()
        this.board = new Board(this);
        // this.start();
      }
     }

  }
  new Game(2);
}