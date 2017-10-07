// require BasicCard.js
var BasicCard = require('./BasicCard.js');
// require ClozeCard.js
var ClozeCard = require('./ClozeCard.js');
// ( -- npm init -- initializes and creates pkg.json)
// require inquirer for CLI prompts (-- npm install inquirer -- in terminal)
var inquirer = require('inquirer');
// require fs
var fs = require('fs');

inquirer.prompt([{
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: [{
        name: 'Make A Flashcard'
    }, {
        name: 'Show Existing Cards'
    }]
}]).then(function(answer) {
    if (answer.command === 'Make A Flashcard') {
        newCard();
    } else if (answer.command === 'Show Existing Cards') {
        showCards();
    }
});

var newCard = function() {
    // get user input
    inquirer.prompt([{
        name: 'card',
        message: 'What kind of flashcard would you like to create?',
        type: 'list',
        choices: [{
            name: 'BasicCard'
        }, {
            name: 'ClozeCard'
        }]
    // When user decides what kind of card they want to make
    }]).then(function(answer) {
        if (answer.card === 'BasicCard') {
            inquirer.prompt([{
                name: 'front',
                message: 'What is the question?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Provide Response - Question');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'What is the answer?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Provide Response - Answer');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasic = new BasicCard(answer.front, answer.back);
                newBasic.create();
                nextUp();
            });
        } else if (answer.card === 'ClozeCard') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full text?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Provide Response - Full Text');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze portion?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Provide Response - Cloze');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeCard(text, cloze);
                    newCloze.create();
                    nextUp();
                } else {
                    console.log('The cloze portion you provided is not found in the full text. Please try again.');
                    newCard();
                }
            });
        }
    });
};

var nextUp = function() {
    // get user input
    inquirer.prompt([{
        name: 'next',
        message: 'What do you want to do next?',
        type: 'list',
        choices: [{
            name: 'Make A New Card'
        }, {
            name: 'Show Existing Cards'
        }, {
            name: 'Exit Flashcard Application'
        }]
    // after user decides what they'd like to do
    }]).then(function(answer) {
        if (answer.next === 'Make A New Card') {
            newCard();
        } else if (answer.next === 'Show Existing Cards') {
            showCards();
        } else if (answer.next === 'Exit Flashcard Application') {
            return;
        }
    });
};

var showCards = function() {
    // read log.txt
    fs.readFile('./log.txt', 'utf8', function(err, data) {
        //console.log if err
        if (err) {
            console.log(err);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

var showQuestion = function(array, i) {
    question = array[i];
    var parsedQuestion = JSON.parse(question);
    var userResponse;
    var correctReponse;
    if (parsedQuestion.type === 'basic') {
        userResponse = parsedQuestion.front;
        correctReponse = parsedQuestion.back;
    } else if (parsedQuestion.type === 'cloze') {
        userResponse = parsedQuestion.clozeDeleted;
        correctReponse = parsedQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: userResponse
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log('Good Job!');
            if (i < array.length - 1) {
              showQuestion(array, i + 1);
            }
        } else {
            console.log('Wrong Answer!');
            if (i < array.length - 1) {
              showQuestion(array, i + 1);
            }
        }
    });
};