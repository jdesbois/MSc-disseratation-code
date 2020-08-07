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

    return result 
}

