import ExpressGenerator from "./express/index.js";
import ReactGenerator from "./react/index.js";

export function getGenerator(name: string) {
	switch (name) {
		case "express":
			return ExpressGenerator;
		case "react":
			return ReactGenerator;
	}

	return ExpressGenerator;
}
