
function Parking() {
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.priority_by_tag = {};
        self.slot_by_type = {};
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
    }
    
    self.clear = function(index) {
        
    }
    
    self.clearAll = function() {
        
    }
    
    self.restoreState = function() {
        
    }
    
    self.saveState = function() {
        
    }
    
    self.yieldState = function() {
        for ( k in self.slot_by_type ) {
            console.log(['\nState for ',k,' parking group'].join(''));
            self.slot_by_type[k].yieldState();
        }
    }
    
    self.init();
}
