
function migrate() {// Quite simple
    delete localStorage.state;
    window.location.reload();
}

function migration_check() {
    
    var ver = localStorage.db_version||0;
    localStorage.db_version = config.version.db;
    if ( ver != config.version.db ) { migrate(); }
    
}
