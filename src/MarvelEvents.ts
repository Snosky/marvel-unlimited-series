import MarvelComic from "./MarvelComic"
import IssueCollection from "./IssueCollection"

export default class MarvelEvents extends IssueCollection{
    protected readonly  eventId!: number
    protected readonly coreIssuesListUrl = 'https://www.marvel.com/comics/list/coreissue/?id='
    protected readonly tieInIssuesListUrl = 'https://www.marvel.com/comics/list/tiein/?id='

    constructor(eventId: number) {
        super()
        this.eventId = eventId
    }

    public loadIssues(includeTieIssues = true) {
        let fetchers = [fetch(this.coreIssuesListUrl + this.eventId).then(r => r.text())]

        if(includeTieIssues) {
            fetchers.push(fetch(this.tieInIssuesListUrl + this.eventId).then(r => r.text()))
        }

        return Promise.all(fetchers).then(([coreIssuesDOM, tieIssuesDOM]) => {
            const tmpNode = document.createElement('div')
            tmpNode.innerHTML = coreIssuesDOM + tieIssuesDOM
            const comicNodes = tmpNode.getElementsByClassName('row-item-image')
            for (let i = 0; i < comicNodes.length; i++) {
                this.comics.push(MarvelComic.initFromHtml(comicNodes[i] as HTMLElement))
            }
        })
    }
}

