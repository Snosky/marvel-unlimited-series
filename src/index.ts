import templateHtml from './template.html'
import AddToLibraryButton from './AddToLibraryButton'
import MarvelComicCollection from './MarvelComicCollection'
import Parameters, {AvailableParameter} from './Parameters'
import ProgressBar from './ProgressBar'
import SimpleLogger from './SimpleLogger'
import RemoveFromLibraryButton from './RemoveFromLibraryButton'

declare const process : {
    env: {
        RATE_URL: string;
    }
}
enum PageType {
    'events' = 'events',
    'series' = 'series'
}

let match: RegExpMatchArray
let pageType: PageType
if ((match = location.href.match('^.*\/events\/([0-9]+).*$'))) {
    pageType = PageType.events
} else if ((match = location.href.match('^.*\/series\/([0-9]+).*$'))) {
    pageType = PageType.series
}

if (!pageType) {
    throw '[MUS]No page type found'
}

let id = parseInt(match[1])

/** Set template **/
const template = document.createElement('div')
template.innerHTML = templateHtml
const parentNode = document.querySelector(pageType === PageType.events
        ? '#page-content .grid-container .details-right'
        : '.module .featured-item-info-wrap .featured-item-text'
    )
parentNode.append(template)

const addToLibraryButton = new AddToLibraryButton(template)
const removeFromLibraryButton = new RemoveFromLibraryButton(template)
const parameters = new Parameters(template)
const simpleLogger = new SimpleLogger(template, process.env.RATE_URL)
const progressBar = new ProgressBar(template)
let marvelCollection: MarvelComicCollection|undefined

function onParameterChange() {
    addToLibraryButton.loading().disable()
    simpleLogger.reset().hide()
    progressBar.reset().hide()
    parameters.disable()

    const promise = pageType === PageType.events
        ? MarvelComicCollection.buildFromMarvelEvent(id, parameters.get(AvailableParameter.includeTieInIssues) as boolean)
        : MarvelComicCollection.buildFromMarvelSeries(id)

    return promise.then((collection) => {
        marvelCollection = collection
        addToLibraryButton.addToLibrary(marvelCollection.count()).enable()
        parameters.enable()
    })
}

/** Check if user logged in **/
try {
    const marvelUserData = sessionStorage.getItem('marvelUserData')
    const marvelUserDataJson = JSON.parse(marvelUserData)
    if (!marvelUserDataJson.loggedIn) {
        throw 'User not logged in'
    }
} catch (e) {
    addToLibraryButton.setText('You must be logged in')
    console.error('[MUS]', e)
    throw e
}

parameters.onChange((parameter, value) => {
    parameters.disable()
    onParameterChange().then(() => {
        parameters.enable()
        console.log('MUS parameters updated')
    })
})

addToLibraryButton.onClick(() => {
    if (marvelCollection && marvelCollection.count()) {
        addToLibraryButton.disable()
        parameters.disable()
        removeFromLibraryButton.disable()

        progressBar.reset().show().max(marvelCollection.count())
        simpleLogger.reset().show()

        marvelCollection.addToLibrary(
            comic => simpleLogger.addLog(comic.title + ' ...', comic.id),
            comic => simpleLogger.addLog(comic.title + ' successfully added !', comic.id),
            comic => simpleLogger.addLog(comic.title + ' error !!', comic.id),
            comic => progressBar.addProgress()
        ).then(() => {
            addToLibraryButton.enable()
            parameters.enable()
            removeFromLibraryButton.enable()
        })
    }
})

removeFromLibraryButton.onClick(() => {
    if (marvelCollection && marvelCollection.count()) {
        addToLibraryButton.disable()
        parameters.disable()
        removeFromLibraryButton.disable()

        progressBar.reset().show().max(marvelCollection.count())
        simpleLogger.reset().show()

        marvelCollection.removeFromLibrary(
            comic => simpleLogger.addLog(comic.title + ' ...', comic.id),
            comic => simpleLogger.addLog(comic.title + ' successfully removed !', comic.id),
            comic => simpleLogger.addLog(comic.title + ' error !!', comic.id),
            comic => progressBar.addProgress()
        ).then(() => {
            addToLibraryButton.enable()
            parameters.enable()
            removeFromLibraryButton.enable()
        })
    }
})

onParameterChange().then(() => {
    if (pageType === PageType.events) {
        parameters.show()
    }
    removeFromLibraryButton.show()
    console.debug('[MUS]Loaded', pageType, id)
})

