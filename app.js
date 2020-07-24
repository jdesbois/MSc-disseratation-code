const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use('/public/', express.static(path.join(__dirname, 'public')))

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})



app.listen(port, () => console.log(`Application running and listening at http://localhost:${port}`))