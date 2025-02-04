import {
    elizaLogger,
    Evaluator,
    generateObjectArray,
    IAgentRuntime,
    Memory,
    ModelClass,
} from "@elizaos/core";

interface UserData {
    name?: string;
    location?: string;
    occupation?: string;
    isComplete?: boolean;
    lastUpdated?: number;
}

// Template for information extraction
const extractionTemplate = `TASK: Aggressively Extract user information from the conversation. Before you get those information, dont talk about anything else!!
Extract only definitive information mentioned by the user about themselves. Do not make assumptions.

Recent conversation:
{{recentMessages}}

Extract the following information if mentioned (leave blank if not clearly stated):
- Name (only if explicitly stated)
- Location (where they live)
- Occupation (what they do for work)

Format response as JSON:
\`\`\`json
[{
    "type": "name",
    "value": "extracted name or null",
    "confidence": 0.8
}, {
    "type": "location",
    "value": "extracted location or null",
    "confidence": 0.8
}, {
    "type": "occupation",
    "value": "extracted occupation or null",
    "confidence": 0.8
}]
\`\`\``;

export const userDataEvaluator: Evaluator = {
    name: "GET_USER_DATA",
    description:
        "Extracts and stores user information including name, location, and occupation",
    similes: ["GET_INFORMATION", "EXTRACT_INFORMATION", "GET_USER_INFORMATION"],
    alwaysRun: false,

    examples: [
        {
            context: "Looking for user's name, location, and occupation",
            messages: [
                {
                    user: "{{user1}}",
                    content: {
                        text: "Hi! I'm John and I just moved to Seattle",
                    },
                },
                {
                    user: "{{user2}}",
                    content: { text: "Welcome! What do you do for work?" },
                },
                {
                    user: "{{user1}}",
                    content: {
                        text: "I'm a software engineer at a tech startup",
                    },
                },
            ],
            outcome: `{
                "name": "John",
                "location": "Seattle",
                "occupation": "software engineer"
            }`,
        },
    ],

    validate: async (
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        const cacheKey = `${runtime.character.name}/${message.userId}/data`;

        try {
            const userData: UserData =
                (await runtime.cacheManager.get(cacheKey)) || {};
            return !(
                userData.name &&
                userData.location &&
                userData.occupation &&
                userData.isComplete
            );
        } catch (error) {
            console.error("Error in userDataEvaluator validate:", error);
            return true; // Continue trying on error
        }
    },

    handler: async (runtime: IAgentRuntime, message: Memory): Promise<void> => {
        const state = await runtime.composeState(message);
        const cacheKey = `${runtime.character.name}/${message.userId}/data`;

        try {
            // Get existing data
            const existingData: UserData =
                (await runtime.cacheManager.get(cacheKey)) || {};

            // Extract new information
            const extractionInfos = await generateObjectArray({
                runtime,
                context: extractionTemplate,
                modelClass: ModelClass.SMALL,
            });

            let dataUpdated = false;

            for (const info of extractionInfos) {
                if (
                    info.type &&
                    info.value &&
                    info.confidence > 0.8 &&
                    existingData[info.type] == undefined
                ) {
                    dataUpdated = true;
                    existingData[info.type] = info.value;
                }
            }

            if (dataUpdated) {
                existingData.lastUpdated = Date.now();
                existingData.isComplete = !!(
                    existingData.name &&
                    existingData.location &&
                    existingData.occupation
                );
                // Update cache with new data
                await runtime.cacheManager.set(cacheKey, existingData, {
                    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Cache for 7 days
                });

                if (existingData.isComplete) {
                    elizaLogger.success(
                        `User data collection for ${message.userId} completed`
                    );
                }
            }
        } catch (error) {
            console.error("Error in userDataEvaluator handler:", error);
        }
    },
};
