import _ from 'lodash';
import { useRef } from 'react';

export function transformColumns(columns: any[], transformations?: any[]): any[] {
  let newColumns: any[] = columns;
  if (!transformations) {
    return newColumns;
  }
  const organizeOptions = transformations[0]?.options;
  if (organizeOptions) {
    const { excludeByName, indexByName, renameByName } = organizeOptions;
    if (indexByName) {
      newColumns = _.map(newColumns, (column) => {
        const index = indexByName[column.title];
        return {
          ...column,
          sort: index,
        };
      });
      newColumns = _.sortBy(newColumns, 'sort');
    }
    if (excludeByName) {
      newColumns = _.filter(newColumns, (column) => !excludeByName[column.title]);
    }
    if (renameByName) {
      newColumns = _.map(newColumns, (column) => {
        const newName = renameByName[column.title];
        if (newName) {
          return { ...column, title: newName };
        }
        return column;
      });
    }
  }
  return newColumns;
}

export function arrayToCsv(data: any[]) {
  return _.chain(data)
    .map((row) => {
      return _.chain(row)
        .map(_.toString)
        .map((v) => v.replaceAll('"', '""'))
        .map((v) => `"${v}"`)
        .join(',')
        .value();
    })
    .join('\r\n')
    .value();
}

export function downloadCsv(data: any[], filename: string) {
  const csv = arrayToCsv(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function useDeepCompareWithRef(value) {
  const ref = useRef();
  if (!_.isEqual(value, ref.current)) {
    ref.current = value; //ref.current contains the previous object value
  }

  return ref.current;
}
