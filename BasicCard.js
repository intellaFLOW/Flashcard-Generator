// require fs
var fs = require("fs");

module.exports = BasicCard;

// BasicCard constructor
function BasicCard(front, back) {
    this.front = front;
    this.back = back;
    this.create = function() {
        // flashcard data to be appended
        var data = {
            front: this.front,
            back: this.back,
            type: "basic",
        };
        // add card to log.txt
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(err) {
            // console.log if err
            if (err) {
                console.log(err);
            }
        });
    };
}