/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Dispatch, useEffect, useRef, useState } from 'react';
import type {
  CreateExceptionListItemSchema,
  PersistHookProps,
  UpdateExceptionListItemSchema,
} from '@kbn/securitysolution-io-ts-list-types';
import { addExceptionListItem, updateExceptionListItem } from '@kbn/securitysolution-list-api';

import { transformNewItemOutput, transformOutput } from '../transforms';

interface PersistReturnExceptionItem {
  isLoading: boolean;
  isSaved: boolean;
}

export type ReturnPersistExceptionItem = [
  PersistReturnExceptionItem,
  Dispatch<CreateExceptionListItemSchema | UpdateExceptionListItemSchema | null>
];

// TODO: Add this to @kbn/securitysolution-list-hooks

/**
 * Hook for creating or updating ExceptionListItem
 *
 * @param http Kibana http service
 * @param onError error callback
 *
 */
export const usePersistExceptionItem = ({
  http,
  onError,
}: PersistHookProps): ReturnPersistExceptionItem => {
  const [exceptionListItem, setExceptionItem] = useState<
    CreateExceptionListItemSchema | UpdateExceptionListItemSchema | null
  >(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isUpdateExceptionItem = (item: unknown): item is UpdateExceptionListItemSchema =>
    Boolean(item && (item as UpdateExceptionListItemSchema).id != null);
  const isSubscribed = useRef(false);

  useEffect(() => {
    let abortCtrl: AbortController | null = null;
    isSubscribed.current = true;
    setIsSaved(false);

    const saveExceptionItem = async (): Promise<void> => {
      if (exceptionListItem === null) {
        return;
      }

      try {
        abortCtrl = new AbortController();
        setIsLoading(true);

        if (isUpdateExceptionItem(exceptionListItem)) {
          // Please see `x-pack/solutions/security/plugins/lists/public/exceptions/transforms.ts` doc notes
          // for context around the temporary `id`
          const transformedList = transformOutput(exceptionListItem);

          await updateExceptionListItem({
            http,
            listItem: transformedList,
            signal: abortCtrl.signal,
          });
        } else {
          // Please see `x-pack/solutions/security/plugins/lists/public/exceptions/transforms.ts` doc notes
          // for context around the temporary `id`
          const transformedList = transformNewItemOutput(exceptionListItem);

          await addExceptionListItem({
            http,
            listItem: transformedList,
            signal: abortCtrl.signal,
          });
        }

        if (isSubscribed.current) {
          setIsSaved(true);
        }
      } catch (error) {
        if (isSubscribed.current) {
          onError(error);
        }
      } finally {
        if (isSubscribed.current) {
          setIsLoading(false);
        }
      }
    };

    saveExceptionItem();

    return (): void => {
      isSubscribed.current = false;
      abortCtrl?.abort();
    };
  }, [http, exceptionListItem, onError]);

  return [{ isLoading, isSaved }, setExceptionItem];
};
