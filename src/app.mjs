import express from 'express'
const app = express()

import url from 'url'
import path from 'path'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req,res) => {
    res.redirect('/game.html')
})
app.listen(3000)
