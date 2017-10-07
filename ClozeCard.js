// require fs
var fs = require("fs");

module.exports = ClozeCard;

// ClozeCard constructor
function ClozeCard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted = this.text.replace(this.cloze, '______');
    this.create = function() {
        var data = {
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted,
            type: "cloze"
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