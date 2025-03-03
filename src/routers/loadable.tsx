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
import React from 'react';
import { Spin } from 'antd';

const loadComp = (Com: React.LazyExoticComponent<any>) => {
  return class LoadComp extends React.Component<any, any> {
    render() {
      return (
        <React.Suspense
          fallback={
            <div
              style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spin />
            </div>
          }
        >
          <Com />
        </React.Suspense>
      );
    }
  };
};

export default loadComp;
