export type Services = Record<string, { appName: string; port: string }>;
export class ServicesTracker {
	private static instance: ServicesTracker;
	private services: Services;
	private constructor() {
		this.services = {};
	}

	static getInstance(): ServicesTracker {
		if (!ServicesTracker.instance) {
			ServicesTracker.instance = new ServicesTracker();
		}
		return ServicesTracker.instance;
	}

	addServices(key:string, service: {appName: string, port:string}): void {
		this.services[key] = service;
	}

	getServices(): Services {
		return this.services;
	}

	setServices(services: Services) {
		this.services = services;
	}

  isPortUsed(potentialPort: string): boolean {
    return Object.values(this.services).some(service => service.port === potentialPort);
  }
  isNameUsed(potentialName: string): boolean {
    return Object.values(this.services).some(service => service.appName === potentialName);
  }
}
