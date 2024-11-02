class Episode{
    title: string
    number: number
    aired: string
    score: number
    filler: boolean
    recap: boolean

    constructor(json: any) {
        this.title = json.title
        this.number = json.mal_id
        this.aired = json.aired
        this.score = json.score
        this.filler = json.filler
        this.recap = json.recap
    }
}

export default Episode