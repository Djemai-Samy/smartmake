import ExpressManager from "./ExpressManager.js";
import ReactManager from "./ReactManager.js";

export function getManager(name: string) {
	switch (name) {
		case "express":
			return ExpressManager;
		case "react":
			return ReactManager;
	}

	return ExpressManager;
}
