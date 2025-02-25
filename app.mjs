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
    return ""
}

app.use((req, res, next) => {
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`Query: ${req.query}`)
    next()
})


app.get('/quiz', (req, res) => {
    res.render('quiz')
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