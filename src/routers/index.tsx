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
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation, Redirect, useHistory } from 'react-router-dom';
import querystring from 'query-string';
import _ from 'lodash';
import { getMenuPerm } from '@/services/common';
import { CommonStateContext } from '@/App';
import Page403 from '@/pages/notFound/Page403';
import NotFound from '@/pages/notFound';
import Login from '@/pages/login';
import Overview from '@/pages/login/overview';
import LoginCallback from '@/pages/loginCallback';
import LoginCallbackCAS from '@/pages/loginCallback/cas';
import LoginCallbackOAuth from '@/pages/loginCallback/oauth';
import AlertRules, { Add as AlertRuleAdd, Edit as AlertRuleEdit } from '@/pages/alertRules';
import AlertRulesBuiltin, { Detail as AlertRulesBuiltinDetail } from '@/pages/alertRulesBuiltin';
import Profile from '@/pages/account/profile';
import { List as Dashboard, Detail as DashboardDetail, Share as DashboardShare } from '@/pages/dashboard';
import Chart from '@/pages/chart';
import Groups from '@/pages/user/groups';
import Users from '@/pages/user/users';
import Business from '@/pages/user/business';
import { Metric as MetricExplore, Log as LogExplore } from '@/pages/explorer';
import IndexPatterns, { Fields as IndexPatternFields } from '@/pages/log/IndexPatterns';
import ObjectExplore from '@/pages/monitor/object';
import Shield, { Add as AddShield, Edit as ShieldEdit } from '@/pages/warning/shield';
import Subscribe, { Add as SubscribeAdd, Edit as SubscribeEdit } from '@/pages/warning/subscribe';
import Event from '@/pages/event';
import EventDetail from '@/pages/event/detail';
import historyEvents from '@/pages/historyEvents';
import Targets from '@/pages/targets';
import Demo from '@/pages/demo';
import TaskTpl from '@/pages/taskTpl';
import TaskTplAdd from '@/pages/taskTpl/add';
import TaskTplDetail from '@/pages/taskTpl/detail';
import TaskTplModify from '@/pages/taskTpl/modify';
import TaskTplClone from '@/pages/taskTpl/clone';
import Task from '@/pages/task';
import TaskAdd from '@/pages/task/add';
import TaskResult from '@/pages/task/result';
import TaskDetail from '@/pages/task/detail';
import Version from '@/pages/help/version';
import Servers from '@/pages/help/servers';
import Datasource, { Form as DatasourceAdd } from '@/pages/datasource';
import RecordingRule, { Add as RecordingRuleAdd, Edit as RecordingRuleEdit } from '@/pages/recordingRules';
import TraceExplorer, { Dependencies as TraceDependencies } from '@/pages/traceCpt/Explorer';
import DashboardBuiltin, { Detail as DashboardBuiltinDetail } from '@/pages/dashboardBuiltin';
import Permissions from '@/pages/permissions';
import SSOConfigs from '@/pages/help/SSOConfigs';
import NotificationTpls from '@/pages/help/NotificationTpls';
import NotificationSettings from '@/pages/help/NotificationSettings';
import MigrateDashboards from '@/pages/help/migrate';
import IBEX from '@/pages/help/NotificationSettings/IBEX';
import VariableConfigs from '@/pages/variableConfigs';
import Brower from '@/pages/brower/index';
import { dynamicPackages, Entry } from '@/utils';
// @ts-ignore
import { Jobs as StrategyBrain } from 'plus:/datasource/anomaly';
// @ts-ignore
import plusLoader from 'plus:/utils/loader';
// @ts-ignore
import useIsPlus from 'plus:/components/useIsPlus';

const Packages = dynamicPackages();
let lazyRoutes = Packages.reduce((result: any, module: Entry) => {
  return (result = result.concat(module.routes));
}, []);
const prefixUrl = import.meta.env.VITE_PREFIX;

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

export default function Content() {
  const location = useLocation();
  const history = useHistory();
  const isPlus = useIsPlus();
  console.log(import.meta.env.VITE_PREFIX, '***process.env.REACT_APP_PREFIX****');
  const { profile, siteInfo } = useContext(CommonStateContext);
  // 仪表盘在全屏和暗黑主题下需要定义个 dark 样式名
  let themeClassName = '';
  if (location.pathname.indexOf(prefixUrl + '/dashboard') === 0) {
    const query = querystring.parse(location.search);
    if (query?.themeMode === 'dark') {
      themeClassName = 'theme-dark';
    }
  }

  useEffect(() => {
    if (profile?.roles?.length > 0 && location.pathname !== prefixUrl + '/') {
      if (profile?.roles.indexOf('Admin') === -1) {
        getMenuPerm().then((res) => {
          const { dat } = res;
          // 如果没有权限则重定向到 403 页面
          if (
            _.every(dat, (item) => {
              return location.pathname.indexOf(item) === -1;
            })
          ) {
            history.push(prefixUrl + '/403');
          }
        });
      }
    }
  }, []);

  return (
    <div className={`content ${themeClassName}`}>
      {/* <Router basename={prefixUrl}> */}
      <Switch>
        <Route path={prefixUrl + '/demo'} component={Demo} />
        <Route path={prefixUrl + '/overview'} component={Overview} />
        <Route path={prefixUrl + '/login'} component={Login} exact />
        <Route path={prefixUrl + '/callback'} component={LoginCallback} exact />
        <Route path={prefixUrl + '/callback/cas'} component={LoginCallbackCAS} exact />
        <Route path={prefixUrl + '/callback/oauth'} component={LoginCallbackOAuth} exact />
        <Route path={prefixUrl + '/metric/explorer'} component={MetricExplore} exact />
        <Route path={prefixUrl + '/log/explorer'} component={LogExplore} exact />
        <Route path={prefixUrl + '/log/index-patterns'} component={IndexPatterns} exact />
        <Route path={prefixUrl + '/log/index-patterns/:id'} component={IndexPatternFields} exact />
        <Route path={prefixUrl + '/object/explorer'} component={ObjectExplore} exact />
        <Route path={prefixUrl + '/busi-groups'} component={Business} />
        <Route path={prefixUrl + '/users'} component={Users} />
        <Route path={prefixUrl + '/user-groups'} component={Groups} />
        <Route path={prefixUrl + '/account/profile/:tab'} component={Profile} />

        <Route path={prefixUrl + '/dashboard/:id'} exact component={DashboardDetail} />
        <Route path={prefixUrl + '/dashboards/:id'} exact component={DashboardDetail} />
        <Route path={prefixUrl + '/dashboards/share/:id'} component={DashboardShare} />
        <Route path={prefixUrl + '/dashboards'} component={Dashboard} />
        <Route path={prefixUrl + '/dashboards-built-in'} exact component={DashboardBuiltin} />
        <Route path={prefixUrl + '/dashboards-built-in/detail'} exact component={DashboardBuiltinDetail} />
        <Route path={prefixUrl + '/chart/:ids'} component={Chart} />

        <Route exact path={prefixUrl + '/alert-rules/add/:bgid'} component={AlertRuleAdd} />
        <Route exact path={prefixUrl + '/alert-rules/edit/:id'} component={AlertRuleEdit} />
        <Route exact path={prefixUrl + '/alert-rules'} component={AlertRules} />
        <Route exact path={prefixUrl + '/alert-rules-built-in'} component={AlertRulesBuiltin} />
        <Route exact path={prefixUrl + '/alert-rules-built-in/detail'} component={AlertRulesBuiltinDetail} />
        <Route exact path={prefixUrl + '/alert-rules/brain/:id'} component={StrategyBrain} />
        <Route exact path={prefixUrl + '/alert-mutes'} component={Shield} />
        <Route exact path={prefixUrl + '/alert-mutes/add/:from?'} component={AddShield} />
        <Route exact path={prefixUrl + '/alert-mutes/edit/:id'} component={ShieldEdit} />
        <Route exact path={prefixUrl + '/alert-subscribes'} component={Subscribe} />
        <Route exact path={prefixUrl + '/alert-subscribes/add'} component={SubscribeAdd} />
        <Route exact path={prefixUrl + '/alert-subscribes/edit/:id'} component={SubscribeEdit} />

        {!isPlus && [
          <Route key='recording-rules' exact path={prefixUrl + '/recording-rules/:id?'} component={RecordingRule} />,
          <Route key='recording-rules-add' exact path={prefixUrl + '/recording-rules/add/:group_id'} component={RecordingRuleAdd} />,
          <Route key='recording-rules-edit' exact path={prefixUrl + '/recording-rules/edit/:id'} component={RecordingRuleEdit} />,
        ]}

        <Route exact path={prefixUrl + '/alert-cur-events'} component={Event} />
        <Route exact path={prefixUrl + '/alert-his-events'} component={historyEvents} />
        <Route exact path={prefixUrl + '/alert-cur-events/:eventId'} component={EventDetail} />
        <Route exact path={prefixUrl + '/alert-his-events/:eventId'} component={EventDetail} />
        <Route exact path={prefixUrl + '/targets'} component={Targets} />

        <Route exact path={prefixUrl + '/job-tpls'} component={TaskTpl} />
        <Route exact path={prefixUrl + '/job-tpls/add'} component={TaskTplAdd} />
        <Route exact path={prefixUrl + '/job-tpls/add/task'} component={TaskAdd} />
        <Route exact path={prefixUrl + '/job-tpls/:id/detail'} component={TaskTplDetail} />
        <Route exact path={prefixUrl + '/job-tpls/:id/modify'} component={TaskTplModify} />
        <Route exact path={prefixUrl + '/job-tpls/:id/clone'} component={TaskTplClone} />
        <Route exact path={prefixUrl + '/job-tasks'} component={Task} />
        <Route exact path={prefixUrl + '/job-tasks/add'} component={TaskAdd} />
        <Route exact path={prefixUrl + '/job-tasks/:id/result'} component={TaskResult} />
        <Route exact path={prefixUrl + '/job-tasks/:id/detail'} component={TaskDetail} />
        <Route exact path={prefixUrl + '/ibex-settings'} component={IBEX} />

        <Route exact path={prefixUrl + '/help/version'} component={Version} />
        <Route exact path={prefixUrl + '/help/servers'} component={Servers} />
        <Route exact path={prefixUrl + '/help/source'} component={Datasource} />
        <Route exact path={prefixUrl + '/help/source/:action/:type'} component={DatasourceAdd} />
        <Route exact path={prefixUrl + '/help/source/:action/:type/:id'} component={DatasourceAdd} />
        <Route exact path={prefixUrl + '/help/sso'} component={SSOConfigs} />
        <Route exact path={prefixUrl + '/help/notification-tpls'} component={NotificationTpls} />
        <Route exact path={prefixUrl + '/help/notification-settings'} component={NotificationSettings} />
        <Route exact path={prefixUrl + '/help/migrate'} component={MigrateDashboards} />
        <Route exact path={prefixUrl + '/help/variable-configs'} component={VariableConfigs} />

        <Route exact path={prefixUrl + '/trace/explorer'} component={TraceExplorer} />
        <Route exact path={prefixUrl + '/trace/dependencies'} component={TraceDependencies} />

        <Route exact path={prefixUrl + '/permissions'} component={Permissions} />
        <Route exact path={prefixUrl + '/brower'} component={Brower} />

        {lazyRoutes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
        {_.map(plusLoader.routes, (route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
        <Route path={prefixUrl + '/'} exact>
          {/* <Redirect to={siteInfo?.home_page_url || '/metric/explorer'} /> */}
          <Redirect to={siteInfo?.home_page_url || prefixUrl + '/brower'} />
        </Route>
        <Route path={prefixUrl + '/403'} component={Page403} />
        <Route path={prefixUrl + '/404'} component={NotFound} />
        <Route path='*' component={NotFound} />
      </Switch>
      {/* </Router> */}
    </div>
  );
}
