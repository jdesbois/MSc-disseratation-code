const randomGraph = require('../public/script/randomGraphGenerator')

test('Check nodeArray generation', () => {
    let nodesArray = randomGraph.generateNodes(5)
    expect(nodesArray).not.toEqual(null)
    expect(nodesArray.length).toBe(5)
})

test('Check randomscore produces number', () => {
    let randomScore = randomGraph.generateRandomScore()
    console.log(`Random score to be tested ${randomScore}`)
    expect(randomScore).toBeGreaterThanOrEqual(1)
    expect(randomScore).toBeLessThanOrEqual(100)   
})

test('Check random age generates correct number in range', () => {
    let randomAge = randomGraph.randomDonorAge()
    console.log(`Random age to be tested ${randomAge}`)
    expect(randomAge).toBeGreaterThanOrEqual(18)
    expect(randomAge).toBeLessThanOrEqual(65)
})

test('Test coin flip returns true or false', () => {
    expect(randomGraph.flipACoin()).toStrictEqual(expect.anything())
})