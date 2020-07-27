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

    var url = "https://kidney.optimalmatching.com/kidney/find.json"
    
    donorPool = JSON.stringify(donorPool)

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

    await fetch(url, fetchData).then((response) =>  {
        if (response.ok) {
            result = response.json()
        } else {
            console.log(response)
        }
    })

    return result 
}

