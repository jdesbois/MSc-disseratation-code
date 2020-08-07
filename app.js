const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const fs = require('fs').promises;
const xmlString = require(path.join(__dirname, "public", "script", "xmlStringOutputParser"))
const downloadDir = path.join("public", "data", "downloads")

app.use('/public/', express.static(path.join(__dirname, 'public')))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
app.use(cookieParser())

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, 'index.html'))
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
        await fs.writeFile(path.join(__dirname, downloadDir, "graphJSON.json"), data);
        console.log("JSON written to file") 
    } catch (error) {
        console.log(error)
    }
    res.download(path.join(__dirname, downloadDir, "graphJSON.json"))
    // res.download(`${__dirname}/public/data/downloads/graphJSON.json`)
})

/**
 * Receives JSON object from front end
 * Sends object to XML String creator
 * Writes XML string to file
 * Sends file to download in response
 */
app.post('/save-xml', async(req, res) => {

    try {
        await fs.writeFile(path.join(__dirname, downloadDir, "graphXML.xml"), xmlString.createXMLString(req.body))
        console.log('XML Written to file')
    } catch (error) {
        console.log(error)
    } 
    res.download(path.join(__dirname, downloadDir, "graphXML.xml"))
    // res.download(`${__dirname}/public/data/downloads/graphXML.xml`)
})

app.post('/save-img', async(req, res) => {
    let uri = req.body['img']
    let imgData = uri.split(';base64,').pop()
    
    try {
        await fs.writeFile(path.join(__dirname,downloadDir, "graphIMG.png"), imgData, { encoding: 'base64'})
        console.log("img written to file")
    } catch (err) {
        console.log(err)
    }
    
    res.download(path.join(__dirname, downloadDir, "graphIMG.png"))
    // res.download(`${__dirname}/public/data/downloads/graphIMG.png`)
    
})

app.listen(process.env.PORT || 3000)