
function toLen(str, len) {
    return new Array(len-str.length+1).join('0')+str;
}

window.carIter = {
    get: function() {
        var num = STORAGE.carId||41
        num+=1;
        STORAGE.carId = num;
        return toLen(num.toString(),4);
    }
};


window.VEHICLE = {};


var Vehicle = (function() {
    
    function init(id) {
        
        this.id = id || [config.vehicle_id_prefix,carIter.get()].join('-');
        VEHICLE[this.id] = this;
        this.saveState();
        
        return this;
    }
    
    function _normalizeTags(taglist) {
        taglist = taglist || [];
        if ( typeof(taglist) == 'string' ) {
            var list = taglist.split(',');
            taglist = [];
            for ( var i = 0; i < list.length; i++ ) {
                taglist.push(TAG[list[i]]);
            }
        }
        return taglist;
    }
    
    function copy() {
        return new Vehicle(taglist.slice()).init();
    }
    
    function _saveRepresintation() {
        return {
            taglist: this.taglist.join(',')
        }
    }
    
    function _createDom() {
        var tagstr = this.taglist.join(' ');
        this.dom = cr('div','vehicle '+tagstr);
        
        this.textlabel = cr('div', 'label', this.dom);
        this.textlabel.textContent = [this.id, tagstr].join(' ');
        
        return this.dom;
    }
    
    function getDom() {
        return this.dom || this._createDom();
    }
    
    return function(taglist) {
        var self = getSelf(this);
        self.inherit(BaseModel);
        self.model = 'Vehicle';
        
        self.init = init;
        self._normalizeTags = _normalizeTags;
        self.copy = copy;
        self._saveRepresintation = _saveRepresintation;
        self._createDom = _createDom;
        self.getDom = getDom;
        
        self.taglist = self._normalizeTags(taglist);
    }
    
})();

Vehicle.prototype.toString = function() {
    return this.id;
}

Vehicle.saveState = BaseModel.ModelSaveStateMechanics(VEHICLE);

Vehicle.loadState = function() {
    for ( var k in STORAGE.Vehicle ) {
        new Vehicle(STORAGE.Vehicle[k].taglist).init(k);
    }
}
