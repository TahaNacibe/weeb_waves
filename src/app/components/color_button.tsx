import { FC } from "react"

type ColorButtonType = {
    color: string,
    content: string,
    prefix: string | null,
    suffix: string | null,
    
}

const ColorButton: FC<ColorButtonType> = ({color, content, prefix, suffix}) => {
    return (
        <button className={`${color} rounded-full px-4 py-2 flex flex-row cursor-pointer`}>
            {prefix != null? <img src={prefix} alt="" className="w-7 h-7 mr-2" /> : null}
            <h2 className="text-center text-lg font-extralight text-black">
                {content}
            </h2>
            {suffix != null? <img src={suffix} alt="" className="w-7 h-7 ml-2" /> : null}
        </button>
    )
}

export default ColorButton