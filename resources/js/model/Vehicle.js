
function Vehicle(taglist) {
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.taglist = taglist;
    }
    
    self.copy = function() {
        return new Vehicle(taglist.slice());
    }
    
    self.init();
}
