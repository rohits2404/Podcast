import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const useGeneratePodcast = ({
    setAudio,
    voiceType,
    voicePrompt,
    setAudioStorageId,
}: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePodcast = async () => {
        setIsGenerating(true);
        setAudio("");

        if (!voicePrompt) {
            toast.error("Please Provide a Voice Type To Generate a Podcast");
            return setIsGenerating(false);
        }

        try {
        } catch (error) {
            console.log("Error Generating Podcast", error);
            toast.error("Error Creating a Podcast");
            setIsGenerating(false);
        }
    };

    return { isGenerating, generatePodcast };
};

export const GeneratePodcast = (props: GeneratePodcastProps) => {
    const { isGenerating, generatePodcast } = useGeneratePodcast(props);

    return (
        <div>
            <div className="flex flex-col gap-2.5">
                <Label className="text-16 font-bold text-white-1">
                    AI Prompt To Generate Podcast
                </Label>
                <Textarea
                    className="input-class font-light focus-visible:ring-offset-orange-1"
                    placeholder="Provide Text To Generate Audio"
                    rows={5}
                    value={props.voicePrompt}
                    onChange={(e) => props.setVoicePrompt(e.target.value)}
                />
            </div>
            <div className="mt-5 w-full max-w-50">
                <Button
                    type="submit"
                    className="text-16 bg-orange-1 py-4 font-bold text-white-1"
                    onClick={generatePodcast}
                >
                    {isGenerating ? (
                        <>
                            Generating
                            <Loader size={20} className="animate-spin ml-2" />
                        </>
                    ) : (
                        "Generate"
                    )}
                </Button>
            </div>
            {props.audio && (
                <audio
                    controls
                    src={props.audio}
                    autoPlay
                    className="mt-5"
                    onLoadedMetadata={(e) =>
                        props.setAudioDuration(e.currentTarget.duration)
                    }
                />
            )}
        </div>
    );
};
