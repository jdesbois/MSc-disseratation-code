/**
 * This file contains the functions required to make requests to the matching algorithm API
 * It also contains the functions that make request to the NodeJS back end for file downloads
 */




/**
 * Function that makes call directly to matching algorithm
 * Takes donorPool JSON Object, operation and chain length criteria
 * makes call to API
 * Converts response into JSON
 * Returns JSON object to controller
 * @param {*} donorPool 
 * @param {*} operation 
 * @param {*} chainLength 
 */

async function makeMatchingRequest(donorPool, operation, chainLength) {
    // Matching algorithm URL
    var url = "https://kidney.optimalmatching.com/kidney/find.json"
    // Converts current donorPool into a JSON Strind
    donorPool = JSON.stringify(donorPool)
    // Creates object that is sent to matching algorithm URL via fetch request
    let fetchData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: donorPool,
            "operation": operation,
            "altruistic_chain_length": chainLength,
        }),

    }
    /** 
     * Fetch request, sends data required to get optimal matching
     * Once promise returns if response OK, converts response into JSON and returns back to controller
     * If response not ok calls alert banner with error and prints to server console
     */
    try {
        await fetch(url, fetchData)
        .then((response) =>  {
            if (response.ok) {
                console.log(response)
                result = response.json()
            } else {
                console.log(response)
                callAlertBanner(response)
            }
        })
    } catch (err) {
        console.log(err)
        callAlertBanner(err)
    }

    return result 
}
/**
* Makes a fetch post request to backend
* resceives file to download in response
* Creates a link document object
* Assigns it file download information
* triggers click event
*/
async function saveXMLFile() {
    const url = '/save-xml'

    await fetch(url, {
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
}

/**
 * Makes a fetch post request to backend
 * resceives file to download in response
 * Creates a link document object
 * Assigns it file download information
 * triggers click event
 */

async function saveJSONFile() {
    const url = '/save-json'

    await fetch(url, {
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
}

/**
 * Makes a fetch post request to backend
 * Receives a file to download in response
 * Creates a link element
 * Assigns URL
 * Assigns Download
 * Triggers click event to download file
 */

async function saveImgFile() {
    
    const url = '/save-img'
    let canvas = window.network.canvas.frame.canvas
    let imgURL = canvas.toDataURL('image/png')
    await fetch(url, {
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
}