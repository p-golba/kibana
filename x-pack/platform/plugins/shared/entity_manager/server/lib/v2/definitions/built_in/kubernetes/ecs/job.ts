/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { BUILT_IN_ID_PREFIX } from '../../constants';
import { commonEcsIndexPatterns } from './ecs_index_patterns';
import { BuiltInDefinition } from '../../../../types';

export const builtInKubernetesJobEcsEntityDefinition: BuiltInDefinition = {
  type: {
    id: `${BUILT_IN_ID_PREFIX}kubernetes_job_ecs`,
    display_name: 'Kubernetes Jobs (ECS)',
  },
  sources: [
    {
      id: `${BUILT_IN_ID_PREFIX}kubernetes_job_ecs_ecs`,
      type_id: `${BUILT_IN_ID_PREFIX}kubernetes_job_ecs`,
      index_patterns: commonEcsIndexPatterns,
      identity_fields: ['kubernetes.job.name'],
      display_name: 'kubernetes.job.name',
      timestamp_field: '@timestamp',
      metadata_fields: [],
      filters: ['kubernetes.job.name: *'],
    },
  ],
};
