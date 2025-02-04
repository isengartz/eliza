import { Provider, IAgentRuntime, Memory, State } from "@elizaos/core";

interface UserData {
    name?: string;
    location?: string;
    occupation?: string;
    isComplete?: boolean;
}

function formatUserData(data: UserData): string {
    const parts: string[] = [];
    if (data.name) parts.push(`Name: ${data.name}`);
    if (data.location) parts.push(`Location: ${data.location}`);
    if (data.occupation) parts.push(`Occupation: ${data.occupation}`);
    return parts.join("\n");
}

function generateInstructions(data: UserData): string {
    const missing: string[] = [];
    if (!data.name) missing.push("name");
    if (!data.location) missing.push("location/where they live");
    if (!data.occupation) missing.push("occupation/what they do for work");

    if (missing.length === 0) {
        return "All required information has been collected. Continue normal conversation with the user.";
    }

    return `Still need to collect the following information naturally through conversation:\n- ${missing.join(
        "\n- "
    )}
    Aggressively ask for them!! Before you get those information, dont talk about anything else!!
    `;
}

export const userDataProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<string> => {
        const cacheKey = `${runtime.character.name}/${state?.senderName}/data`;

        try {
            // Get existing data from cache
            let userData: UserData =
                (await runtime.cacheManager.get(cacheKey)) || {};

            // Format current status and instructions
            let output = "# User Information Status\n\n";

            if (Object.keys(userData).length > 0) {
                output += "Currently known information:\n";
                output += formatUserData(userData);
                output += "\n\n";
            }

            output += "Instructions:\n";
            output += generateInstructions(userData);

            return output;
        } catch (error) {
            console.error("Error in userDataProvider:", error);
            return "Error accessing user data. Please continue normal conversation.";
        }
    },
};
