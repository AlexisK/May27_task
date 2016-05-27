
// Tag is model in order to use fast reference to it (orr add functionality later)

window.TAG = {};

function Tag(name) {
    this.name = name;
    TAG[name] = this;
}

Tag.prototype.toString = function() { return this.name; }

Tag.fetch = function(name) {
    return TAG[name] || new Tag(name);
}
