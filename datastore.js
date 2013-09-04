/*
 *  Datastore.js
 *
 *  An interface to native/emulated database storage methods
 *  Avoids issues when browser does not have native database storage
 *
 *  @license OS
 *  @author Valérian Saliou <valerian@valeriansaliou.name>
 *  @url https://github.com/valeriansaliou/datastore.js
 */

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
function getDB(database, table, row) {
	try {
		return storageDB.getItem(database + '_' + table + '_' + row);
	} catch(e) {}

	return null;
}

// Temporary: used to update a database entry
function setDB(database, table, row, value) {
	try {
		storageDB.setItem(database + '_' + table + '_' + row, value);

		return true;
	} catch(e) {}

	return false;
}

// Temporary: used to remove a database entry
function removeDB(database, table, row) {
	try {
		storageDB.removeItem(database + '_' + table + '_' + row);
		
		return true;
	} catch(e) {}

	return false;
}

// Temporary: used to check a database entry exists
function existDB(database, table, row) {
	return getDB(table, row) != null;
}

// Temporary: used to clear all the database
function resetDB() {
	try {
		storageDB.clear();
		
		return true;
	} catch(e) {
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
	} catch(e) {
		return false;
	}
}

// Persistent: used to read a database entry
function getPersistent(database, table, row) {
	try {
		return storagePersistent.getItem(database + '_' + table + '_' + row);
	} catch(e) {
		return null;
	}
}

// Persistent: used to update a database entry
function setPersistent(database, table, row, value) {
	try {
		storagePersistent.setItem(database + '_' + table + '_' + row, value);
		
		return true;
	}
	
	// Database might be full
	catch(e) {
		// Reset it!
		resetPersistent();
		
		// Set the item again
		try {
			storagePersistent.setItem(database + ' -> ' + table + '_' + row, value);
			
			return true;
		}
		
		// New error!
		catch(e) {}
	}

	return false;
}

// Persistent: used to remove a database entry
function removePersistent(database, table, row) {
	try {
		storagePersistent.removeItem(database + '_' + table + '_' + row);

		return true;
	} catch(e) {}

	return false;
}

// Persistent: used to check a database entry exists
function existPersistent(database, table, row) {
	return getPersistent(database, table, row) != null;
}

// Persistent: used to clear all the database
function resetPersistent() {
	try {
		storagePersistent.clear();

		return true;
	} catch(e) {}

	return false;
}-