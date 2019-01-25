export default class Pattern {
    public static packageName: RegExp = /[a-z]{3,}/i;

    public static packageVersion: RegExp = /[0-9]+\.[0-9]+\.[0-9]+/;
}
