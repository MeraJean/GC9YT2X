function hag() {
    let key = getQueryVariable("k");
    if (!key || key.length != 120) {
        document.body.innerText = "Invalid key";
        return;
    }

    let step = parseInt(getQueryVariable("s"));
    if (!Number.isInteger(step) || step <= 0) {
        document.body.innerText = "Invalid step";
        return;
    }

    fetch(`./${step}/content.txt`, {
        "referrer": "",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    }).then((res) => {
        res.text().then((text) => {
            document.body.innerText = decrypt(text, key);
        });
    });
}

function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

let characters = [...Array(95).keys()].map(i => String.fromCharCode(i+32))
characters = characters.concat(characters).concat(characters);

function encrypt(text, key) {
    let result = "";
    let keyIdx = 0;

    for (let char of text) {
        result += characters[characters.indexOf(char) + 95 + parseInt(key[keyIdx])];
        keyIdx++;
        if (keyIdx == key.length) keyIdx = 0;
    }

    return result;
}

function decrypt(text, key) {
    let result = "";
    let keyIdx = 0;

    for (let char of text) {
        result += characters[characters.indexOf(char) + 95 - parseInt(key[keyIdx])];
        keyIdx++;
        if (keyIdx == key.length) keyIdx = 0;
    }

    return result;
}