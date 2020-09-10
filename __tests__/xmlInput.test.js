/**
 * Require xml input methods that will be tested
 */
const xmlInput = require('../public/script/xmlInputParser')



/**
 * Tests to be run
 */

 test('Check that json entry is created from xml', () => {
    let xmlEntries = xmlDocument.getElementsByTagName('entry')
    let jsonNode = xmlInput.createNode(xmlEntries[0])

    expect(jsonNode).not.toBe(null)
    expect(typeof jsonNode).toBe('object')
 })

 test('Check sources array creation', () => {
     let xmlEntry = xmlDocument.getElementsByTagName('entry')[0]
     let sourcesArray = xmlInput.getSources(xmlEntry.getElementsByTagName('sources')[0])

     expect(sourcesArray).not.toBe(null)
     expect(typeof sourcesArray).toBe('object')
     expect(sourcesArray[0]).toBe(1)

 })

 test('Check that retrieving matches from XML object works', () => {
    let xmlEntry = xmlDocument.getElementsByTagName('entry')[0]
    let matchesArray = xmlInput.getMatches(xmlEntry.getElementsByTagName('matches')[0])

    expect(matchesArray).not.toBe(null)
    expect(typeof matchesArray).toBe('object')
    expect(matchesArray[0]['recipient']).toBe(2)
 })

/**
 * Setup test data to be used with input parser
 */

let xmlString = `<?xml version="1.0" ?>
<data>
<entry donor_id="1">
	<sources>
		<source>1</source>
	</sources>
	<dage>65</dage>
	<matches>
		<match>
			<recipient>2</recipient>
			<score>3</score>
		</match>
		<match>
			<recipient>3</recipient>
			<score>1</score>
		</match>
		<match>
			<recipient>4</recipient>
			<score>2</score>
		</match>
	</matches>
</entry>
<entry donor_id="2">
	<sources>
		<source>2</source>
	</sources>
	<dage>45</dage>
	<matches>
		<match>
			<recipient>1</recipient>
			<score>2</score>
		</match>
		<match>
			<recipient>5</recipient>
			<score>1</score>
		</match>
	</matches>
</entry>
<entry donor_id="3">
	<sources>
		<source>3</source>
	</sources>
	<dage>25</dage>
	<matches>
		<match>
			<recipient>1</recipient>
			<score>1</score>
		</match>
	</matches>
</entry>
<entry donor_id="4">
	<sources>
		<source>4</source>
	</sources>
	<dage>55</dage>
	<matches>
		<match>
			<recipient>3</recipient>
			<score>2</score>
		</match>
		<match>
			<recipient>2</recipient>
			<score>3</score>
		</match>
		<match>
			<recipient>5</recipient>
			<score>4</score>
		</match>
	</matches>
</entry>
<entry donor_id="5">
	<sources>
		<source>5</source>
		<source>6</source>
	</sources>
	<dage>30</dage>
	<matches>
		<match>
			<recipient>4</recipient>
			<score>2</score>
		</match>
		<match>
			<recipient>2</recipient>
			<score>1</score>
		</match>
	</matches>
</entry>
<entry donor_id="6">
	<dage>29</dage>
	<altruistic>true</altruistic>
	<matches>
		<match>
			<recipient>7</recipient>
			<score>10</score>
		</match>
	</matches>
</entry>
<entry donor_id="7">
	<sources>
		<source>7</source>
	</sources>
	<dage>29</dage>
</entry>
</data>`

let domParser = new DOMParser()
let xmlDocument = domParser.parseFromString(xmlString, "text/xml")

