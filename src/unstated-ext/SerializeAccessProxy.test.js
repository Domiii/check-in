import makeProxy from './SerializeAccessProxy';
import { db } from 'api/firebase';

it('does collections + documents', () => {
  const p = makeProxy(db);

  expect(p.__serialized).toEqual('');
  expect(p.__result).toBe(db);

  p.collection('users');
  expect(p.__serialized).toEqual('collection["users"]');
  expect(p.__result.constructor.name).toEqual('CollectionReference');

  p.doc('123');
  expect(p.__serialized).toEqual('collection["users"]doc["123"]');
  expect(p.__result.constructor.name).toEqual('DocumentReference');
});


it('does queries', () => {
  // console.log(fs.collection('users').doc('123').path);
  // console.log(fs.collection('users').where('title', '==', 'abc').path);
  const p = makeProxy(db);

  expect(p.__serialized).toEqual('');
  expect(p.__result).toBe(db);

  p.collection('users').where('title', '==', 'abc').orderBy('level');

  expect(p.__serialized).toEqual('collection["users"]where["title","==","abc"]orderBy["level"]');
  expect(p.__result.constructor.name).toEqual('Query');
});
