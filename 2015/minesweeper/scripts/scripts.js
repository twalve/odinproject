(function(){
  var MNSWPR = {
    FLAG: false,
    MINES: {
      count: 8,
      difficulty: "easy",
      set: []
    },
    GRID: {
      cells: 20,
      columns: 9,
      count: null,
      rows: 9
    },
    RINGED: [
      [-1,-1], [-1,0], [-1,1],
      [0,-1],/*[x],*/[0,1],
      [1,-1], [1,0], [1,1]
    ],
    game: {
      clicked: function(target) {
        var selected = document.querySelector(MNSWPR.game.selector(target));
        selected.classList.add("clicked");

        if (selected.classList.contains("mined")) {
          selected.classList.add("boom");
          MNSWPR.game.over();
        } else {
          
        }
      },
      flag: function() {
        MNSWPR.FLAG = (MNSWPR.FLAG) ? false : true;
        document.querySelector("header fieldset:last-child label").classList.toggle("flagged");
      },
      flagged:  function(target) {
        var selected = document.querySelector(MNSWPR.game.selector(target));
        selected.classList.toggle("flagged");
      },
      mine: function() {
        var unplaced = MNSWPR.MINES.count - MNSWPR.MINES.set.length;

        for (var i = 0; i < unplaced; i += 1) {
          var row = MNSWPR.core.random(0, MNSWPR.GRID.rows - 1);
          var column = MNSWPR.core.random(MNSWPR.GRID.columns + 1);// min optional, then max not inclusive
          var target = [row, column].join("_");
          var selected = document.querySelector(MNSWPR.game.selector(target));

          if (!selected.classList.contains("mined")) {
            MNSWPR.MINES.set.push(target);
            selected.classList.add("mined");
          }
        }

        if (MNSWPR.MINES.set.length !== MNSWPR.MINES.count) {
          MNSWPR.game.mine();
        } else {
          MNSWPR.game.sweeper();
        }
      },
      over: function() {
        document.documentElement.classList.add("gameover");
        alert("BOOM");
      },
      sweeper: function() {
        var ring = function(rowcol, count) {
          for (var i = 0; i < MNSWPR.RINGED.length; i += 1) {

            var row = MNSWPR.core.add(rowcol[0], MNSWPR.RINGED[i][0]);
            var col = MNSWPR.core.add(rowcol[1], MNSWPR.RINGED[i][1]);

            if (row > -1 && row < MNSWPR.GRID.rows) {
              if (col > -1 && col < MNSWPR.GRID.columns) {

                var ringer = document.querySelector("[data-grid='" + row + "_" + col + "']");
                var count = parseInt(ringer.getAttribute('data-ring'), 10) || 0;
                ringer.setAttribute('data-ring', count + 1);
              }
            }
          }
        }

        MNSWPR.MINES.set.sort();

        for (var i = 0; i < MNSWPR.MINES.set.length; i += 1) {
          ring(MNSWPR.MINES.set[i].split("_"), i);          
        }
      },
      selector: function(target) {
        return ["[data-grid='", target,"']"].join("");
      },
      setup: function() {
        this.mine();
      }
    },
    player: {
      turn: function(cell) {
        if (MNSWPR.FLAG) {
          MNSWPR.game.flagged(cell.dataset.grid);
        } else {
          MNSWPR.game.clicked(cell.dataset.grid);
        }
      }
    },
    build: function() {
      var list = document.createElement("UL");

      for (var i = 0; i < MNSWPR.GRID.rows; i += 1) {
        for (var j = 0; j < MNSWPR.GRID.columns; j += 1) {
          var item = document.createElement("LI");
          item.dataset.grid = [i, j].join("_");
          list.appendChild(item);

          MNSWPR.GRID.count += 1;
        }
      }

      document.querySelector("section ol").innerHTML = list.innerHTML;
    },
    core: {
      add: function(a, b) {
        return (parseInt(a, 10) + parseInt(b, 10));
      },
      leading: function(chars) {
        return (chars.toString().length > 1) ? chars : "0" + chars;
      },
      random: function(min, max) {
        return (max) ?
          Math.floor(Math.random() * (max - min + 1)) + min
        :
          Math.floor(Math.random() * (min - 1))
        ;
      }
    },
    listen: function() {
      document.querySelector("ol").addEventListener("click", function(event){
        if (event.target.tagName.toLowerCase() === "li") {
          MNSWPR.player.turn(event.target);
        }
      }, false);

      document.querySelector("header [type='checkbox']").addEventListener("change", function(event){
        MNSWPR.game.flag();
      }, false);

    },
    search: function() {
      // check for a query string to set the game level
    },
    style: function() {
      var list = document.createElement("STYLE");
      var rules = [
        "ol {",
          "width: ", (MNSWPR.GRID.cells * MNSWPR.GRID.columns) + 1, "px;",
        "}",
        "li {",
          "height: ", MNSWPR.GRID.cells, "px;",
          "width: ", MNSWPR.GRID.cells, "px;",
        "}"
      ].join("");
      var style = document.createTextNode(rules);

      list.appendChild(style);
      document.querySelector("head").appendChild(list);      
    },
    init: function() {
      this.build();
      this.game.setup();
      this.listen();
    }
  };

  window.MNSWPR = MNSWPR;
  MNSWPR.style();
  MNSWPR.init();
}());
