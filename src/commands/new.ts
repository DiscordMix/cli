import Command from "../core/command";
import fs from "fs";
import {Coordinator, GitOperations, FileSystemOperations, ScriptOperations, ICoordinatorRunResult, CoordinatorState} from "@atlas/automata";
import {cloneUrl, cloneName} from "../entry";
import colors from "colors";

export default class $New extends Command {
    readonly name: string = "new";
    readonly description: string = "create a new project";

    public async run(args: string[]): Promise<void> {
        const dir: string = args[0] || cloneName;

        if (fs.existsSync(dir)) {
            console.log(`Path '${dir}' already exists`);

            return;
        }

        const coordinator: Coordinator = new Coordinator();

        const result: ICoordinatorRunResult = await coordinator
            .then(() => {
                console.log(`--> Cloning into '${dir}'`);

                return GitOperations.clone(cloneUrl, dir);
            })

            .then(() => FileSystemOperations.workingDir(dir))

            .then(() => {
                console.log("--> Removing git directory");
                FileSystemOperations.forceRemove(".git")
            })

            .then(() => console.log("--> Installing NPM modules"), true)
            .then(ScriptOperations.npmInstall)

            .fallback(() => {
                coordinator
                    .then(() => {
                        console.log("--> Rolling back operations");

                        return FileSystemOperations.forceRemove(dir)
                    }, true)

                    .run();
            })

            .run();

        const state: string = result.state === CoordinatorState.OK ? colors.green("OK") : colors.red("FAIL");

        console.log(`Operation completed with state '${state}' | Took ${result.time}ms (${result.averageTime}ms avg.)`);

        if (result.state === CoordinatorState.OK) {
            console.log(`You may now configure your bot by running 'npm run config' (within the '${dir}' directory)`);
        }
    }
}
