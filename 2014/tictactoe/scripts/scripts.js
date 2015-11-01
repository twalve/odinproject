(function() {
    var TCTCT = {
        MARKS: {
            clicked: null,
            player: "one",// "two"
            claimed: {
                one: "",
                two: ""
            },
            marks: {
                one: "fa-bomb",
                two: "fa-asterisk"
            }
        },
        TILES: 9,
        WINNER: null,
        WINS: [
            "012", 345, 678,// rows
            "036", 147, 258,// columns
            "048", 246// diagonals
        ],
        assign: function() {
            var claimed = TCTCT.MARKS.claimed[TCTCT.MARKS.player] + TCTCT.MARKS.clicked;

            TCTCT.MARKS.claimed[TCTCT.MARKS.player] = TCTCT.reorder(claimed);
        },
        board: function() {
            var dom = document.createElement('div');
            for (var i = 0; i < this.TILES; i += 1) {
                var button = document.createElement('button');
                button.innerHTML = "";
                button.id = i;
                dom.appendChild(button);
            }

            document.querySelector('x-board').innerHTML = dom.innerHTML;
        },
        claim: function(button) {
            if (!button.innerHTML && !TCTCT.WINNER) {
                // button.innerHTML = TCTCT.MARKS.marks[TCTCT.MARKS.player];
                TCTCT.MARKS.clicked = button.id;
                TCTCT.iconise(button);
                TCTCT.assign();
                TCTCT.judge();

                TCTCT.MARKS.player = TCTCT.MARKS.player === "one" ? "two" : "one";
            }
        },
        iconise: function(button) {
            var icon = document.createElement("i");
            icon.classList.add("fa");
            icon.classList.add(TCTCT.MARKS.marks[TCTCT.MARKS.player]);
            button.classList.add("claimed");
            button.appendChild(icon);
        },
        judge: function() {
            for (var i = 0; i < TCTCT.WINS.length; i += 1) {
                // if (TCTCT.WINS[i] == TCTCT.MARKS.claimed[TCTCT.MARKS.player]) {

                console.log([TCTCT.MARKS.claimed[TCTCT.MARKS.player], TCTCT.WINS[i], TCTCT.MARKS.claimed[TCTCT.MARKS.player].indexOf(TCTCT.WINS[i])])

                if (TCTCT.MARKS.claimed[TCTCT.MARKS.player].indexOf(TCTCT.WINS[i]) !== -1) {
                    TCTCT.WINNER = TCTCT.MARKS.player;
                    TCTCT.mask();
                }
            }
        },
        listen: function() {
            document.querySelector('x-board').addEventListener("click", function(event){
                if (event.target.tagName.toLowerCase() === "button") {
                    TCTCT.claim(event.target);
                }
            });
            document.querySelector('aside a').addEventListener("click", function(event){
                document.location.reload();
            });
        },
        mask: function() {
            document.body.classList.add("gameover");
        },
        register: function(elements) {
            for (var i = 0; i < elements.length; i += 1) {
                var register = document.createElement(elements[i]);
            }
        },
        reorder: function(claimed) {
            return claimed.split("").sort(function(a, b) {
                return a - b;
            }).join("");
        },
        init: function() {
            this.register(['x-board']);
            this.board();
            this.listen();
        }
    }

    window.TCTCT = TCTCT;
    window.TCTCT.init();
}());
