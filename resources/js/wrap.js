
function def(val) { return typeof(val) != 'undefined' && val !== null; }

function cr(tag, cls, parent) {
    var elem = document.createElement(tag);
    if ( def(cls) ) { elem.className = cls; }
    if ( def(parent) ) { parent.appendChild(elem); }
    return elem;
}

