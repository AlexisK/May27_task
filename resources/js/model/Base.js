
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
    
    self._deleteworker = function() {
        if ( self.model && self.id ) {
            var globRef = self.model.toUpperCase();
            if ( window[globRef] && window[globRef][self.id] ) {
                delete window[globRef][self.id];
            }
            if ( STORAGE[self.model] && STORAGE[self.model][self.id] ) {
                delete STORAGE[self.model][self.id];
            }
        }
        self.doondelete();
    }
    
    self.delete = function() {
        self._deleteworker();
        window.saveState();
    }
    
    
    self._saveRepresintation = function() { return {}; }// rewritable functions
    self._loadRepresintation = function(data) {}
    
    self.saveState = function() {
        if ( self.model && self.id ) {
            STORAGE[self.model] = STORAGE[self.model] || {};
            STORAGE[self.model][self.id] = self._saveRepresintation();
        }
        window.saveState();
    }
    self.loadState = function() {
        if ( self.model && self.id && STORAGE[self.model] && STORAGE[self.model][self.id] ) {
            self._loadRepresintation(STORAGE[self.model][self.id]);
        }
    }
    
}

BaseModel.ModelSaveStateMechanics = function(globalRef) {
    return function() {
        for ( var k in globalRef ) {
            globalRef[k].saveState();
        }
    }
}

BaseModel.ModelLoadStateMechanics = function(globalRef) {
    return function() {
        for ( var k in globalRef ) {
            globalRef[k].loadState();
        }
    }
}







