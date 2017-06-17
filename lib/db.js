const Datastore = require('nedb')
const db = new Datastore({ filename: 'data.db', autoload: true });

const find = () => {
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      err ? reject(err) : resolve(docs[0]);
    });
  });
}

const insert = (obj) => {
  return new Promise((resolve, reject) => {
    db.insert(obj, (err, newDoc) => {
      err ? reject(err) : resolve(newDoc);
    });
  });
}



module.exports.find = find;
module.exports.insert = insert;
