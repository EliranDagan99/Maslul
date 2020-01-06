const mongod = require("mongodb");
const MongoClient = mongod.MongoClient;

class dbConn {
  constructor(collectionName) {
    this.collection = collectionName;
    this.URL = "mongodb://mongo.test.bsmch.net:27017";
  }

  add(object, dbName) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.URL, (err, db) => {
        if (err) {
          reject(err);
        }

        db.db(dbName)
          .collection(this.collection)
          .insertOne(object, (err, res) => {
            if (err) throw err;
            db.close();
            resolve(res.ops[0]);
          });
      });
    });
  }

  pushToId(id, object, dbName) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.URL, (err, db) => {
        if (err) {
          reject(err);
        }

        db.db(dbName)
          .collection(this.collection)
          .updateOne(
            {
              _id: id
            },
            {
              $push: object
            },
            (err, res) => {
              if (err) reject(err);
              db.close();
              resolve(res.matchedCount);
            }
          );
      });
    });
  }

  getByQuery(query, dbName, fields = {}) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.URL, (err, db) => {
        if (err) {
          reject(err);
        }

        db.db(dbName)
          .collection(this.collection)
          .find(query)
          .project(fields)
          .toArray((err, res) => {
            if (err) reject(err);
            db.close();
            resolve(res);
          });
      });
    });
  }

  getAll(dbName, fields = {}) {
    return new Promise((resolve, reject) => {
      resolve(this.getByQuery({}, dbName, fields));
    });
  }

  getById(id, dbName) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.URL, (err, db) => {
        if (err) {
          reject(err);
        }

        db.db(dbName)
          .collection(this.collection)
          .findOne(
            {
              _id: new mongod.ObjectID(id)
            },
            (err, res) => {
              if (err) reject(err);
              db.close();
              resolve(res);
            }
          );
      });
    });
  }

  remove(identifier, dbName) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.URL, (err, db) => {
        if (err) {
          reject(err);
        }

        db.db(dbName)
          .collection(this.collection)
          .remove(identifier, (err, res) => {
            if (err) throw err;
            db.close();
            resolve(res);
          });
      });
    });
  }

  update(identifier, dbName, updateObject) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.URL, (err, db) => {
        if (err) {
          reject(err);
        }

        db.db(dbName)
          .collection(this.collection)
          .update(identifier, updateObject, (err, res) => {
            if (err) reject(err);
            resolve(res);
            db.close();
          });
      });
    });
  }

  removeFields(id, dbName, fields) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.URL, (err, db) => {
        if (err) {
          reject(err);
        }

        db.db(dbName)
          .collection(this.collection)
          .update(
            {
              _id: id
            },
            fields,
            (err, res) => {
              if (err) reject(err);
              resolve({
                _id: id
              });
              db.close();
            }
          );
      });
    });
  }
}

module.exports = dbConn;
