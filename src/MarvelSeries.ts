import MarvelComic from "./MarvelComic"
import IssueCollection from "./IssueCollection"

export default class MarvelSeries extends IssueCollection {
    protected readonly seriesId!: number
    protected readonly issuesListUrl = 'https://www.marvel.com/comics/show_more?offset=0&tpl=..%2Fpartials%2Fcomic_issue%2Fcomics_singlerow_item.mtpl&byType=comic_series&limit=100000&isDigital=1&byId='

    constructor(seriesId: number) {
        super()
        this.seriesId = seriesId
    }

    public loadIssues(): Promise<void> {
        return fetch(this.issuesListUrl + this.seriesId)
            .then(r => r.json())
            .then((issuesDOM) => {
                const tmpNode = document.createElement('div')
                tmpNode.innerHTML = issuesDOM.output
                const comicNodes = tmpNode.getElementsByClassName('row-item-image')
                for (let i = 0; i < comicNodes.length; i++) {
                    this.comics.push(MarvelComic.initFromHtml(comicNodes[i] as HTMLElement))
                }
            })
    }
}
