import { ChildProcess } from "child_process";

export class ChildProcessTracker {
	private static instance: ChildProcessTracker;
	private childProcesses: ChildProcess[];

	private constructor() {
		this.childProcesses = [];
	}

	static getInstance(): ChildProcessTracker {
		if (!ChildProcessTracker.instance) {
			ChildProcessTracker.instance = new ChildProcessTracker();
		}
		return ChildProcessTracker.instance;
	}

	addChildProcess(childProcess: ChildProcess): void {
		this.childProcesses.push(childProcess);
	}

	getChildProcesses(): ChildProcess[] {
		return this.childProcesses;
	}

	removeChildProcess(childProcess: ChildProcess): void {
		const index = this.childProcesses.indexOf(childProcess);
		if (index !== -1) {
			this.childProcesses.splice(index, 1);
		}
	}

  killAllChilds(code: number){
    this.getChildProcesses().forEach((child)=>{
      if(child.pid){
        process.kill(child.pid)
      }
    })
  }
}