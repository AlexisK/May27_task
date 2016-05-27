
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
    
    self._createDom = function() {
        var tagstr = self.taglist.join(' ');
        self.dom = cr('div','vehicle '+tagstr);
        
        self.textlabel = cr('div', 'label', self.dom);
        self.textlabel.textContent = [self.id, tagstr].join(' ');
        
        return self.dom;
    }
    
    self.getDom = function() {
        return self.dom || self._createDom();
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
