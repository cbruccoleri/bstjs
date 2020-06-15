/*
    Binary Search Tree in Javascript - Test Suite.

    Copyright 2020 Dr. Christian Bruccoleri
    License: MIT License. See also the LICENSE file included in this distribution.
 */

const {BstNode, BinarySearchTree} = require( './bst');
const seedrandom = require('seedrandom');

// A BST used by several tests.
let bst = null;
let values = null;

const testParams = {
    // minimum value for the pseudo-randomly generated test values
    minVal: -99,
    // maximum value for the pseudo-randomly generated test values
    maxVal: +99,
    // maximum number of values inserted in the tree
    numElems: 8
};

/**
 * Generates a random number between `minVal` and `maxVal`, extrema included.
 * Since we have replaced the standard random number generator with a "seedable" one,
 * this function will always return the same sequence of numbers, unless the seed is 
 * changed. See the function `beforeall()` for the seed and the `seedrandom` package
 * in `npm` for details.
 * @param {number} minVal Smallest integer in the random uniform distribution (included).
 * @param {number} maxVal Largest integer in the random uniform distribution (included).
 */
function randint(minVal, maxVal)
{
    if (typeof(minVal) == 'number' && typeof(maxVal) == 'number') {
        minVal = Math.floor(minVal);
        maxVal = Math.floor(maxVal);
        if (minVal > maxVal) {
            temp   = minVal;
            minVal = maxVal;
            maxVal = temp;
        }
        return Math.round(Math.random()*(maxVal - minVal)) + minVal;
    }
    else 
        throw Error(`minVal and maxVal must be numbers; got: ${minVal}, ${maxVal}`);
}

// Initialization, this also tests basic insert and search
beforeAll(() => {
    // replace Math.random with a seedable version
    const seedString = 'hash_testing';
    seedrandom(seedString, {global: true});
    // make a BST object
    bst = new BinarySearchTree();
    // fill it with values
    values = [];
    for (let i = 0; i < testParams.numElems; i++) {
        // if a duplicate value is generated, it will be skipped,
        // this keeps things simple and it is sufficient for the purpose of this test.
        let val = randint(testParams.minVal, testParams.maxVal);
        if (! bst.search(val)) {
            // not a duplicate key, insert
            bst.insert(val);
            values.push(val);
        }
    }
    console.log('BST initialized with: ', values);
    console.log(`Number of elements in the BST: ${bst.size()}`);
    console.log('BST keys:', bst.preOrderKeys());
});

test('Number of elements', () => {
    expect(bst.size()).toBe(values.length);
});

test('BST invariant', () => {
    // the BST invariant must hold right after we inserted a bunch of elements
    expect(bst.checkInvariant()).toBeTruthy();
    // now violate the invariant and check that it is reported
    // firstly, find a node that has at least one child
    let node = null;
    do {
        let i = randint(0, values.length-1);
        node = bst.search(values[i]);
    } while(node.left == null && node.right == null);
    if (node.left) {
        [node.key, node.left.key] = [node.left.key, node.key];
        // now we have at least one violation
        expect(bst.checkInvariant).toThrowError();
        // restore the correct tree
        [node.key, node.left.key] = [node.left.key, node.key];
    }
    else {
        [node.key, node.right.key] = [node.right.key, node.key];
        expect(bst.checkInvariant).toThrowError();
        // restore the correct tree
        [node.key, node.right.key] = [node.right.key, node.key];
    }
})

test('constructor', () => {
    node = new BstNode(12);
    expect(node.key).toBe(12);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
    expect(node.parent).toBeNull();
});

test('BstNode.leaf()', () => {
    node = new BstNode(0);
    expect(node.isLeaf()).toBeTruthy();
});


test('BstNode.addLeft()', () => {
    node = new BstNode(0);
    lNode = new BstNode(-1);
    node.addLeft(lNode);
    expect(node.left === lNode && lNode.parent === node).toBeTruthy();
    // try to add an invalid object
    expect(() => {lNode.addLeft({key: -1})}).toThrow(Error);
    // try to add `undefined`
    expect(() => {lNode.addLeft()}).toThrow(Error);
});

test('BstNode.addRight()', () => {
    node = new BstNode(0);
    rNode = new BstNode(-1);
    node.addRight(rNode);
    expect(node.right === rNode && rNode.parent === node).toBeTruthy();
    // try to add an invalid object
    expect(() => {rNode.addRight({key: 1})}).toThrow(Error);
    // try to add `undefined`
    expect(() => {rNode.addRight()}).toThrow(Error);
});


test('Empty check', () => {
    let tree = new BinarySearchTree();
    expect(tree.isEmpty()).toBeTruthy();
    expect(tree.size()).toBe(0);
});

test('Test multiple insertions', () => {
    let numberCompare = (a, b) => a - b;
    // makes a shallow copy and sort
    let sortedValues = values.slice().sort(numberCompare);
    let keys = bst.preOrderKeys().sort(numberCompare);
    let check = sortedValues.reduce(
        (acc, item, i) => acc && (item === keys[i]),
        true);
    expect(check).toBeTruthy();
})

test('min()', () => {
    const trueMin = values.reduce((val, curMin) => val < curMin ? val: curMin);
    const minNode = bst.min();
    expect(minNode.key).toBe(trueMin);
    expect(minNode.left).toBeNull();
});

test('max()', () => {
    const trueMax = values.reduce((val, curMax) => val > curMax ? val: curMax);
    const maxNode = bst.max();
    expect(maxNode.key).toBe(trueMax);
    expect(maxNode.right).toBeNull();
});


test('Successor', () => {
    let sortValues = values.sort((a, b) => a - b);
    if (sortValues.length == 0)
        return;
    else if (sortValues.length == 1)
        expect(bst.successor(sortValues[0])).toBeNull();
    else // more than 1 element
        for (let i = 0; i < sortValues.length - 1; i++)
            expect(bst.successor(sortValues[i]).key).toBe(sortValues[i+1]);
    // check the max
    expect(bst.successor(bst.max())).toBeNull();
    expect(bst.successor(testParams.minVal - 1)).toBeNull();
});


test('Predecessor', () => {
    let sortValues = values.sort((a, b) => a - b);
    if (sortValues.length == 0)
        return;
    else if (sortValues.length == 1)
        expect(bst.predecessor(sortValues[0])).toBeNull();
    else // more than 1 element
        for (let i = 1; i < sortValues.length; i++)
            expect(bst.predecessor(sortValues[i]).key).toBe(sortValues[i-1]);
    // check the min
    expect(bst.predecessor(bst.min())).toBeNull();
    // check a key that is not in the BST
    expect(bst.predecessor(testParams.maxVal + 1)).toBeNull();
});

/* Note: this test adds a value not already in values. */
test('Test insert() and search()', () => {
    const newValue = 0;
    // the new values is not in the `values` array
    expect(values.indexOf(newValue) === -1).toBeTruthy();
    // and not in the tree
    expect(bst.search(newValue)).not.toBeTruthy();
    // insert it
    bst.insert(newValue);
    values.push(newValue);
    // check it is there
    expect(bst.search(newValue)).toBeTruthy();
});

test('inOrderKeys', () => {
    let sortVal = values.sort((a,b) => a-b);
    let keys = bst.inOrderKeys();
    let keysVal = [];
    keys.forEach((node) => keysVal.push(node.key));
    console.log(`inOrderKeys: ${keysVal}`);
    let checkVal = keysVal.reduce((acc, val, i) => acc + val - sortVal[i], 0);
    expect(keysVal.length).toBe(values.length);
    expect(checkVal).toBe(0);
})


test('Delete', () => {
    bst.delete(70);
    values.splice(values.indexOf(70), 1);
    expect(bst.size()).toBe(values.length);
    expect(bst.checkInvariant()).toBeTruthy();
});