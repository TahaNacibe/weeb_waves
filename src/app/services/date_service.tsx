class DateTimeService{
    getTheCurrentDay() {
        //* values to return 
        const days: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const currentDayIndex = new Date().getDay(); // 0 for Sunday, 1 for Monday, etc.

        //* check if the date is in the correct range
        if (currentDayIndex >= 0 && currentDayIndex < days.length) {
            return days[currentDayIndex]
        } else {
            return "unknown"
        }
    }

    formatDate(isoString: string): string {
        // Create a new Date object from the ISO string
        const date = new Date(isoString);
    
        // Define options for formatting the date
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
        };
        
        // Format the date using toLocaleDateString
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        // Return the formatted date, removing the comma before the day
        return formattedDate.replace(',', ''); // Adjust format to match "MMM DD YYYY"
    }

    getCurrentEpisode(dateString: string, isAiring: boolean, episodes: number): string {
        if (!isAiring) formateAnswer(episodes);
        // Create a Date object from the start date string
        const startDate = new Date(dateString).getTime();
        // Calculate days passed since the start date
        const daysPassed = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24));
    
        console.log("Start date:", new Date(startDate));
        console.log("Days passed:", daysPassed);
    
        // If still airing, return the provided episode count
    
        // Assuming weekly episodes (7-day interval)
        const currentEpisode = Math.floor(daysPassed / 6);
        
        // Ensure the returned episode count doesn't exceed total episodes
        const result = Math.min(currentEpisode, episodes);
        return formateAnswer(result)
    }
    
    
}
export function formateAnswer(ep: number): string {
if (ep == 0) {
    return "No Episodes"
} else {
    return `Episode ${ep}`
}
}

export default DateTimeService