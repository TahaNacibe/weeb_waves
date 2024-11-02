import Images from "./images_types";

// Class representing an anime entry
class RecommendationItem {
    mal_id: number;
    url: string;
    images: Images;
    title: string;

    constructor(data: any) {
        this.mal_id = data.entry.mal_id;
        this.url = data.entry.url;
        this.images = new Images(data.entry.images);
        this.title = data.entry.title;
    }
}

export default RecommendationItem