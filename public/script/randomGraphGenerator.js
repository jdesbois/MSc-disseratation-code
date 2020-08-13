/**
 * Collection of all the methods that create the random nodes and egdes required to produce a random graph
 * Functions generate random nodes and edges
 * 0.5 density by flipping a coin
 * Adds objects directly to JSON
 * Builds network from JSON object
 */

/**
 * Creates nodeArray up to and including the number requested
 * Creates nodes with ids from 1 - numNodes
 * Generates random donor age using fucntion
 * @param {} numNodes 
 */
function generateRandomGraph() {
    let numNodes = document.getElementById('num-of-nodes-input').value
    let density = document.getElementById('densityInput').value
//Generate array of random nodes
    let nodesArray = generateNodes(numNodes)
// Adds nodes to JSON object
    addNodesToJSON(nodesArray)
// Generates random edges and adds them to JSON
    let edgesArray = generateEdges(nodesArray, density)
    addEdgesToJSON(edgesArray)
// Builds network from JSON object
    // nodes.update(nodesArray)

    // setTimeout(() => {
    //     edges.update(edgesArray)
    // }, 5000)
    buildNetwork(window.currentDataObj)
    $('#random-graph-modal').modal('hide')
}

/**
 * Takes random nodes arrray
 * Iterates over array and passes each one to add node to JSON
 * @param {*} nodesArray 
 */
function addNodesToJSON(nodesArray) {
    for (let i=0; i< nodesArray.length; i++) {
        addDonorToJSON(nodesArray[i])
    }
}

/**
 * Takes random edges array
 * Calls addEdgeToJSON on each edge
 * @param {*} edgesArray 
 */
function addEdgesToJSON(edgesArray) {
    for (let i=0; i<edgesArray.length; i++) {
        addEdgeToJSON(edgesArray[i].score, edgesArray[i].from, edgesArray[i].to)
    }
}

/**
 * Generate nodes by looping for numNodes times
 * Create nodes with ids 1 -> numNodes
 * Generates random donor age
 * Returns nodeArray
 * @param {*} numNodes
 */

function generateNodes(numNodes) {
    let nodeArray = []
    for (let i=1; i<=numNodes; i++) {
        nodeArray.push( { 
            id:i, 
            'dage': randomDonorAge(), 
            patient: i,
            label: " D" + i + " \n" + "R"+i,
        })
    }
    return nodeArray
}

/**
 * Generate edges by iterating through Node Array
 * Flip a coin for each node in array against other nodes 
 * IF heads(true) make edge
 * If tails(false) move on
 * Return array of edges
 */

function generateEdges(nodeArray, density) {
    let edgeArray = []
    for (node of nodeArray) {
        for (let i=0; i<nodeArray.length; i++) {
            if (node.id === nodeArray[i].id && node.patient === nodeArray[i].patient) {
                continue
            }
            if (checkDensity(density)) {
                console.log("egde created")
                edgeArray.push({
                   id: node.id +"-" + nodeArray[i].patient,
                   from: node.id,
                   to: nodeArray[i].id,
                   score: generateRandomScore(),
                })
            } else {
                continue
            }
        }
    }
    return edgeArray
}

/**
 * Generates a random donors age between 18-65
 * Returns integer
 */
function randomDonorAge() {
    let min = 18
    let max = 65
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generate a random integer between 1-100
 * If integer is even return true
 * If integer is odd return false
 */
function flipACoin() {
    let num = Math.floor(Math.random() * 100) + 1

    if (num % 2 === 0) {
        return true
    } else {
        return false
    }
}



function checkDensity(density) {
    let randomFloat = Math.random()
    
    if (randomFloat >density) {
        return false
    } else {
        
        return true
    }
}

function oneInThree() {
    let num = Math.floor(Math.random() * 3) + 1
    return num
}

/**
 * Generates a random edge score between 
 * 1 -100
 */
function generateRandomScore() {
    return Math.floor(Math.random() * 100) + 1
}