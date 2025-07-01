// File: src/utils/sharedState.js

let memory = {};

export const setData = (key, value) => {
  memory[key] = value;
};

export const getData = (key) => {
  return memory[key];
};

export const clearData = (key) => {
  delete memory[key];
};

export const resetMemory = () => {
  memory = {};
};