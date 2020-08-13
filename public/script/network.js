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
            $('#nodeModal').modal('show')
            document.getElementById('saveNodeButton').onclick = addNodeToGraph.bind(this, nodeData, callback)
        },
        addEdge: function(edgeData, callback) {
            $('#edgeModal').modal('show')
            document.getElementById('saveEdgeButton').onclick = addEdgeFunction.bind(this, edgeData, callback)
        },
        editNode: function(nodeData, callback) {
            document.getElementById('id-input').value = nodeData.id
            document.getElementById('donor-age-input').value = nodeData.dage
            
            if (window.currentDataObj['data'][nodeData.id]['altruistic']) {
                document.getElementById('altruistic-input').checked = true
                document.getElementById('patient-input').value = ""
                document.getElementById('patient-input').disabled = true
            } else {
                document.getElementById('altruistic-input').checked = false
                document.getElementById('patient-input').value = nodeData.patient
            }
            $('#nodeModal').modal('show')
            document.getElementById('saveNodeButton').onclick = addNodeToGraph.bind(this, nodeData, callback)
        },
        editEdge: false,
        deleteNode: function(nodeData, callback) {
            delete currentDataObj['data'][nodeData['nodes'][0]]
            callback(nodeData)
        }
    },
    nodes: {
        shape: 'circle',
        color: {
            background: 'white',
            highlight: '#EBE84A',
        },
        size: 20,
        font: {
            size: 12,
        },
        scaling: {
            label: {
                enabled: true,
            }
        },
        labelHighlightBold: true,
    },
    edges: {
        physics: false,
        color: {
            color: '#848484',
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
            type: 'discrete',
            roundness: 0,
        },
        hoverWidth: 1.5,
        width: 1,
        selectionWidth: 2,
    },
    interaction: {
        multiselect: true,
        selectable: true,
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true,
    },
    layout: {
        randomSeed: 2,
        improvedLayout: true,
        // clusterThreshold: 12,
    }
}
// Creation of graph canvas (known as network by library) 
var network = new vis.Network(networkContainer, data, defaultOptions)

/**
 * Event Listener: Before drawing content to the canvas it saves state
 * Fills the backgroud white
 * Redraws network
 * This to produce a white background for when an image of the network is saved
 */
network.on("beforeDrawing", function(ctx) {
    ctx.save()

    ctx.setTransform(1, 0, 0, 1, 0, 0)

    ctx.fillStyle="#FFFFFF"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.restore()
})

/**
 * Function that takes entries from JSON object as parameter
 * Passes entries to helper functions
 * Adds the arrays to the graph and calls .fit() to show all nodes once stabilization completes
 * @param {*} entries 
 */
function buildNetwork(jsonObj) {
    nodes.clear()
    edges.clear()
    defaultNetworkOptions()
    let entries = Object.entries(jsonObj['data'])

    let nodesArray = createNodes(entries)
    nodes.add(nodesArray)
    let edgesArray = createEdges(entries)
    
    let layout = document.getElementById('layoutSelect')

    if (layout.value === "circle") {
        layoutCircle(nodesArray)
    } else {
        layoutPhysics()
    }

    // setColourOptions()    

    nodes.update(nodesArray)
    network.on('stabilized', () => {
        edges.update(edgesArray)
    })
    
    network.fit(nodes)
}
/**
 * Function that takes the entries from the JSON object
 * Iterates over entries and creates nodeArray
 * Returns node array
 * @param {*} nodes 
 */
function createNodes(entries) {
    nodeArray = []
    for (const node of entries) {
        nodeArray.push({ 
            id: node[0],
            'dage': node[1]['dage'], 
            label: " D" + node[0] + " \n " + (node[1]['sources'] ? "R"+node[1]['sources'][0] +" " : " A "),
            patient: (node[1]['sources'] ? node[1]['sources'][0] : "na")
        })
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
function createEdges(entries) {
    edgeArray = []
    for (const node of entries) {
        if (node[1]['matches']) {
            for (const edge of node[1]['matches']) {
                let recipientNode = nodes.get({
                    filter: function(item) {
                        return (item['patient'] == edge['recipient'])
                    }
                })
                // console.log(recipientNode.length)
                for (let i=0; i<recipientNode.length; i++) {
                    let edgeObject = {
                        id: node[0] + "-" + recipientNode[i]['id'], 
                        from: node[0], 
                        to: recipientNode[i]['id'], 
                        score: edge['score']
                    }
                    // console.log(edgeObject)
                    edgeArray.push(edgeObject)
                }
                // console.log(node)


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
                iterations: 1,
                fit: true,
            },
            solver: 'barnesHut',
            barnesHut: {
                avoidOverlap: 0.5,
                centralGravity: 0.7,
                damping: 0.1,
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
    // setColourOptions()
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
    // Resets current graph to pre-matching request
    buildNetwork(currentDataObj)

    let nodeArray = []
    let edgeArray = []
    let exchanges = data['output']['exchange_data'][0]['exchanges']
    let all_cycles = data['output']['all_cycles']

    for (let i=0; i<exchanges.length; i++) {
        let currentCycle = all_cycles[exchanges[i]]['cycle']
        nodeArray = nodeArray.concat(colorNodes(currentCycle))
        edgeArray = edgeArray.concat(colorEdges(currentCycle))
    }

    // network.setOptions( {physics: true} )
    nodes.update(nodeArray)  
    network.on('stabilized', () => {
        edges.update(edgeArray)
    })
    network.fit(nodes)
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

    let returnedNode = queryNodesDataForID(node)

    let nodeID = returnedNode.id
    let x = nodes.get(nodeID)['x']
    let y = nodes.get(nodeID)['y']

    coloredNode.id = nodeID

    if (layout.value === "circle") {
        coloredNode.x = x
        coloredNode.y = y
    }

    if (node['a']) {
        coloredNode.color = {
            background: '#61C962',
        }
    } else {
        coloredNode.color = {
            background: '#30AFBF',
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
        color: '#E77D06',
        highlight: '#42f59e',
        opacity: 1,
    }
    let cycleNodeIDsArray = getCycleNodeIDs(cycle)
    // console.log(cycleNodeIDsArray)
    // Logic for a 3 way exchange
    if (cycleNodeIDsArray.length == 3) {
        let edge1 = cycleNodeIDsArray[0]+"-"+cycleNodeIDsArray[1];
        let edge2 = cycleNodeIDsArray[1]+"-"+cycleNodeIDsArray[2];
        let edge3 = cycleNodeIDsArray[2]+"-"+cycleNodeIDsArray[0];                            
        
        edgeArray.push({id: edge1, color: edgeOptions,
            width: 5,}, {id: edge2, color: edgeOptions,
            width: 5,}, {id: edge3, color: edgeOptions,
            width: 5,})
    // Logic for a two way exchange
    
    } else if (cycleNodeIDsArray.length == 2) {
        let edge1 = cycleNodeIDsArray[0]+"-"+cycleNodeIDsArray[1];
        let edge2 = cycleNodeIDsArray[1]+"-"+cycleNodeIDsArray[0];

        edgeArray.push({id: edge1, color: edgeOptions,
            width: 5,}, {id: edge2, color: edgeOptions,
            width: 5,})
    }
    return edgeArray
}

function getCycleNodeIDs(cycle) {
    let cycleNodeIDs = []
    for (let i=0; i<cycle.length; i++) {
        cycleNodeIDs.push(queryNodesDataForID(cycle[i]).id)
    }
    
    return cycleNodeIDs
}

/**
 * Function: Queries the nodes dataset and matches donor/patient id's in order to get unique node
 * @param {*} node 
 */
function queryNodesDataForID(node) {

    let returnedNode = nodes.get({
        filter: function(item) {
            // console.log(`noded: ${node.d} patient:${node.p} item id: ${item.id} item patient: ${item.patient}`)
            return (node.d == item.id && (node.p == item.patient || node.a == true))
        }
    })

    return returnedNode[0]
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
function addDonorToJSON(nodeData) {
    //Checks if JSON object exists, creates blank one if not
    let donorID = parseInt(nodeData.id)
    let patient = parseInt(nodeData.patient)
    let donorAge = nodeData['dage']

    if(window.currentDataObj === null) {
        window.currentDataObj = buildJSONObject();
    }

    // Checks if the donor ID passed is currently in donor pool
    if (currentDataObj['data'].hasOwnProperty(donorID)) {
        console.log("Donor ID Exists: Updating instead")
        currentDataObj['data'][donorID] = createJSONDonor(patient, donorAge)
    } else {
        currentDataObj['data'][donorID] = createJSONDonor(patient, donorAge)
    }

    // currentDataObj['data'][donorID] = createJSONDonor(donorID, donorAge)
    // console.log(currentDataObj)
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
function createJSONDonor(patient, dage) {
    let obj = {
        "sources": [patient],
        "dage": dage,
    }
    return obj
}
/**
 * Function that attempts to add new node to graph, calls Alert banner if callback throws an error
 * @param {*} data 
 * @param {*} callback 
 */

function addNodeToGraph(nodeData, callback) {
    let nodeID = document.getElementById('id-input').value
    let donorAge = parseInt(document.getElementById('donor-age-input').value)
    console.log(typeof nodeID)
    nodeData.id = nodeID
    nodeData.patient = document.getElementById('patient-input').value
    nodeData['dage'] = donorAge
    nodeData['label'] = ` D${nodeData.id} \n R${nodeData.patient} `
    //Calls function to add node to JSON object
    addDonorToJSON(nodeData)
    if (document.getElementById('altruistic-input').checked) {
        addAltruisticDonor(nodeData.id)
        nodeData['label'] = ` D${nodeData.id} \n A `
        nodeData.color = {
            color: 'blue',
        }
    }
    try {
        console.log(`Adding to graph`)
        callback(nodeData)
    } catch (err) {
        console.log(err.message)
        callAlertBanner(err.message)
    }
    $('#nodeModal').modal('hide')
    
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
    let scoreInput = document.getElementById('score-input')
    let score = parseInt(scoreInput.value)
    let edgeFrom = edgeData['from']
    let edgeTo = edgeData['to']
    let edgeID = edgeData['from'] + "-" + edgeData['to']
    edgeData.id = edgeID
    edgeData.score = score
    if (currentDataObj['data'][edgeTo]['altruistic']) {
        callAlertBanner("Cannot add edge directed to Altruistic Donor")
        $('#edgeModal').modal('hide')
        return
    }

    try {
        console.log("adding edge to graph and JSON")
        addEdgeToJSON(score, edgeFrom, edgeTo)
        callback(edgeData)
        network.addEdgeMode()
    } catch (err) {
        console.log(err.message)
        callAlertBanner(err.message)
    }
    $('#edgeModal').modal('hide')
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
 * Function: takes data passed from addEdge function    console.log(xmlStringDocument)    console.log(xmlStringDocument)
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
 * Calls timeout for banner to dissappear after 5 secs
 * @param {*} msg 
 */
function callAlertBanner(msg) {
    let idAlert = document.getElementById('id-alert')
    idAlert.innerHTML = msg
    $('#id-alert').show()
    setTimeout(function() {
        $('#id-alert').hide()
    }, 5000)
}

/**
 * Function: Hides alert banner by calling function
 */
function hideAlertBanner() {
    $('#id-alert').hide()
}