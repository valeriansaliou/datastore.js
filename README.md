DataStore.js
============

[![Build Status](https://travis-ci.org/valeriansaliou/datastore.js.svg?branch=master)](https://travis-ci.org/valeriansaliou/datastore.js) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/valeriansaliou/datastore.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A complete Web storage wrapper (sessionStorage/localStorage). Provides a fallback when not supported.

This wrapper has been extracted from [Jappix](https://github.com/jappix/jappix), the project for which it's been written.


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