class Pagination {
    // Define pagination properties if necessary
    lastVisiblePage: number;
    has_next_page: Boolean;
    itemsCount: number | null;
    itemsTotal: number;
    itemsParPage: number;
    constructor(json: any) {
        // Initialize pagination properties from json
        this.lastVisiblePage = json.last_visible_page,
            this.has_next_page = json.has_next_page,
            this.itemsCount = (json.items.count) ? json.items.count : null
        this.itemsTotal = json.items.total,
        this.itemsParPage = json.items.per_page
    }
}
  
export default Pagination