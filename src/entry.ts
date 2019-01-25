#!/usr/bin/env node

import Handler from "./core/handler";
import $Version from "./commands/version";
import $New from "./commands/new";
import $Remote from "./commands/remote";
import $Export from "./commands/export";

export const cloneUrl: string = "https://github.com/discord-mix/example-bot.git";
export const cloneName: string = "mix-bot";

const handler: Handler = new Handler();

handler
    .register(new $New())
    .register(new $Version())
    .register(new $Remote())
    .register(new $Export())
    .handle();
