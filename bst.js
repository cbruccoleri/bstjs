/*
    Binary Search Tree in Javascript - Implementation.

    Copyright 2020 Dr. Christian Bruccoleri
    License: MIT License. See also the LICENSE file included in this distribution.
 */


/**
 * An object intended to be the building block of a Binary Search tree.
 * It has a `key` property representing the values contained in the tree and
 * pointers to facilitate the implementation of BSTs, such as `left`, `right`, and 
 * `parent`.
 * 
 * The `key` property must contain values that are part of a partially ordered set. That,
 * in practice, means values for which the `<` operator can be evaluated.
 * Javascript is not too picky about what objects are compared, so you can insert in the
 * BST etherogenous objects.
 * 
 * For more details, see also the `BinarySearchTree` class.
 */
class BstNode {
    constructor(key) {
        this.key = key;
        this.parent = null;
        this.left = null;
        this.right = null;
    }

    /**
     * Attach a node to the left of this node.
     * @param {BstNode} node A node to be attached.
     */
    addLeft(node) {
        if (typeof(node)==='object' && node instanceof BstNode) {
            this.left = node;
            node.parent = this;
        }
        else {
            throw new Error('Invalid argument: ' + JSON.stringify(node));
        }
    }


    /**
     * Attach a node to the right pointer of this node.
     * @param {BstNode} node A node to be attached.
     */
    addRight(node) {
        if (typeof(node)==='object' && node instanceof BstNode) {
            this.right = node;
            node.parent = this;
        }
        else {
            throw new Error('Invalid argument: ' + JSON.stringify(node));
        }
    }

    /** A node is a Leaf if and only if its left and right pointers are both null. */
    isLeaf() {
        return this.left == null && this.right == null;
    }
}

/**
 * An helper object to define constants for Left and Right traversal directions
 */
const Dir = { LEFT: 0, RIGHT: 1 };

/**
 * Binary Search Tree that implements the following operations:
 * search(key)
 * insert(key)
 * delete(key)
 * predecessor(key)
 * successor(key)
 * min()
 * max()
 */
class BinarySearchTree {
    constructor() {
        this.root = null;
        this._size = 0;
    }

    size() {
        return this._size;
    }

    /** Insert a new key in the BST. 
     * @param {any} key     A key value not already in the BST. This implementation of `insert()`
     *                      will not add a duplicate value. The function returns `true` if the 
     *                      value was correctly inserted, `false` otherwise.
     */
    insertOld(key) {
        if (this.root == null) {
            this.root = new BstNode(key);
            this._size += 1;
            return true;
        }
        else {
            this._size += 1;
            return this._addRec(this.root, key);
        }
    }

    /**
     * Helper function for insert. Do not call directly. 
     * @param {BstNode} node The root node of the BST sub-tree where the key must be added.
     * @param {any}     key  An object or value to be inserted in the tree.
     */
    _addRecOld(node, key) {
        if (node != null)
            if (node.key == key) {
                console.log(`!! Warning: duplicate key detected ${key}`);
                return;
            }
            else if (node.key > key)
                if (node.left == null) {
                    let newNode = new BstNode(key);
                    newNode.parent = node;
                    node.addLeft(newNode);
                }
                else // traverse left
                    this._addRec(node.left, key);
            else // node.key < key
                if (node.right == null) {
                    let newNode = new BstNode(key);
                    newNode.parent = node;
                    node.addRight(newNode);
                }
                else // traverse right
                    this._addRec(node.right, key);
    }

    /**
     * Insert the new value in the BST using a recursive algorithm. This is implemented
     * just for reference and benchmarking. The iterative version is more efficient
     * in practice.
     * 
     * @param {any} key  The value to be inserted in the tree. Must be comparable to the
     *                   values already in the tree (i.e. `<` makes sense).
     */
    insertRec(key) {
        this._addRec(this.root, key, null);
        this._size += 1;
    }

    /**
     * Helper function to implement the recursive version of insert.
     * @param {BstNode} node Current node to examine.
     * @param {any} key The value to be inserted in the tree.
     * @param {BstNode} parent The parent of the current node (can be null if none).
     * @param {Dir} direction Can be Dir.LEFT or Dir.RIGHT
     */
    _addRec(node, key, parent, direction) {
        if (node == null) {
            // recursion base case: we reached the location where the node must be added
            let newNode = new BstNode(key);
            if (parent == null)
                // empty root node case: `node` and `parent` are both null
                this.root = newNode;
            else if (direction == Dir.LEFT)
                parent.addLeft(newNode);
            else // direction == Dir.RIGHT
                parent.addRight(newNode);
        }
        else if (node.key == key)
                // duplicates not allowed
                throw new Error(`Duplicate key detected ${key}`);
            else if (key < node.key)
                // traverse left
                this._addRec(node.left, key, node, Dir.LEFT);
            else // node.key < key
                // traverse right
                this._addRec(node.right, key, node, Dir.RIGHT);
    }

    insert(key) {
        let node = this.root;
        let parent = null;
        while (node != null) {
            parent = node;
            if (key == node.key)
                throw new Error('Duplicate key: ' + JSON.stringify(key));
            else if (key < node.key)
                node = node.left;
            else
                node = node.right;
        }
        // at this point we found the node to insert (parent)
        let newNode = new BstNode(key);
        if (parent == null)
            // empty tree; the only node allowed a `null` parent would be the root
            this.root = newNode;
        else if (key < parent.key)
            parent.addLeft(newNode);
        else
            parent.addRight(newNode);
        this._size += 1;
    }


    /**
     * Verify that the BST invariant is maintained for each node.
     * In addition, a check is made for the uniqueness of each key. 
     * This simple implementation does not allow duplicates, although it would not be
     * too hard to add using an overflow-list technique.
     * 
     * Complexity: O(n) where n = this.size(), the number of nodes in the BST.
     * 
     * Do not call this method often because it is slow if there are many nodes.
     * This method is useful for debugging purposes.
     */
    checkInvariant() {
        let queue = [];
        let mapUnique = new Map();
        if (! this.isEmpty())
            queue.push(this.root);
        while (queue.length > 0) {
            let node = queue.pop();
            // check it is not a duplicate key
            if (mapUnique.has(node))
                return false;
            else
                mapUnique.set(node, true);
            // check BST invariant left
            if (node.left) {
                if (node.left.key > node.key)
                    // violation to the left
                    return false;
                else
                    queue.push(node.left)
            }
            // check BST invariant right
            if (node.right) {
                if (node.right.key < node.key)
                    // violation to the right
                    return false;
                else
                    queue.push(node.right);
            }
        }
        // none of the invariants has been violated
        return true;
    }

    /** 
     * Return an array containing the nodes in the BST in order.
     */
    inOrderKeys() {
        let inOrderRec = (arr, node) => {
            if (node)
                if (node.isLeaf())
                    arr.push(node);
                else {
                    inOrderRec(arr, node.left);
                    arr.push(node);
                    inOrderRec(arr, node.right);
                }
        }
        let inOrdArray = [];
        inOrderRec(inOrdArray, this.root);
        return inOrdArray;
    }


    /**
     * Vist the BST in pre-order and returns an `Array` of all the keys in the tree.
     */
    preOrderKeys() {
        let arr = [];
        let stack = [];
        stack.push(this.root);
        if (this.root)
            arr.push(this.root.key);
        while (stack.length > 0) {
            let node = stack.pop();
            if (node instanceof BstNode) {
                if (node.left) arr.push(node.left.key);
                if (node.right) arr.push(node.right.key);
                stack.push(node.right);
                stack.push(node.left);
            }
        }
        return arr;
    }


    /**
     * Generate a string representing the tree, printable to console.
     */
    stringTree() {
        let stringTreeRec = (node, treeStr, indentLevel) => {
            if (node == null) {
                treeStr += '    '.repeat(indentLevel) + '----[]\n';
                return treeStr;
            }
            else {
                treeStr += '    '.repeat(indentLevel) + '----[' + String(node.key) + ']\n';
                const indentStr = '    '.repeat(indentLevel+1)
                // left branch
                treeStr = stringTreeRec(node.left, treeStr + indentStr, indentLevel+1);
                // right branch
                treeStr = stringTreeRec(node.right, treeStr + indentStr, indentLevel+1);
                return treeStr;
            }
        }
        return stringTreeRec(this.root, '', 0);
    }

    /** Search the key in the BST, if found return the node containing the key, otherwise `null`. */
    search(key) {
        let node = this.root;
        while (node != null && node.key != key) {
            if (node.key > key)
                node = node.left;
            else // key < node.key
                node = node.right;
        }
        return node;
    }

    /** Return true if and only if this is an empty BST. */
    isEmpty() {
        return this.root == null;
    }

    /** Return the node with the minimum value of the key */
    min(node=this.root) {
        //  go left until you find an empty left child
        while (node != null && node.left != null) {
            node = node.left;
        }
        return node;
    }

    /**
     * Return the node with the maximum value of the key 
     * @param {BstNode} node The node of the subtree for which the Max key must be found. 
     *                       If not provided, defaults to the root.
     */
    max(node=this.root) {
        // go right until you find an empty right child
        while (node != null && node.right != null) {
            node = node.right;
        }
        return node;
    }

    /**
     * Find the biggest node `p` in the BST for which `p.key < key`.
     * This is the same as `pred()`, but the argument is a key, which is useful in practice.
     * 
     * Complexity: see `pred()`
     * 
     * @param {Comparable} key
     * @return The predecessor node, if it exists; null otherwise.
     */
    predecessor(key) {
        let node = this.search(key);
        return this.pred(node);
    }

    /**
     * Find the biggest node `pred` in the BST for which `pred.key < node.key`.
     * 
     * Complexity: worst case is O(n) for a completely unbalanced tree; on average is O(h)
     * where h is the height of the tree.
     * 
     * @param {BstNode} node A node to find the predecessor.
     * @return The predecessor node, if it exists; null otherwise.
     */
    pred(node) {
        if (node == null)
            return null;
        else 
            // if there is a left branch, then the root of the left branch is the predecessor
            if (node.left) {
                // the predecessor is the largest value in the right branch
                return this.max(node.left);
            }
            else {
                // walk up on the left branch until you find an ancestor node with a 
                // right branch or reach the root
                let p = node.parent;
                while (p != null && p.left == node) {
                    node = p;
                    p = node.parent;
                }
                return p;
            }
    }


    /**
     * Find the smallest node `s` in the BST for which `s.key > key`.
     * This is the same as `succ()`, except that the argument is a key, not a node, which
     * is more convenient in practice.
     * 
     * Complexity: see `succ()`. In addition to the cost of succ(), this function performs
     * a search in the tree to find the key. If the tree is umbalanced that is also,
     * O(n), where n is the number of elements in the tree.
     * 
     * @param {Comparable} key A key in the BST. If the `key` is not in the tree, null is returned.
     * @return The successor node, if it exist; null otherwise
     */
    successor(key) {
        let node = this.search(key);
        return this.succ(node);
    }

    /**
     * Return the successor of the `node` argument, if it exists; null otherwise.
     * 
     * Complexity: worst case is O(n) for a completely unbalanced tree, where n is the
     * number of elements of the tree. On average it is O(h) where h is the height of the 
     * tree.
     * 
     * @param {BstNode} node A node in the BST for which the successor must be returned.
     */
    succ(node) {
        // if there is a right branch, then the root of the right branch is the successor
        if (node == null)
            return null;
        else 
            if (node.right) {
                // the successor is the smallest value in the right branch
                return this.min(node.right);
            }
            else {
                // walk up on the right branch until you find a left branch 
                // or reach the root
                let p = node.parent;
                while (p != null && p.right == node) {
                    node = p;
                    p = node.parent;
                }
                return p;
            }        
    }

    /**
     * Moves a subtree to replace another subtree. After the move, the displaced subtree
     * is no longer attached to this BST.
     * 
     * @param {BstNode} nodeFrom Root of the subtree to be moved in place of `nodeTo`.
     * @param {BstNode} nodeTo Root of the subtree to be replaced.
     */
    _transplant(nodeFrom, nodeTo) {
        if (! nodeTo)
            return;
        else if (nodeTo.parent == null)
            this.root = nodeFrom;
        else if (nodeTo.parent.left == nodeTo)
            nodeTo.parent.left = nodeFrom;
        else
            nodeTo.parent.right = nodeFrom;
        if (nodeFrom)
            nodeFrom.parent = nodeTo.parent;
    }

    delete(key) {
        let node = this.search(key);
        this.del(node);
    }

    del(node) {
        if (! node)
            return;
        else if (node.left == null) {
            // splice right
            this._transplant(node.right, node);
        }
        else if (node.right == null) {
            // splice left
            this._transplant(node.left, node);
        }
        else { // the node has both a left and a right subtree
            let succ = this.min(node.right);
            if (node.right != succ) {
                // `succ` is not the root of the right subtree of `node`
                // then, the right subtree of `succ` takes the place of `succ`
                this._transplant(succ.right, succ);
                // succ is moved up to become the root of the right subtree of `node`
                succ.right = node.right;
                succ.right.parent = succ;
            }
            // splice succ to where the node is
            this._transplant(succ, node);
            // attach the left branch of node to succ
            succ.left = node.left;
            succ.left.parent = succ;
        }
        this._size -= 1;
    }
}


class AVLNode extends BstNode {

    /**
     * Height of a leaf. This is a convenient value to simplify rebalancing algorithms
     * because they do not have to check for null values.
     */
    LEAF_HEIGHT = -1;

    constructor (key) {
        super(key);
        this.avlHeight = AVLNode.LEAF_HEIGHT;
    }

    _updateHeight() {
        const leftHeight  = this.left  ? this.left.avlHeight: AVLNode.LEAF_HEIGHT;
        const rightHeight = this.right ? this.right.avlHeight: AVLNode.LEAF_HEIGHT;
        this.avlHeight = max(rightHeight, leftHeight) + 1;
    }

    addLeft(node) {
        super.addLeft(node);
        this._updateHeight();
    }

    addRight(node) {
        super.addRight(node);
        this._updateHeight();
    }
}

class AVLTree extends BinarySearchTree 
{
    constructor() {
        super();
    }

    rotateLeft(node) {
        if (node) {
            // node.right becomes the new root of the subtree at `node`
            let y = node.right;
            this._transplant(y, node);
            // splice y's left branch to node's right
            node.addRight(y.left);
            // splice node to y's left
            y.addLeft(node);
            // the height of `y` and `node` has also been updated
            return y;
        }
        else
            return node;
    }

    rotateRight(node) {
        if (node) {
            // node.left becomes the new root of the subtree at `node`
            let y = node.left;
            this._transplant(y, node);
            // splice y's right branch to node's left
            node.addLeft(y.right);
            // splice node to y's right
            y.addRight(node);
            // the height of `y` and `node` has also been updated
            return y;
        }
        else
            return node;
    }

    rebalance(node) {
        // TODO: if this node is unbalanced
        // determine and execute a rotation sequence to rebalance it
        // walk up the tree and rebalance
    }

    insert(node, atNode) {
        // insert as in BST
        super.insert(node);
        // TODO: rebalance
    }

    delete(node) {
        // TODO: implement
    }

}

// Export these classes as a Nodejs module (and for tests)
module.exports = {BstNode, BinarySearchTree};
