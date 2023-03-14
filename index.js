import inquirer from "inquirer";
import { simpleGit } from "simple-git";
import { spawn, execSync } from "child_process";
import path from "path";
const appNamePrompt = {
  type: "input",
  name: "appName",
  message: "What is the name of your new app?",
  default: "MyApp",
};

const bundleIdPrompt = {
  type: "input",
  name: "bundleId",
  message: "What is the bundle ID of your new app?",
  default: "com.myapp",
};

inquirer.prompt([appNamePrompt, bundleIdPrompt]).then(createApp);

async function renameReactNativeApp(newName, bundleIdentifier, cwd) {
  const args = ["react-native-rename", newName];

  if (bundleIdentifier) {
    args.push("--bundleID", bundleIdentifier);
  }

  const child = spawn("npx", args, { stdio: "inherit", cwd: cwd });

  child.on("exit", (code) => {
    console.log(`react-native-rename exited with code ${code}`);
  });
}

async function createApp({ appName, bundleId }) {
  try {
    // Clone the boilerplate to a new directory with the given app name
    const git = simpleGit();
    await git.clone("https://github.com/4RGUS/ethoraboilerplate.git", appName);

    //get the directory of the cloned app
    const cwd = path.resolve(process.cwd(), appName);

    //rename the package with the bundleID and name provided
    await renameReactNativeApp(appName, bundleId, cwd);

    // Install dependencies
    execSync("yarn", { cwd, stdio: "inherit" });
    execSync("npx pod-install", { cwd, stdio: "inherit" });

    console.log(`\nSuccess! Created ${appName} at ${cwd}`);
    console.log("Inside that directory, you can run several commands:\n");
    console.log("  yarn start");
    console.log("    Starts the development server.");
    console.log();
    console.log("  yarn ios");
    console.log("    Starts the app in the iOS simulator (requires Xcode).");
    console.log();
    console.log("  yarn android");
    console.log(
      "    Starts the app in the Android emulator (requires Android Studio)."
    );
  } catch (err) {
    console.error(err);
  }
}
