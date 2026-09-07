import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateAudioAction = action({
    args: {
        input: v.string(),
        voice: v.string(),
    },

    handler: async (_, { input, voice }) => {
        const rapidApiKey = process.env.RAPIDAPI_KEY;

        if (!rapidApiKey) {
            throw new Error("RAPIDAPI_KEY is not configured");
        }

        if (!voice) {
            throw new Error("Voice is required");
        }

        const response = await fetch(
            "https://open-ai-text-to-speech1.p.rapidapi.com/",
            {
                method: "POST",
                headers: {
                    "x-rapidapi-key": rapidApiKey,
                    "x-rapidapi-host": "open-ai-text-to-speech1.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "tts-1",
                    input,
                    voice,
                }),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error("RapidAPI TTS Error:", response.status, errorText);

            throw new Error(
                `TTS Request Failed: ${response.status} ${errorText}`,
            );
        }

        const audioBuffer = await response.arrayBuffer();

        if (audioBuffer.byteLength === 0) {
            throw new Error("TTS API returned empty audio");
        }

        return audioBuffer;
    },
});
