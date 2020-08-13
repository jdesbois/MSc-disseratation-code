
// Global obj variables for current donor pool and returned matching object
var currentDataObj = null
var matchingObj = null

// Example data button logic (JQUERY since it was less complicated)
$('#graphDropdown a').click(function() {
    let graphSize = $(this)[0]['attributes']['value'].value
    currentDataObj = null
    if (graphSize === 'large') {
        currentDataObj = largeData
    } else if (graphSize === 'small') {
        currentDataObj = smallData
    } else {
        currentDataObj = multipleDonor
    }
    buildNetwork(window.currentDataObj)
})

// Layout dropdown logic
const layoutDropdown = document.getElementById('layoutSelect')
layoutDropdown.addEventListener('change', () => {
})

/**
 * Function that deals with on click event for the graph
 */
network.on('click', (params) => {
    // console.log(params)
    // Clears information display before displaying new information
    clearSelectionInfo()

    if (params['nodes'][0]) {
        displaySelectedNodeInfo(params)
    }

    if (!params['nodes'][0] && params['edges'][0]) {
        displaySelectedEdgeInfo(params)
    } 

})

// Display selected node information
function displaySelectedNodeInfo(params) {
    let node = nodes.get(params['nodes'][0])
    let innerString = `Donor: ${node['id']}<br/>
                       Recipient: ${node['patient']}<br/>
                       Donor age: ${node['dage']}<br/>`;

    if (window.currentDataObj['data'][node.id]['altruistic']) {
        innerString += "\nAltruistic: True"
    } else {
        innerString += "\nAltruistic: False"
    }

    document.getElementById('selected-item-display').innerHTML = innerString
}

// Displays information about selected edge
function displaySelectedEdgeInfo(params) {
    let innerString = `Edge ID: ${params['edges'][0]} Score: ${edges.get(params['edges'][0])['score']}`
    document.getElementById('selected-item-display').innerHTML = innerString
}

// Clears selection info when click occurs on graph
function clearSelectionInfo() {
    document.getElementById('selected-item-display').innerHTML = " "
}

// Reset graph button logic
/**
 * Event listener for reset graph button
 * Calls buildnetork function on current data obj
 */
const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', () => {
    nodes.clear()
    edges.clear()
    buildNetwork(currentDataObj)
})

/**
 * Random graph nav button logic
 * Adds event listener to nav bar button
 * Adds event listener to Save Button
 * Takes num of nodes input 
 * Calls generate random graph
 */
const randomGraphButton = document.getElementById('randomGraph-button')
randomGraphButton.addEventListener('click', () => {
    $('#random-graph-modal').modal('show')
    document.getElementById('randomGraphSave').onclick = generateRandomGraph.bind()
})

// Set Colour button logic 
const setLayoutButton = document.getElementById('set-layout-options')
setLayoutButton.addEventListener('click', () => {
    if (window.currentDataObj === null) {
        callAlertBanner("Please build/input a graph first")
        return
    }
    buildNetwork(currentDataObj)
})

// Matching request button logic
const matchingRequestButton = document.getElementById('matching-request')
const operationSelect = document.getElementById('operationSelect')
const chainSelect = document.getElementById('chainSelect')

matchingRequestButton.addEventListener('click', () => {
    network.disableEditMode()
    let operation = operationSelect.value
    let chainLength = chainSelect.value
    // Checks to make sure there is current data to send to algorithm
    if (currentDataObj === null) {
        callAlertBanner("No graph data present")
        return
    }
    // Disbales run button and produces working update to show user that function is running
    matchingRequestButton.disabled = true
    document.getElementById('matching-request-running').innerHTML = `<strong> Working... </strong>`
    // Calls matching request function with selected criteria and current data object
    makeMatchingRequest(currentDataObj, operation, chainLength)
    //Once promise returns, the matching data is assigned to the global matching object
    //Plot matches and update description is then called
    .then(data => {
        console.log(data)

        matchingRequestButton.disabled = false
        document.getElementById('matching-request-running').innerHTML = ``
        if (data['error']) {
            callAlertBanner(data['error'])
            return
        }

        window.matchingObj = data
        plotMatches(data)
        updateDescriptionData(data['output']['exchange_data'][0])

    })
})

// File upload button logic
/**
 * Function: Assigns an event listener to the file selection button
 * When the file selection button has changed i.e. user selected a file
 * FileReader is created, file type found and a load event is created on file reader
 * Once the file is loaded/read it is passed to the relevant parser to be converted to a workable object
 * read as Text is then called on file read with file name in order to trigger event
 */
const fileSelection = document.getElementById('file-selector')
fileSelection.addEventListener('change', (event) => {
    const reader = new FileReader();
    let fileType = event.target.files[0]['name'].split('.').pop().toLowerCase()

    reader.addEventListener('load', (event) => {
        let fileContent = event.target.result
        if (fileType === 'json') {
            currentDataObj = JSON.parse(fileContent)
            buildNetwork(currentDataObj)
        } else if (fileType === 'xml') {
            currentDataObj = readXMLFile(fileContent)
            buildNetwork(currentDataObj)
        } else {
            callAlertBanner(`${fileType} not currently supported`)
        }
    })
    reader.readAsText(event.target.files[0])

})
/**
 * 
 * Function: Updates the matching algorithm status data
 * @param {*} exchange_data 
 */
function updateDescriptionData(exchange_data) {
    const matchingDesc = document.getElementById('matching-desc')
    matchingDesc.innerHTML = exchange_data['description']

    const numExchanges = document.getElementById('num-exchanges')
    const threeWays = document.getElementById('three-ways')
    const twoWays = document.getElementById('two-ways')
    const totalTransplants = document.getElementById('total-transplants')
    const weight = document.getElementById('weight')

    numExchanges.innerHTML = exchange_data['exchanges'].length 
    threeWays.innerHTML = exchange_data['three_way_exchanges']
    twoWays.innerHTML = exchange_data['two_way_exchanges']
    totalTransplants.innerHTML = exchange_data['total_transplants']
    weight.innerHTML = exchange_data['weight']

    console.log(exchange_data)
}



/**
 * Function: Assigns event listener to Save XML nav entry, calls saveXMLFile from api.js
*/
const saveXML = document.getElementById('save-xml').addEventListener('click', saveXMLFile)

/**
 * Function: Assigns event listener to Save JSON nav entry, calls saveJSONFile from api.js

 */
const saveJSON = document.getElementById('save-json').addEventListener('click', saveJSONFile)


/**
 * Function: Assigns event listener to save to Image button, calls saveImgFile from api.js
 */
const saveImageButton = document.getElementById('save-image').addEventListener('click', saveImgFile)


/**
 * Function: Sets current data pool object to null
 * Clears out nodes and edges dataset 
 */
const deleteGraph = document.getElementById('delete-button')
deleteGraph.addEventListener('click', () => {
    nodes.clear()
    edges.clear()
    window.currentDataObj = null
})
/** 
 * Switches patient ID in node modal on and off when altruistic checkbox is changed 
 */
const altruisticCheckbox = document.getElementById('altruistic-input')
altruisticCheckbox.addEventListener('change', (event) => {
    console.log(event)
    if (altruisticCheckbox.checked) {
        document.getElementById('patient-input').value = ""
        document.getElementById('patient-input').disabled = true
    } else {
        document.getElementById('patient-input').disabled = false
    }
})

const modalCloseButton = document.getElementById('modal-close-button')
modalCloseButton.addEventListener('click', ()  => {
    network.disableEditMode()
})

/**
 * TESTING AREA FUNCTION TO BE REMOVED
 */
const testXMLConvert = document.getElementById('convert-to-xml')
testXMLConvert.addEventListener('click', () => {
    network.disableEditMode()
})

const printObject = document.getElementById('print-obj').addEventListener('click', () => {
    network.addEdgeMode()
})

const addNode = document.getElementById('add-to-obj').addEventListener('click', ()=> {
    $('#random-graph-modal').modal('show')
})

/**
 * Not in use yet - working out logic
 */
function checkDataBeforeSave() {
    if (window.currentDataObj == null) {
        callAlertBanner("No data currently present to save, please build a graph first!")
        return false
    } else {
        return true
    }
}

