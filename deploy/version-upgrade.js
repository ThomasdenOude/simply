"use strict"
const { readFile, writeFile } = require("fs");

const versionUpgrade = process.argv[2];
const path = "./package.json";

const exitWithError = (message) => {
    console.error(message);
    process.exitCode = 1;
}

const readPackage = () => {
    readFile(path, "utf8", (error, data) => {
        if (error) {
            exitWithError("Error in reading package.json", error);
            return;
        }
        const packageJson = JSON.parse(data);
        writePackage(packageJson);
    });
}

const writePackage = (packageJson) => {
    const version = packageJson.version;
    if (!version) {
        exitWithError("No version found in package.json");
        return;
    }
    const newVersion = setNewVersion(version, versionUpgrade);
    if (!newVersion) {
        exitWithError("Unable to set new version in package.json");
        return;
    }

    packageJson.version = newVersion;
    const data = JSON.stringify(packageJson, null, 2);

    writeFile(path, data, (error) => {
        if (error) {
            exitWithError("Unable to write new package.json ", error);
            return;
        }
        console.log(newVersion);
    });
}

const setNewVersion = (version, upgrade) => {
    const segments = version.split('.');
    if (segments.length !== 3) {
        exitWithError("Version not recognized: ", version);
        return;
    }
    switch (upgrade) {
        case "patch":
            segments[2]++;
            break;
        case "minor":
            segments[1]++;
            segments[2] = 0;
            break;
        case "major":
            segments[0]++;
            segments[1] = 0;
            segments[2] = 0;
            break;
    }
    return segments.join('.');
}

if (!versionUpgrade) {
    exitWithError("No version upgrade provided (major, minor or patch)");
} else {
    readPackage();
}
