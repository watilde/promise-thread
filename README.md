# promise-thread
Promise.all in thread

## Example
### PT.all
```js
const PT = require('promise-thread')
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 200, 'two');
});

PT.all([promise1, promise2])
  .then((values) => {
    // values: ['one', 'two']
  })
```
