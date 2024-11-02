class Genre {
  [x: string]: any;
    mal_id: number;
    type: string;
    name: string;
  url: string;
  
    constructor(json: any) {
      this.mal_id = json.mal_id;
      this.type = json.type;
      this.name = json.name;
      this.url = json.url;
    }
}
  
export default Genre