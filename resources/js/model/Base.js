
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
    
    self._delete = {
        todo: [],
    }
    
    self.addondelete = function(func) {
        self._delete.todo.push(func);
    }
    
    self.removeondelete = function(func) {
        var pos = self._delete.todo.indexOf(func);
        if ( pos != -1 ) {
            self._delete.todo.splice(pos, 1);
        }
    }
    
    self.doondelete = function() {
        for ( var i = 0; i < self._delete.todo.length; i++ ) {
            self._delete.todo[i]();
        }
        self._delete.todo = [];
    }
    
}
