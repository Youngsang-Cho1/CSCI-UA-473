// app.mjs
import express from 'express'
import hbs from 'hbs'
export let server = null;
export const app = express();

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Implement the decorate function
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



server = app.listen(3000, () => {
    console.log("Server started; type CTRL+C to shut down");
});
// Continue with the rest of the code
// cd desktop/homework04-Youngsang-Cho1