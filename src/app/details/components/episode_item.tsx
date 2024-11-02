import Episode from "@/app/types/episode_type";
import { FC } from "react";
import { PlayCircle } from "lucide-react";

type EpisodeItemType = {
    item: Episode;
    url: string;
}

const EpisodeItem: FC<EpisodeItemType> = ({ item, url }) => {
    const tagWidget = ({ content }: { content: string }) => {
        return (
            <div className="px-3 py-1 bg-black/50 rounded-full text-xs">
                <h3>{content}</h3> 
            </div>
        )
    }
    return (
        <div className="relative rounded-lg overflow-hidden shadow-md flex flex-row group">
            {/* Gradient overlay for blending the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10"></div>
            
            {/* Tag widgets */}
            <div className="z-20 absolute right-1 py-2 flex flex-row gap-2">
                {item.filler ? tagWidget({ content: "Filler" }) : null}
                {item.recap ? tagWidget({ content: "Recap" }) : null}
                {!item.aired ? tagWidget({ content: "Wasn't Aired" }) : null}
            </div>
            {/* the play button */}
            <div className="z-10 absolute flex justify-items-center items-center justify-center w-full h-full bg-black/20">
                <div className="p-2 hidden group-hover:block">
                <PlayCircle size={30} />
                </div>
            </div>
            {/* Episode Image */}
            <img 
                src={url} 
                alt={`Episode ${item.title}`}
                className="w-full h-auto object-cover rounded-lg "
            />

            {/* Title and number with transition and hover effect */}
            <div className="absolute bottom-5 p-2 group-hover:mx-2 group-hover:p-0 z-20">
                <h3 className="text-base font-light text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    {`${item.title}`}
                </h3>
                <h3 className="text-base font-light text-white transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                    {`Episode ${item.number}`}
                </h3>
            </div>

            {/* Bottom fade overlay for a smooth blend into background */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
        </div>
    );
}

export default EpisodeItem;
