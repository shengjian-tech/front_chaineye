/*
 * Copyright 2022 ChainEye Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import _ from 'lodash';
import moment from 'moment';
import { utilValMap } from '../config';
import * as byteConverter from './byteConverter';

export function timeFormatter(val, type: 'seconds' | 'milliseconds', decimals) {
  if (typeof val !== 'number')
    return {
      value: val,
      unit: '',
      text: val,
      stat: val,
    };
  const timeMap = [
    {
      unit: 'years',
      value: 31104000,
    },
    {
      unit: 'months',
      value: 2592000,
    },
    {
      unit: 'weeks',
      value: 604800,
    },
    {
      unit: 'days',
      value: 86400,
    },
    {
      unit: 'hours',
      value: 3600,
    },
    {
      unit: 'mins',
      value: 60,
    },
  ];
  const shortTypeMap = {
    seconds: 's',
    milliseconds: 'ms',
  };
  let newVal = val;
  let unit = shortTypeMap[type];
  _.forEach(timeMap, (item) => {
    const _val = val / item.value / (type === 'milliseconds' ? 1000 : 1);
    if (_val >= 1) {
      newVal = _val;
      unit = item.unit;
      return false;
    }
  });
  if (type === 'milliseconds' && unit === 'ms') {
    const _val = newVal / 1000;
    if (_val >= 1) {
      newVal = _val;
      unit = 's';
    }
  }
  return {
    value: _.round(newVal, decimals),
    unit,
    text: _.round(newVal, decimals) + ' ' + unit,
    stat: val,
  };
}

const valueFormatter = ({ unit, decimals = 3, dateFormat = 'YYYY-MM-DD HH:mm:ss' }, val) => {
  if (val === null || val === '' || val === undefined) {
    return {
      value: '',
      unit: '',
      text: '',
      stat: '',
    };
  }
  if (decimals === null) decimals = 3;
  if (typeof val !== 'number') {
    val = _.toNumber(val);
  }
  if (unit) {
    const utilValObj = utilValMap[unit];
    if (utilValObj) {
      const { type, base, postfix } = utilValObj;
      return byteConverter.format(val, {
        type,
        base,
        decimals,
        postfix,
      });
    }
    if (unit === 'none') {
      return {
        value: _.round(val, decimals),
        unit: '',
        text: _.round(val, decimals),
        stat: val,
      };
    }
    if (unit === 'percent') {
      return {
        value: _.round(val, decimals),
        unit: '%',
        text: _.round(val, decimals) + '%',
        stat: val,
      };
    }
    if (unit === 'percentUnit') {
      return {
        value: _.round(val * 100, decimals),
        unit: '%',
        text: _.round(val * 100, decimals) + '%',
        stat: val,
      };
    }
    if (unit === 'humantimeSeconds') {
      return {
        value: moment.duration(val, 'seconds').humanize(),
        unit: '',
        text: moment.duration(val, 'seconds').humanize(),
        stat: val,
      };
    }
    if (unit === 'humantimeMilliseconds') {
      return {
        value: moment.duration(val, 'milliseconds').humanize(),
        unit: '',
        text: moment.duration(val, 'milliseconds').humanize(),
        stat: val,
      };
    }
    if (unit === 'seconds') {
      return timeFormatter(val, unit, decimals);
    }
    if (unit === 'milliseconds') {
      return timeFormatter(val, unit, decimals);
    }
    if (unit === 'datetimeSeconds') {
      return {
        value: moment.unix(val).format(dateFormat),
        unit: '',
        text: moment.unix(val).format(dateFormat),
        stat: val,
      };
    }
    if (unit === 'datetimeMilliseconds') {
      return {
        value: moment(val).format(dateFormat),
        unit: '',
        text: moment(val).format(dateFormat),
        stat: val,
      };
    }
    return {
      value: _.round(val, decimals),
      unit: '',
      text: _.round(val, decimals),
      stat: val,
    };
  }
  // 默认返回 SI 不带基础单位
  return byteConverter.format(val, {
    type: 'si',
    decimals,
  });
};
export default valueFormatter;
