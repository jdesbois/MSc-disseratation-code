

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
})


// Reset graph button logic
const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', () => {
    buildNetwork(currentDataObj)
})


// Matching request button logic
const matchingRequestButton = document.getElementById('matching-request')
const operationSelect = document.getElementById('operationSelect')
const chainSelect = document.getElementById('chainSelect')

matchingRequestButton.addEventListener('click', () => {
    let operation = operationSelect.value
    let chainLength = chainSelect.value
    makeMatchingRequest(currentDataObj, operation, chainLength).then(data => {
        matchingObj = data
        plotMatches(data)
        updateDescriptionData(data['output']['exchange_data'][0])
    })
})

// File upload button logic
const fileSelection = document.getElementById('file-selector')
fileSelection.addEventListener('change', (event) => {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
        let fileContent = event.target.result
        let jsonObj = JSON.parse(fileContent);
        currentDataObj = jsonObj
        buildNetwork(jsonObj)
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
    console.log(matchingObj);
})

const addNode = document.getElementById('add-to-obj').addEventListener('click', ()=> {
    let newNode = {
        'sources': [8],
        'dage': 35,
        'matches': [
            {'recipient': 2, 'score': 3},
            {'recipient': 5, 'score': 1}
        ]
    }
    currentDataObj['data']['8'] = newNode
})

