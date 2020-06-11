// Binary Search Tree library in Javascript

class BstNode {
    constructor(key) {
        this.key = key;
        this.parent = null;
        this.left = null;
        this.right = null;
    }

    addLeft(node) {
        if (typeof(node)==='object' && node instanceof BstNode) {
            this.left = node;
        }
        else {
            throw 'Invalid argument: ' + node;
        }
    }


    addRight(node) {
        if (typeof(node)==='object' && node instanceof BstNode) {
            this.right = node;
        }
        else {
            throw 'Invalid argument: ' + node;
        }
    }

    isLeaf(node) {
        return node.left == null && node.right == null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }

    add(key) {
        if (this.root == null) {
            this.root = new BstNode(key);
        }
        else {
            this._addRec(this.root, key);
        }
        this.size += 1;
    }

    _addRec(node, key) {
        if (node != null) {
            if (node.key >= key) {
                if (node.left == null) {
                    let newNode = new BstNode(key);
                    newNode.parent = node;
                    node.addLeft(newNode);
                }
                else { // traverse left
                    this._addRec(node.left, key);
                }
            }
            else { // node.key < key
                if (node.right == null) {
                    let newNode = new BstNode(key);
                    newNode.parent = node;
                    node.addRight(newNode);
                }
                else { // traverse right
                    this._addRec(node.right, key);
                }
            }
        }
    }

    asArray() {
        // this can be done recursively, of course; this implementation 
        // avoids recursion limits on deep trees.
        let arr = [];
        let queue = [];
        queue.push(this.root);
        if (this.root)
            arr.push(this.root);
        while (queue.length > 0) {
            let node = queue.pop();
            if (node instanceof BstNode) {
                if (node.left) arr.push(node.left);
                if (node.right) arr.push(node.right);
                queue.push(node.right);
                queue.push(node.left);
            }
        }
        return arr;
    }

    search(key) {
        let node = this.root;
        let found = false;
        while (node != null) {
            if (node.key == key) {
                return true;
            }
            else if (node.key >= key) {
                node = node.left;
            }
            else { // key < node.key
                node = node.right;
            }
        }
        return found;
    }
}

(function () {
    // main
    let bst = new BinarySearchTree();
    let values = [];
    for (let i = 0; i < 8; i++) {
        let val = Math.floor(Math.random()*100);
        bst.add(val);
        values.push(val);
    }
    console.log('values: ', values);
    console.log('num. nodes: ', bst.size);
    console.log("bst: ", bst.asArray());
    console.log("search: ", bst.search(values.pop()));
    console.log("search: ", bst.search(-1));
})();
