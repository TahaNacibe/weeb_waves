import { FC } from 'react'
import { AlertCircle, RefreshCw, Popcorn, TrafficCone } from 'lucide-react'

type ErrorWidgetProps = {
    message?: string
    title?: string
    type?: number
    isEpisode?: boolean
    onRetry?: () => void
}

const ErrorWidget: FC<ErrorWidgetProps> = ({ 
    message = "Something went wrong. Please try again.", 
    title = "Error Occurred",
    type = 0,
    isEpisode = false,
    onRetry 
}) => {
    const iconsArray: Array<any> = [
        <AlertCircle className="w-8 h-8 text-red-500" />,
        <Popcorn className="w-8 h-8 text-indigo-500" />,
        <TrafficCone className="w-8 h-8 text-white" />,
    ]
    return (
        <div className={`bg-transparent rounded-lg p-6 ${isEpisode? "min-w-[160vh]" : null}`}>
            <div className="flex flex-col items-center text-center gap-4">
                {/* Error Icon */}
                <div className="bg-indigo-500/20 rounded-full p-3">
                    {iconsArray[type]}
                </div>
                
                {/* Error Message */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-white">
                        {title}
                    </h3>
                    <p className="text-sm text-white">
                        {message}
                    </p>
                </div>
                
                {/* Retry Button - Only shown if onRetry is provided */}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-4 py-2 mt-2 text-sm 
                                 text-red-400 border border-red-500/20 rounded-lg
                                 hover:bg-red-500/10 transition-colors duration-200"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    )
}

export default ErrorWidget