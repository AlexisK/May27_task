
function toLen(str, len) {
    return new Array(len-str.length+1).join('0')+str;
}

window.carIter = {
    num: 41,
    get: function() { return toLen((carIter.num+=1).toString(),4); }
};

function Vehicle(taglist) {
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.id = 'VH-'+carIter.get();
        self.taglist = taglist;
    }
    
    self.copy = function() {
        return new Vehicle(taglist.slice());
    }
    
    self.init();
}
