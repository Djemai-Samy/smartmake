import path from "path";
import fs from "fs";


export const fileExist = (folderPath: string, fileName: string) => {
	const filePath = path.join(folderPath, fileName);
	return fs.existsSync(filePath);
};

export const fileExistCWD = ( fileName: string) => {
  // Get the current working directory
	const cwd = process.cwd();
	const filePath = path.join(cwd, fileName);
	return fs.existsSync(filePath);
};


export const smartmakeSettingsExist = () => {
	return fileExistCWD("smartmake.json");
}

export const dockerComposeFileExist = () => {
	return fileExistCWD("docker-compose.yaml");
}

export const dockerComposeDevFileExist = () => {
	return fileExistCWD("docker-compose-dev.yaml");
}

export const packageFileExist = () => {
	return fileExistCWD("package.json");
}