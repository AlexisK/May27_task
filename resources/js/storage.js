
window.STORAGE = {};

function SaveState() {
    localStorage.state = JSON.stringify(STORAGE);
}

function LoadState() {
    try {
        STORAGE = JSON.parse(localStorage.state);
    } catch(err) {}
    // error on empty storage - nothing to do
}
