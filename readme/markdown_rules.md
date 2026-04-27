

## 2026-04-28
- **[Feature]** 리모콘 Action/Toggle 로직 분리 및 최적화
  - `remocon.ts`에서 `End()` 함수 직접 호출로 컨트롤러 의존성 제거
  - [View Details](./daily/2026-04-28.md#remote-refactor)
- **[Fix]** 웹워커 상태 동기화 누락 수정
  - [View Details](./daily/2026-04-28.md#worker-sync)
- **[Optimization]** 렌더링 루프 가비지 컬렉션 최적화
  - [View Details](./daily/2026-04-28.md#rendering-optimization)

## 2026-04-27
- **[Structure]** 렌더링 파이프라인 아키텍처 개편
  - [View Details](./daily/2026-04-27.md#rendering-architecture)

---
*규칙: 새로운 작업은 항상 맨 위에 추가. [View Details]는 해당 날짜 파일의 앵커(#)로 연결.*

# 1. 수평선 긋기 \<hr /> (셋 다 동일)
--- 
***
___

# 2. 글씨크기 (샾+공백+문장 입력)
# h1
## h2
### h3
#### h4 
##### h5
###### h6 (최소 크기)

# 3. 글씨타입
- 기본글
- ~~취소선~~
- *이탤릭*
- **볼드**
- ***볼드+이탤릭***
- `백틱 강조`
- > 인용구 (Blockquote)

# 4. 목차
- **Underwear**
    - ***Men's***
        1. Adidas
        2. BYC
        3. Nike
    - ***Women's***
        1. Calvin Klein
        2. Victoria's Secret
- **Outerwear**
    1. ...........................................

# 5. 코드블록
```typescript
const type1: string = '타입1';
let type2: null|'타입1'|'타입2' = null;
```

# 6. 링크
1. [내부 섹션으로 이동](#under-link) 
    - <h4 id="under-link">여기로 이동합니다.</h4>

2. [외부 섹션으로 이동](../README.md#welcome-link)
    - #### /README.md#welcome-link 로 이동합니다.

# 7. 테이블
| 항목 | 설명 | 비고 |
| :--- | :---: | ---: |
| 왼쪽 정렬 | 중앙 정렬 | 오른쪽 정렬 |
| 데이터 1 | 데이터 2 | 데이터 3 |
| 데이터 4 | 데이터 5 | 데이터 6 |

# 8. 다이어그램
1. Top Down (TD) 방식
```mermaid
graph TD
    Start([시작]) --> Input[/입력 데이터/]
    Input --> DB[(데이터베이스)]
    DB --> Decision{분기 처리}
    Decision -- Yes --> Process[공정 처리]
    Decision -- No --> Note[-- 메모: 예외 상황]
    Process --> End[종료]
    Note --> End
```
2. Left to Right (LR) 방식
```mermaid
graph LR
    Start([시작]) --> Input[/입력 데이터<br>a: 시작값1<br>b: 시작값2/]
    Input --> DB[(데이터베이스)]
    DB --> Decision{분기 처리}
    Decision -- Yes --> Process[공정 처리]
    Decision -- No --> Note[-- 메모: 예외 상황]
    Process --> End[종료]
    Note --> End
```
### 주요 포함 요소 설명
* `([ ])`: 알약(타원형) - 시작/종료
* `[/ /]`: 평행사변형 - 입력/출력
* `[( )]`: 원통형 - 데이터베이스
* `{ }`: 마름모 - 분기/결정
* `[ ]`: 사각형 - 일반 처리
* `--[ ]`: 노트/메모 - 주석 형태



