import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

const useGeneratePodcast = ({
    setAudio,
    voiceType,
    voicePrompt,
    setAudioStorageId,
}: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);

    const getPodcastAudio = useAction(api.openai.generateAudioAction);

    const getAudioUrl = useMutation(api.podcasts.getUrl);

    const generatePodcast = async () => {
        setIsGenerating(true);
        setAudio("");

        if (!voicePrompt) {
            toast.error("Please Provide a VoiceType To Generate a Podcast");
            return setIsGenerating(false);
        }

        try {
            const response = await getPodcastAudio({
                voice: voiceType,
                input: voicePrompt,
            });

            const blob = new Blob([response], { type: "audio/mpeg" });
            const fileName = `podcast-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, { type: "audio/mpeg" });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);

            const audioUrl = await getAudioUrl({ storageId });
            setAudio(audioUrl!);
            setIsGenerating(false);
            toast.success("Podcast Generated Successfully");
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
