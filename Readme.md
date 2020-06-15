# BST in Javascript
Binary Search Tree implementation in (modern as in 2020) Javascript.
This project is also an exploration of unit testing in Javascript.

## Why BST in Javascript?
It is a useful exercise with modern Javascript: this code uses ES6 for a much cleaner
syntax (it was about time) when defining classes in Javascript. There is still a long
way to go to fully support a few idioms of OOP, but it is a great step forward.

Implementing a fundamental data structure such as a BST reveals quite a bit of insight on
good programming practices with ES6. This project also shows how to integrate Jest, a unit
testing framework for Javascript developed by Facebook engineers.

## What are BSTs anyway?
A good explanation of BST is beyond the scope of this document. Briefly, a Binary Search
Tree (BST) is a Binary Tree in which for each node `n` in the BST the following invariant
is maintained: n.left.key < n.key < n.right.key.

A more comprehensive introduction can be found in:

* [Wikipedia Article on BST](https://en.wikipedia.org/wiki/Binary_search_tree)
* Cormen et al., ["Introduction to Algorithms"](https://mitpress.mit.edu/books/introduction-algorithms-third-edition)
, MIT Press, Cambridge, Massachussetts

# Unit Testing with Jest
These are a few notes on how to use Jest with Visual Studio Code. These have been written
on 6/12/2020. It may change over time, alas. It does not seem, at this time, that you
can use the automatic Unit Test discovery feature of Visual Studio Code like one does
with Python. We must use the Debugger instead to launch Jest for a test suite.

## Setting up Jest
Firstly, install Jest in the folder where the project resides. If using `npm`, you can
do it like this:

    > npm install jest

This installs the required packages in the `node_modules` folder. It also creates a 
`package-lock.json` file to keep track of dependencies.

Then, you need to create the `launch.json` file and a configuration to run Jest from
Visual Studio Code Debugger. A simple configuration to do this is shown below:

    {
        "type": "node",
        "request": "launch",
        "name": "Jest single run all tests",
        "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
        "args": ["--verbose", "-i", "--no-cache"],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen"
    }

This is just the configuration, for the full file just create a default on with the 
Debugger.

Next, we need a configuration file for Jest. The simplest way to get one is to run:

    > jest --init

in the project folder. You may also need to create a default `package.json` file before
running `jest --init`. An empty JSON file should work, or you can just add the following:

    {
        "scripts": {
            "test": "jest"
        }
    }

Jest will ask a few questions interactively on the CLI. After the initialization is 
complete, you have a new file: `jest.config.js` which stores the parameters to launch
the test suite. Note that all these files are intended to go in the repository.

## Writing Jest Tests
To keep tests and the code to be tested separate, it is best to write your code as a
Javascript module. If you want to test it with Nodejs, like I am doing in this code,
You need to import a module using the `require()` function of Nodejs and not the import
statement of EC6, otherwise Nodejs will throw an error that `import` cannot be used in
code that is not a module (it expects *.mjs file extension).

The process is straightforward once everything else is in place. You simply wrap the
code to be tested inside a function call to the `test()` function of Jest. For instance:

    test('Test description', () => {
        expect(someFunctionCall()).toBe(value);
    });

Then, run the code in Debug mode (VS Code) and the output of your tests will appear in the
Debug Console in VS Code (or in the command line if you go that route).
The Jest documentation is pretty simple and clear on how the use the framework.
For some examples see [Jest Documentation](https://jestjs.io/docs/en/getting-started).

## Debugging Jest Tests
In order to debug Jest tests we must have a debugger that can attach to the node process.
Fortunately, Visual Studio Code has an excellent debugger. In order for the Debugger to
behave consistenly, you need to add the following configuration:

    {
        "name": "Debug Jest Tests",
        "type": "node",
        "request": "launch",
        "runtimeArgs": [
        "--inspect-brk",
        "${workspaceRoot}/node_modules/jest/bin/jest.js",
        "--runInBand"
        ],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen",
        "port": 9229
    }

Some documentation on how to Debug Jest can be found in 
[Jest's reference documents](https://jestjs.io/docs/en/troubleshooting).
