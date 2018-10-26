"use strict";

// const axios = require('axios');
// const sessionStorage = require('sessionstorage')

const { Dexie } = require('dexie');
const { addQuery, createUrl } = require('dumb-url-handler');
const HostUrl = 'http://nyan';
const EndPointUrl = createUrl(HostUrl, ['/api/hongya']);

const setupDexie = () => {
  const setGlobalVars = require('indexeddbshim');
  const thing = {};
  setGlobalVars(thing, {checkOrigin: false});
  const { indexedDB, IDBKeyRange } = thing;
  
  return new Dexie('MyDatabase', {
    indexedDB: indexedDB,
    IDBKeyRange: IDBKeyRange
  })
};

const db = setupDexie();
db.version(1).stores({
  friends: '++id, name, age'
});

(async () => {
  // or make a new one
  await db.friends.add({
    name: 'Camilla',
    age: 25,
  });

  const friend = await db.friends
          .where('age')
          .above(15)
          .toArray();
  
  console.log(friend);
})().then((ret) => {})
    .catch((err) => {
      console.error(err);
    })




const axios = {
  get(url) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            result: 1
          }
        });
      }, 100)
    });
  }
}

function main(seed, n) {
  const handler = new RecursiveHandler();
  handler.recursive(seed, n)
    .then((ret) => {
      console.log(ret)
    })
    .catch((error) => {
      console.log(error)
    })
}

let requestStack = {};
const setStorage = (key, value) => {
  requestStack[key] = value;
}
const getStorage = (key) => {
  requestStack[key];
}

class RecursiveHandler {
  constructor() {
    this.requestStack = {};
  }

  async recursive(inputSeed, inputN) {
    if (inputN === 0) return 1;
    if (inputN === 2) return 2;
    
    try {
      if (inputN % 2 === 0) {
        const retArray = await Promise.all([
          this.recursive(inputSeed, inputN - 1),
          this.recursive(inputSeed, inputN - 2),
          this.recursive(inputSeed, inputN - 3),
          this.recursive(inputSeed, inputN - 4),
        ]);
  
        return retArray.reduce((stack, next) => {
          stack += next;
          return stack;
        }, 0);
      } else {
        const cache = getStorage(inputN);
        // console.log(cache);
        if (cache == null) {
          const ret = await axios.get(addQuery(EndPointUrl, {
            seed: inputSeed,
            n: inputN,
          }));
          const { seed, result, n } = ret.data;
          this.requestStack[inputN] = result;

          setStorage(inputN, result);

          return result;
        } else {
          return cache;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

setStorage(2, 22);

main(
  'hoge',
  20
);