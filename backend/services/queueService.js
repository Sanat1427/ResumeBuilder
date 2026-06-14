class RequestQueue {
  constructor(concurrencyLimit = 2) {
    this.concurrencyLimit = concurrencyLimit;
    this.runningCount = 0;
    this.queue = [];
  }

  /**
   * Enqueue an asynchronous task
   */
  async enqueue(taskFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFunction, resolve, reject });
      this.processNext();
    });
  }

  /**
   * Process the next task in the queue if concurrency slots are available
   */
  processNext() {
    if (this.runningCount >= this.concurrencyLimit || this.queue.length === 0) {
      return;
    }

    const { taskFunction, resolve, reject } = this.queue.shift();
    this.runningCount++;

    taskFunction()
      .then((result) => {
        this.runningCount--;
        resolve(result);
        this.processNext();
      })
      .catch((error) => {
        this.runningCount--;
        reject(error);
        this.processNext();
      });
  }
}

// Export a default queue with a safe concurrency limit of 2 calls
export default new RequestQueue(2);
export { RequestQueue };
