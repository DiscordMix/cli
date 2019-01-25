import fs from "fs";

const packagePath: string = "package.mix.json";

export default class Package {
    public static ensure(): void {
        if (!fs.existsSync(packagePath)) {
            throw new Error(`Package file '${packagePath}' does not exist. Use 'mix init' to create it.`);
        }
    }
}
