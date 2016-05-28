
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

var BaseModel = (function() {
    
    
    function addondelete(func) {
        this._delete.todo.push(func);
    }
    
    function removeondelete(func) {
        var pos = this._delete.todo.indexOf(func);
        if ( pos != -1 ) {
            this._delete.todo.splice(pos, 1);
        }
    }
    
    function doondelete() {
        for ( var i = 0; i < this._delete.todo.length; i++ ) {
            this._delete.todo[i]();
        }
        this._delete.todo = [];
    }
    
    function _deleteworker() {
        if ( this.model && this.id ) {
            var globRef = this.model.toUpperCase();
            if ( window[globRef] && window[globRef][this.id] ) {
                delete window[globRef][this.id];
            }
            if ( STORAGE[this.model] && STORAGE[this.model][this.id] ) {
                delete STORAGE[this.model][this.id];
            }
        }
        this.doondelete();
    }
    
    function del() {
        this._deleteworker();
        window.saveState();
    }
    
    
    function _saveRepresintation() { return {}; }// rewritable functions
    function _loadRepresintation(data) {}
    
    function saveState() {
        if ( this.model && this.id ) {
            STORAGE[this.model] = STORAGE[this.model] || {};
            STORAGE[this.model][this.id] = this._saveRepresintation();
        }
        window.saveState();
    }
    function loadState() {
        if ( this.model && this.id && STORAGE[this.model] && STORAGE[this.model][this.id] ) {
            this._loadRepresintation(STORAGE[this.model][this.id]);
        }
    }
    
    
    return function() {
        this._delete = {
            todo: [],
        }
        this.addondelete = addondelete;
        this.removeondelete = removeondelete;
        this.doondelete = doondelete;
        this._deleteworker = _deleteworker;
        this.delete = del;
        this._saveRepresintation = _saveRepresintation;
        this._loadRepresintation = _loadRepresintation;
        this.saveState = saveState;
        this.loadState = loadState;
    }
})();

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







