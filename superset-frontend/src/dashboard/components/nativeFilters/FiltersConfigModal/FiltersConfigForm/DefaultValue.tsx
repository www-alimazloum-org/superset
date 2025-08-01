/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { FC } from 'react';
import {
  Behavior,
  SetDataMaskHook,
  SuperChart,
  AppSection,
  t,
} from '@superset-ui/core';
import { Loading, type FormInstance } from '@superset-ui/core/components';
import { NativeFiltersForm } from '../types';
import { getFormData } from '../../utils';
import {
  INPUT_HEIGHT,
  INPUT_WIDTH,
  TIME_FILTER_INPUT_WIDTH,
} from './constants';

type DefaultValueProps = {
  hasDefaultValue: boolean;
  filterId: string;
  setDataMask: SetDataMaskHook;
  hasDataset: boolean;
  form: FormInstance<NativeFiltersForm>;
  formData: ReturnType<typeof getFormData>;
  enableNoResults: boolean;
};

const DefaultValue: FC<DefaultValueProps> = ({
  hasDefaultValue,
  filterId,
  hasDataset,
  form,
  setDataMask,
  formData,
  enableNoResults,
}) => {
  const formFilter = form.getFieldValue('filters')?.[filterId];
  const queriesData = formFilter?.defaultValueQueriesData;
  const loading = hasDataset && queriesData === null;
  const value = formFilter?.defaultDataMask?.filterState?.value;
  const isMissingRequiredValue =
    hasDefaultValue && (value === null || value === undefined);
  return loading ? (
    <Loading position="inline-centered" />
  ) : (
    <SuperChart
      height={INPUT_HEIGHT}
      width={
        formFilter?.filterType === 'filter_time'
          ? TIME_FILTER_INPUT_WIDTH
          : INPUT_WIDTH
      }
      appSection={AppSection.FilterConfigModal}
      behaviors={[Behavior.NativeFilter]}
      formData={formData}
      // For charts that don't have datasource we need workaround for empty placeholder
      queriesData={
        hasDataset ? formFilter?.defaultValueQueriesData : [{ data: [{}] }]
      }
      chartType={formFilter?.filterType}
      hooks={{ setDataMask }}
      enableNoResults={enableNoResults}
      filterState={{
        ...formFilter?.defaultDataMask?.filterState,
        validateMessage: isMissingRequiredValue && t('Value is required'),
        validateStatus: isMissingRequiredValue && 'error',
      }}
    />
  );
};

export default DefaultValue;
