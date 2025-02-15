import Broadcast from "./brodcast_type";
import Aired from "./date_type";
import Genre from "./geners_type";
import Images from "./images_types";
import Producer from "./producer_type";
import Title from "./title_type";
import Trailer from "./triler_type";

// Anime class representing each anime entry in the "data" array
export class Anime {
    mal_id: number;
    url: string;
    images: Images;
    trailer: Trailer;
    approved: boolean;
    titles: Title[];
    title: string;
    title_english: string;
    title_japanese: string;
    title_synonyms: string[];
    type: string;
    source: string;
    episodes: number;
    status: string;
    airing: boolean;
    aired: Aired;
    duration: string;
    rating: string;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    background: string;
    season: string;
    year: number;
    broadcast: Broadcast;
    producers: Producer[];
    licensors: Producer[];
    studios: Producer[];
    genres: Genre[];
    explicit_genres: Genre[];
    themes: Genre[];
    demographics: Genre[];
  
    constructor(json: any) {
      this.mal_id = json.mal_id;
      this.url = json.url;
      this.images = new Images(json.images);
      this.trailer = new Trailer(json.trailer);
      this.approved = json.approved;
      this.titles = json.titles.map((item: any) => new Title(item));
      this.title = json.title;
      this.title_english = json.title_english;
      this.title_japanese = json.title_japanese;
      this.title_synonyms = json.title_synonyms;
      this.type = json.type;
      this.source = json.source;
      this.episodes = json.episodes;
      this.status = json.status;
      this.airing = json.airing;
      this.aired = new Aired(json.aired);
      this.duration = json.duration;
      this.rating = json.rating;
      this.score = json.score;
      this.scored_by = json.scored_by;
      this.rank = json.rank;
      this.popularity = json.popularity;
      this.members = json.members;
      this.favorites = json.favorites;
      this.synopsis = json.synopsis;
      this.background = json.background;
      this.season = json.season;
      this.year = json.year;
      this.broadcast = new Broadcast(json.broadcast);
      this.producers = json.producers.map((item: any) => new Producer(item));
      this.licensors = json.licensors.map((item: any) => new Producer(item));
      this.studios = json.studios.map((item: any) => new Producer(item));
      this.genres = json.genres.map((item: any) => new Genre(item));
      this.explicit_genres = json.explicit_genres.map((item: any) => new Genre(item));
      this.themes = json.themes.map((item: any) => new Genre(item));
      this.demographics = json.demographics.map((item: any) => new Genre(item));
  }
  
  static toJson(anime: Anime){
    return {
      "mal_id": anime.mal_id,
      "title": anime.title,
      "type": anime.type,
      "rank": anime.rank,
      "status": anime.status,
      "cover":anime.images.jpg.large_image_url
  }
  }
  }