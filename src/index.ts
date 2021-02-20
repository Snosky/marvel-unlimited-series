import AddToLibraryButton from "./AddToLibraryButton"
import MarvelSeries from "./MarvelSeries"
import MarvelEvents from "./MarvelEvents"
import ProgressBar from "./ProgressBar"
import SimpleLogger from "./SimpleLogger"
import IssueCollection from "./IssueCollection"
import RemoveFromLibraryButton from "./RemoveFromLibraryButton"

declare const process : {
    env: {
        RATE_URL: string
    }
}

(async function() {
    const addToLibraryButton = new AddToLibraryButton()
    const removeFromLibraryButton = new RemoveFromLibraryButton()
    let loggedIn = false

    let issueCollection: IssueCollection
    let buttonParentNode: HTMLElement
    if (location.href.match('^.*\/events\/[0-9]+.*$')) {
        const eventId = parseInt(location.href.match('^.*\/events\/([0-9]+).*$')[1])
        issueCollection = new MarvelEvents(eventId)
        buttonParentNode = document.querySelector('#comics-eventsdetail > div.header-box.grid-container > div > div.details-right')
    } else if (location.href.match('^.*\/series\/[0-9]+.*$')) {
        const seriesId = parseInt(location.href.match('^.*\/series\/([0-9]+).*$')[1])
        issueCollection = new MarvelSeries(seriesId)
        buttonParentNode = document.querySelector('.module .featured-item-info-wrap .featured-item-text') as HTMLElement
    }

    addToLibraryButton.appendTo(buttonParentNode)
    addToLibraryButton.toggleLoading()

    if (!sessionStorage.getItem('marvelUserData')) {
        addToLibraryButton.setErrorText('Please connect to your account.')
        throw new Error('Session marvelUserData not found.')
    }

    try {
        loggedIn = JSON.parse(sessionStorage.getItem('marvelUserData')).loggedIn
    } catch (e) {
        addToLibraryButton.setErrorText('You must be logged in.')
        throw new Error('mavelUserData\'s parsing failed')
    }
    if (!loggedIn) {
        addToLibraryButton.setErrorText('You must be logged in.')
        throw new Error('User not logged in.')
    }

    await issueCollection.loadIssues()

    if (!issueCollection.comicsCount()) {
        addToLibraryButton.setCustomText('No Marvel Unlimited comics found.')
        return
    }
    addToLibraryButton.setDefaultText(issueCollection.comicsCount())
    removeFromLibraryButton.appendTo(buttonParentNode)

    const progressBar = new ProgressBar(issueCollection.comicsCount())
    const simpleLogger = new SimpleLogger(process.env.RATE_URL)

    addToLibraryButton.onClick(() => {
        progressBar.appendTo(buttonParentNode).resetProgress()
        simpleLogger.appendTo(buttonParentNode).reset()

        addToLibraryButton.disable()
        removeFromLibraryButton.disable()

        issueCollection.addIssuesToLibrary(
            comic => simpleLogger.addLog(comic.title + ' ...', comic.id),
            comic => simpleLogger.addLog(comic.title + ' successfully added !', comic.id),
            comic => simpleLogger.addLog(comic.title + ' error !!', comic.id),
            comic => {
                progressBar.addProgress()
                if (progressBar.isFinished) {
                    addToLibraryButton.enable()
                    removeFromLibraryButton.enable()
                }
            }
        )
    })

    removeFromLibraryButton.onClick(() => {
        progressBar.appendTo(buttonParentNode).resetProgress()
        simpleLogger.appendTo(buttonParentNode).reset()

        addToLibraryButton.disable()
        removeFromLibraryButton.disable()

        issueCollection.removeFromLibrary(
            comic => simpleLogger.addLog(comic.title + ' ...', comic.id),
            comic => simpleLogger.addLog(comic.title + ' successfully removed !', comic.id),
            comic => simpleLogger.addLog(comic.title + ' error !!', comic.id),
            comic => {
                progressBar.addProgress()
                if (progressBar.isFinished) {
                    addToLibraryButton.enable()
                    removeFromLibraryButton.enable()
                }
            }
        )
    })
})();
