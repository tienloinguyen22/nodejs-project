/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';

export const createDefaultSort = (sortField: any) => {
  return (order: any) => {
    return { [sortField]: order };
  };
};

export const toDbSort = (sortBy: any, sortFieldDict: any): any => {
  const localSortBy = sortBy || 'createdAt_des';
  const sortInfo = localSortBy.split('_');
  const sortField = sortInfo[0];
  const sortOrder = sortInfo[1] === 'asc' ? 1 : -1;
  const defaultSort = createDefaultSort(sortField);
  return _.get(sortFieldDict, sortField, defaultSort)(sortOrder);
};

export const createSimpleSetter = (field: any) => {
  return (object: any, value: any) => {
    return _.merge(object, { [field]: value });
  };
};

export const toDbQuery = (searchParams: any, dbQuerySetterDict: any): any => {
  return _.reduce(
    searchParams,
    (prevQuery, value, field) => {
      const resultSetterOrField = _.get(dbQuerySetterDict, field);
      if (!resultSetterOrField) {
        return prevQuery;
      }
      if (resultSetterOrField instanceof Function) {
        return resultSetterOrField(prevQuery, value);
      }
      return createSimpleSetter(resultSetterOrField)(prevQuery, value);
    },
    {},
  );
};

export const toBoolean = (setter: any) => {
  return (obj: any, value: any) => {
    if (value instanceof Boolean) {
      return setter(obj, value);
    }
    if (String(value) === 'true') {
      return setter(obj, true);
    }
    return setter(obj, false);
  };
};

export const ignoreEmptyField = (setter: any): any => {
  return (obj: any, value: any) => {
    if (!value || value === '') {
      return obj;
    }
    return setter(obj, value);
  };
};

export const createSearchSetter = (searchByCharacters: any): any => {
  return (obj: any, value: any) => {
    const newObj = _.cloneDeep(obj);
    if (searchByCharacters) {
      _.set(newObj, '$text.$search', `${value}`);
    } else {
      _.set(newObj, '$text.$search', `"${value}"`);
    }
    return newObj;
  };
};

export const autoFillQuery = (query: any): any => {
  return {
    ...(query || {}),
    limit: Number(query.limit || 20),
    page: Number(query.page || 1),
  };
};
