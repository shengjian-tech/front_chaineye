import React from 'react';
const prefixUrl = import.meta.env.VITE_PREFIX;

export const sourceLogoMap = {
  prometheus: <img src={prefixUrl + '/logos/prometheus_logos.png'} alt='' className='datasource-logo' width='80' />,
  elasticsearch: <img src={prefixUrl + '/logos/elasticSearch.svg'} alt='' className='datasource-logo' width='46' />, // 兼容 n9e
  'aliyun-sls': <img src={prefixUrl + '/logos/aliyun-sls.svg'} alt='' className='datasource-logo' width='132' height='56' />,
  'tencent-cls': <img src={prefixUrl + '/logos/tencent-cls.svg'} alt='' className='datasource-logo' width='132' height='56' />,
  jaeger: <img src={prefixUrl + '/logos/jaeger_logo.png'} alt='' className='datasource-logo' width='40' />,
  ck: <img src={prefixUrl + '/logos/clickhouse.svg'} alt='' className='datasource-logo' width='132' height='56' />,
  zabbix: <img src={prefixUrl + '/logos/zabbix.svg'} alt='' className='datasource-logo' width='132' />,
  influxdb: <img src={prefixUrl + '/logos/influxdb.svg'} alt='' className='datasource-logo' width='132' height='56' />,
  opensearch: <img src={prefixUrl + '/logos/opensearch.svg'} alt='' className='datasource-logo' width='132' height='56' />,
  tdengine: <img src={prefixUrl + '/logos/tdengine.svg'} alt='' className='datasource-logo' width='132' height='56' />,
  loki: <img src={prefixUrl + '/logos/loki_logo.png'} alt='' className='prometheus_logo' width='56' />,
};
