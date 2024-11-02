"use client"
import { FC } from "react"

//* types
type TagLabelType = {
    content: string
    color: string
}

//* widget
const TagLabel: FC<TagLabelType> = ({ content, color }) => {
    return (
        <div className="p-2">
        <div className={`${color} rounded-xl px-3 py-1`}>
            <h2 className="text-xs font-extralight">
            {content}
            </h2>
        </div>

        </div>
    )
}

export default TagLabel