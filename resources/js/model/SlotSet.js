
function SlotSet(data) {
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.has = 0;
        self.max = data.max || 0;
        self.tagqueue = data.tagqueue || [];
        self.vehicles = new Array(self.max);
        self.vehicles_dom = new Array(self.max);
        self._createDom();
    }
    
    self.addVehicle = function(vehicle, pos) {
        if ( self.has == self.max ) { return false; }
        
        if ( !def(pos) ) {
            pos = 0;
            for ( ;self.vehicles[pos] != undefined; pos++ );
        }
        
        self.vehicles[pos] = vehicle;
        self.has += 1;
        
        vehicle._delete.slot = function() {
            self.removeVehicle(vehicle);
        }
        
        vehicle.addondelete(vehicle._delete.slot);
        
        self.vehicles_dom[pos].className = 'vehicle '+vehicle.taglist.join(' ');
    }
    
    self.removeVehicle = function(vehicle) {
        var pos = self.vehicles.indexOf(vehicle);
        if ( pos != -1 ) {
            delete self.vehicles[pos];
            self.has -= 1;
            
            vehicle.removeondelete(vehicle._delete.slot);
            
            self.vehicles_dom[pos].className = 'vehicle hidden';
        }
    }
    
    self.getPriorityFor = function(tag) {
        if ( self.has == self.max ) { return -1; }
        return self.tagqueue.indexOf(tag);
    }
    
    self.yieldState = function() {
        console.log(['Currently filled with ',self.has,'/',self.max,' vehicles: {'].join(''));
        for ( var i = 0; i < self.max; i++ ) {
            var vehicle = self.vehicles[i];
            if ( vehicle == undefined ) {
                console.log('\t---------');
            } else {
                console.log(['\t',vehicle.id,' ',vehicle.taglist.join(', ')].join(''));
            }
        }
        console.log('}');
    }
    
    self.getSerializedList = function() {
        return self.vehicles.join(',');
    }
    
    self.clear = function() {
        for ( var i = 0; i < self.max; i++ ) {
            var vehicle = self.vehicles[i];
            vehicle && vehicle.delete();
        }
        self.vehicles = new Array(self.max);
        self.has = 0;
    }
    
    
    self._createDom = function() {
        self.dom = cr('div','slot-set');
        
        for ( var i = 0; i < self.max; i++ ) {
            self.vehicles_dom[i] = cr('div','vehicle hidden', cr('div', 'slot', self.dom) );
        }
        
        return self.dom;
    }
    
    self.getDom = function() {
        return self.dom;
    }
    
    self.init();
}

