
import { FC } from "react"
import { ChevronRight } from "lucide-react";
import Link from "next/link";


type TitleBarType = {
    title: string,
}

const TitleBarWidget: FC<TitleBarType> = ({title}) => {
    return (
        <Link href={`/anime/${title}?page=0`}>
             <div className="flex flex-row justify-between items-center p-2 my-2 pr-12  z-50">
            <h1 className="text-white text-xl bg-white/10 rounded-full px-4 py-2">
                {title}
            </h1>
            <div className="flex flex-row items-center justify-evenly w-32 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group-hover:scale-105"
            >
                <h2 className="text-white font-light">
                    View All
                </h2>
                <ChevronRight />
            </div>
        </div>
            </Link>
       
    )
}

export default TitleBarWidget