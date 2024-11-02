class Aired {
    [x: string]: any;
    from: string;
    to: string;
    prop: Prop;
    string: string;
  
    constructor(json: any) {
      this.from = json.from;
      this.to = json.to;
      this.prop = new Prop(json.prop);
      this.string = json.string;
    }
  }
  
  class Prop {
    from: DateDetails;
    to: DateDetails;
  
    constructor(json: any) {
      this.from = new DateDetails(json.from);
      this.to = new DateDetails(json.to);
    }
  }
  
  class DateDetails {
    day: number;
    month: number;
    year: number;
  
    constructor(json: any) {
      this.day = json.day;
      this.month = json.month;
      this.year = json.year;
    }
}
  

export default Aired
