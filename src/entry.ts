#!/usr/bin/env node

import Handler from "./core/handler";
import VersionCmd from "./commands/version";
import NewCmd from "./commands/new";

const handler: Handler = new Handler();

handler
    .register(new NewCmd())
    .register(new VersionCmd())
    .handle();