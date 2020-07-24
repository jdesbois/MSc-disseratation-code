/**
 * This file contains the functions required to read and write to the required XML object
 * When a user requests to load an XML file it will parse the file and turn it into a JSON object
 * When a user wishes to save as XML it will parse the JSON object into an XML object and write to file
 */

 /**
  * Function: This function is called by the controller when an XML file is selected to be read
  * Receives the files content as a String from controller
  * Uses DOM Parser to convert XML String into XML Tree
  * Selects the donor entries of the XML document
  * Iterates over entries and passes each one to the createNode function
  * Returns a completed JSON donor pool object
  * @param {*} data 
  */
function readXMLFile(data) {
    let jsonObj = buildJSONObject()
    let domParser = new DOMParser()

    let xmlDocument = domParser.parseFromString(data, "text/xml")
    let xmlStringDocument = new XMLSerializer().serializeToString(xmlDocument)
    console.log(xmlStringDocument)
    let xmlData = xmlDocument.getElementsByTagName('entry')

    for(let i=0; i<xmlData.length; i++) {
        let entryID = xmlData[i]['attributes'][0]['nodeValue']
        jsonObj['data'][entryID] = createNode(xmlData[i])
    }
    return jsonObj
}
/**
 * Function: Takes a single entry from the XML donor pool 
 * Extracts the sources and matches elements and passes to respective functions
 * Checks for Altruistic donor and sets to true on Node
 * Extracts donor age and pases into Int and adds to Node
 * Returns completed JSON formatted node from XML entry
 * @param {*} entry 
 */
function createNode(entry) {
    // Creation of blank JSON Node entry
    let jsonNode = {}
    // Extracts sources elements and passes to function to create sources array
    if (entry.getElementsByTagName('sources')[0]) {
        jsonNode['sources'] = getSources(entry.getElementsByTagName('sources')[0])
    }
    // Checks for altruistic donor
    if (entry['children'][1]['nodeName'] === "altruistic") {
        jsonNode['altruistic'] = true
    }
    // Checks for matches for donor entry and passes to function to extract if exists
    if (entry.getElementsByTagName('matches')[0]) {
        jsonNode['matches']= getMatches(entry.getElementsByTagName('matches')[0])
    }
    // Extracts donor age from entry and parses into an Integer
    jsonNode['dage'] = parseInt(entry.getElementsByTagName('dage')[0].innerHTML)    

    return jsonNode
}
/**
 * Function: Takes the sources entry from the XML donor entry
 * Iterates over the sources and adds the sources ID to an array
 * Returns sources array
 * @param {*} sources 
 */
function getSources(sources) {
    // console.log(sources)
    let sourcesArray = []
    for (let i=0; i<sources['children'].length; i++) {
        sourcesArray.push(parseInt(sources['children'][i].innerHTML))
    }
    return sourcesArray
}
/**
 * Function: Takes XML donor entry matches
 * Iterates over the matches and creates a match for each one
 * Adds match to the matches array
 * Returns completed matches array 
 * @param {*} matches 
 */
function getMatches(matches) {
    let entryMatches = matches.getElementsByTagName('match')
    let matchesArray = []

    for (let i=0; i<entryMatches.length; i++) {
        let recipient = parseInt(entryMatches[i]['children'][0].innerHTML)
        let score = parseInt(entryMatches[i]['children'][1].innerHTML)
        let match = {
            "recipient": recipient,
            "score": score,
        }
        matchesArray.push(match)
    }
    return matchesArray
}