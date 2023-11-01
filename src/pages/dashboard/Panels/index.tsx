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
import React, { useRef, useContext, useEffect } from 'react';
import _ from 'lodash';
import semver from 'semver';
import { v4 as uuidv4 } from 'uuid';
import { message, Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import querystring from 'query-string';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { IRawTimeRange } from '@/components/TimeRangePicker';
import { updateDashboardConfigs as updateDashboardConfigsFunc } from '@/services/dashboardV2';
import { Dashboard } from '@/store/dashboardInterface';
import { CommonStateContext } from '@/App';
import {
  buildLayout,
  sortPanelsByGridLayout,
  updatePanelsLayout,
  handleRowToggle,
  updatePanelsWithNewPanel,
  updatePanelsInsertNewPanel,
  panelsMergeToConfigs,
  getRowCollapsedPanels,
  getRowUnCollapsedPanels,
  processRepeats,
} from './utils';
import Renderer from '../Renderer/Renderer/index';
import Row from './Row';
import EditorModal from './EditorModal';
import './style.less';

interface IProps {
  dashboardId: string;
  editable: boolean;
  dashboard: Dashboard;
  range: IRawTimeRange;
  variableConfig: any;
  panels: any[];
  isPreview: boolean;
  setPanels: React.Dispatch<React.SetStateAction<any[]>>;
  onShareClick: (panel: any) => void;
  onUpdated: (res: any) => void;
}

const ReactGridLayout = WidthProvider(RGL);

function index(props: IProps) {
  const { profile } = useContext(CommonStateContext);
  const location = useLocation();
  const { themeMode } = querystring.parse(location.search);
  const { editable, dashboard, range, variableConfig, panels, isPreview, setPanels, onShareClick, onUpdated } = props;
  const roles = _.get(profile, 'roles', []);
  const isAuthorized = !_.some(roles, (item) => item === 'Guest') && !isPreview;
  const layoutInitialized = useRef(false);
  const allowUpdateDashboardConfigs = useRef(false);
  const reactGridLayoutDefaultProps = {
    rowHeight: 40,
    cols: 24,
    useCSSTransforms: false,
    draggableHandle: '.dashboards-panels-item-drag-handle',
  };
  const updateDashboardConfigs = (dashboardId, options) => {
    if (!editable) {
      message.warning('仪表盘已经被别人修改，为避免相互覆盖，请刷新仪表盘查看最新配置和数据');
    }
    if (!_.isEmpty(roles) && isAuthorized && editable) {
      return updateDashboardConfigsFunc(dashboardId, options);
    }
    return Promise.reject();
  };
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setPanels(processRepeats(panels, variableConfig));
  }, []);

  return (
    <div className='dashboards-panels'>
      <ReactGridLayout
        layout={buildLayout(panels)}
        onLayoutChange={(layout) => {
          if (layoutInitialized.current) {
            const newPanels = sortPanelsByGridLayout(updatePanelsLayout(panels, layout));
            if (!_.isEqual(panels, newPanels)) {
              setPanels(newPanels);
              // TODO: 这里可能会触发两次 update, 删除、克隆面板后可能会触发 layoutChange，此时需要更新面板重新更新下 dashboard 配置
              if (allowUpdateDashboardConfigs.current) {
                allowUpdateDashboardConfigs.current = false;
                updateDashboardConfigs(dashboard.id, {
                  configs: panelsMergeToConfigs(dashboard.configs, newPanels),
                }).then((res) => {
                  onUpdated(res);
                });
              }
            }
          }
          layoutInitialized.current = true;
        }}
        onDragStop={(layout) => {
          const newPanels = sortPanelsByGridLayout(updatePanelsLayout(panels, layout));
          if (!_.isEqual(panels, newPanels)) {
            updateDashboardConfigs(dashboard.id, {
              configs: panelsMergeToConfigs(dashboard.configs, newPanels),
            }).then((res) => {
              onUpdated(res);
            });
          }
        }}
        onResizeStop={(layout) => {
          const newPanels = sortPanelsByGridLayout(updatePanelsLayout(panels, layout));
          if (!_.isEqual(panels, newPanels)) {
            updateDashboardConfigs(dashboard.id, {
              configs: panelsMergeToConfigs(dashboard.configs, newPanels),
            }).then((res) => {
              onUpdated(res);
            });
          }
        }}
        {...reactGridLayoutDefaultProps}
      >
        {_.map(panels, (item) => {
          return (
            <div key={item.layout.i} data-id={item.layout.i}>
              {item.type !== 'row' ? (
                semver.valid(item.version) ? (
                  <Renderer
                    isPreview={!isAuthorized}
                    themeMode={themeMode as 'dark'}
                    dashboardId={_.toString(props.dashboardId)}
                    id={item.id}
                    time={range}
                    values={item}
                    variableConfig={variableConfig}
                    onCloneClick={() => {
                      setPanels((panels) => {
                        return updatePanelsInsertNewPanel(panels, {
                          ...item,
                          id: uuidv4(),
                          layout: {
                            ...item.layout,
                            i: uuidv4(),
                          },
                        });
                      });

                      // 克隆面板必然会触发 layoutChange，更新 dashboard 放到 onLayoutChange 里面处理
                      allowUpdateDashboardConfigs.current = true;
                    }}
                    onShareClick={() => {
                      onShareClick(item);
                    }}
                    onEditClick={() => {
                      editorRef.current?.setEditorData({
                        mode: 'edit',
                        visible: true,
                        id: item.id,
                        initialValues: {
                          ...item,
                          id: item.id,
                        },
                      });
                    }}
                    onDeleteClick={() => {
                      Modal.confirm({
                        title: `是否删除图表：${item.name}`,
                        onOk: async () => {
                          setPanels((panels) => {
                            const newPanels = _.filter(panels, (panel) => panel.id !== item.id);
                            allowUpdateDashboardConfigs.current = true;
                            updateDashboardConfigs(dashboard.id, {
                              configs: panelsMergeToConfigs(dashboard.configs, newPanels),
                            }).then((res) => {
                              onUpdated(res);
                            });
                            return newPanels;
                          });
                        },
                      });
                    }}
                  />
                ) : (
                  <div className='dashboards-panels-item-invalid'>
                    <div>
                      <div>无效的图表配置</div>
                      <a
                        onClick={() => {
                          const newPanels = _.filter(panels, (panel) => panel.id !== item.id);
                          allowUpdateDashboardConfigs.current = true;
                          setPanels(newPanels);
                          updateDashboardConfigs(dashboard.id, {
                            configs: panelsMergeToConfigs(dashboard.configs, newPanels),
                          }).then((res) => {
                            onUpdated(res);
                          });
                        }}
                      >
                        删除
                      </a>
                    </div>
                  </div>
                )
              ) : (
                <Row
                  isPreview={!isAuthorized}
                  name={item.name}
                  row={item}
                  onToggle={() => {
                    const newPanels = handleRowToggle(!item.collapsed, panels, _.cloneDeep(item));
                    setPanels(newPanels);
                    updateDashboardConfigs(dashboard.id, {
                      configs: panelsMergeToConfigs(dashboard.configs, newPanels),
                    }).then((res) => {
                      onUpdated(res);
                    });
                  }}
                  onAddClick={() => {
                    editorRef.current?.setEditorData({
                      mode: 'add',
                      visible: true,
                      id: item.id,
                      initialValues: {
                        type: 'timeseries',
                        name: 'Panel Title',
                        targets: [
                          {
                            refId: 'A',
                            expr: '',
                          },
                        ],
                      },
                    });
                  }}
                  onEditClick={(newPanel) => {
                    const newPanels = updatePanelsWithNewPanel(panels, newPanel);
                    setPanels(newPanels);
                    updateDashboardConfigs(dashboard.id, {
                      configs: panelsMergeToConfigs(dashboard.configs, newPanels),
                    }).then((res) => {
                      onUpdated(res);
                    });
                  }}
                  onDeleteClick={(mode: 'self' | 'withPanels') => {
                    let newPanels: any[] = _.cloneDeep(panels);
                    if (mode === 'self') {
                      newPanels = getRowCollapsedPanels(newPanels, item);
                      newPanels = _.filter(newPanels, (panel) => panel.id !== item.id);
                    } else {
                      newPanels = getRowUnCollapsedPanels(newPanels, item);
                      newPanels = _.filter(newPanels, (panel) => panel.id !== item.id);
                    }
                    allowUpdateDashboardConfigs.current = true;
                    setPanels(newPanels);
                    updateDashboardConfigs(dashboard.id, {
                      configs: panelsMergeToConfigs(dashboard.configs, newPanels),
                    }).then((res) => {
                      onUpdated(res);
                    });
                  }}
                />
              )}
            </div>
          );
        })}
      </ReactGridLayout>

      <EditorModal
        ref={editorRef}
        dashboardId={props.dashboardId}
        variableConfig={variableConfig}
        range={range}
        dashboard={dashboard}
        panels={panels}
        setPanels={setPanels}
        updateDashboardConfigs={updateDashboardConfigs}
        onUpdated={onUpdated}
      />
    </div>
  );
}

export default React.memo(index);
