#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import init from "./utils/init.js";
import cli from "./utils/cli.js";
import { runCreate } from "./commands/create/index.js";
import { runStart } from "./commands/start/index.js";
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;
(() => __awaiter(void 0, void 0, void 0, function* () {
    init({});
    input.includes("create") && (yield runCreate());
    input.includes("start") && (yield runStart());
    input.includes(`help`) && cli.showHelp(0);
}))();
