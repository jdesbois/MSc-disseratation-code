
// Global obj variables for current donor pool and returned matching object
var currentDataObj = null
var matchingObj = null

// Example data button logic (JQUERY since it was less complicated)
$('#graphDropdown a').click(function() {
    let graphSize = $(this)[0]['attributes']['value'].value
    if (graphSize === 'large') {
        currentDataObj = largeData
        buildNetwork(largeData)
    } else {
        currentDataObj = smallData
        buildNetwork(smallData)
    }
})

// Layout dropdown logic
const layoutDropdown = document.getElementById('layoutSelect')
layoutDropdown.addEventListener('change', () => {
})

/**
 * Function that deals with on click event for the graph
 */
network.on('click', (params) => {
    console.log(params)
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
    let innerString = `Donor: ${node['id']} Patient: ${node['patient']} Donor age: ${node['dage']}`
    if (nodes.get(params['nodes'][0])['label'].split("").pop() === "A") {
        innerString += ` Altruistic: True`
    } else {
        innerString += ` Altruistic: False`
    }
    // innerString += ` Patient: ${node['patient']}`
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
const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', () => {
    buildNetwork(currentDataObj)
})

// Set Colour button logic 
const setLayoutButton = document.getElementById('set-layout-options')
setLayoutButton.addEventListener('click', () => {
    setColourOptions()
})

// Matching request button logic
const matchingRequestButton = document.getElementById('matching-request')
const operationSelect = document.getElementById('operationSelect')
const chainSelect = document.getElementById('chainSelect')

matchingRequestButton.addEventListener('click', () => {
    let operation = operationSelect.value
    let chainLength = chainSelect.value
    makeMatchingRequest(currentDataObj, operation, chainLength).then(data => {
        if (currentDataObj === null) {
            callAlertBanner("No donor pool present")
            return
        }
        window.matchingObj = data
        plotMatches(data)
        updateDescriptionData(data['output']['exchange_data'][0])
    })
})

// File upload button logic
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

// Function: Updates the matching algorithm status data
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

const printObject = document.getElementById('print-obj').addEventListener('click', () => {
    console.log(window.currentDataObj);
})

const addNode = document.getElementById('add-to-obj').addEventListener('click', ()=> {

})

/**
 * Function: Assigns event listener to Save XML nav entry
 * Makes a fetch post request to backend
 * resceives file to download in response
 * Creates a link document object
 * Assigns it file download information
 * triggers click event
 */
const saveXML = document.getElementById('save-xml').addEventListener('click', () => {
    const url = '/save-xml'
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(window.currentDataObj)
    })
    .then(response => response.blob())
    .then(blob => {
        const newURL = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = newURL
        a.download = 'graphXML.xml' || 'download'
        a.click()
    })
})

/**
 * Function: Assigns event listener to Save JSON nav entry
 * Makes a fetch post request to backend
 * resceives file to download in response
 * Creates a link document object
 * Assigns it file download information
 * triggers click event
 */
const saveJSON = document.getElementById('save-json').addEventListener('click', () => {
    const url = '/save-json'
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(window.currentDataObj)
    })
    .then(response => response.blob())
    .then(blob => {
        const newURL = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = newURL
        a.download = 'graphJSON.json' || 'download'
        a.click()
    })
})

/**
 * Function: Assigns event listener to save to Image button
 * Makes a fetch post request to backend
 * Receives a file to download in response
 * Creates a link element
 * Assigns URL
 * Assigns Download
 * Triggers click event to download file
 */
const saveImageButton = document.getElementById('save-image').addEventListener('click', () => {
    const url = '/save-img'
    let canvas = window.network.canvas.frame.canvas
    let imgURL = canvas.toDataURL('image/png')
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            img: imgURL
        })
    })
    .then(response => response.blob())
    .then(blob => {
        const newURL = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = newURL
        a.download = 'graphIMG.png' || 'download'
        a.click()
    })
    
})


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
 * TESTING AREA FUNCTION TO BE REMOVED
 */
const testXMLConvert = document.getElementById('convert-to-xml')
testXMLConvert.addEventListener('click', () => {
    let returnedItem = nodes.get({
        filter: function(item) {
            return (item.patient == 2)
        }
    })
    console.log(returnedItem)
})

