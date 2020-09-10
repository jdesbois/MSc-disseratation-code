
/**
 * Require file to acccess methods being tested
 */
const xmlParser= require('../public/script/xmlStringOutputParser')

/**
 * Setup data to pass to tests
 */
const jsonData = require('../public/data/donorPool.json')


test('Check XML entry string creation', () => {
    let entryString = xmlParser.createEntryString(jsonData['data'][1],1)
    console.log(`Entry string to be tested ${entryString}`)

    expect(entryString).not.toBe(null)
    expect(typeof entryString).toBe('string')
})

test('Check sources string creation', () => {
    let sourcesString = xmlParser.createSourcesString(jsonData['data'][1]['sources'])
    console.log(`Sources string to be tested ${sourcesString}`)

    expect(sourcesString).not.toBe(null)
    expect(typeof sourcesString).toBe('string')
})

test('Check source string creation', () => {
    let sourceString = xmlParser.createSourceString(jsonData['data'][1]['sources'][0])
    console.log(`Source string to be tested ${sourceString}`)

    expect(sourceString).not.toBe(null)
    expect(typeof sourceString).toBe('string')
})

test('Check donorage entry creation', () => {
    let dageString = xmlParser.createDageString(25)
    console.log(`Donor age string to be tested: ${dageString}`)

    expect(dageString).toBeDefined()
    expect(typeof dageString).toBe('string')
    expect(dageString).toBe('\t<dage>' + 25 + '</dage>\n')
})

test('Check altruistic string creation', () => {
    let altruisticString = xmlParser.createAltruisticString()
    console.log(`Altruistic string to test ${altruisticString}`)

    expect(altruisticString).not.toBe(null)
    expect(typeof altruisticString).toBe('string')
    expect(altruisticString).toBe('\t<altruistic>' + true + '</altruistic>\n')
})

test('Check matches string creation', () => {
    let matchesString = xmlParser.createMatchesString(jsonData['data'][1]['matches'])
    console.log(`Matches string for testing ${matchesString}`)

    expect(matchesString).not.toBe(null)
    expect(typeof matchesString).toBe('string')
})

test('Check match string creation', () => {
    let matchString = xmlParser.createMatchString(jsonData['data'][1]['matches'][0])
    console.log(`Match string for testing ${matchString}`)

    expect(matchString).not.toBe(null)
    expect(typeof matchString).toBe('string')
})

test('Check that xmlString is being created', () => {
    let xmlString = xmlParser.createXMLString(jsonData)
    
    expect(xmlString).not.toBe(null)
    expect(typeof xmlString).toBe('string')
})