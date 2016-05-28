
window.PARKING = {};

var Parking = (function(){
    
    function init(name) {
        this.id = name;
        this.priority_by_tag = {};
        this.slot_by_type = {};
        PARKING[name] = this;
    }
    
    function _getSlotByTag(tag) {
        
        var priorityFound = Infinity;// JavaScript can, why not?
        var result = null;
        
        for ( var key in this.slot_by_type ) {
            var slotSet = this.slot_by_type[key];
            var prio = slotSet.getPriorityFor(tag);
            if ( prio != -1 ) {
                if ( prio == 0 ) { return slotSet; }
                if ( !result || prio < priorityFound ) {
                    priorityFound = prio;
                    result = slotSet;
                }
            }
        }
        
        return result;
    }
    
    function _getSlotByVehicle(vehicle) {
        var place = null;
        for ( var i = 0; i < vehicle.taglist.length; i++ ) {
            var tag = vehicle.taglist[i];
            place = this._getSlotByTag(tag);
            if ( place ) { return place; }
        }
        return place;
    }
    
    function addSlots(name, quantity, tagqueue) {
        this.slot_by_type[name] = new SlotSet({
            name: name,
            max: quantity,
            tagqueue: tagqueue
        });
        
    }
    
    function register(vehicle) {
        var place = this._getSlotByVehicle(vehicle);
        if ( !place ) {
            console.log(locale.no_place_for,vehicle);
            return false;
        }
        
        place.addVehicle(vehicle);
        this.saveState();
        return true;
    }
    
    function clear() {
        for ( var key in this.slot_by_type ) {
            var slotSet = this.slot_by_type[key];
            slotSet.clear();
        }
        this.saveState();
    }
    
    function _saveRepresintation() {
        var saveObj = {};
        
        for ( var key in this.slot_by_type ) {
            saveObj[key] = this.slot_by_type[key].getSerializedList();
        }
        
        return saveObj;
    }
    
    function _loadRepresintation(data) {
        
        for ( var k in data ) {
            var vehicles = data[k].split(',');
            for ( var i = 0; i < vehicles.length; i++ ) {
                var vehicle = VEHICLE[vehicles[i]];
                if ( vehicle && this.slot_by_type[k] ) {
                    this.slot_by_type[k].addVehicle(vehicle, i);
                }
            }
            
        }
    }
    
    function yieldState() {
        for ( k in this.slot_by_type ) {
            console.log(['\n',locale.state_parking_group[0],' ',k,' ',locale.state_parking_group[1]].join(''));
            this.slot_by_type[k].yieldState();
        }
    }
    
    function _createDom() {
        this.dom = cr('div','parking');
        
        for ( k in this.slot_by_type ) {
            this.dom.appendChild(this.slot_by_type[k].getDom());
        }
        
        return this.dom;
    }
    
    function getDom() {
        return this.dom || this._createDom();
    }
    
    return function(name) {
        var self = getSelf(this);
        self.inherit(BaseModel);
        self.model = 'Parking';
        
        self.init = init;
        self._getSlotByTag = _getSlotByTag;
        self._getSlotByVehicle = _getSlotByVehicle;
        self.addSlots = addSlots;
        self.register = register;
        self.clear = clear;
        self._saveRepresintation = _saveRepresintation;
        self._loadRepresintation = _loadRepresintation;
        self.yieldState = yieldState;
        self._createDom = _createDom;
        self.getDom = getDom;
        
        self.init(name);
    };
    
})();

Parking.saveState = BaseModel.ModelSaveStateMechanics(PARKING);
Parking.loadState = BaseModel.ModelLoadStateMechanics(PARKING);


