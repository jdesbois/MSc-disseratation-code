/**
 * This file will contain the functions and information required to convert the JSON donor pool object into an XML output
 * Since XML when read is converted straight to JSON this file will also just convert the XML into a string that can be written 
 * to a file when the user wishes to save the donor pool.
 */

/**
 * Function: Takes the Current JSON Donor pool as parameter
 * Creates initial XML String 
 * Iterates over donor pool data object
 * Passes entries to Entry String creation function
 * Returns completed XML String
 * @param {*} jsonToConvert 
 */
function createXMLString(jsonToConvert) {
    let xmlString = '<?xml version="1.0" ?>\n'
    xmlString += '<data>\n'

    let jsonData = jsonToConvert['data']

    for (let i=1; i<=Object.entries(jsonData).length; i++) {
       xmlString += createEntryString(jsonData[i], i)
    }
    xmlString += '</data>'
    return xmlString
}

/**
 * Function: Takes a JSON donor pool entry and associated ID 
 * Iterates over sources and matches, passes data to respective functions
 * Checks for altruisitic donors and adds altruistic donor string
 * Passes donor age to age string creator function
 * Returns a completed Donor Entry string
 * @param {*} jsonEntry 
 * @param {*} id 
 */
function createEntryString(jsonEntry, id) {
    let donorString = '<entry donor_id="' + id + '">\n'

    if (jsonEntry['sources']) {
       donorString += createSourcesString(jsonEntry['sources'])
    }
    donorString += createDageString(jsonEntry['dage'])

    if (jsonEntry['altruistic']) {
        donorString += createAltruisticString() 
    }

    if (jsonEntry['matches']) {
        donorString += createMatchesString(jsonEntry['matches'])
    }

    donorString += '</entry>\n'
    return donorString
}


/**
 * Function: Takes sourcs from donor entry
 * Iterates over sources and creates a string for each entry using Source String creation function
 * Returns a compeleted String of sources
 * @param {*} sources 
 */
function createSourcesString(sources) {
    let sourcesString = "\t<sources>\n"
    for(let i=0; i<sources.length; i++) {
        sourcesString += createSourceString(sources[i])
    }
    sourcesString += "\t</sources>\n"
    return sourcesString
}

/**
 * Function: Takes a single source from donor entry sources array
 * Creates formatted source string
 * returns completed string
 * @param {*} source 
 */
function createSourceString(source) {
    let sourceString = '\t\t<source>' + source + '</source>\n'
    return sourceString
}

/**
 * Function: Takes donor age from donor entry 
 * Creates formatted donor age string
 * Returns completed string
 * @param {*} dage 
 */
function createDageString(dage) {
    let dageString = '\t<dage>' + dage + '</dage>\n'
    return dageString
}

/**
 * Function: Is called when an altruistic donor is found
 * Creates and formats an altruistic donor string
 * returns completed string
 */
function createAltruisticString() {
    return '\t<altruistic>' + true + '</altruistic>\n'
}

/**
 * Function: Takes matches array from a single donor entry 
 * Iterates over matches and passes each match to match string creation function
 * Returns a formatted matches string
 * @param {*} matches 
 */
function createMatchesString(matches) {
    let matchesString = '\t<matches>\n'

    for(let i=0; i<matches.length; i++) {
        matchesString += createMatchString(matches[i])
    }
    matchesString += '\t</matches>\n'
    return matchesString
}

/**
 * Function: takes a single match from a matches array in a donor entry
 * Creates and formats a match string
 * Returns match string
 * @param {*} match 
 */
function createMatchString(match) { 
    let matchString = '\t\t<match>\n'
    matchString += '\t\t\t<recipient>' + match['recipient'] + '</recipient>\n'
    matchString += '\t\t\t<score>' + match['score'] + '</score>\n'
    matchString += '\t\t</match>\n'

    return matchString
    
}

exports.createXMLString = createXMLString