
window.STORAGE = {};

function saveState() {
    localStorage.state = JSON.stringify(STORAGE);
}

function loadState() {
    try {
        STORAGE = JSON.parse(localStorage.state);
    } catch(err) {}
    // error on empty storage - nothing to do
}
