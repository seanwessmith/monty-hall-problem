export class WorkerPool {
  workers: Worker[];
  freeWorkers: Worker[];
  poolSize: number;
  workerScript: string;
  constructor(workerScript: string, poolSize: number) {
    this.workers = [];
    this.freeWorkers = [];
    this.poolSize = poolSize;
    this.workerScript = workerScript;

    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);
      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  runTask(data: { switchDoor: boolean; iterations: number }) {
    return new Promise((resolve, reject) => {
      if (this.freeWorkers.length > 0) {
        const worker = this.freeWorkers.pop();

        if (!worker) throw new Error("No free workers available");

        worker.onmessage = (e) => {
          this.freeWorkers.push(worker);
          resolve(e.data);
        };
        worker.onerror = (e) => {
          this.freeWorkers.push(worker);
          reject(e);
        };
        worker.postMessage(data);
      } else {
        reject("No free workers available");
      }
    });
  }

  terminate() {
    this.workers.forEach((worker) => worker.terminate());
  }
}
