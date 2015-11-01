var $ = function(selector) {
  return document.querySelector(selector);
};

(function(){
  var TCTCTW = {
    ENDED: false,
    GRID: {
      columns: 3,
      rows: 3
    },
    SELECTED: [],
    SYMBOL: "X",// "O"
    TURNS: 0,
    WINS: [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ],
    game: {
      next: function() {
        TCTCTW.TURNS += 1;
        TCTCTW.SYMBOL = (TCTCTW.SYMBOL === "X") ? "O" : "X";
      },
      over: function(ending) {
        var message;
        var className;

        switch (ending) {
          case "ended":
            message = "Player " + TCTCTW.SYMBOL + " wins the game";
            className = "icon-trophy";
            break;
          case "over":
            message = "Game Over";
            className = "icon-skull";
            break;
        }

        $("body > aside h1").innerHTML = message;
        document.querySelector("body > aside .icon").className = "icon " + className;
        document.querySelector("body").classList.add(ending);
      },
      pattern: function() {
        return TCTCTW.SYMBOL + TCTCTW.SYMBOL + TCTCTW.SYMBOL;
      },
      replay: function() {
        TCTCTW.ENDED = false;
        TCTCTW.SELECTED = [];
        TCTCTW.SYMBOL = "X";
        TCTCTW.TURNS = 0;
        TCTCTW.build();

        document.querySelector("body").classList.remove("ended", "over");
      },
      resolve: function() {
        for (var i = 0; i < TCTCTW.WINS.length; i += 1) {
          var pattern = [];
          for (var j = 0; j < TCTCTW.WINS[i].length; j += 1) {
            pattern.push(TCTCTW.SELECTED[TCTCTW.WINS[i][j]]);
          }

          if (pattern.join("") === TCTCTW.game.pattern()) {
            TCTCTW.game.over("ended");
            TCTCTW.ENDED = true;
            break;
          }
        }

        if (TCTCTW.TURNS === 8 && !TCTCTW.ENDED) {
          TCTCTW.game.over("over");
        }
      },
      turn: function(cell) {
        if (cell.classList.toString().indexOf("-") === -1) {
          cell.classList.add("icon-" + TCTCTW.SYMBOL);
          TCTCTW.SELECTED[cell.getAttribute("data-index")] = TCTCTW.SYMBOL;
        }

        if (TCTCTW.TURNS > 3) { TCTCTW.game.resolve(); }

        TCTCTW.game.next();
      }
    },
    opponent: {
      human: function() {
        window.location.assign("playerversusplayer.html");
      },
      robot: function() {
        window.location.assign("playerversusai.html");
      }
    },
    build: function() {
      var target = document.querySelector("ol");
      var list = document.createElement("ol");
      var cells = this.GRID.columns * this.GRID.rows;
      var i = 0;

      for (; i < cells; i += 1) {
        this.SELECTED.push(" ");
        var cell = document.createElement("li");
        cell.classList.add("icon");
        cell.dataset.index = i;
        list.appendChild(cell);
      }

      target.innerHTML = list.innerHTML;
    },
    listen: function() {
      document.querySelector("body").addEventListener("click", function(event){
        if (event.target.tagName.toLowerCase() === "li") {
          TCTCTW.game.turn(event.target);
        }
      }, false);

      document.querySelector("button").addEventListener("click", function(event){
        TCTCTW.game.replay();
      }, false);

      document.querySelector("select").addEventListener("change", function(event){
        TCTCTW.opponent.robot();
      }, false);
    },
    init: function() {
      this.build();
      this.listen();
    }
  };

  window.TCTCTW = TCTCTW;
  TCTCTW.init();
}());
