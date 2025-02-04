import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

const emotionProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        const emotions = {
            happy: _runtime.character.name + " is feeling quite cheerful and optimistic right now!",
            sad: _runtime.character.name + " is feeling a bit down at the moment...",
            excited: _runtime.character.name + " is feeling really enthusiastic and energized!",
            thoughtful: _runtime.character.name + " is feeling contemplative and reflective.",
            playful: _runtime.character.name + " is feeling quite lighthearted and fun!",
            curious: _runtime.character.name + " is feeling very inquisitive and eager to learn.",
            calm: _runtime.character.name + " is feeling peaceful and serene.",
            motivated: _runtime.character.name + " is feeling driven and ready to tackle challenges!",
            creative: _runtime.character.name + " is feeling particularly imaginative today.",
            friendly: _runtime.character.name + " is feeling very sociable and warm."
        };

        const emotionKeys = Object.keys(emotions);
        const randomEmotion = emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
                
        return emotions[randomEmotion];
    },
};
export { emotionProvider };
