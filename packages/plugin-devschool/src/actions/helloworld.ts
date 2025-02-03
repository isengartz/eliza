import type {
    ActionExample,
    IAgentRuntime,
    Memory,
    Action,
    HandlerCallback,
    State,
} from "@elizaos/core";

export const helloWorldAction: Action = {
    name: "HELLO_WORLD",
    similes: [

    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Make a cool hello world ascii art",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown; },
        _callback: HandlerCallback
    ): Promise<boolean> => {

        const helloWorld = `
        ______________________
        < Hello World! >
        ----------------------
        \   ^__^
        \  (oo)\_______
        \ (__) )_______)
        \  ||----w |
        \  ||     ||
        `;  

        _callback({ text: helloWorld });

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "hello world" },
            },
            {
                user: "{{user2}}",
                content: { text: "Let me show you a cool hello world!", action: "HELLO_WORLD" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "can you show me hello world?" },
            },
            {
                user: "{{user2}}",
                content: { text: "Here's a fun hello world for you!", action: "HELLO_WORLD" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "display hello world" },
            },
            {
                user: "{{user2}}",
                content: { text: "Check out this ASCII art hello world!", action: "HELLO_WORLD" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "give me a hello world message" },
            },
            {
                user: "{{user2}}",
                content: { text: "Here's a fun way to say hello world!", action: "HELLO_WORLD" },
            }
        ]
    ] as ActionExample[][],
} as Action;
