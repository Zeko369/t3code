import { useAtomSet, useAtomValue } from "@effect/atom-react";
import { DEFAULT_SIDEBAR_THREAD_LIST_SORT_ORDER } from "@t3tools/contracts";
import type { SidebarThreadListSortOrder } from "@t3tools/contracts";
import { AsyncResult } from "effect/unstable/reactivity";
import { useCallback } from "react";

import { mobilePreferencesAtom, updateMobilePreferencesAtom } from "../../state/preferences";

/**
 * How the flat thread list orders its active block, stored per device (the
 * web counterpart is the synced `sidebarThreadListSortOrder` client
 * setting). Until preferences load, the shipped creation order applies —
 * the same value an unset preference resolves to, so the list never
 * reshuffles on hydration.
 */
export function useThreadListSortOrder(): {
  readonly threadListSortOrder: SidebarThreadListSortOrder;
  readonly setThreadListSortOrder: (sortOrder: SidebarThreadListSortOrder) => void;
} {
  const preferencesResult = useAtomValue(mobilePreferencesAtom);
  const savePreferences = useAtomSet(updateMobilePreferencesAtom);
  const threadListSortOrder = AsyncResult.isSuccess(preferencesResult)
    ? (preferencesResult.value.threadListSortOrder ?? DEFAULT_SIDEBAR_THREAD_LIST_SORT_ORDER)
    : DEFAULT_SIDEBAR_THREAD_LIST_SORT_ORDER;
  const setThreadListSortOrder = useCallback(
    (sortOrder: SidebarThreadListSortOrder) => {
      savePreferences({ threadListSortOrder: sortOrder });
    },
    [savePreferences],
  );
  return { threadListSortOrder, setThreadListSortOrder };
}
