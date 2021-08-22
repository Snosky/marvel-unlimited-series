import MarvelComic from './MarvelComic'

enum MarvelComicCollectionType {
    series = 'series',
    event = 'event'
}

export default class MarvelComicCollection {
    protected comics: MarvelComic[] = []
    protected type?: MarvelComicCollectionType
    protected id?: number

    constructor(comics: MarvelComic[], type?: MarvelComicCollectionType, id?: number) {
        this.comics = comics
        this.type = type
        this.id = id
    }

    public count() {
        return this.comics.length
    }

    public addToLibrary(
        before: (x: MarvelComic) => void,
        onComicAdded: (x: MarvelComic) => void,
        onError: (x: MarvelComic) => void,
        always: (x: MarvelComic) => void
    ) {
        const promises = []
        for (let i = 0; i < this.comics.length; i++) {
            before(this.comics[i])
            promises.push(
                this.comics[i].addToLibrary()
                    .then(() => onComicAdded(this.comics[i]))
                    .catch(() => onError(this.comics[i]))
                    .finally(() => always(this.comics[i]))
            )
        }
        return Promise.all(promises)
    }

    public removeFromLibrary(
        before: (x: MarvelComic) => void,
        onComicAdded: (x: MarvelComic) => void,
        onError: (x: MarvelComic) => void,
        always: (x: MarvelComic) => void
    ) {
        const promises = []
        for (let i = 0; i < this.comics.length; i++) {
            before(this.comics[i])
            promises.push(
                this.comics[i].removeFromLibrary()
                    .then(() => onComicAdded(this.comics[i]))
                    .catch(() => onError(this.comics[i]))
                    .finally(() => always(this.comics[i]))
            )
        }
        return Promise.all(promises)
    }

    /**
     * Build a MarvelComicCollection from an event id
     * Example : https://www.marvel.com/comics/events/238/civil_war => Event ID 238
     * @param eventId
     * @param includeTieInIssues
     */
    public static buildFromMarvelEvent(eventId: number, includeTieInIssues = false): Promise<MarvelComicCollection> {
        const fetchers = [fetch('https://www.marvel.com/comics/list/coreissue/?id=' + eventId).then(r => r.text())]

        if (includeTieInIssues) {
            fetchers.push(fetch('https://www.marvel.com/comics/list/tiein/?id=' + eventId).then(r => r.text()))
        }

        return Promise.all(fetchers)
            .then(([coreIssueDOM, tieIssueDOM]) => this.domToComicCollection(coreIssueDOM + tieIssueDOM, MarvelComicCollectionType.event, eventId))
    }

    /**
     * Build a MarvelComicCollection from an series id
     * Example : https://www.marvel.com/comics/series/21692/civil_war_ii_choosing_sides_2016 => Series ID 21692
     * @param seriesId
     */
    public static buildFromMarvelSeries(seriesId: number): Promise<MarvelComicCollection> {
        return fetch('https://www.marvel.com/comics/show_more?offset=0&tpl=..%2Fpartials%2Fcomic_issue%2Fcomics_singlerow_item.mtpl&byType=comic_series&limit=100000&isDigital=1&byId=' + seriesId)
            .then(r => r.json())
            .then((issuesDOM) => this.domToComicCollection(issuesDOM.output, MarvelComicCollectionType.series, seriesId))
    }

    /**
     * Build a MarvelComicCollection from DOM
     * @param dom
     * @param collectionType
     * @param collectionId
     * @protected
     */
    protected static domToComicCollection(dom: string, collectionType: MarvelComicCollectionType, collectionId: number): MarvelComicCollection {
        console.log('MUS domToComicCollection')
        const comics: MarvelComic[] = []
        const tmpNode = document.createElement('div')
        tmpNode.innerHTML = dom
        const comicsNodes = tmpNode.getElementsByClassName('row-item-image')
        for (let i = 0; i < comicsNodes.length; i++) {
            let comic = MarvelComic.initFromHtml(comicsNodes[i] as HTMLElement);
            if (comic != null) {
                comics.push(comic)
            } else {
                console.log('mus', comic)
            }
        }
        return new MarvelComicCollection(comics, collectionType, collectionId)
    }
}
