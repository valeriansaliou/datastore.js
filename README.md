Datastore.js
============

A complete Web storage wrapper (sessionStorage/localStorage). Provides a fallback when not supported.

This wrapper has been extracted from [Jappix](https://github.com/jappix/jappix), the project for which it's been written.

## How To Use?

### sessionStorage

Those storage entries are temporary and only available in the page they are in use, and MAY be kept across navigation in the same tab.

* hasDB() - Returns whether sessionStorage is available or not
* getDB(database, table, row) - Get a value (database->table->row)
* setDB(database, table, row, value) - Stores a value (database->table->row:value)
* removeDB(database, table, row) - Removes a value (database->table->row)
* existDB(database, table, row) - Returns whether a value is set or none
* resetDB() - Clear the whole database values

### localStorage

Those storage entries are persistent, so that database MAY be kept across browser (and system) restart. Available across all tabs, too.

* hasPersistent() - Returns whether localStorage is available or not
* getPersistent(database, table, row) - Get a value (database->table->row)
* setPersistent(database, table, row, value) - Stores a value (database->table->row:value)
* removePersistent(database, table, row) - Removes a value (database->table->row)
* existPersistent(database, table, row) - Returns whether a value is set or none
* resetPersistent() - Clear the whole database values