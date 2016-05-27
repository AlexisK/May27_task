
function declareInstances() {
    
    'Truck,Sedan,Disabled'.split(',').map(function(name) {
        new Tag(name);
    });
    
    window.parking = new Parking();
    
    parking.addSlots('Trucks',10,[TAG.Truck, null ,TAG.Disabled,TAG.Sedan]);// These are priority queues, null is to put anything other than trucks futher
    parking.addSlots('Disabled',5,[TAG.Disabled]);
    parking.addSlots('Simple',15,[TAG.Sedan,TAG.Disabled]);
    
    window.dummy_Truck = new Vehicle([TAG.Truck]);// Vehicle can have any number of tags, so we can have "Disabled Truck" :)
    window.dummy_Sedan = new Vehicle([TAG.Sedan]);
    window.dummy_Disabled = new Vehicle([TAG.Disabled]);
    
}

function mainScenario() {
    parking.restoreState();
    
    parking.register(dummy_Sedan.copy());
    parking.register(dummy_Sedan.copy());
    parking.register(dummy_Disabled.copy());
    parking.register(dummy_Truck.copy());
    
    for ( var i = 0; i < 6; i++ ) { parking.register(dummy_Disabled.copy()); }
    
    parking.yieldState();
}

// Start
declareInstances();
mainScenario();
