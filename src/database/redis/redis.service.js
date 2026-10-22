import { client } from "../../main.js";

export const get = (key) => {
  return client.get(key);
};
export const set = (key, value, EX) => {
  return client.set(key, value, { EX: EX });
};

export const del = (key) => {
  return client.del(key);
};

export const expire = (key, time) => {
  return client.expire(key, time);
};

export const ttl = (key) => {
  return client.ttl(key);
};

export const incr = (key) => {
  return client.incr(key);
};

export const decr = (key) => {
  return client.decr(key);
};
