const {
  BroadcastChannel,
  isMainThread,
  Worker,
  workerData
} = require('worker_threads')
const numCPUs = require('os').cpus().length
const bc = new BroadcastChannel('worker-thread');

module.exports = (promises, sharedVariables) => {
  return new Promise((resolve, reject) => {
    const length = promises.length
    const threads = numCPUs > length ? length : numCPUs
    if (isMainThread) {
      let values = []
      let workers = threads
      for (let i = 0; i < workers; i++) {
        new Worker(__filename, {workerData: {index: i, data: sharedVariables}});
        bc.onmessage = (event) => {
          --workers;
          const msg = event.data;
          values[msg.index] = msg.values
          if (workers === 0) {
            resolve([].concat.apply([], values))
            bc.close()
          }
        }
      }
    } else {
      const index = workerData.index
      const begin = Math.round(length / clusters * index)
      const end = Math.round(length / clusters * (index + 1))
      let all = promises.slice(begin, end)
      Promise.all(all).then((values) => {
        bc.postMessage({index: index, values: values});
        bc.close()
      }).catch(reject)
    }
  })
}
