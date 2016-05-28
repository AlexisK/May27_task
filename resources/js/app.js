
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
    migration_check();
    
    window.loadState();// only data, no model instances here
    declareInstances();
    Vehicle.loadState();
    Parking.loadState();
    
    parking.yieldState();
    
    var view = parking.getDom();
    document.body.appendChild(view);
}


// Start
loadJson('config.json', mainScenario);

