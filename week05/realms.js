
function ownPropertyNamesFor(target) {
    if (target === window) {
        return [
            'eval',
            'isFinite',
            'isNaN',
            'parseFloat',
            'parseInt',
            'decodeURI',
            'decodeURIComponent',
            'encodeURI',
            'encodeURIComponent',
            'Array',
            'ArrayBuffer',
            'Boolean',
            'DataView',
            'Date',
            'Error',
            'EvalError',
            'Float32Array',
            'Float64Array',
            'Function',
            'Int8Array',
            'Int16Array',
            'Int32Array',
            'Map',
            'Number',
            'Object',
            'Promise',
            'Proxy',
            'RangeError',
            'ReferenceError',
            'RegExp',
            'Set',
            'SharedArrayBuffer',
            'String',
            'Symbol',
            'SyntaxError',
            'TypeError',
            'Uint8Array',
            'Uint16Array',
            'Uint32Array',
            'URIError',
            'WeakMap',
            'WeakSet',
            'Atomics',
            'JSON',
            'Math',
            'Reflect',
        ];
    }
    return Object.getOwnPropertyNames(target);
}

function ownPropertyFor(target, propName) {
    return Object.getOwnPropertyDescriptor(target, propName).value;
}

function isObject(any) {
    return (any !== null) && (typeof any === 'function' || typeof any === 'object');
}

function getObjectProperties(target, prefix = 'global', visited = new Set()) {
    if (visited.has(target) || !isObject(target)) {
        return null;
    }

    visited.add(target);
    const objectPropNames = ownPropertyNamesFor(target).filter(name => isObject(ownPropertyFor(target, name)));
    return objectPropNames.map((name) => {
        const item = {
            id: `${prefix}.${name}`,
            name,
        };

        const children = getObjectProperties(ownPropertyFor(target, name), item.id, visited);
        if (children && children.length) {
            item.children = children;
        }

        return item;
    });
}