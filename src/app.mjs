import './config.mjs'
import mongoose from 'mongoose'
import express from 'express'
import Question from './db.mjs'
import url from 'url'
import path from 'path'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.json());

app.post('/questions/', async (req, res) => {
  const { question } = req.body;
  if (!question || question.trim() === '') {
    res.status(400).json({ error: 'Question is required' });
    return;
  }
  try {
    const q = await Question.create({ question, answers: [] });
    res.json(q);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
})

app.post('/questions/:id/answers/', async (req, res) => {
  const update = { "$push": { answers: req.body.answer } }
  try {
    const result = await Question.findByIdAndUpdate(req.params.id, update, { "new": true })
    res.json({ success: 'Added an answer' })
  } catch(e) {
    res.status(500).json({ error: 'Failed to add answer' })
  }
})

app.get('/questions/', async (req, res) => {
  // TODO: finish implementation
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {console.log(`Server is listening on ${port}`)})

//cd desktop/homework07-Youngsang-Cho1