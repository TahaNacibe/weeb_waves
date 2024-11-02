class Title {
    [x: string]: any;
    type: string;
    title: string;
  
    constructor(json: any) {
      this.type = json.type;
      this.title = json.title;
    }
}

export default Title