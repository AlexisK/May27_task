
// Tag is model in order to use fast reference to it (orr add functionality later)

window.TAG = {};

function Tag(name) {
    this.name = name;
    TAG[name] = this;
}
