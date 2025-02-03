import {
    type ActionExample,
    type IAgentRuntime,
    type Memory,
    type Action,
    type HandlerCallback,
    type State,
    type Content,
    generateText,
    ModelClass,
} from "@elizaos/core";



async function getCurrentNews(searchText: string) {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${searchText}&apiKey=${process.env.NEWS_API_KEY}`);
    const data = await response.json();
    return data.articles.slice(0, 10);
}

export const currentNewsAction: Action = {
    name: "CURRENT_NEWS",
    similes: [

    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return process.env.NEWS_API_KEY !== undefined;
    },
    description:
        "Get the current news",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown; },
        _callback: HandlerCallback
    ): Promise<boolean> => {

        const context = `Extract the users search term from the {{username}} message. The message is: ${_message.content.text}
        Only respond with the search term, do not include any other text.`

        const searchTerm = await generateText({runtime: _runtime, context, modelClass: ModelClass.SMALL, stop: ["\n"]})


        const news = await getCurrentNews(searchTerm);

        const memory : Memory = {
            userId: _message.userId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content: {
                text: news,
                action: "CURRENT_NEWS",
                source: _message.content.source,
            } as Content,
        }
        await _runtime.messageManager.createMemory(memory);

        _callback({ text: news });

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
                content: { text: "I'll fetch the latest news for you!", action: "CURRENT_NEWS" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "what's happening in the news?" },
            },
            {
                user: "{{user2}}",
                content: { text: "Let me get you up to speed with the current news.", action: "CURRENT_NEWS" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "show me today's news" },
            },
            {
                user: "{{user2}}",
                content: { text: "I'll fetch today's news headlines for you.", action: "CURRENT_NEWS" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "what are the latest headlines?" },
            },
            {
                user: "{{user2}}",
                content: { text: "I'll show you the latest news headlines.", action: "CURRENT_NEWS" },
            }
        ]
    ] as ActionExample[][],
} as Action;
