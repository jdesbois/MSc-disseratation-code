const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const cookieParser = require('cookie-parser')
const fs = require('fs').promises;
const xmlString = require('./public/script/xmlStringOutputParser')


app.use('/public/', express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

/**
 * Receives JSON object from front end
 * Turns object to string
 * Writes to file
 * Sends file to download in response
 */
app.post('/save-json', async(req, res) => {

    let data = JSON.stringify(req.body, null, 4)
    try {
        await fs.writeFile(`${__dirname}/public/data/donorPool.json`, data);
        console.log("JSON written to file") 
    } catch (error) {
        console.log(error)
    }

    res.download(`${__dirname}/public/data/donorPool.json`)
})

/**
 * Receives JSON object from front end
 * Sends object to XML String creator
 * Writes XML string to file
 * Sends file to download in response
 */
app.post('/save-xml', async(req, res) => {

    try {
        await fs.writeFile(`${__dirname}/public/data/donorPool.xml`, xmlString.createXMLString(req.body))
        console.log('XML Written to file')
    } catch (error) {
        console.log(error)
    } 
    res.download(`${__dirname}/public/data/donorPool.xml`)
})


app.listen(port, () => console.log(`Application running and listening at http://localhost:${port}`))