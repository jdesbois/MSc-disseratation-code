/**
 * This file will contain the functions and information required to convert the JSON donor pool object into an XML output
 * Since XML when read is converted straight to JSON this file will also just convert the XML into a string that can be written 
 * to a file when the user wishes to save the donor pool.
 */

function createXMLDom(jsonToConvert) {
    let xmlDOM = document.implementation.createDocument("", "", null)
    xmlDOM.xmlVersion = 1.0
    xmlDOM.appendChild(xmlDOM.createElement('data'))
    let jsonData = jsonToConvert['data']
    
    for (let i=1; i<=Object.entries(jsonData).length; i++) {
        xmlDOM['children'][0].appendChild(createDonorEntry(jsonData[i], i))
    }

    return xmlDOM   
}


function createDonorEntry(jsonEntry, id) {
    let xmlDonor = document.createElement("entry")

    xmlDonor.setAttribute("donor_id", id)

    if (jsonEntry['sources']) {
        xmlDonor.appendChild(createSources(jsonEntry['sources']))
    }

    xmlDonor.appendChild(createAge(jsonEntry['dage']))

    if (jsonEntry['altruistic']) {
        xmlDonor.appendChild(createAltruistic())
    }

    if(jsonEntry['matches']) {
        xmlDonor.appendChild(createMatches(jsonEntry['matches']))
    }

    return xmlDonor
}

function createSources(sources) {
    let xmlSources = document.createElement("sources")
    for (let i=0; i<sources.length; i++) {
        xmlSources.appendChild(createSource(sources[i]))
    }
    return xmlSources
}

function createSource(source) {
    let xmlSource = document.createElement("source")
    xmlSource.innerHTML = source

    return xmlSource
}

function createAge(age) {
    let xmlAge = document.createElement('dage')
    xmlAge.innerHTML = age
    return xmlAge
}

function createAltruistic() {
    let altruistic = document.createElement('altruistic')
    altruistic.innerHTML = true
    return altruistic
}

function createMatches(matches) {
    let xmlMatches = document.createElement('matches')
    for (let i=0; i<matches.length; i++) {
        xmlMatches.appendChild(createMatch(matches[i]))
    }
    return xmlMatches
}


function createMatch(match) {
    let xmlMatch = document.createElement('match')
    let xmlRecipient = document.createElement('recipient')
    let xmlScore = document.createElement('score')

    xmlRecipient.innerHTML = match['recipient']
    xmlScore.innerHTML = match['score']

    xmlMatch.appendChild(xmlRecipient)
    xmlMatch.appendChild(xmlScore)

    return xmlMatch
}