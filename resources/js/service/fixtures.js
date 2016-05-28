
function fixtureFillScenario(limit, tag_keys) {
    limit = limit || 1;
    
    tag_keys = tag_keys || Object.keys(TAG);
    
    for ( var i = 0; i < limit; i++ ) {
        var tag = TAG[tag_keys[parseInt(Math.random()*tag_keys.length)]];
        parking.register(new Vehicle([tag]).init());
    }
}

function fixtureContiniousFillScenario(limit, tag_keys) {
    // algorythm always trying to fit in its 'ideal' state - targetQuantity, so it will add or remove corresponding amout of vehicles
    limit = limit || 1;
    var targetQuantity = limit - config.fixtureFill.random;
    if ( targetQuantity <= 0 ) { console.log([locale.fixture_fill_need[0], (config.fixtureFill.random+1), locale.fixture_fill_need[1]].join(' ')); return 0; }
    parking.clear();
    var quantity = 0;
    
    var worker = function() {
        if ( quantity < targetQuantity ) {
            fixtureFillScenario(targetQuantity-quantity+Math.floor(Math.random()*config.fixtureFill.random), tag_keys);
        } else {
            var toDel = quantity-targetQuantity+Math.floor(Math.random()*config.fixtureFill.random);
            for ( var i = 0; i < toDel; i++ ) {
                var vkeys = Object.keys(VEHICLE);
                VEHICLE[vkeys[Math.floor(Math.random()*vkeys.length)]].delete();
            }
        }
        quantity = Object.keys(VEHICLE).length;
    }
    
    clearInterval(window._ffInt);
    window._ffInt = setInterval(worker, config.fixtureFill.interval);
}
