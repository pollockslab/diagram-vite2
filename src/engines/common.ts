
/**
 * [Function] PatchObjectDeep
 * @description 타겟 오브젝트에 존재하는 Key 부분만(하위 구조 포함), 소스 오브젝트의 값으로 덮어쓴다
 * @param target 값을 저장할 오브젝트
 * @param source 값을 보낼 오브젝트
 * @returns 타겟 오브젝트
 */
export function PatchObjectDeep<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key) && key in source) {
      const targetVal = target[key];
      const sourceVal = source[key];

      // [Validation] 값이 둘 다 객체(순수 객체)라면 재귀적으로 깊은 패치 수행
      if (
        targetVal &&
        sourceVal &&
        typeof targetVal === 'object' &&
        typeof sourceVal === 'object' && 
        !Array.isArray(targetVal)
      ) {
        PatchObjectDeep(targetVal, sourceVal);
      } else if (sourceVal !== undefined) {
        target[key] = sourceVal as T[Extract<keyof T, string>];
      }
    }
  }
  return target;
}