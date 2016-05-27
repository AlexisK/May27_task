
function declareInstances() {
    
    'Truck,Sedan,Disabled'.split(',').map(function(name) {
        new Tag(name);
    });
    
    window.parking = new Parking();
    
    parking.addSlots('Trucks',10,[TAG.Truck, null ,TAG.Disabled,TAG.Sedan]);// These are priority queues, null is to put anything other than trucks futher
    parking.addSlots('Disabled',5,[TAG.Disabled]);
    parking.addSlots('Simple',15,[TAG.Sedan,TAG.Disabled]);
    
    window.dummy_Truck = new Vehicle([TAG.Truck],'DV-truck');// Vehicle can have any number of tags, so we can have "Disabled Truck" :)
    window.dummy_Sedan = new Vehicle([TAG.Sedan],'DV-sedan');
    window.dummy_Disabled = new Vehicle([TAG.Disabled],'DV-disabled');
    
}

function mainScenario() {
    LoadState();// only data, no model instances here
    declareInstances();
    Vehicle.restore();// global vehicle restoration
    parking.restoreState();// specific parking restoration
    
    fixtureFillScenario(10);//- data restoration is not ready yet - so we use random generator for now
    
    parking.yieldState();
}

function fixtureFillScenario(limit) {
    limit = limit || 0;
    
    var tag_keys = Object.keys(TAG);
    
    for ( var i = 0; i < limit; i++ ) {
        var tag = TAG[tag_keys[parseInt(Math.random()*tag_keys.length)]];
        parking.register(new Vehicle([tag]));
    }
}

// Start
mainScenario();

