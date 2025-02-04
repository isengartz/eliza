import type { Plugin } from "@elizaos/core";

import { helloWorldAction } from "./actions/helloworld.ts";
import { currentNewsAction } from "./actions/currentnews.ts";
import { userDataProvider } from "./providers/userDataProvider.ts";
import { userDataEvaluator } from "./evaluators/getUserData.ts";
export * as actions from "./actions";

export const devSchoolPlugin: Plugin = {
    name: "devschool",
    description: "Dev school plugin with basic actions and evaluators ",
    actions: [helloWorldAction, currentNewsAction],
    providers: [userDataProvider],
    evaluators: [userDataEvaluator],
};
export default devSchoolPlugin;
