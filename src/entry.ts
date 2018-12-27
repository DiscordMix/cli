#!/usr/bin/env node

import Handler from "./core/handler";
import VersionCmd from "./commands/version";

const handler: Handler = new Handler();

handler
    .register(new VersionCmd());