
function declareInstances() {
    
    'Truck,Sedan,Disabled'.split(',').map(function(name) {
        new Tag(name);
    });
    
    window.parking = new Parking();
    
    parking.addSlots('Trucks',10,[TAG.Truck,TAG.Disabled,TAG.Sedan]);
    parking.addSlots('Disabled',5,[TAG.Disabled]);
    parking.addSlots('Simple',15,[TAG.Sedan,TAG.Disabled]);
    
    window.dummy_Truck = new Vehicle([TAG.Truck]);
    window.dummy_Sedan = new Vehicle([TAG.Sedan]);
    window.dummy_Disabled = new Vehicle([TAG.Disabled]);
    
}

function mainScenario() {
    parking.restoreState();
    
    parking.yieldState();
    
    parking.register(dummy_Sedan.copy());
    parking.register(dummy_Sedan.copy());
    parking.register(dummy_Disabled.copy());
    parking.register(dummy_Truck.copy());
    
    parking.yieldState();
}

// Start
declareInstances();
mainScenario();
