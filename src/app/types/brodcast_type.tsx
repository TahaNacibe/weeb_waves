class Broadcast {
    [x: string]: any;
    day: string;
    time: string;
    timezone: string;
    string: string;
  
    constructor(json: any) {
      this.day = json.day;
      this.time = json.time;
      this.timezone = json.timezone;
      this.string = json.string;
    }
}
  
export default Broadcast