
function toLen(str, len) {
    return new Array(len-str.length+1).join('0')+str;
}

window.carIter = {
    num: 41,
    get: function() { return toLen((carIter.num+=1).toString(),4); }
};


window.VEHICLE = {};


function Vehicle(taglist, id) {// id is optional, used to restore vehicles
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        
        self.id = id || 'VH-'+carIter.get();
        self.taglist = self._normalizeTags(taglist);
        VEHICLE[self.id] = self;
        self.save();
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
        return new Vehicle(taglist.slice());
    }
    
    self.save = function() {
        STORAGE.Vehicle = STORAGE.Vehicle || {};
        STORAGE.Vehicle[self.id] = {
            taglist: self.taglist.join(',')
        }
        SaveState();
    }
    
    self.delete = function() {
        delete VEHICLE[self.id];
        delete STORAGE.Vehicle[self.id];
        self.doondelete();
        SaveState();
    }
    
    self.init();
}

Vehicle.prototype.toString = function() {
    return this.id;
}

Vehicle.restore = function() {
    for ( var k in STORAGE.Vehicle ) {
        new Vehicle(STORAGE.Vehicle[k].taglist, k);
    }
}
