class EpisodePagination {
    lastVisiblePage: number
    hasNextPage: boolean


    constructor(json: any) {
        this.hasNextPage = json.has_next_page
        this.lastVisiblePage = json.last_visible_page
    }
}

export default EpisodePagination