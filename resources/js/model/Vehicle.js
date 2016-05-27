
function toLen(str, len) {
    return new Array(len-str.length+1).join('0')+str;
}

window.carIter = {
    num: 41,
    get: function() { return toLen((carIter.num+=1).toString(),4); }
};


window.VEHICLE = {};


function Vehicle(taglist) {// id is optional, used to restore vehicles
    var self = getSelf(this);
    self.inherit(BaseModel);
    self.model = 'Vehicle';
    
    self.init = function(id) {
        
        self.id = id || 'VH-'+carIter.get();
        self.taglist = self._normalizeTags(taglist);
        VEHICLE[self.id] = self;
        self.saveState();
        
        return self;
    }
    
    self._normalizeTags = function(taglist) {
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
    
    self.copy = function() {
        return new Vehicle(taglist.slice()).init();
    }
    
    self._saveRepresintation = function() {
        return {
            taglist: self.taglist.join(',')
        }
    }
    
}

Vehicle.prototype.toString = function() {
    return this.id;
}

Vehicle.saveState = BaseModel.ModelSaveStateMechanics(VEHICLE);

Vehicle.loadState = function() {
    for ( var k in STORAGE.Vehicle ) {
        new Vehicle(STORAGE.Vehicle[k].taglist).init(k);
    }
}
