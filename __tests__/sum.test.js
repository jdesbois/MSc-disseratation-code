/**
 * Baseline test file to be sure Jest dependency is working
 */

const sum = require('../public/script/sum')

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1,2)).toBe(3)
})