
function SlotSet(data) {
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.has = 0;
        self.max = data.max || 0;
        self.tagqueue = data.tagqueue || [];
        self.vehicles = new Array(self.max);
    }
    
    self.addVehicle = function(vehicle) {
        if ( self.has == self.max ) { return false; }
        var pos = 0;
        for ( ;self.vehicles[pos] != undefined; pos++ );
        self.vehicles[pos] = vehicle;
        self.has += 1;
    }
    
    self.removeVehicle = function(vehicle) {
        
    }
    
    self.getPriorityFor = function(tag) {
        if ( self.has == self.max ) { return -1; }
        return self.tagqueue.indexOf(tag);
    }
    
    self.yieldState = function() {
        console.log(['Currently filled with ',self.has,'/',self.max,' vehicles: {'].join(''));
        for ( var i = 0; i < self.vehicles.length; i++ ) {
            var vehicle = self.vehicles[i];
            if ( vehicle == undefined ) {
                console.log('\t---------');
            } else {
                console.log(['\t',vehicle.id,' ',vehicle.taglist.join(', ')].join(''));
            }
        }
        console.log('}');
    }
    
    self.init();
}

