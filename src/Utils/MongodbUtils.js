/**
 * mongodb工具类
 * */
const MongoClient = require('mongodb').MongoClient;

function normalCallback (resolve, reject) {
    return function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    };
}

function find (collection, query, findOptions) {
    return collection.find(query, findOptions);
}

function toArray (findCursor, resolve, reject) {
    findCursor.toArray(normalCallback(resolve, reject));
}

class Db {
    constructor (db) {
        this.instance = db;
    }

    /**
     * Create a new collection on a server with the specified options. Use this to create capped collections.
     * More information about command options available at https://docs.mongodb.com/manual/reference/command/create/
     *
     * @method
     * @param {string} name the collection name we wish to access.
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
     * @param {object} [options.pkFactory=null] A primary key factory object for generation of custom _id keys.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object.
     * @param {boolean} [options.strict=false] Returns an error if the collection does not exist
     * @param {boolean} [options.capped=false] Create a capped collection.
     * @param {boolean} [options.autoIndexId=true] DEPRECATED: Create an index on the _id field of the document, True by default on MongoDB 2.6 - 3.0
     * @param {number} [options.size=null] The size of the capped collection in bytes.
     * @param {number} [options.max=null] The maximum number of documents in the capped collection.
     * @param {number} [options.flags=null] Optional. Available for the MMAPv1 storage engine only to set the usePowerOf2Sizes and the noPadding flag.
     * @param {object} [options.storageEngine=null] Allows users to specify configuration to the storage engine on a per-collection basis when creating a collection on MongoDB 3.0 or higher.
     * @param {object} [options.validator=null] Allows users to specify validation rules or expressions for the collection. For more information, see Document Validation on MongoDB 3.2 or higher.
     * @param {string} [options.validationLevel=null] Determines how strictly MongoDB applies the validation rules to existing documents during an update on MongoDB 3.2 or higher.
     * @param {string} [options.validationAction=null] Determines whether to error on invalid documents or just warn about the violations but allow invalid documents to be inserted on MongoDB 3.2 or higher.
     * @param {object} [options.indexOptionDefaults=null] Allows users to specify a default configuration for indexes when creating a collection on MongoDB 3.2 or higher.
     * @param {string} [options.viewOn=null] The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create on MongoDB 3.4 or higher.
     * @param {array} [options.pipeline=null] An array that consists of the aggregation pipeline stage. create creates the view by applying the specified pipeline to the viewOn collection or view on MongoDB 3.4 or higher.
     * @param {object} [options.collation=null] Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    createCollection (name, options) {
        const db = this.instance;
        return new Promise((resolve, reject) => {
            db.createCollection(name, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Fetch a specific collection (containing the actual collection information). If the application does not use strict mode you
     * can use it without a callback in the following way: `var collection = db.collection('mycollection');`
     *
     * @method
     * @param {string} name the collection name we wish to access.
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
     * @param {object} [options.pkFactory=null] A primary key factory object for generation of custom _id keys.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object.
     * @param {boolean} [options.strict=false] Returns an error if the collection does not exist
     * @param {function} [options.map] Function to map documents returned in find, findOne, and findAndModify commands.
     * @param {function} [options.unmap] Function to unmap documents passed to insertOne, insertMany, and replaceOne commands.
     * @param {object} [options.readConcern=null] Specify a read concern for the collection. (only MongoDB 3.2 or higher supported)
     * @param {object} [options.readConcern.level='local'] Specify a read concern level for the collection operations, one of [local|majority]. (only MongoDB 3.2 or higher supported)
     * @return {Collection} return the new Collection instance if not in strict mode
     */
    collection (name, options) {
        return new Collection(this.instance.collection(name, options));
    }

    /**
     * Execute a command
     * @method
     * @param {object} command The command hash
     * @param {object} [options=null] Optional settings.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    command (command, options) {
        const db = this.instance;
        return new Promise((resolve, reject) => {
            db.command(command, options, normalCallback(resolve, reject));
        });
    }

}

class Collection {
    constructor (collection) {
        this.instance = collection;
    }

    /**
     * Creates an index on the db and collection collection.
     * @method
     * @param {(string|object)} fieldOrSpec Defines the index.
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {boolean} [options.unique=false] Creates an unique index.
     * @param {boolean} [options.sparse=false] Creates a sparse index.
     * @param {boolean} [options.background=false] Creates the index in the background, yielding whenever possible.
     * @param {boolean} [options.dropDups=false] A unique index cannot be created on a key that has pre-existing duplicate values. If you would like to create the index anyway, keeping the first document the database indexes and deleting all subsequent documents that have duplicate value
     * @param {number} [options.min=null] For geospatial indexes set the lower bound for the co-ordinates.
     * @param {number} [options.max=null] For geospatial indexes set the high bound for the co-ordinates.
     * @param {number} [options.v=null] Specify the format version of the indexes.
     * @param {number} [options.expireAfterSeconds=null] Allows you to expire data on indexes applied to a data (MongoDB 2.2 or higher)
     * @param {string} [options.name=null] Override the autogenerated index name (useful if the resulting name is larger than 128 bytes)
     * @param {object} [options.partialFilterExpression=null] Creates a partial index based on the given filter object (MongoDB 3.2 or higher)
     * @param {object} [options.collation=null] Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    createIndex (fieldOrSpec, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.createIndex(fieldOrSpec, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB
     * @method
     * @param {object} [query={}] The cursor query object.
     * @param {object} [options=null] Optional settings.
     * @param {number} [options.limit=0] Sets the limit of documents returned in the query.
     * @param {(array|object)} [options.sort=null] Set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
     * @param {object} [options.projection=null] The fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
     * @param {object} [options.fields=null] **Deprecated** Use `options.projection` instead
     * @param {number} [options.skip=0] Set to skip N documents ahead in your query (useful for pagination).
     * @param {Object} [options.hint=null] Tell the query to use specific indexes in the query. Object of indexes to use, {'_id':1}
     * @param {boolean} [options.explain=false] Explain the query instead of returning the data.
     * @param {boolean} [options.snapshot=false] DEPRECATED: Snapshot query.
     * @param {boolean} [options.timeout=false] Specify if the cursor can timeout.
     * @param {boolean} [options.tailable=false] Specify if the cursor is tailable.
     * @param {number} [options.batchSize=0] Set the batchSize for the getMoreCommand when iterating over the query results.
     * @param {boolean} [options.returnKey=false] Only return the index key.
     * @param {number} [options.maxScan=null] DEPRECATED: Limit the number of items to scan.
     * @param {number} [options.min=null] Set index bounds.
     * @param {number} [options.max=null] Set index bounds.
     * @param {boolean} [options.showDiskLoc=false] Show disk location of results.
     * @param {string} [options.comment=null] You can put a $comment field on a query to make looking in the profiler logs simpler.
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
     * @param {boolean} [options.promoteLongs=true] Promotes Long values to number if they fit inside the 53 bits resolution.
     * @param {boolean} [options.promoteValues=true] Promotes BSON values to native types where possible, set to false to only receive wrapper types.
     * @param {boolean} [options.promoteBuffers=false] Promotes Binary BSON values to native Node Buffers.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {boolean} [options.partial=false] Specify if the cursor should return partial results when querying against a sharded system
     * @param {number} [options.maxTimeMS=null] Number of miliseconds to wait before aborting the query.
     * @param {object} [options.collation=null] Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @throws {MongoError}
     * @return {Promise}
     */
    find (query, options) {
        const self = this;
        return new Promise((resolve, reject) => {
            toArray(self.findCursor(query, options), resolve, reject);
        });
    }

    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB
     * @method
     * @param {object} [query={}] The cursor query object.
     * @param {object} [options=null] Optional settings.
     * @param {number} [options.limit=0] Sets the limit of documents returned in the query.
     * @param {(array|object)} [options.sort=null] Set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
     * @param {object} [options.projection=null] The fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
     * @param {object} [options.fields=null] **Deprecated** Use `options.projection` instead
     * @param {number} [options.skip=0] Set to skip N documents ahead in your query (useful for pagination).
     * @param {Object} [options.hint=null] Tell the query to use specific indexes in the query. Object of indexes to use, {'_id':1}
     * @param {boolean} [options.explain=false] Explain the query instead of returning the data.
     * @param {boolean} [options.snapshot=false] DEPRECATED: Snapshot query.
     * @param {boolean} [options.timeout=false] Specify if the cursor can timeout.
     * @param {boolean} [options.tailable=false] Specify if the cursor is tailable.
     * @param {number} [options.batchSize=0] Set the batchSize for the getMoreCommand when iterating over the query results.
     * @param {boolean} [options.returnKey=false] Only return the index key.
     * @param {number} [options.maxScan=null] DEPRECATED: Limit the number of items to scan.
     * @param {number} [options.min=null] Set index bounds.
     * @param {number} [options.max=null] Set index bounds.
     * @param {boolean} [options.showDiskLoc=false] Show disk location of results.
     * @param {string} [options.comment=null] You can put a $comment field on a query to make looking in the profiler logs simpler.
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
     * @param {boolean} [options.promoteLongs=true] Promotes Long values to number if they fit inside the 53 bits resolution.
     * @param {boolean} [options.promoteValues=true] Promotes BSON values to native types where possible, set to false to only receive wrapper types.
     * @param {boolean} [options.promoteBuffers=false] Promotes Binary BSON values to native Node Buffers.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {boolean} [options.partial=false] Specify if the cursor should return partial results when querying against a sharded system
     * @param {number} [options.maxTimeMS=null] Number of miliseconds to wait before aborting the query.
     * @param {object} [options.collation=null] Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @param {object} [sortOptions={}] Cursor sort options
     * @throws {MongoError}
     * @return {Promise}
     */
    findOnSort (query, options, sortOptions = {}) {
        const self = this;
        return new Promise((resolve, reject) => {
            toArray(self.findCursor(query, options).sort(sortOptions), resolve, reject);
        });
    }

    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB
     * @method
     * @param {object} [query={}] The cursor query object.
     * @param {object} [options=null] Optional settings.
     * @param {number} [options.limit=0] Sets the limit of documents returned in the query.
     * @param {(array|object)} [options.sort=null] Set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
     * @param {object} [options.projection=null] The fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
     * @param {object} [options.fields=null] **Deprecated** Use `options.projection` instead
     * @param {number} [options.skip=0] Set to skip N documents ahead in your query (useful for pagination).
     * @param {Object} [options.hint=null] Tell the query to use specific indexes in the query. Object of indexes to use, {'_id':1}
     * @param {boolean} [options.explain=false] Explain the query instead of returning the data.
     * @param {boolean} [options.snapshot=false] DEPRECATED: Snapshot query.
     * @param {boolean} [options.timeout=false] Specify if the cursor can timeout.
     * @param {boolean} [options.tailable=false] Specify if the cursor is tailable.
     * @param {number} [options.batchSize=0] Set the batchSize for the getMoreCommand when iterating over the query results.
     * @param {boolean} [options.returnKey=false] Only return the index key.
     * @param {number} [options.maxScan=null] DEPRECATED: Limit the number of items to scan.
     * @param {number} [options.min=null] Set index bounds.
     * @param {number} [options.max=null] Set index bounds.
     * @param {boolean} [options.showDiskLoc=false] Show disk location of results.
     * @param {string} [options.comment=null] You can put a $comment field on a query to make looking in the profiler logs simpler.
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
     * @param {boolean} [options.promoteLongs=true] Promotes Long values to number if they fit inside the 53 bits resolution.
     * @param {boolean} [options.promoteValues=true] Promotes BSON values to native types where possible, set to false to only receive wrapper types.
     * @param {boolean} [options.promoteBuffers=false] Promotes Binary BSON values to native Node Buffers.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {boolean} [options.partial=false] Specify if the cursor should return partial results when querying against a sharded system
     * @param {number} [options.maxTimeMS=null] Number of miliseconds to wait before aborting the query.
     * @param {object} [options.collation=null] Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @param {object} [projectObject={}] Cursor project options
     * @throws {MongoError}
     * @return {Promise}
     */
    findOnProject (query, options, projectObject = {}) {
        const self = this;
        return new Promise((resolve, reject) => {
            toArray(self.findCursor(query, options).project(projectObject), resolve, reject);
        });
    }

    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB
     * @method
     * @param {object} [query={}] The cursor query object.
     * @param {object} [options=null] Optional settings.
     * @param {number} [options.limit=0] Sets the limit of documents returned in the query.
     * @param {(array|object)} [options.sort=null] Set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
     * @param {object} [options.projection=null] The fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
     * @param {object} [options.fields=null] **Deprecated** Use `options.projection` instead
     * @param {number} [options.skip=0] Set to skip N documents ahead in your query (useful for pagination).
     * @param {Object} [options.hint=null] Tell the query to use specific indexes in the query. Object of indexes to use, {'_id':1}
     * @param {boolean} [options.explain=false] Explain the query instead of returning the data.
     * @param {boolean} [options.snapshot=false] DEPRECATED: Snapshot query.
     * @param {boolean} [options.timeout=false] Specify if the cursor can timeout.
     * @param {boolean} [options.tailable=false] Specify if the cursor is tailable.
     * @param {number} [options.batchSize=0] Set the batchSize for the getMoreCommand when iterating over the query results.
     * @param {boolean} [options.returnKey=false] Only return the index key.
     * @param {number} [options.maxScan=null] DEPRECATED: Limit the number of items to scan.
     * @param {number} [options.min=null] Set index bounds.
     * @param {number} [options.max=null] Set index bounds.
     * @param {boolean} [options.showDiskLoc=false] Show disk location of results.
     * @param {string} [options.comment=null] You can put a $comment field on a query to make looking in the profiler logs simpler.
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
     * @param {boolean} [options.promoteLongs=true] Promotes Long values to number if they fit inside the 53 bits resolution.
     * @param {boolean} [options.promoteValues=true] Promotes BSON values to native types where possible, set to false to only receive wrapper types.
     * @param {boolean} [options.promoteBuffers=false] Promotes Binary BSON values to native Node Buffers.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {boolean} [options.partial=false] Specify if the cursor should return partial results when querying against a sharded system
     * @param {number} [options.maxTimeMS=null] Number of miliseconds to wait before aborting the query.
     * @param {object} [options.collation=null] Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @throws {MongoError}
     * @return {Cursor}
     */
    findCursor (query, options) {
        return find(this.instance, query, options);
    }

    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @method
     * @param {object} filter Document selection filter.
     * @param {object} update Update operations to be performed on the document
     * @param {object} [options=null] Optional settings.
     * @param {object} [options.projection=null] Limits the fields to return for all matching documents.
     * @param {object} [options.sort=null] Determines which document the operation modifies if the query selects multiple documents.
     * @param {number} [options.maxTimeMS=null] The maximum amount of time to allow the query to run.
     * @param {boolean} [options.upsert=false] Upsert the document if it does not exist.
     * @param {boolean} [options.returnOriginal=true] When false, returns the updated document rather than the original. The default is true.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    findOneAndUpdate (filter, update, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.findOneAndUpdate(filter, update, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @method
     * @param {object} filter Document selection filter.
     * @param {object} [options=null] Optional settings.
     * @param {object} [options.projection=null] Limits the fields to return for all matching documents.
     * @param {object} [options.sort=null] Determines which document the operation modifies if the query selects multiple documents.
     * @param {number} [options.maxTimeMS=null] The maximum amount of time to allow the query to run.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @param {Collection~findAndModifyCallback} [callback] The collection result callback
     * @return {Promise} returns Promise
     */
    findOneAndDelete (filter, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.findOneAndDelete(filter, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Execute an aggregation framework pipeline against the collection, needs MongoDB >= 2.2
     * @method
     * @param {object} pipeline Array containing all the aggregation framework commands for the execution.
     * @param {object} [options=null] Optional settings.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {object} [options.cursor=null] Return the query as cursor, on 2.6 > it returns as a real cursor on pre 2.6 it returns as an emulated cursor.
     * @param {number} [options.cursor.batchSize=null] The batchSize for the cursor
     * @param {boolean} [options.explain=false] Explain returns the aggregation execution plan (requires mongodb 2.6 >).
     * @param {boolean} [options.allowDiskUse=false] allowDiskUse lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 >).
     * @param {number} [options.maxTimeMS=null] maxTimeMS specifies a cumulative time limit in milliseconds for processing operations on the cursor. MongoDB interrupts the operation at the earliest following interrupt point.
     * @param {boolean} [options.bypassDocumentValidation=false] Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
     * @param {boolean} [options.promoteLongs=true] Promotes Long values to number if they fit inside the 53 bits resolution.
     * @param {boolean} [options.promoteValues=true] Promotes BSON values to native types where possible, set to false to only receive wrapper types.
     * @param {boolean} [options.promoteBuffers=false] Promotes Binary BSON values to native Node Buffers.
     * @param {object} [options.collation=null] Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     * @param {string} [options.comment] Add a comment to an aggregation command
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise}
     */
    aggregate (pipeline, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.aggregate(pipeline, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @method
     * @param {object} doc Document to insert.
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object.
     * @param {boolean} [options.forceServerObjectId=false] Force server to assign _id values instead of driver.
     * @param {boolean} [options.bypassDocumentValidation=false] Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    insertOne (doc, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.insertOne(doc, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @method
     * @param {object[]} docs Documents to insert.
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object.
     * @param {boolean} [options.forceServerObjectId=false] Force server to assign _id values instead of driver.
     * @param {boolean} [options.bypassDocumentValidation=false] Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     * @param {boolean} [options.ordered=true] If true, when an insert fails, don't execute the remaining writes. If false, continue with remaining inserts when one fails.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    insertMany (docs, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.insertMany(docs, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Update a single document on MongoDB
     * @method
     * @param {object} filter The Filter used to select the document to update
     * @param {object} update The update operations to be applied to the document
     * @param {object} [options=null] Optional settings.
     * @param {boolean} [options.upsert=false] Update operation is an upsert.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {boolean} [options.bypassDocumentValidation=false] Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     * @param {Array} [options.arrayFilters=null] optional list of array filters referenced in filtered positional operators
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    updateOne (filter, update, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.updateOne(filter, update, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Update multiple documents on MongoDB
     * @method
     * @param {object} filter The Filter used to select the documents to update
     * @param {object} update The update operations to be applied to the document
     * @param {object} [options=null] Optional settings.
     * @param {boolean} [options.upsert=false] Update operation is an upsert.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {Array} [options.arrayFilters=null] optional list of array filters referenced in filtered positional operators
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    updateMany (filter, update, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.updateMany(filter, update, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Delete a document on MongoDB
     * @method
     * @param {object} filter The Filter used to select the document to remove
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    deleteOne (filter, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.deleteOne(filter, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Delete multiple documents on MongoDB
     * @method
     * @param {object} filter The Filter used to select the documents to remove
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    deleteMany (filter, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.deleteMany(filter, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Perform a bulkWrite operation without a fluent API
     *
     * Legal operation types are
     *
     *  { insertOne: { document: { a: 1 } } }
     *
     *  { updateOne: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
     *
     *  { updateMany: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
     *
     *  { deleteOne: { filter: {c:1} } }
     *
     *  { deleteMany: { filter: {c:1} } }
     *
     *  { replaceOne: { filter: {c:3}, replacement: {c:4}, upsert:true}}
     *
     * If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @method
     * @param {object[]} operations Bulk operations to perform.
     * @param {object} [options=null] Optional settings.
     * @param {(number|string)} [options.w=null] The write concern.
     * @param {number} [options.wtimeout=null] The write concern timeout.
     * @param {boolean} [options.j=false] Specify a journal write concern.
     * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object.
     * @param {boolean} [options.ordered=true] Execute write operation in ordered or unordered fashion.
     * @param {boolean} [options.bypassDocumentValidation=false] Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    bulkWrite (operations, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.bulkWrite(operations, options, normalCallback(resolve, reject));
        });
    }

    /**
     * Count number of matching documents in the db to a query.
     * @method
     * @param {object} query The query for the count.
     * @param {object} [options=null] Optional settings.
     * @param {boolean} [options.limit=null] The limit of documents to count.
     * @param {boolean} [options.skip=null] The number of documents to skip for the count.
     * @param {string} [options.hint=null] An index name hint for the query.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {number} [options.maxTimeMS=null] Number of miliseconds to wait before aborting the query.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    count (query, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.count(query, options, normalCallback(resolve, reject));
        });
    }

    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     * @method
     * @param {string} key Field of the document to find distinct values for.
     * @param {object} query The query for filtering the set of documents to which we apply the distinct filter.
     * @param {object} [options=null] Optional settings.
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
     * @param {number} [options.maxTimeMS=null] Number of miliseconds to wait before aborting the query.
     * @param {ClientSession} [options.session] optional session to use for this operation
     * @return {Promise} returns Promise
     */
    distinct (key, query, options) {
        const collection = this.instance;
        return new Promise((resolve, reject) => {
            collection.distinct(key, query, options, normalCallback(resolve, reject));
        });
    }

}

class Mongodb {
    constructor (origins = '', options = {}) {
        this.options = options;
        this.origins = origins;
        this.url = this.genUrl(this.origins, this.options);
        this.client = null;
        this.connect();
    }

    genUrl (origins = '', options = {}) {
        let url = 'mongodb://';
        if (typeof origins === 'string') {
            url += `${origins}`;
        } else if (typeof origins === 'object') {
            const keys = Object.keys(origins);
            const length = keys.length;
            if (length > 0) {
                keys.forEach((key, index) => {
                    url += `${origins[index]}`;
                    if (index < (length - 1)) {
                        url += ',';
                    }
                });
            }
        }
        const params = options.params;
        if (typeof params === 'string') {
            url += `/?${params}`;
        } else if (typeof params === 'object') {
            const keys = Object.keys(params);
            const length = keys.length;
            if (length > 0) {
                url += `/?`;
                keys.forEach((key, index) => {
                    url += `${key}=${params[key || '']}`;
                    if (index < (length - 1)) {
                        url += '&';
                    }
                });
            }
        }
        return url;
    }

    /**
     * Connect to MongoDB using a url as documented at
     *
     *  docs.mongodb.org/manual/reference/connection-string/
     *
     * Note that for replicasets the replicaSet query parameter is required in the 2.0 driver
     *
     * @method
     * @static
     * @param {string} origins The connection URI string or URI array
     * @param {object} [options] Optional settings
     * @param {number} [options.poolSize=5] The maximum size of the individual server pool
     * @param {boolean} [options.ssl=false] Enable SSL connection.
     * @param {boolean} [options.sslValidate=true] Validate mongod server certificate against Certificate Authority
     * @param {buffer} [options.sslCA=undefined] SSL Certificate store binary buffer
     * @param {buffer} [options.sslCert=undefined] SSL Certificate binary buffer
     * @param {buffer} [options.sslKey=undefined] SSL Key file binary buffer
     * @param {string} [options.sslPass=undefined] SSL Certificate pass phrase
     * @param {buffer} [options.sslCRL=undefined] SSL Certificate revocation list binary buffer
     * @param {boolean} [options.autoReconnect=true] Enable autoReconnect for single server instances
     * @param {boolean} [options.noDelay=true] TCP Connection no delay
     * @param {boolean} [options.keepAlive=true] TCP Connection keep alive enabled
     * @param {boolean} [options.keepAliveInitialDelay=30000] The number of milliseconds to wait before initiating keepAlive on the TCP socket
     * @param {number} [options.connectTimeoutMS=30000] TCP Connection timeout setting
     * @param {number} [options.family=null] Version of IP stack. Can be 4, 6 or null (default).
     * If null, will attempt to connect with IPv6, and will fall back to IPv4 on failure
     * @param {number} [options.socketTimeoutMS=360000] TCP Socket timeout setting
     * @param {number} [options.reconnectTries=30] Server attempt to reconnect #times
     * @param {number} [options.reconnectInterval=1000] Server will wait # milliseconds between retries
     * @param {boolean} [options.ha=true] Control if high availability monitoring runs for Replicaset or Mongos proxies
     * @param {number} [options.haInterval=10000] The High availability period for replicaset inquiry
     * @param {string} [options.replicaSet=undefined] The Replicaset set name
     * @param {number} [options.secondaryAcceptableLatencyMS=15] Cutoff latency point in MS for Replicaset member selection
     * @param {number} [options.acceptableLatencyMS=15] Cutoff latency point in MS for Mongos proxies selection
     * @param {boolean} [options.connectWithNoPrimary=false] Sets if the driver should connect even if no primary is available
     * @param {string} [options.authSource=undefined] Define the database to authenticate against
     * @param {(number|string)} [options.w=null] The write concern
     * @param {number} [options.wtimeout=null] The write concern timeout
     * @param {boolean} [options.j=false] Specify a journal write concern
     * @param {boolean} [options.forceServerObjectId=false] Force server to assign _id values instead of driver
     * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object
     * @param {Boolean} [options.ignoreUndefined=false] Specify if the BSON serializer should ignore undefined fields
     * @param {boolean} [options.raw=false] Return document results as raw BSON buffers
     * @param {number} [options.bufferMaxEntries=-1] Sets a cap on how many operations the driver will buffer up before giving up on getting a working connection, default is -1 which is unlimited
     * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST)
     * @param {object} [options.pkFactory=null] A primary key factory object for generation of custom _id keys
     * @param {object} [options.promiseLibrary=null] A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible
     * @param {object} [options.readConcern=null] Specify a read concern for the collection (only MongoDB 3.2 or higher supported)
     * @param {string} [options.readConcern.level='local'] Specify a read concern level for the collection operations, one of [local|majority]. (only MongoDB 3.2 or higher supported)
     * @param {number} [options.maxStalenessSeconds=undefined] The max staleness to secondary reads (values under 10 seconds cannot be guaranteed)
     * @param {string} [options.loggerLevel=undefined] The logging level (error/warn/info/debug)
     * @param {object} [options.logger=undefined] Custom logger object
     * @param {boolean} [options.promoteValues=true] Promotes BSON values to native types where possible, set to false to only receive wrapper types
     * @param {boolean} [options.promoteBuffers=false] Promotes Binary BSON values to native Node Buffers
     * @param {boolean} [options.promoteLongs=true] Promotes long values to number if they fit inside the 53 bits resolution
     * @param {boolean} [options.domainsEnabled=false] Enable the wrapping of the callback in the current domain, disabled by default to avoid perf hit
     * @param {boolean|function} [options.checkServerIdentity=true] Ensure we check server identify during SSL, set to false to disable checking. Only works for Node 0.12.x or higher. You can pass in a boolean or your own checkServerIdentity override function
     * @param {object} [options.validateOptions=false] Validate MongoClient passed in options for correctness
     * @param {string} [options.appname=undefined] The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log and profile collections
     * @param {string} [options.auth.user=undefined] The username for auth
     * @param {string} [options.auth.password=undefined] The password for auth
     * @param {string} [options.authMechanism=undefined] Mechanism for authentication: MDEFAULT, GSSAPI, PLAIN, MONGODB-X509, or SCRAM-SHA-1
     * @param {object} [options.compression=null] Type of compression to use: snappy or zlib
     * @param {boolean} [options.fsync=false] Specify a file sync write concern
     * @param {array} [options.readPreferenceTags=null] Read preference tags
     * @param {number} [options.numberOfRetries=5] The number of retries for a tailable cursor
     * @param {boolean} [options.auto_reconnect=true] Enable auto reconnecting for single server instances
     * @param {number} [options.minSize] If present, the connection pool will be initialized with minSize connections, and will never dip below minSize connections
     * @param {object} [options.params={}] url params keyValuePair
     * @return {Mongodb}
     */
    static create (origins, options) {
        return new Mongodb(origins, options);
    }

    /**
     * 创建连接
     * */
    connect () {
        const self = this;
        MongoClient.connect(self.url, self.options, function (err, client) {
            if (err) {
                setTimeout(self.connect, 100);
            } else {
                self.client = client;
            }
        });
    }

    /**
     * 获取客户端实例
     * */
    getClient (callback) {
        const self = this;
        return new Promise(resolve => {
            const looperId = setInterval(() => {
                if (self.check(true)) {
                    clearInterval(looperId);
                    const client = self.client;
                    typeof callback === 'function' ? callback(client) : resolve(client);
                }
            });
        });
    }

    /**
     * 获取可操作的数据库
     * */
    db (dbName) {
        this.check();
        return new Db(this.client.db(dbName));
    }

    /**
     * 关闭客户端
     * */
    close () {
        this.check();
        this.client.close();
        this.client = null;
        return this;
    }

    /**
     * 验证是否已创建客户端实例
     * */
    check (returnResult) {
        if (!this.client) {
            if (returnResult) {
                return false;
            }
            throw new Error('Network error.');
        }
        return true;
    }

    /**
     * 教程
     * */
    static get HELP () {
        return 'https://mongodb.github.io/node-mongodb-native/3.0/tutorials/main';
    }
}

module.exports = Mongodb.create;
