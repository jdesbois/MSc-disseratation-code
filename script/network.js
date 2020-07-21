/**
 * This file deals with the creation of the graph canvas
 * The methods for drawing and maipulating the graph are also present
 * Including methods to draw the optimal matching criteria received from the API
 */

//Declaration of datasets for nodes and edges to be used on graph
let nodes = new vis.DataSet();
let edges = new vis.DataSet();
// Selection of the container the graph will be placed into
const networkContainer = document.getElementById('myNetwork');
// Creation of data object to be passed to graph constructor
let data = {
    nodes: nodes,
    edges: edges,
}
// Default options object sent to the gragh constructor
const defaultOptions = {
    height: '100%',
    width: '100%',
    autoResize: true,
    manipulation: {
        enabled: true,
        addNode: function(nodeData, callback) {
            addNodeFunction(nodeData, callback);
        },
        addEdge: function(edgeData, callback) {
            addEdgeFunction(edgeData, callback)
        }
    },
    nodes: {
        shape: 'dot',
        color: {
            background: 'white',
            highlight: 'green',
        },
        size: 15,
        font: {
            size: 30,
            align: 'left',
        },
        scaling: {
            label: {
                enabled: true,

            }
        }
    },
    edges: {
        physics: false,
        color: {
            inherit: false,
            highlight: '#42f59e',
            opacity: 1,
        },
        arrows: {
            to: {
                enabled: true,
            },
        },
        smooth: {
            enabled: false,
        },
        hoverWidth: 1.5,
        width: 1,
        selectionWidth: 2,
    },
    interaction: {
        multiselect: true,
        selectable: true,
    },
    layout: {
    //     randomSeed: 150,
        improvedLayout: true,
    //     // clusterThreshold: 12,
    }
}
// Creation of graph canvas (known as network by library) 
var network = new vis.Network(networkContainer, data, defaultOptions)

/**
 * Function that takes entries from JSON object as parameter
 * Passes entries to helper functions
 * Adds the arrays to the graph and calls .fit() to show all nodes once stabilization completes
 * @param {*} entries 
 */
function buildNetwork(jsonObj) {
    nodes.clear()
    edges.clear()
    let entries = Object.entries(jsonObj['data'])

    let nodesArray = createNodes(entries)
    let edgesArray = createEdges(entries)
    
    let layout = document.getElementById('layoutSelect')

    if (layout.value === "circle") {
        layoutCircle(nodesArray)
    } else {
        layoutPhysics()
    }

    setColourOptions()    

    nodes.add(nodesArray)
    edges.add(edgesArray)
    network.fit(nodes)
}
/**
 * Function that takes the entries from the JSON object
 * Iterates over entries and creates nodeArray
 * Returns node array
 * @param {*} nodes 
 */
function createNodes(nodes) {
    nodeArray = []
    for (const node of nodes) {
        console.log(typeof node[0])
        nodeArray.push({ id: node[0], 'dage': node[1]['dage'], label: node[0]})
    }
    network.setOptions({physics: false})
    return nodeArray
}

/**
 * Function that iterates through the nodes entries
 * Finds any nodes with matches
 * Creates corresponding edges with id of from-to 
 * Returns array of edges
 * @param {*} nodes 
 */
function createEdges(nodes) {
    edgeArray = []
    for (const node of nodes) {
        if (node[1]['matches']) {
            for (const edge of node[1]['matches']) {
                let edgeObject = {id: node[0] + "-" + edge['recipient'], from: node[0], to: edge['recipient'], score: edge['score']}
                edgeArray.push(edgeObject)
            }
        }
    }
    return edgeArray
}
/**
 * Function that adds the required X/Y coords to each node to form a circle layout
 * @param {} nodes 
 */
function layoutCircle(nodes) {
    const radius = 900;
    const d = 2 * Math.PI / nodes.length;

    for (const node of nodes) {
        let x = radius * Math.cos(d * node.id)
        let y = radius * Math.sin(d * node.id)
        node.x = x
        node.y = y
    }
}
/**
 * Function to set the network options to layout using Barnes Hut physics algorithm
 */
function layoutPhysics() {
    let options = {
        physics: {
            enabled: true,
            maxVelocity: 15,
            stabilization: {
                enabled: true,
                iterations: 2,
                fit: true,
            },
            barnesHut: {
                avoidOverlap: 1,
                centralGravity: 0.5,
            },
        }
    }
    network.setOptions(options)
}
/**
 * Selects the colour inputs on the page
 * Sets the nodes and edges to respective colour values
 */
function setColourOptions() {
    const nodeColor = document.getElementById('node-color').value
    const nodeHighlight = document.getElementById('node-highlight').value
    const edgeColor = document.getElementById('edge-color').value
    const edgeHighlight = document.getElementById('edge-highlight').value

    let options = {
        height: '100%',
        width: '100%',
        autoResize: true,
        manipulation: {
            enabled: true,
        },
        nodes: {
            color: {
                background: nodeColor,
                highlight: nodeHighlight,
            },
        },
        edges: {
            color: {
                inherit: false,
                highlight: edgeHighlight,
                color: edgeColor,
            },
        },
    }
    network.setOptions(options)
}
// Function that resets the network options to default settings and applys colour changes selected by User
function defaultNetworkOptions() {
    network.setOptions(defaultOptions)
    setColourOptions()
}

/**
 * Graph event: Once graph has stabilized physics is turned
 */
network.on("stabilized", () => {
    network.setOptions( {physics: false} )
    network.fit(nodes)
})


/**
 * Function: Takes the data returned from the API request
 * Iterates through the exchanges array
 * Grabs each cycle and passes it to the colorNodes function
 * Updates the newly colored nodes
 * @param {*} data 
 */

function plotMatches(data) {
    console.log(data)
    let nodeArray = []
    let edgeArray = []
    let exchanges = data['output']['exchange_data'][0]['exchanges']
    let all_cycles = data['output']['all_cycles']

    for (let i=0; i<exchanges.length; i++) {
        let currentCycle = all_cycles[exchanges[i]]['cycle']
        nodeArray = nodeArray.concat(colorNodes(currentCycle))
        edgeArray = edgeArray.concat(colorEdges(currentCycle))
    }

    network.setOptions( {physics: true} )
    nodes.update(nodeArray)   
    edges.update(edgeArray)
}

/**
 * Function: Takes a single cycle and iterates through it
 * Passes each node in the cycle to colorNode function
 * returns array of modified nodes
 * @param {} cycle 
 */
function colorNodes(cycle) {
    let nodeArray = []
    for(let i=0; i<cycle.length; i++) {
        let currentNode = cycle[i]
        nodeArray.push(colorNode(currentNode))
    } 

    return nodeArray
}
/**
 * Function: Takes a single node object
 * gets and assigned current XY coords
 * colors node depending on altruistic donor or not
 * returns modified node
 * @param {*} node 
 */
function colorNode(node) {
    let coloredNode = {}
    let layout = document.getElementById('layoutSelect')
    let nodeID = node['d'].toString()
    let x = nodes.get(nodeID)['x']
    let y = nodes.get(nodeID)['y']

    coloredNode.id = nodeID

    if (layout.value === "circle") {
        coloredNode.x = x
        coloredNode.y = y
    }

    if (node['a']) {
        coloredNode.color = {
            background: 'green'
        }
    } else {
        coloredNode.color = {
            background: 'pink'
        }
    }

    return coloredNode
}

/**
 * Function: takes a single cycle
 * Checks length of cycle
 * Creates Edge ID's
 * Updates each edge with colour, width and opacity
 * also lowers opacity and width of un-used edges
 * @param {*} cycle 
 */

function colorEdges(cycle) {
    //Options for non-matched edges
    let options = {
        edges: {
            color: {
                opacity: 0.4
            },
            width: 0.75,
        }
    }
    // Set options for non matched edges
    network.setOptions(options)
    // Edge array to be returned
    let edgeArray = []
    // Color options for the matched edges
    let edgeOptions = {
        color: 'black',
        highlight: '#42f59e',
        opacity: 1,
    }
    // Logic for a 3 way exchange
    if (cycle.length == 3) {
        let edge1 = cycle[0]['d']+"-"+cycle[1]['d'];
        let edge2 = cycle[1]['d']+"-"+cycle[2]['d'];
        let edge3 = cycle[2]['d']+"-"+cycle[0]['d'];                            

        edgeArray.push({id: edge1, color: edgeOptions,
            width: 5,}, {id: edge2, color: edgeOptions,
            width: 5,}, {id: edge3, color: edgeOptions,
            width: 5,})
    // Logic for a two way exchange
    
    } else if (cycle.length == 2) {
        let edge1 = cycle[0]['d']+"-"+cycle[1]['d'];
        let edge2 = cycle[1]['d']+"-"+cycle[0]['d'];

        edgeArray.push({id: edge1, color: edgeOptions,
            width: 5,}, {id: edge2, color: edgeOptions,
            width: 5,})
    }
    return edgeArray
}

/**
 * Function: Shows Modal required to add a new node
 * Assigns event listener to save button
 * Gathers user inputs
 * Passes data to JSON and Graph functions
 * Closes modal
 * @param {*} nodeData 
 * @param {*} callback 
 */

function addNodeFunction(nodeData, callback) {
    //Select and show modal for editing
    let nodeModal = $('#nodeModal')
    nodeModal.modal('show')
    // Select and assign event listener to Save Button
    let saveButton = document.getElementById('saveNodeButton')
    saveButton.addEventListener('click', (event) => {
        //Selection of input components
        let donorAgeInput = document.getElementById('donor-age-input')
        let idInput = document.getElementById('id-input')
        let altruisticInput = document.getElementById('altruistic-input')
        //Gather input values
        let donorAge = parseInt(donorAgeInput.value)
        let donorID = parseInt(idInput.value)
        let altruisticDonor = altruisticInput.checked
        //Assign Values to nodeData for passing to callback
        nodeData.id = donorID.toString()
        nodeData['dage'] = donorAge
        nodeData['label'] = nodeData.id.toString()
        // Pass data to JSON adder and Add to graph call back
        addDonorToJSON(donorID, donorAge)
        addNodeToGraph(nodeData, callback)
        // Checks to see if the altruisitic donor checkbox is true
        if (altruisticDonor) {
            // If true sends donorID to add altruistic donor function
            addAltruisticDonor(donorID)
        }
        // Stop event from triggering/bubbling up
        event.stopImmediatePropagation()
        //Remove the modal from view
        nodeModal.modal('hide')
    })
    // Hide warning alert  
    $('#id-alert').hide() 
}


/**
 * Function: Creates initial data object if building graph manually
 * Is called when current object is null
 */
function buildJSONObject() {
    let obj = {
        "data": {
        }
    }
    return obj
}

/**
 * Function: Checks for current donor pool object
 * If not present, creates new one, if present carries on
 * Sends donorID and age to JSON formatter for Donor
 * Adds Donor to current donor pool obj
 * Logs current donor pool obj
 * @param {*} donorID 
 * @param {*} donorAge 
 */
function addDonorToJSON(donorID, donorAge) {
    //Checks if JSON object exists, creates blank one if not
    if(window.currentDataObj === null) {
        window.currentDataObj = buildJSONObject();
    }
    // Checks if the donor ID passed is currently in donor pool
    if (currentDataObj['data'].hasOwnProperty(donorID)) {
        console.log("Donor ID Exists: Updating instead")
        currentDataObj['data'][donorID] = createJSONDonor(donorID, donorAge)
    } else {
        currentDataObj['data'][donorID] = createJSONDonor(donorID, donorAge)
    }

    // currentDataObj['data'][donorID] = createJSONDonor(donorID, donorAge)
    console.log(currentDataObj)
}
/**
 * Function: Removes sources from selected donorID
 * Adds an altruistic entry to donor in JSON
 * @param {*} donorID 
 */
function addAltruisticDonor(donorID) {
    let donor = currentDataObj['data'][donorID]
    delete donor.sources
    donor['altruistic'] = true
}
/**
 * Function that creates JSON donor entry to be added to donor pool
 * @param {*} id 
 * @param {*} dage 
 */
function createJSONDonor(id, dage) {
    let obj = {
        "sources": [id],
        "dage": dage,
    }
    return obj
}
/**
 * Function that attempts to add new node to graph, calls Alert banner if callback throws an error
 * @param {*} data 
 * @param {*} callback 
 */
function addNodeToGraph(data, callback) {
    try {
        console.log("graph function called")
        callback(data)
    } catch (err) {
        console.log(err.message)
        callAlertBanner(err.message)
    } 
}
/**
 * Function: Shows modal required to add new edge
 * Assigns event to save button, unbinds button before assigning to stop event propagation
 * Collects user input and creates Edge ID user Edge data
 * Passes data to Graph and JSON functions to add edge
 * Closes modal
 * @param {*} edgeData 
 * @param {*} callback 
 */
function addEdgeFunction(edgeData, callback) {
    let edgeModal = $('#edgeModal')
    edgeModal.modal('show')
    
    $('#saveEdgeButton').unbind('click').click(function() {
        let scoreInput = document.getElementById('score-input')
        let score = parseInt(scoreInput.value)
        let edgeFrom = edgeData['from']
        let edgeTo = edgeData['to']

        console.log(`from: ${edgeFrom} to: ${edgeTo} score: ${score}`)

        addEdgeToJSON(score, edgeFrom, edgeTo)        
        addEdgeToGraph(score, edgeFrom, edgeTo)

        edgeModal.modal('hide')
    })
    $('#id-alert').hide()
}

/**
 * Function: This helper function takes data passes from addEdge function
 * Checks if the To Node already has an array of matches 
 * IF yes: adds edge to matches array
 * If no: creates array and adds edge
 * @param {*} score 
 * @param {*} from 
 * @param {*} to 
 */
function addEdgeToJSON(score, from, to) {
    let fromNode = currentDataObj['data'][from]

    if (fromNode.hasOwnProperty('matches')) {
        fromNode['matches'].push({'recipient': parseInt(to), 'score': score})
    } else {
        fromNode['matches'] = [{'recipient': parseInt(to), 'score': score}]
    }
}

/**
 * Function: takes data passed from addEdge function
 * Creates the edge ID
 * Creates a new Edge object
 * Adds edge object to the graph
 * @param {*} score 
 * @param {*} from 
 * @param {*} to 
 */
function addEdgeToGraph(score, from, to) {
    let edgeID = from + "-" + to
    let newEdge = {id: edgeID, from: from, to: to, score: score}
    console.log(newEdge)
    edges.update(newEdge)
}

/**
 * Function that displays message in alert banner under NAV bar
 * Takes message parameter as content for alert banner
 * @param {*} msg 
 */
function callAlertBanner(msg) {
    let idAlert = document.getElementById('id-alert')
    idAlert.innerHTML = msg
    $('#id-alert').show()
}