
function Parking() {
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.priority_by_tag = {};
        self.slot_by_type = {};
    }
    
    self.getSlotByTag = function(tag) {
        
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
    
    self.addSlots = function(name, quantity, tagqueue) {
        self.slot_by_type[name] = new SlotSet({
            max: quantity,
            tagqueue: tagqueue
        });
        
    }
    
    self.register = function(vehicle) {
        
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
        
    }
    
    self.init();
}
