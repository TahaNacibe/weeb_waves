class Trailer {
    [x: string]: any;
    youtube_id: string;
    url: string;
    embed_url: string;
  
    constructor(json: any) {
      this.youtube_id = json.youtube_id;
      this.url = json.url;
      this.embed_url = json.embed_url;
    }
}
  
export default Trailer