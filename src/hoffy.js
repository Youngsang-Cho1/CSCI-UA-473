// hoffy.js

import fs from 'fs';

function getEvenParam(...args) {
    if (args.length <= 0) {
        return [];
    }
    return arguments.filter((arg, idx) => idx % 2 == 0);
}

function myFlatten(arr2d) {
    return arr2d.reduce((emptyArray, arg) => {
        emptyArray.push(...arg); 
        return emptyArray; 
    }, []);
}

function maybe(fn) {
    return (...args) => {
        const store = args.filter( arg =>  arg === null || arg === undefined)
        if (store.length > 0) {
            return undefined;
        }
        return fn(...args);
    };
}

function filterWith(fn) {
    return (arg) => {
        return arg.filter(fn)
    }
}

function repeatCall(fn, n, arg) {
    if (n == 0){
        return;
    }
    fn(arg);
    repeatCall(fn, n-1, arg);
}

function limitCallsDecorator(fn, n) {
    let counter = 0;
    return (...args) => {
        if (counter < n) {
            counter ++;
            return (fn(...args))
        }
        else {
            return undefined;
        }
    }
}

function myReadFile(fileName, successFn, errorFn) {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (!err) {
            successFn(data);
        }
        else {
            errorFn(err);
        }
    })
}

function stringFieldToList(data, key) {
    const store = {...data};
    store[key] = data[key].split(",").map(val => val.trim());
    return(store);
}

function rowsToObjects({data}) {
    const headers = data.headers;
    const rows = data.rows;

    return rows.map(row => 
        headers.reduce((obj, header, idx) => {
            obj[header] = row[idx];
            return obj;
        }, {})
    );
}

export {
    getEvenParam,
    myFlatten,
    maybe,
    filterWith,
    repeatCall,
    limitCallsDecorator,
    myReadFile,
    stringFieldToList,
    rowsToObjects
}

// cd desktop/homework02-Youngsang-Cho1
