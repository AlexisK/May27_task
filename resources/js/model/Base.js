
function inherit(ref, args) {
    if ( !this._inherits || this._inherits.indexOf(ref) != -1 ) { return 0; }
    ref.apply(this, args);
    this._inherits.push(ref);
    
}

function getSelf(ref) {
    ref._inherits = ref._inherits||[];
    
    ref.inherit = inherit;
    
    return ref;
}

function BaseModel() {
    var self = getSelf(this);
    
    
}
