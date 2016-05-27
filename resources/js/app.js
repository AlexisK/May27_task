
window.db_version = 1;

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
    
    var ver = localStorage.db_version||0;
    localStorage.db_version = window.db_version;
    if ( ver != window.db_version ) { migrate(); }
    
    
    window.loadState();// only data, no model instances here
    declareInstances();
    Vehicle.loadState();
    Parking.loadState();
    
    parking.yieldState();
    
    var view = parking.getDom();
    document.body.appendChild(view);
}

function fixtureFillScenario(limit, tag_keys) {
    limit = limit || 1;
    
    tag_keys = tag_keys || Object.keys(TAG);
    
    for ( var i = 0; i < limit; i++ ) {
        var tag = TAG[tag_keys[parseInt(Math.random()*tag_keys.length)]];
        parking.register(new Vehicle([tag]).init());
    }
}

window.fcfRand = 4;
function fixtureContiniousFillScenario(limit, tag_keys) {
    // algorythm always trying to fit in its 'ideal' state - targetQuantity, so it will add or remove corresponding amout of vehicles
    limit = limit || 1;
    var targetQuantity = limit - fcfRand;
    if ( targetQuantity <= 0 ) { console.log('Failed to run continious autofill - need limit of '+(fcfRand+1)+' at least'); return 0; }
    parking.clear();
    var quantity = 0;
    
    var worker = function() {
        if ( quantity < targetQuantity ) {
            fixtureFillScenario(targetQuantity-quantity+Math.floor(Math.random()*fcfRand), tag_keys);
        } else {
            var toDel = quantity-targetQuantity+Math.floor(Math.random()*fcfRand);
            for ( var i = 0; i < toDel; i++ ) {
                var vkeys = Object.keys(VEHICLE);
                VEHICLE[vkeys[Math.floor(Math.random()*vkeys.length)]].delete();
            }
        }
        quantity = Object.keys(VEHICLE).length;
    }
    setInterval(worker, 200);
}

function migrate() {// Quite simple
    delete localStorage.state;
    window.location.reload();
}


// Start
mainScenario();

