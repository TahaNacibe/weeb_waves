class Images {
    jpg: ImageUrls;
    webp: ImageUrls;
  
  constructor(json: any) {
      this.jpg = new ImageUrls(json.jpg);
      this.webp = new ImageUrls(json.webp);
    }
  }
  
  class ImageUrls {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  
    constructor(json: any) {
      this.image_url = json.image_url;
      this.small_image_url = json.small_image_url;
      this.large_image_url = json.large_image_url;
    }
}

export default Images