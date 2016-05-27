
function def(val) { return typeof(val) != 'undefined' && val !== null; }


window.STORAGE = {};

function saveState() {
    localStorage.state = JSON.stringify(STORAGE);
}

function loadState() {
    try {
        STORAGE = JSON.parse(localStorage.state);
    } catch(err) {}
    // error on empty storage - nothing to do
}


function inherit(ref, args) {
    if ( !this._inherits || this._inherits.indexOf(ref) != -1 ) { return 0; }
    ref.apply(this, args);
    this._inherits.push(ref);
    
}

function getSelf(ref) {
    ref._inherits = ref._inherits||[];
    
    ref.inherit = inherit;
    
    return ref;
}

function BaseModel() {
    var self = getSelf(this);
    
    self._delete = {
        todo: [],
    }
    
    self.addondelete = function(func) {
        self._delete.todo.push(func);
    }
    
    self.removeondelete = function(func) {
        var pos = self._delete.todo.indexOf(func);
        if ( pos != -1 ) {
            self._delete.todo.splice(pos, 1);
        }
    }
    
    self.doondelete = function() {
        for ( var i = 0; i < self._delete.todo.length; i++ ) {
            self._delete.todo[i]();
        }
        self._delete.todo = [];
    }
    
    self._deleteworker = function() {
        if ( self.model && self.id ) {
            var globRef = self.model.toUpperCase();
            if ( window[globRef] && window[globRef][self.id] ) {
                delete window[globRef][self.id];
            }
            if ( STORAGE[self.model] && STORAGE[self.model][self.id] ) {
                delete STORAGE[self.model][self.id];
            }
        }
        self.doondelete();
    }
    
    self.delete = function() {
        self._deleteworker();
        window.saveState();
    }
    
    
    self._saveRepresintation = function() { return {}; }// rewritable functions
    self._loadRepresintation = function(data) {}
    
    self.saveState = function() {
        if ( self.model && self.id ) {
            STORAGE[self.model] = STORAGE[self.model] || {};
            STORAGE[self.model][self.id] = self._saveRepresintation();
        }
        window.saveState();
    }
    self.loadState = function() {
        if ( self.model && self.id && STORAGE[self.model] && STORAGE[self.model][self.id] ) {
            self._loadRepresintation(STORAGE[self.model][self.id]);
        }
    }
    
}

BaseModel.ModelSaveStateMechanics = function(globalRef) {
    return function() {
        for ( var k in globalRef ) {
            globalRef[k].saveState();
        }
    }
}

BaseModel.ModelLoadStateMechanics = function(globalRef) {
    return function() {
        for ( var k in globalRef ) {
            globalRef[k].loadState();
        }
    }
}









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
    
    self.init();
}

Parking.saveState = BaseModel.ModelSaveStateMechanics(PARKING);
Parking.loadState = BaseModel.ModelLoadStateMechanics(PARKING);




function SlotSet(data) {
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.has = 0;
        self.max = data.max || 0;
        self.tagqueue = data.tagqueue || [];
        self.vehicles = new Array(self.max);
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
    }
    
    self.removeVehicle = function(vehicle) {
        var pos = self.vehicles.indexOf(vehicle);
        if ( pos != -1 ) {
            delete self.vehicles[pos];
            self.has -= 1;
            
            vehicle.removeondelete(vehicle._delete.slot);
        }
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
    
    self.getSerializedList = function() {
        return self.vehicles.join(',');
    }
    
    self.clear = function() {
        for ( var i = 0; i < self.vehicles.length; i++ ) {
            var vehicle = self.vehicles[i];
            vehicle && vehicle.delete();
        }
        self.vehicles = new Array(self.max);
        self.has = 0;
    }
    
    self.init();
}



// Tag is model in order to use fast reference to it (orr add functionality later)

window.TAG = {};

function Tag(name) {
    this.name = name;
    TAG[name] = this;
}

Tag.prototype.toString = function() { return this.name; }

Tag.fetch = function(name) {
    return TAG[name] || new Tag(name);
}


function toLen(str, len) {
    return new Array(len-str.length+1).join('0')+str;
}

window.carIter = {
    num: 41,
    get: function() { return toLen((carIter.num+=1).toString(),4); }
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


function declareInstances() {
    
    'Truck,Sedan,Disabled'.split(',').map(function(name) {
        new Tag(name);
    });
    
    window.parking = new Parking('main');
    
    parking.addSlots('Trucks',10,[TAG.Truck, null ,TAG.Disabled,TAG.Sedan]);// These are priority queues, null is to put anything other than trucks futher
    parking.addSlots('Disabled',5,[TAG.Disabled]);
    parking.addSlots('Simple',15,[TAG.Sedan,TAG.Disabled]);
    
    window.dummy_Truck = new Vehicle([TAG.Truck]).init('DV-truck');// Vehicle can have any number of tags, so we can have "Disabled Truck" :)
    window.dummy_Sedan = new Vehicle([TAG.Sedan]).init('DV-sedan');
    window.dummy_Disabled = new Vehicle([TAG.Disabled]).init('DV-disabled');
    
}

function mainScenario() {
    window.loadState();// only data, no model instances here
    declareInstances();
    Vehicle.loadState();
    Parking.loadState();
    
    
    parking.yieldState();
}

function fixtureFillScenario(limit) {
    limit = limit || 0;
    
    var tag_keys = Object.keys(TAG);
    
    for ( var i = 0; i < limit; i++ ) {
        var tag = TAG[tag_keys[parseInt(Math.random()*tag_keys.length)]];
        parking.register(new Vehicle([tag]).init());
    }
}

function migrate() {// Quite simple
    delete localStorage.state;
    window.location.reload();
}


// Start
mainScenario();

