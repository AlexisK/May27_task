
window.PARKING = {};

function Parking(name) {
    var self = getSelf(this);
    self.inherit(BaseModel);
    self.model = 'Parking';
    
    self.init = function() {
        self.id = name;
        self.priority_by_tag = {};
        self.slot_by_type = {};
        PARKING[name] = self;
    }
    
    self._getSlotByTag = function(tag) {
        
        var priorityFound = Infinity;// JavaScript can, why not?
        var result = null;
        
        for ( var key in self.slot_by_type ) {
            var slotSet = self.slot_by_type[key];
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
    
    self._getSlotByVehicle = function(vehicle) {
        var place = null;
        for ( var i = 0; i < vehicle.taglist.length; i++ ) {
            var tag = vehicle.taglist[i];
            place = self._getSlotByTag(tag);
            if ( place ) { return place; }
        }
        return place;
    }
    
    self.addSlots = function(name, quantity, tagqueue) {
        self.slot_by_type[name] = new SlotSet({
            name: name,
            max: quantity,
            tagqueue: tagqueue
        });
        
    }
    
    self.register = function(vehicle) {
        var place = self._getSlotByVehicle(vehicle);
        if ( !place ) {
            console.log('No place for ',vehicle);
            return false;
        }
        
        place.addVehicle(vehicle);
        self.saveState();
    }
    
    self.clear = function(index) {
        for ( var key in self.slot_by_type ) {
            var slotSet = self.slot_by_type[key];
            slotSet.clear();
        }
        self.saveState();
    }
    
    self._saveRepresintation = function() {
        var saveObj = {};
        
        for ( var key in self.slot_by_type ) {
            saveObj[key] = self.slot_by_type[key].getSerializedList();
        }
        
        return saveObj;
    }
    
    self._loadRepresintation = function(data) {
        
        for ( var k in data ) {
            var vehicles = data[k].split(',');
            for ( var i = 0; i < vehicles.length; i++ ) {
                var vehicle = VEHICLE[vehicles[i]];
                if ( vehicle ) {
                    self.slot_by_type[k].addVehicle(vehicle, i);
                }
            }
            
        }
    }
    
    self.yieldState = function() {
        for ( k in self.slot_by_type ) {
            console.log(['\nState for ',k,' parking group'].join(''));
            self.slot_by_type[k].yieldState();
        }
    }
    
    self._createDom = function() {
        self.dom = cr('div','parking');
        
        for ( k in self.slot_by_type ) {
            self.dom.appendChild(self.slot_by_type[k].getDom());
        }
        
        return self.dom;
    }
    
    self.getDom = function() {
        return self.dom || self._createDom();
    }
    
    self.init();
}

Parking.saveState = BaseModel.ModelSaveStateMechanics(PARKING);
Parking.loadState = BaseModel.ModelLoadStateMechanics(PARKING);


