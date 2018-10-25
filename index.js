"use strict";

// const axios = require('axios');
const { addQuery, createUrl } = require('dumb-url-handler');
const HostUrl = 'http://nyan';
const EndPointUrl = createUrl(HostUrl, ['/api/hongya']);

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

async function main(seed, n) {
  const handler = new RecursiveHandler();

  try {
    const ret = await handler.recursive(seed, n);
    console.log(ret);
  } catch(error) {
  }
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
        const cache = sessionStorage.getItem(inputN);
        if (cache == null) {
          const ret = await axios.get(addQuery(EndPointUrl, {
            seed: inputSeed,
            n: inputN,
          }));
          const { seed, result, n } = ret.data;
          this.requestStack[inputN] = result;

          sessionStorage.setItem(inputN, result);

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

main(
  'hoge',
  20
);