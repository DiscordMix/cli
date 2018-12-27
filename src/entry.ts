#!/usr/bin/env node

import Handler from "./core/handler";
import VersionCmd from "./commands/version";
import NewCmd from "./commands/new";
import RemoteCmd from "./commands/remote";

export const cloneUrl: string = "https://github.com/discord-forge/example-forge-bot.git";
export const cloneName: string = "forge-bot";

const handler: Handler = new Handler();

handler
    .register(new NewCmd())
    .register(new VersionCmd())
    .register(new RemoteCmd())
    .handle();