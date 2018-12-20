[![npm](https://img.shields.io/npm/v/js-object-ext.svg)](https://www.npmjs.com/package/js-object-ext)
# js-object-ext

### Quick intro
There is a detailed [API documentation](https://rawcdn.githack.com/eddow/js-object-ext/master/docs/index.html) available.
Here are functionalities I needed in many projects that I finally gathered in a library. There are few functionalitites though many can still be added. It's not rocket science but always useful.

Things have been written so that the whole library can be used even if only one function is used and tree-shaking is used, only that function will be packed.

All the functions are packed as root export of the library - they are divided in modules in the documentation for cease of reading.

### Example
```typescript
import {onGet, del} from 'js-object-ext'
```

## Deep
The deep part is about recursion in the object.
### equal
Deeply compare objects. This does not get through `for(... in ...)` - it compares the constructors and owned properties.
### copy
Deeply copy a source into a target. The result will be the target into which has been copied the source.

The copy operation stops when an object has to be copied into an object with a different constructor - the result will still be a cloned object but the target object will be unmodified.

Hemce, skipping the target argument will just return a deep clone of the source.

## Path
Three functions, `get`, `set` and `del` take an object as a first argument and a *path* as a second argument. Only `set` takes a third argument for the value.

A useless example is `get(window, 'location.href')`

The path specific characters are '`.`' along with '`[`' and '`]`' for numeric indexes. Note that `'myArray[2]'` is equivalent to `'myArray.2'`

## Cuff
These functions are shortcuts to bind callback to property-get and property-set of an object