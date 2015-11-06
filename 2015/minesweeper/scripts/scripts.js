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
    game: {
      clicked: function(target) {
        var selected = document.querySelector(MNSWPR.game.selector(target));
        selected.classList.add("clicked");
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
      sweeper: function() {
        console.log(MNSWPR.MINES.set)

        

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
