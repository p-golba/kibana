/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Apply DataView indices to all installed engines
 *   version: 2023-10-31
 */

import { z } from '@kbn/zod';

export type EngineDataviewUpdateResult = z.infer<typeof EngineDataviewUpdateResult>;
export const EngineDataviewUpdateResult = z.object({
  type: z.string(),
  changes: z
    .object({
      indexPatterns: z.array(z.string()).optional(),
    })
    .optional(),
});

export type ApplyEntityEngineDataviewIndicesResponse = z.infer<
  typeof ApplyEntityEngineDataviewIndicesResponse
>;
export const ApplyEntityEngineDataviewIndicesResponse = z.object({
  success: z.boolean().optional(),
  result: z.array(EngineDataviewUpdateResult).optional(),
});
