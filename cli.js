#!/usr/bin/env node

const meow = require("meow");
const fs = require("fs");
const clone = require("git-clone");
const urlExists = require("url-exists");
const rimraf = require("rimraf");
const path = require("path");
const ncp = require("ncp").ncp;
const chalk = require("chalk");

ncp.limit = 16;

// Grab provided args.
const [,, ...args] = process.argv;

const cli = meow("Usage: forge add|remove <package name> OR forge update|list SWITCHES: -l|--local <relative path> (The local path to save the repo), -r|--remote <url> (The url to pull commands from, must be git url), -f|--force (Override accidental directory erasure protection)", {
    flags: {
        force: {
            type: "boolean",
            alias: "f"
        },

        out: {
            type: "string",
            alias: "o"
        },

        remote: {
            type: "string",
            alias: "r"
        },

        local: {
            type: "string",
            alias: "l"
        },

        sentry: {
            type: "string",
            alias: "s"
        }
    }
});

function getLocalPath(p) {
    return path.resolve(path.join(process.cwd(), p));
}

const remoteRepoPath = cli.flags.r || cli.flags.remote || "https://github.com/cloudrex/forge-commands.git";
const exampleBotRepoPath = "https://github.com/cloudrex/example-forge-bot.git";
const repoPath = getLocalPath(cli.flags.l || cli.flags.local || ".forge-repo");
const repoSentry = cli.flags.s || cli.flags.sentry || ".cmd-repo";
const sentryPath = path.resolve(`${repoPath}/${repoSentry}`);
const manifestFile = "cmd.json";
const originalAuthor = "CloudRex <cloudrex@outlook.com>";

function getCommandPath(command) {
    return path.resolve(path.join(repoPath, command));
}

function commandExists(command) {
    // TODO: Make sure directory isn't empty
    return fs.existsSync(getCommandPath(command)) && fs.lstatSync(getCommandPath(command)).isDirectory();
}

function getCommandManifestPath(command) {
    return path.resolve(path.join(getCommandPath(command), manifestFile));
}

function getCommandManifest(command) {
    return JSON.parse(fs.readFileSync(getCommandManifestPath(command).toString()));
}

function getOutPath() {
    return getLocalPath(cli.flags.o || cli.flags.out);
}

function updateRepo() {
    console.log("Updating repo ...");

    if (fs.existsSync(repoPath)) {
        if (!fs.existsSync(sentryPath)) {
            console.log(`Warning: Directory '${repoPath}' was not created by forge-cli. You must remove or rename this directory to use the forge-cli.`);

            process.exit(0);
        }

        console.log("Removing old repo ...");

        rimraf.sync(repoPath);
    }
    else {
        fs.mkdirSync(repoPath);
    }

    clone(remoteRepoPath, repoPath, {
        checkout: process.env.REPO_BRANCH || "master"
    }, () => {
        fs.writeFileSync(sentryPath, "");
        console.log("Repo updated");
    });
}

if (!fs.existsSync(getLocalPath("package.json")) && !(cli.flags.force || cli.flags.f) && cli.input[0] !== "new") {
    console.log("You must be in the root folder of a node.js project. Use the -f or --force flag to omit this warning.");

    process.exit(0);
}

switch (cli.input[0]) {
    case "add": {
        if (cli.input[1] === undefined) {
            console.log("You didn't specify a command name. Use forge list to view all available commands");

            return;
        }
        else if (!cli.flags.o && !cli.flags.out) {
            console.log("You didn't specify an output directory. Use the -o or --out flag.");
        
            process.exit(0);
        }

        urlExists(remoteRepoPath, (error, exists) => {
            if (error) {
                throw error;
            }

            if (exists) {
                if (fs.existsSync(repoPath)) {
                    if (commandExists(cli.input[1])) {
                        const outPath = getOutPath();
                        const finalOutPath = path.resolve(`${outPath}/${cli.input[1]}`);

                        if (!fs.existsSync(outPath)) {
                            fs.mkdirSync(outPath);
                        }

                        if (!fs.existsSync(finalOutPath)) {
                            fs.mkdirSync(finalOutPath);
                        }
                        else {
                            console.log("Command already exists");

                            return;
                        }

                        ncp(getCommandPath(cli.input[1]), finalOutPath, (error) => {
                            if (error) {
                                throw error;
                            }

                            console.log(`Added command '${cli.input[1]}' to '${outPath}'`);
                        });
                    }
                    else {
                        console.log("That command doesn't exist. Try updating the repo (forge update)");
                    }
                }
                else {
                    updateRepo();
                }
            }
            else {
                console.log("Remote repo url does not exist");
            }
        });

        break;
    }

    case "list": {
        if (!fs.existsSync(repoPath)) {
            console.log("Repo does not exist. Use forge update to download commands");

            return;
        }

        const commands = fs.readdirSync(repoPath);

        let counter = 0;

        console.log("");

        // TODO: Make sure command is a directory and it isn't empty
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].startsWith(".")) {
                continue;
            }

            const manifest = getCommandManifest(commands[i]);

            counter++;

            let message = chalk.greenBright.bold(commands[i]) + " " + chalk.bgWhite.black("v" + (manifest.version || "?")) + chalk.gray(" => ") + manifest.description;

            if (manifest.author !== originalAuthor) {
                message += chalk.gray(` by ${manifest.author}`);
            }

            console.log(message);
        }

        console.log(`\n${counter} Command(s)`);

        break;
    }

    case "new": {
        if (cli.input[1] === undefined) {
            console.log("Expecting directory name");

            process.exit(0);
        }

        if (fs.existsSync(getLocalPath(cli.input[1]))) {
            console.log("Directory already exists");

            process.exit(0);
        }

        urlExists(remoteRepoPath, (error, exists) => {
            if (error) {
                throw error;
            }

            if (exists) {
                const localPath = cli.input[1];

                console.log("Cloning template bot ...");

                clone(exampleBotRepoPath, localPath, {
                    checkout: process.env.NEW_REPO_BRANCH || "master"
                }, () => {
                    console.log(`Created template bot @ ${localPath}`);
                });
            }
            else {
                console.log("Example bot repo does not exist");
            }
        });

        break;
    }

    case "update": {
        updateRepo();

        break;
    }

    case "remove": {
        console.log("Not yet implemented");

        break;
    }

    default: {
        console.log("Unknown command, please use either add, remove, update or list");
    }
}