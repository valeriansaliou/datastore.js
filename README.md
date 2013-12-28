DataStore.js
============

A complete Web storage wrapper (sessionStorage/localStorage). Provides a fallback when not supported.

This wrapper has been extracted from [Jappix](https://github.com/jappix/jappix), the project for which it's been written.


[![build status](https://ci.frenchtouch.pro/projects/11/status.png?ref=master)](https://ci.frenchtouch.pro/projects/11?ref=master)


## How To Use?

### sessionStorage

Those storage entries are temporary and only available in the page they are in use, and MAY be kept across navigation in the same tab.

* DataStore.hasDB() - Returns whether sessionStorage is available or not
* DataStore.getDB(database, table, row) - Get a value (database->table->row)
* DataStore.setDB(database, table, row, value) - Stores a value (database->table->row:value)
* DataStore.removeDB(database, table, row) - Removes a value (database->table->row)
* DataStore.existDB(database, table, row) - Returns whether a value is set or none
* DataStore.resetDB() - Clear the whole database values

### localStorage

Those storage entries are persistent, so that database MAY be kept across browser (and system) restart. Available across all tabs, too.

* DataStore.hasPersistent() - Returns whether localStorage is available or not
* DataStore.getPersistent(database, table, row) - Get a value (database->table->row)
* DataStore.setPersistent(database, table, row, value) - Stores a value (database->table->row:value)
* DataStore.removePersistent(database, table, row) - Removes a value (database->table->row)
* DataStore.existPersistent(database, table, row) - Returns whether a value is set or none
* DataStore.resetPersistent() - Clear the whole database values