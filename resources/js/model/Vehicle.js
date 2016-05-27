
function toLen(str, len) {
    return new Array(len-str.length+1).join('0')+str;
}

window.carIter = {
    num: 41,
    get: function() { return toLen((carIter.num+=1).toString(),4); }
};

STORAGE.Vehicle = STORAGE.Vehicle || {};

function Vehicle(taglist, id) {// id is optional, used to restore vehicles
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.id = id || 'VH-'+carIter.get();
        self.taglist = taglist;
        self.save();
    }
    
    self.copy = function() {
        return new Vehicle(taglist.slice());
    }
    
    self.save = function() {
        STORAGE.Vehicle[self.id] = {
            taglist: self.taglist
        }
        SaveState();
    }
    
    self.init();
}

Vehicle.restore = function() {
    for ( var k in STORAGE.Vehicle ) {
        new Vehicle(STORAGE.Vehicle[k].taglist, k);
    }
}
