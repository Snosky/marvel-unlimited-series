import AddToLibraryButton from "./AddToLibraryButton";
import MarvelSeries from "./MarvelSeries";
import ProgressBar from "./ProgressBar";
import MarvelComic from "./MarvelComic";
import SimpleLogger from "./SimpleLogger";
import AdvancedLogger from "./AdvancedLogger";

(async function(){
    const addToLibraryButton = new AddToLibraryButton();
    addToLibraryButton.toggleLoading();

    const buttonParentNode = document.querySelector('.module .featured-item-info-wrap .featured-item-text') as HTMLElement;
    if (buttonParentNode) {
        addToLibraryButton.appendTo(buttonParentNode)
    }

    const seriesId = parseInt(location.href.match('^.*series\/([0-9]*).*$')[1]);
    if (!seriesId) {
        addToLibraryButton.setErrorText('Series ID not found.');
        throw new Error('Series ID not found');
    }

    let loggedIn = false;
    if (!sessionStorage.getItem('marvelUserData')) {
        addToLibraryButton.setErrorText('Session marvelUserData not found. Please connect to your account.');
        throw new Error('Session marvelUserData not found.')
    }

    try {
        loggedIn = JSON.parse(sessionStorage.getItem('marvelUserData')).loggedIn
    } catch (e) {
        addToLibraryButton.setErrorText('You must be logged in.');
        throw new Error('mavelUserData\'s parsing failed');
    }
    if (!loggedIn) {
        addToLibraryButton.setErrorText('You must be logged in.');
        throw new Error('User not logged in.')
    }

    const series = new MarvelSeries(seriesId);
    if (!await series.init()) {
        addToLibraryButton.setErrorText(' Failed parsing JSON.');
        throw new Error('Failed parsing JSON on series init');
    }
    if (series.getComicNb()) {
        addToLibraryButton.setCustomText('No Marvel Unlimited comics in this series.');
        return;
    } else {
        addToLibraryButton.setDefaultText(series.getComicNb());
    }

    const progressBar = new ProgressBar(series.getComicNb());
    const simpleLogger = new SimpleLogger();
    const advancedLogger = new AdvancedLogger();
    addToLibraryButton.onClick(() => {
        progressBar.appendTo(buttonParentNode);
        simpleLogger.appendTo(buttonParentNode);

        series.addToLibrary(
            (comic) => {
                simpleLogger.addLog(comic.title + ' ...', comic.id);
            },
            (comic) => {
                simpleLogger.addLog(comic.title + ' successfully added !', comic.id);
            },
            (comic) => {
                simpleLogger.addLog(comic.title + ' error !!', comic.id);
            },
            (comic: MarvelComic) => {
                progressBar.addProgress();
                if (progressBar.isFinished) {
                    advancedLogger.appendButtonTo(buttonParentNode);
                }
            }
        );
    });
})();