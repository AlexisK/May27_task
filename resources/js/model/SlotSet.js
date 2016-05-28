
var SlotSet = (function() {
    
    function init(data) {
        this.name = data.name;
        this.has = 0;
        this.max = data.max || 0;
        this.tagqueue = data.tagqueue || [];
        this.vehicles = new Array(this.max);
        this.vehicles_dom = new Array(this.max);
        this._createDom();
    }
    
    function addVehicle(vehicle, pos) {
        var self = this;
        
        if ( this.has == this.max ) { return false; }
        
        if ( !def(pos) ) {
            pos = 0;
            for ( ;this.vehicles[pos] != undefined; pos++ );
        }
        
        this.vehicles[pos] = vehicle;
        this.has += 1;
        
        vehicle._delete.slot = function() {
            self.removeVehicle(vehicle);
        }
        
        vehicle.addondelete(vehicle._delete.slot);
        
        this.vehicles_dom[pos].appendChild(vehicle.getDom());
        this.fetchString();
    }
    
    function removeVehicle(vehicle) {
        var pos = this.vehicles.indexOf(vehicle);
        if ( pos != -1 ) {
            delete this.vehicles[pos];
            this.has -= 1;
            
            vehicle.removeondelete(vehicle._delete.slot);
            
            this.vehicles_dom[pos].textContent = '';
            this.fetchString();
        }
    }
    
    function getPriorityFor(tag) {
        if ( this.has == this.max ) { return -1; }
        return this.tagqueue.indexOf(tag);
    }
    
    function yieldState() {
        console.log([locale.filled_with_vehicles[0],' ',this.has,'/',this.max,' ',locale.filled_with_vehicles[1],': {'].join(''));
        for ( var i = 0; i < this.max; i++ ) {
            var vehicle = this.vehicles[i];
            if ( vehicle == undefined ) {
                console.log('\t---------');
            } else {
                console.log(['\t',vehicle.id,' ',vehicle.taglist.join(', ')].join(''));
            }
        }
        console.log('}');
    }
    
    function getSerializedList() {
        return this.vehicles.join(',');
    }
    
    function clear() {
        for ( var i = 0; i < this.max; i++ ) {
            var vehicle = this.vehicles[i];
            vehicle && vehicle.delete();
        }
        this.vehicles = new Array(this.max);
        this.has = 0;
    }
    
    
    function _createDom() {
        this.dom = cr('div','slot-set');
        
        this.textlabel = cr('div','slot-name', this.dom);
        this.fetchString();
        
        for ( var i = 0; i < this.max; i++ ) {
            this.vehicles_dom[i] = cr('div', 'slot', this.dom);
        }
        
        return this.dom;
    }
    
    function fetchString() {
        this.textlabel.textContent = [this.name,' ',this.has,'/',this.max].join('');
    }
    
    function getDom() {
        return this.dom;
    }
    
    return function(data) {
        var self = getSelf(this);
        self.inherit(BaseModel);
        
        self.init = init;
        self.addVehicle = addVehicle;
        self.removeVehicle = removeVehicle;
        self.getPriorityFor = getPriorityFor;
        self.yieldState = yieldState;
        self.getSerializedList = getSerializedList;
        self.clear = clear;
        self._createDom = _createDom;
        self.fetchString = fetchString;
        self.getDom = getDom;
        
        self.init(data);
    }
    
})();



