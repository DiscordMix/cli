import fs from "fs";
import path from "path";
import Pattern from "./pattern";

const templatePath: string = path.join(__dirname, "..", "package-template.json");

export interface IPackage {
    readonly name: string;
    readonly author: string | "anonymous";
    readonly version: string;
    readonly description?: string;
    readonly export: string[] | string;
}

export default class Package {
    public static path: string = "package.mix.json";

    public static ensure(): void {
        if (!Package.exists) {
            throw new Error(`Package file '${Package.path}' does not exist. Use 'mix init' to create it.`);
        }
    }

    public static get exists(): boolean {
        return fs.existsSync(Package.path);
    }

    public static readTemplateSync(): string {
        return fs.readFileSync(templatePath).toString();
    }

    public static createSync(): boolean {
        fs.writeFileSync(Package.path, Package.readTemplateSync());

        return Package.exists;
    }

    public static getSync(): IPackage {
        return JSON.parse(fs.readFileSync(Package.path).toString());
    }

    public static validate(pckg: IPackage): boolean {
        if (typeof pckg.name !== "string" || !Pattern.packageName.test(pckg.name)) {
            return false;
        }
        else if ((typeof pckg.description !== "undefined" && typeof pckg.description !== "string")) {
            return false;
        }
        else if (typeof pckg.version !== "string" || !Pattern.packageVersion.test(pckg.version)) {
            return false;
        }
        else if (typeof pckg.author !== "string" || pckg.author.trim().length === 0) {
            return false;
        }
        else if (typeof pckg.export !== "string" && !Array.isArray(pckg.export)) {
            return false;
        }

        return true;
    }
}
