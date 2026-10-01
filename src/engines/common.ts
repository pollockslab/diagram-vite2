/**
 * [Function] PatchObjectDeep
 * @description 타겟 오브젝트에 존재하는 Key 부분만(하위 구조 포함), 소스 오브젝트의 값으로 덮어쓴다
 * @param target 값을 저장할 오브젝트
 * @param source 값을 보낼 오브젝트
 * @param ignoreKeys (선택) 덮어쓰지 않을 키 경로 목록. 예: ['axis.id', 'parent.tab.id']. 생략하면 전부 덮어쓴다
 * @returns 타겟 오브젝트
 */
export function PatchObjectDeep<T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
  ignoreKeys?: string[],
): T {
  // [Validation] 생략/undefined/null이면 빈 목록으로 처리 (조회 빠르게 Set 변환)
  const ignoreSet = new Set(ignoreKeys ?? []);
  return PatchDeep(target, source, ignoreSet, '');
}

// 내부용: path(현재 경로)는 재귀 추적용이라 외부에 노출하지 않는다
function PatchDeep(
  target: Record<string, any>,
  source: Record<string, any>,
  ignoreSet: Set<string>,
  path: string,
): any {
  for (const key in target) {
    if (!Object.prototype.hasOwnProperty.call(target, key) || !(key in source)) { continue; }

    const fullPath = path ? `${path}.${key}` : key;
    if (ignoreSet.has(fullPath)) { continue; }   // 막을 키는 건너뜀

    const targetVal = target[key];
    const sourceVal = source[key];

    if (
      targetVal && sourceVal &&
      typeof targetVal === 'object' &&
      typeof sourceVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      PatchDeep(targetVal, sourceVal, ignoreSet, fullPath);
    } else if (sourceVal !== undefined) {
      target[key] = sourceVal;
    }
  }
  return target;
}