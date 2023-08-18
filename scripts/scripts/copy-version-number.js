const fs = require('fs');
const path = require('path');

// Get package.json from root 
const rootPackageJsonPath = path.join(__dirname, '../../package.json');
const rootPackageJson = require(rootPackageJsonPath);

// Get package.json from release/app
const appPackageJsonPath = path.join(__dirname, '../../release', 'app', 'package.json');
const appPackageJson = require(appPackageJsonPath);

// Copy version from root to app
appPackageJson.version = rootPackageJson.version;

// Write updated app package.json
fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2));

console.log(`Copied version ${appPackageJson.version} from root package.json to release/app/package.json`);
