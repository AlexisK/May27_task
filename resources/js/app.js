
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
    
    var view = parking.getDom();
    document.body.appendChild(view);
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

