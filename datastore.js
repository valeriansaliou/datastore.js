// Common: storage adapter
function storageAdapter(storage_native, storage_emulated) {
	var legacy = !storage_native;

	this.key = function(key) {
		if(legacy) {
			if(key >= this.length)
				return null;

			var c = 0;

			for(name in storage_emulated) {
				if(c++ == key)  return name;
			}

			return null;
		}

		return storage_native.key(key);
	};

	this.getItem = function(key) {
		if(legacy) {
			if(storage_emulated[key] !== undefined)
				return storage_emulated[key];

			return null;
		} else {
			return storage_native.getItem(key);
		}
	};

	this.setItem = function(key, data) {
		if(legacy) {
			if(!(key in storage_emulated))
				this.length++;

			storage_emulated[key] = (data + '');
		} else {
			storage_native.setItem(key, data);
			this.length = storage_native.length;
		}
	};

	this.removeItem = function(key) {
		if(legacy) {
			if(key in storage_emulated) {
				this.length--;
				delete storage_emulated[key];
			}
		} else {
			storage_native.removeItem(key);
			this.length = storage_native.length;
		}
	};

	this.clear = function() {
		if(legacy) {
			this.length = 0;
			storage_emulated = {};
		} else {
			storage_native.clear();
			this.length = storage_native.length;
		}
	};

	this.length = legacy ? 0 : storage_native.length;
}


// Temporary: sessionStorage emulation
var DATASTORE_DB_EMULATED = {};

// Temporary: sessionStorage class alias for direct access
var storageDB = new storageAdapter(
	(window.sessionStorage ? sessionStorage : null),
	DATASTORE_DB_EMULATED
);

// Temporary: returns whether it is available or not
function hasDB() {
	// Try to write something
	try {
		storageDB.setItem('hasdb_check', 'ok');
		storageDB.removeItem('hasdb_check');

		return true;
	}
	
	// Not available?
	catch(e) {
		return false;
	}
}

// Temporary: used to read a database entry
function getDB(dbID, type, id) {
	try {
		return storageDB.getItem(dbID + '_' + type + '_' + id);
	}
	
	catch(e) {
		logThis('Error while getting a temporary database entry (' + dbID + ' -> ' + type + ' -> ' + id + '): ' + e, 1);
	}

	return null;
}

// Temporary: used to update a database entry
function setDB(dbID, type, id, value) {
	try {
		storageDB.setItem(dbID + '_' + type + '_' + id, value);

		return true;
	}
	
	catch(e) {
		logThis('Error while writing a temporary database entry (' + dbID + ' -> ' + type + ' -> ' + id + '): ' + e, 1);
	}

	return false;
}

// Temporary: used to remove a database entry
function removeDB(dbID, type, id) {
	try {
		storageDB.removeItem(dbID + '_' + type + '_' + id);
		
		return true;
	}
	
	catch(e) {
		logThis('Error while removing a temporary database entry (' + dbID + ' -> ' + type + ' -> ' + id + '): ' + e, 1);
	}

	return false;
}

// Temporary: used to check a database entry exists
function existDB(dbID, type, id) {
	return getDB(type, id) != null;
}

// Temporary: used to clear all the database
function resetDB() {
	try {
		storageDB.clear();
		
		logThis('Temporary database cleared.', 3);
		
		return true;
	}
	
	catch(e) {
		logThis('Error while clearing temporary database: ' + e, 1);
		
		return false;
	}
}


// Persistent: localStorage emulation
var DATASTORE_PERSISTENT_EMULATED = {};

// Persistent: localStorage class alias for direct access
var storagePersistent = new storageAdapter(
	(window.localStorage ? localStorage : null),
	DATASTORE_PERSISTENT_EMULATED
);

// Persistent: returns whether it is available or not
function hasPersistent() {
	// Try to write something
	try {
		storagePersistent.setItem('haspersistent_check', 'ok');
		storagePersistent.removeItem('haspersistent_check');
		
		return true;
	}
	
	// Not available?
	catch(e) {
		return false;
	}
}

// Persistent: used to read a database entry
function getPersistent(dbID, type, id) {
	try {
		return storagePersistent.getItem(dbID + '_' + type + '_' + id);
	}
	
	catch(e) {
		logThis('Error while getting a persistent database entry (' + dbID + ' -> ' + type + ' -> ' + id + '): ' + e, 1);
		
		return null;
	}
}

// Persistent: used to update a database entry
function setPersistent(dbID, type, id, value) {
	try {
		storagePersistent.setItem(dbID + '_' + type + '_' + id, value);
		
		return true;
	}
	
	// Database might be full
	catch(e) {
		logThis('Retrying: could not write a persistent database entry (' + dbID + ' -> ' + type + ' -> ' + id + '): ' + e, 2);
		
		// Flush it!
		flushPersistent();
		
		// Set the item again
		try {
			storagePersistent.setItem(dbID + ' -> ' + type + '_' + id, value);
			
			return true;
		}
		
		// New error!
		catch(e) {
			logThis('Aborted: error while writing a persistent database entry (' + dbID + ' -> ' + type + ' -> ' + id + '): ' + e, 1);
		}
	}

	return false;
}

// Persistent: used to remove a database entry
function removePersistent(dbID, type, id) {
	try {
		storagePersistent.removeItem(dbID + '_' + type + '_' + id);

		return true;
	}
	
	catch(e) {
		logThis('Error while removing a persistent database entry (' + dbID + ' -> ' + type + ' -> ' + id + '): ' + e, 1);
	}

	return false;
}

// Persistent: used to check a database entry exists
function existPersistent(dbID, type, id) {
	return getPersistent(dbID, type, id) != null;
}

// Persistent: used to clear all the database
function resetPersistent() {
	try {
		storagePersistent.clear();

		logThis('Persistent database cleared.', 3);
		
		return true;
	}
	
	catch(e) {
		logThis('Error while clearing persistent database: ' + e, 1);
	}

	return false;
}

// Persistent: used to flush the database
function flushPersistent() {
	try {
		// Get the stored session entry
		var session = getPersistent('global', 'session', 1);
		
		// Reset the persistent database
		resetPersistent();
		
		// Restaure the stored session entry
		if(session)
			setPersistent('global', 'session', 1, session);
		
		logThis('Persistent database flushed.', 3);
		
		return true;
	}
	
	catch(e) {
		logThis('Error while flushing persistent database: ' + e, 1);
	}

	return false;
}