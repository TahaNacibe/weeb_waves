class GenreForFilter{
    name: string
    mal_id: number
    color: string

    constructor(json: any) {
        this.mal_id = json.mal_id;
        this.name = json.name;
        this.color = json.color;
      }
}

export const animeGenres: GenreForFilter[] = [
  new GenreForFilter({
    mal_id: 1,
    name: "Action",
    color: "#FF6B6B"  // Energetic red
  }),
  new GenreForFilter({
    mal_id: 2,
    name: "Adventure",
    color: "#4ECDC4"  // Teal
  }),
  new GenreForFilter({
    mal_id: 4,
    name: "Comedy",
    color: "#FFD93D"  // Bright yellow
  }),
  new GenreForFilter({
    mal_id: 8,
    name: "Drama",
    color: "#95A5A6"  // Subtle gray
  }),
  new GenreForFilter({
    mal_id: 10,
    name: "Fantasy",
    color: "#9B59B6"  // Mystical purple
  }),
  new GenreForFilter({
    mal_id: 14,
    name: "Horror",
    color: "#2C3E50"  // Dark blue-gray
  }),
  new GenreForFilter({
    mal_id: 7,
    name: "Mystery",
    color: "#34495E"  // Deep blue-gray
  }),
  new GenreForFilter({
    mal_id: 22,
    name: "Romance",
    color: "#FF7979"  // Soft pink-red
  }),
  new GenreForFilter({
    mal_id: 24,
    name: "Sci-Fi",
    color: "#3498DB"  // Bright blue
  }),
  new GenreForFilter({
    mal_id: 36,
    name: "Slice of Life",
    color: "#A8E6CE"  // Soft mint
  }),
  new GenreForFilter({
    mal_id: 30,
    name: "Sports",
    color: "#45B7D1"  // Sporty blue
  }),
  new GenreForFilter({
    mal_id: 37,
    name: "Supernatural",
    color: "#8E44AD"  // Deep purple
  }),
  new GenreForFilter({
    mal_id: 18,
    name: "Mecha",
    color: "#E74C3C"  // Mechanical red
  }),
  new GenreForFilter({
    mal_id: 19,
    name: "Music",
    color: "#F1C40F"  // Musical yellow
  }),
  new GenreForFilter({
    mal_id: 40,
    name: "Psychological",
    color: "#2E4053"  // Dark slate
  }),
  new GenreForFilter({
    mal_id: 41,
    name: "Thriller",
    color: "#C0392B"  // Deep red
  }),
  new GenreForFilter({
    mal_id: 23,
    name: "School",
    color: "#5DADE2"  // School blue
  }),
  new GenreForFilter({
    mal_id: 25,
    name: "Shoujo",
    color: "#FF9FF3"  // Soft pink
  }),
  new GenreForFilter({
    mal_id: 27,
    name: "Shounen",
    color: "#FF6B6B"  // Energetic orange-red
  }),
  new GenreForFilter({
    mal_id: 16,
    name: "Magic",
    color: "#9B59B6"  // Magical purple
  }),
  new GenreForFilter({
    mal_id: 38,
    name: "Military",
    color: "#5D6D7E"  // Military gray
  }),
  new GenreForFilter({
    mal_id: 42,
    name: "Seinen",
    color: "#566573"  // Mature gray
  }),
  new GenreForFilter({
    mal_id: 43,
    name: "Josei",
    color: "#D7BDE2"  // Soft purple
  }),
  new GenreForFilter({
    mal_id: 13,
    name: "Historical",
    color: "#BDB76B"  // Antique gold
  }),
  new GenreForFilter({
    mal_id: 11,
    name: "Game",
    color: "#3498DB"  // Game blue
  }),
  new GenreForFilter({
    mal_id: 6,
    name: "Demons",
    color: "#8B0000"  // Dark red
  }),
  new GenreForFilter({
    mal_id: 17,
    name: "Martial Arts",
    color: "#E67E22"  // Martial orange
  }),
  new GenreForFilter({
    mal_id: 29,
    name: "Space",
    color: "#2C3E50"  // Space blue
  }),
  new GenreForFilter({
    mal_id: 31,
    name: "Super Power",
    color: "#F1C40F"  // Power yellow
  }),
  new GenreForFilter({
    mal_id: 32,
    name: "Vampire",
    color: "#6C3483"  // Dark purple
  }),
  new GenreForFilter({
    mal_id: 35,
    name: "Harem",
    color: "#FF69B4"  // Pink
  }),
  new GenreForFilter({
    mal_id: 15,
    name: "Kids",
    color: "#82E0AA"  // Cheerful green
  }),
  new GenreForFilter({
    mal_id: 20,
    name: "Parody",
    color: "#F7DC6F"  // Light yellow
  }),
  new GenreForFilter({
    mal_id: 39,
    name: "Police",
    color: "#2E86C1"  // Police blue
  }),
  new GenreForFilter({
    mal_id: 21,
    name: "Samurai",
    color: "#E74C3C"  // Samurai red
  }),
  new GenreForFilter({
    mal_id: 46,
    name: "Award Winning",
    color: "#F4D03F"  // Gold
  }),
  new GenreForFilter({
    mal_id: 47,
    name: "Gourmet",
    color: "#FF7F50"  // Coral
  }),
  new GenreForFilter({
    mal_id: 48,
    name: "Work Life",
    color: "#5499C7"  // Professional blue
  })
];

export default animeGenres;

