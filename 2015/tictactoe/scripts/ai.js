/*
  Tile positions:
  0   1   2
  3   4   5
  6   7   8

*/
var $$ = function(selector) {
  return document.querySelectorAll(selector);
};


(function(){
  var AI = {
    MOVE: {
      index: null,
      match: null
    },
    MOVES: {
      center: [4],
      corners: [0, 2, 6, 8],
      cycle: [0, 1, 2, 5, 8, 7, 6, 3],
      sides: [1, 5, 7, 3],
      patterns: [
        [1,1,0], [1,0,1], [0,1,1]
      ]
    },
    SYMBOL: null,
    WINS: [],
    moves: {
      available: function(index) {
        return TCTCTW.SELECTED[index] === " ";
      },
      blocks: function() {
        return AI.moves.test("X");// index to block with
      },
      click: function(index) {
        $$("ol li")[index].click();
      },
      corners: function() {
        for (var i = 0; i < AI.MOVES.corners.length; i += 1) {
          if (AI.moves.available(AI.MOVES.corners[i])) {
            AI.moves.click(AI.MOVES.corners[i])
            break;
          }
        }
      },
      cycle: function() {
        for (var i = 0; i < AI.MOVES.cycle.length; i += 1) {
          if (AI.moves.available(i)) {
            AI.moves.click(i);
            break;
          }
        }
      },
      first: function() {
        if (AI.moves.available(AI.MOVES.center)) {
          AI.moves.click(AI.MOVES.center)
        } else {
          AI.moves.corners()
        }
      },
      test: function(symbol) {
        var tests = AI.WINS;
        var patterns = AI.MOVES.patterns;
        var played;
        var pattern;
        var match = -1;

        AI.SYMBOL = symbol;

        outer:
        for (var i = 0; i < tests.length; i += 1) {
          played = [];

          for (var j = 0; j < tests[i].length; j += 1) {
            if (TCTCTW.SELECTED[tests[i][j]] === " ") {
              played.push("_");
              AI.MOVE.index = j;
            } else {
              played.push(TCTCTW.SELECTED[tests[i][j]]);
            }
          }

          pattern = played.join("");

          for (var k = 0; k < patterns.length; k += 1) {
            if (AI.think.pattern(patterns[k]) === pattern) {
              match = i;// index that tested successfully
              break outer;
            }
          }
        }

        return match;
      },
      wins: function() {
        return AI.moves.test("O");// index to win with
      }
    },
    think: {
      choose: function() {
        if (TCTCTW.TURNS === 1) {
          AI.moves.first();
        } else {
          var wins = AI.moves.wins();

          if (wins >= 0) {
            AI.moves.click(AI.WINS[wins][AI.MOVE.index]);// the AI has won
          } else {
            var blocks = AI.moves.blocks();

            if (blocks >= 0) {
              AI.moves.click(AI.WINS[blocks][AI.MOVE.index]);// the AI has blocked
            } else {
              if (AI.SYMBOL === "X") {
                AI.moves.cycle();
              }
            }
          }
        }
      },
      pattern: function(pattern) {
        var symbols = [];
        var symbol = AI.SYMBOL;

        for (var i = 0; i < pattern.length; i += 1) {
          if (pattern[i] === 1) {
            symbols.push(symbol);
          } else {
            symbols.push("_");
          }
        }

        return symbols.join("");
      },
      random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      turn: function() {
        setTimeout(AI.think.choose, AI.think.random(3,12) * 100);
      }
    },
    setup: function(game) {
      this.WINS = game.WINS;
    },
    init: function() {
      // nothing is initiated here. The AI is purely responsive
    }
  }

  window.AI = AI;
  AI.init();
}());
