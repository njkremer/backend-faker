import { FakeEntity } from "../types"
import { get, set } from 'idb-keyval';
import { trim } from "../utils/utils";

const splitPath = (path: string) => {
  const pathParts = path.split('/');

  return pathParts.filter(x => !!x);
}

const parsePath = (path: string) => {
  const pathParts = splitPath(path);

  const entities: string[] = [];
  const entityIds: number[] = [];

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    const isEntity = i % 2 === 0;
    if (isEntity) {
      entities.push(part);
    }
    else {
      if (Number.isNaN(part)) {
        throw new Error(`${part} must be an :id identifier which needs to be a number. E.g. /list/:id/items/:id`);
      }
      else {
        entityIds.push(Number(part));
      }
    }
  };

  return {
    entities,
    entityIds
  }
}

const getOne = async <T extends FakeEntity>(path: string): Promise<T> => {
  const pathParts = splitPath(path);
  const isGetSingle = pathParts.length % 2 === 0;
  if (isGetSingle === false) {
    throw new Error('get(path: string) only returns a single item by :id. E.g. /list/:id');
  }

  const { entities, entityIds } = parsePath(path);

  let currentEntity: T | null = null;
  let currentEntityName = '';

  for (let i = 0; i < entities.length; i++) {
    currentEntityName = trim(`${currentEntityName}-${entities[i]}-`, '-');

    const entityId = Number(entityIds[i]);

    const allEntities = await get<T[]>(currentEntityName) ?? [];

    const potentialEntity = allEntities.find(x => x.id === entityId);

    if (potentialEntity) {
      currentEntity = potentialEntity;
    }
    else {
      throw new Error(`Could not find entity of type ${currentEntityName} with id ${entityId}`);
    }
  }

  if (currentEntity === null) {
    throw new Error(`An error occured trying to get an entity for path ${path}. Please check your path and try again.`);
  }

  return currentEntity;
}

const getMany = async <T extends FakeEntity>(path: string): Promise<T[]> => {
  const pathParts = splitPath(path);;
  const isGetMany = pathParts.length % 2 !== 0;
  if (isGetMany === false) {
    throw new Error('get(path: string) only returns an array of items E.g. /list or /list/:id/items');
  }

  const { entities, entityIds } = parsePath(path);

  let currentEntity: T | undefined;
  let previousEntity: T | undefined;

  let currentEntityName = '';
  let previousEntityName = '';

  let foundEntities: T[] = [];

  for (let i = 0; i < entities.length; i++) {
    previousEntityName = currentEntityName;

    currentEntityName = trim(`${currentEntityName}-${entities[i]}-`, '-');

    const allEntities = await get<T[]>(currentEntityName) ?? [];

    const entityId = entityIds[i];
    if (entityId) {
      previousEntity = currentEntity;
      currentEntity = allEntities.find(x => x.id === entityId);
    }
    else if (previousEntity) {
      const relatedKey = previousEntityName + 'Id';
      foundEntities = allEntities.filter(x => (x as any)[relatedKey] === previousEntity!.id);
    }
    else {
      foundEntities = allEntities;
    }
  }

  return foundEntities;
}

const post = async <T extends FakeEntity>(path: string, entity: T): Promise<T> => {
  const pathParts = splitPath(path);;
  const isUpdate = pathParts.length % 2 === 0;

  const { entities, entityIds } = parsePath(path);

  const entityName = entities.join('-');
  const lastId = entityIds.pop();

  const newEntity: T = {
    ...entity
  };

  if (isUpdate) {
    if (!!lastId === false) {
      throw new Error('Updating an entity requires an id. E.g. /list/:id');
    }
    const allEntities = await get<T[]>(entityName) ?? [];
    const entityIndex = allEntities.findIndex(x => x.id = lastId);

    allEntities[entityIndex] = newEntity;

    await set(entityName, allEntities);
  }
  else { // isInsert
    const allEntities = await get<T[]>(entityName) ?? [];
    const newId = allEntities.sort((left, right) => right.id - left.id)[0]?.id ?? 1;

    newEntity.id = newId;
    let currentEntityName = '';

    for (let i = 0; i < entityIds.length; i++) {
      currentEntityName = trim(`${currentEntityName}-${entities[i]}-`, '-');
      const currentEntityId = entityIds[i];

      const relatedEntityKey = currentEntityName + 'Id';

      (newEntity as any)[relatedEntityKey] = currentEntityId;
    }

    allEntities.push(newEntity);

    await set(entityName, allEntities);
  }

  return newEntity;
}

const deleteEntity = async <T extends FakeEntity>(path: string) => {
  const pathParts = splitPath(path);;
  const hasIdentifier = pathParts.length % 2 === 0;
  if (hasIdentifier === false) {
    throw new Error('delete(path: string) only allows for deleting a single item by :id. E.g. /list/:id');
  }

  const { entities, entityIds } = parsePath(path);

  const entityName = entities.join('-');
  const lastId = entityIds.pop();

  if (!!lastId === false) {
    throw new Error('Deleting an entity requires an id. E.g. /list/:id');
  }
  const allEntities = await get<T[]>(entityName) ?? [];
  const entitiesWithItemDeleted = allEntities.filter(x => x.id !== lastId);

  if (allEntities.length === entitiesWithItemDeleted.length) {
    throw new Error(`An error occured trying to delete an entity for path ${path}. Please check your path and try again.`);
  }

  await set(entityName, entitiesWithItemDeleted);
}

export {
  getOne as get,
  getMany,
  post,
  deleteEntity as delete
}