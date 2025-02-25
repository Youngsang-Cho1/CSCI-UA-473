// app.mjs
import express from 'express'
import { Query } from './query.mjs';
import { readFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import hbs from 'hbs';
export let server = null;
export const app = express();

let queries = []

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

readFile ('code-samples/question-bank.json', 'utf-8', (err, data) => {
    if (err) {
        console.error("Error occured:", err);
        return ;
    }
    const queryData = JSON.parse(data);
    queryData.forEach(elem => {
        queries.push(new Query(uuidv4(), elem.question, elem.genre, elem.answers));
    })
    console.log("Questions:", queries);
})


export const decorate = (answer, correct) => {
    if (correct) {
        return `<span class="correct-answer">${answer}</span>`;
    }
    return `<span class="incorrect-answer">${answer}</span>`;
}

app.use((req, res, next) => {
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`Query:`, JSON.stringify(req.query, null, 2))
    next()
})
app.get('/', (req, res) => {
    res.redirect('/quiz');
});

app.get('/quiz', (req, res) => {
    if (queries.length === 0){
        return res.render('quiz', {error: "No question available"})
    }
    const randIndex = Math.floor(Math.random() * queries.length);
    const returnVal = queries[randIndex];

    res.render('quiz', {
        question : returnVal.question,
        id : returnVal.id
    })
})

app.post('/quiz', (req, res) => {
    const {answer, id} = req.body;
    const question = queries.find(q => q.id === id)

    if (!question) {
        return res.render('quiz', { error: "No matching question ID." })
    }

    const userAnswer = answer.split(',').map(item => item.trim());
    const correctAnswer = question.answers.map(item => item.trim());

    const userAnswerLower = userAnswer.map(item => item.toLowerCase());
    const correctAnswerLower = correctAnswer.map(item => item.toLowerCase());

    let answerDict = {}

    let decoratedAnswer = []
    let correctCounter = 0;

    for (let i = 0; i < userAnswerLower.length; i++) {
        if (correctAnswerLower.includes(userAnswerLower[i]) && !(answerDict.hasOwnProperty(userAnswerLower[i]))) {
            correctCounter ++;
            let original = correctAnswer.find(a => a.toLowerCase() === userAnswerLower[i]);
            answerDict[userAnswerLower[i]] = 1;
            decoratedAnswer.push(decorate(original, true));
        }
        else {
            decoratedAnswer.push(decorate(userAnswer[i], false));
        }
    }
    let status

    if (correctCounter === correctAnswer.length && userAnswer.length === correctAnswer.length) {
        status = "Correct";
    }
    else if (correctCounter === 0 ){
        status = "Incorrect";
    }
    else {
        status = "Partially Correct";
    }

    res.render('quiz', {
        question : question.question,
        id : question.id,
        userAnswer : answer,
        correction: decoratedAnswer.join(', '),
        status: status
    });  

})

app.get('/questions', (req, res) => {
    const value  = req.query.search
    let filtQueries = [];

    if (!value) {
        return res.render('questions', { queries });
    }
    for (let i of queries) {
        if (i["question"].includes(value) || i["genre"].includes(value) || (i["answers"].filter(a => a == value)).length > 0) {
            filtQueries.push(i)
        }
    }
    res.render('questions', { queries : filtQueries });
});

app.post('/questions', (req,res) => {
    const {question, genre, answers} = req.body;
    const newQuestion = new Query (uuidv4(), question, genre, answers.split(","));
    queries.push(newQuestion);
    res.redirect("/questions")
})


server = app.listen(3000, () => {
    console.log("Server started; type CTRL+C to shut down");
});
// cd desktop/homework04-Youngsang-Cho1
// npx mocha tests/app-test.mjs