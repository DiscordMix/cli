#!/usr/bin/env node

import Handler from "./core/handler";
import $New from "./commands/new";
import $Remote from "./commands/remote";
import $Export from "./commands/export";
import $Init from "./commands/init";
import $Scan from "./commands/scan";

export const cloneUrl: string = "https://github.com/discord-mix/example-bot.git";
export const cloneName: string = "mix-bot";

const handler: Handler = new Handler();

handler
    .register(new $New())
    .register(new $Remote())
    .register(new $Export())
    .register(new $Init())
    .register(new $Scan())
    .handle();
