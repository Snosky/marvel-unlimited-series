// Extract serie ID from the url
const serieId = location.href.match('^.*series\/([0-9]*).*$')[1];
if (!serieId) {
    throw new Error('Serie ID not found');
}

// Create button
const addToLibraryButton = document.createElement('a');
addToLibraryButton.classList.add('cta-btn', 'cta-btn--solid', 'cta-btn--red', 'active');
addToLibraryButton.setAttribute('aria-current', 'true');

addToLibraryButtonInside = document.createElement('div');
addToLibraryButtonInside.classList.add('innerFill');
addToLibraryButtonInside.innerText = 'Loading...';

addToLibraryButton.appendChild(addToLibraryButtonInside);


// Create log div
const logDiv = document.createElement('div');
logDiv.style.height = '200px';
logDiv.style.overflowY = 'auto';
logDiv.style.background = '#e62429';
logDiv.style.color = '#FFF';
logDiv.style.display = 'none';

// Display button and logDiv
const buttonParentNode = document.querySelector('.module .featured-item-info-wrap .featured-item-text');
if (buttonParentNode) {
    buttonParentNode.appendChild(addToLibraryButton);
    buttonParentNode.appendChild(logDiv);
}

let comicsNumber = 0;
// Get number of comics in the series
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.marvel.com/comics/show_more?offset=0&tpl=..%2Fpartials%2Fcomic_issue%2Fcomics_singlerow_item.mtpl&byType=comic_series&limit=1&isDigital=1&byId=' + serieId);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        try {
            let responseJson = JSON.parse(xhr.responseText);
            if (responseJson.count) {
                comicsNumber = responseJson.count;
                addToLibraryButtonInside.innerText = 'Add ' + comicsNumber + ' issue' + (comicsNumber > 0 ? 's' : '') + ' to Library'
                registerAddEvent();
            } else {
                addToLibraryButtonInside.innerText = 'No Marvel Unlimited comics in this series.'
            }
        } catch (e) {
            addToLibraryButtonInside.innerText = 'An error occured.';
            throw new Error('Failed parse JSON');
        }
    }
};
xhr.send();

const registerAddEvent = function () {
    addToLibraryButton.addEventListener('click', function (e) {
        e.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                try {
                    const responseJson = JSON.parse(xhr.responseText);
                    addToLibrary(responseJson.output);
                } catch (e) {
                    addToLibraryButtonInside.innerText = 'An error occured.';
                    throw new Error('Failed parse JSON');
                }
            }
        }; // Implemented elsewhere.
        xhr.open('GET', 'https://www.marvel.com/comics/show_more?offset=0&tpl=..%2Fpartials%2Fcomic_issue%2Fcomics_singlerow_item.mtpl&byType=comic_series&limit=' + comicsNumber + '&isDigital=1&byId=' + serieId, true);
        xhr.send();
    });
};

const addToLibrary = function(html) {
    let comicsIds = [...html.matchAll(/<a href=".*www\.marvel.com\/comics\/issue\/([0-9]*)/gm)];
    logDiv.innerHTML = '';
    logDiv.style.display = 'block';
    for (let i = 0; i < comicsIds.length; i++) {
        if (!comicsIds[i][1]) continue;

        let p = document.createElement('p');
        p.innerText = 'Adding ' + comicsIds[i][1] + '...';
        logDiv.appendChild(p);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 201) {
                    p.innerText = comicsIds[i][1] + ' added to library !';
                } else {
                    p.innerText = comicsIds[i][i] + ' error !!!';
                }
            }
        };
        xhr.open('POST', 'https://www.marvel.com/my_account/my_must_reads', true);

        let formData = new FormData();
        formData.append('id', comicsIds[i][1]);
        xhr.send(formData);
        break;
    }
};


