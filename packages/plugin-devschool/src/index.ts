import type { Plugin } from "@elizaos/core";

import { helloWorldAction } from "./actions/helloworld.ts";
import { currentNewsAction } from "./actions/currentnews.ts";
import { emotionProvider } from "./providers/emotion.ts";
export * as actions from "./actions";

export const devSchoolPlugin: Plugin = {
    name: "devschool",
    description: "Dev school plugin with basic actions and evaluators ",
    actions: [
        helloWorldAction,
        currentNewsAction,
    ],
    providers: [
        emotionProvider,
    ],
};
export default devSchoolPlugin;
