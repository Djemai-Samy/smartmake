import { Service, Settings } from "../ProjectManage";

export default abstract class BaseManager {
	service: Service;

  packageManager:string;

  task:string;

  settings: Settings;

  services:Record<string, Service>;

	constructor(service:Service, task:string, settings:Settings, services: Record<string, Service>) {
		this.service = service;
    this.packageManager = settings.useYarn ? "yarn" : "npm";
		this.task = task;
    this.settings = settings;
    this.services = services;
	}

	async run(){};
}

