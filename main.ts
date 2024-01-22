import { argv } from "bun";
import { WorkerPool } from "./workerPool.js";
import os from "os";

async function runSimulation(
  switchDoor: boolean,
  totalIterations: number,
  poolSize: number
): Promise<number> {
  const pool = new WorkerPool("montyHallWorker.js", poolSize);
  const iterationsPerWorker = Math.floor(totalIterations / poolSize);
  const promises = [];

  for (let i = 0; i < poolSize; i++) {
    promises.push(
      pool.runTask({ switchDoor, iterations: iterationsPerWorker })
    );
  }

  const results = await Promise.all(promises);
  pool.terminate();

  return results.reduce<number>((acc: number, val: any) => acc + val, 0);
}

async function main() {
  const totalIterations = argv[2] ? parseInt(argv[2]) : 1000000;
  const poolSize = 10; // Adjust based on your CPU

  // Start the timer
  const startTime = performance.now();

  const winsWithSwitch = await runSimulation(true, totalIterations, poolSize);
  const winsWithoutSwitch = await runSimulation(
    false,
    totalIterations,
    poolSize
  );

  // Stop the timer
  const endTime = performance.now();
  console.log(
    `Win rate with switching: ${(winsWithSwitch / totalIterations) * 100}%`
  );
  console.log(
    `Win rate without switching: ${
      (winsWithoutSwitch / totalIterations) * 100
    }%`
  );

  // Log execution time
  console.log(
    `Execution time: ${(endTime - startTime).toFixed(2)} milliseconds`
  );

  // Log basic system information
  console.log(`System Info:`);
  console.log(`CPU Count: ${os.cpus().length}`);
  console.log(`CPU Model: ${os.cpus()[0].model}`);
  console.log(`System Type: ${os.type()} ${os.arch()}`);
  console.log(
    `Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`
  );
}

main();
