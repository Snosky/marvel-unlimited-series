import AdvancedLogger from "./AdvancedLogger";

export default class MyLibrary {
    public refresh() {
        return new Promise((resolve, reject) => {

        })
    }

    protected getMyMustReadDocument(page: number = 0) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://www.marvel.com/my_account/my_must_reads&limit=1000&offset=' + 1000 * page, true);
            xhr.onreadystatechange = () => {
                if (xhr.status === 200) {
                    console.log(xhr.response);
                    return resolve(xhr.response);
                } else {
                    return reject(xhr.responseText);
                }
            };
        })
    }
}
