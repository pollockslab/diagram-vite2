[...목록으로 가기](./index.md)

# : : : [Module] MAIN : : :

<br/>

# 기능목록
## [Logic] 마우스 드래그로 다이어그램 이동 시, 모듈들이 순서대로 하는 일.

```mermaid
sequenceDiagram
    participant _REMO as 리모콘
    participant _CTRL as 컨트롤러
    participant _TRAN as 트랜잭션

    _REMO->>_REMO: 1. 포인터 아이콘 선택
    _CTRL->>_CTRL: 2. [마우스 드래그]<br> 화면중에 보이는 임의의<br> 다이어그램 `A` 드래그
    _CTRL->>_TRAN: 3. [다이어그램 `A` 위치 이동 요청]
```
## [Logic] 트랜잭션에서 루프로 [화면그리기] 예약 시, 모듈들이 순서대로 하는 일.
```mermaid
sequenceDiagram
    participant _CTRL as 컨트롤러
    participant _TRAN as 트랜잭션
    participant _STOR as 스토리지
    participant _LOOP as 루프
    participant _VIEW as 뷰


    _CTRL->>_TRAN: 1. [화면 그리기 요청]
    _TRAN-->>_LOOP: 2. [화면 그리기 예약]
    _LOOP-->>_LOOP: 3. rAF 마다 예약작업 실행하고,<br> 예약목록 지우기
    _LOOP-->>_VIEW: 4. 예약목록 중,<br> [화면 그리기] 를 확인하여 호출
    _VIEW->>_VIEW: 5. 화면에 존재하는<br> 다이어그램들 그리기  
```

```mermaid
graph LR
    A[함수 호출] --> B{_TRAN 시작}
    B --> C[기존 상태 백업<br/>Undo용]
    C --> D[데이터 변경<br/>_STOR 갱신]
    D --> E[작업 기록<br/>History 저장]
    E --> F{_TRAN 종료}
    F --> G[루프 예약<br/>_ROOP.request]
    G --> H[화면 반영<br/>_VIEW.draw]

    style B fill:#f96,stroke:#333
    style F fill:#f96,stroke:#333
    style D fill:#bbf,stroke:#333
```

```typescript
// [Tool] 싱글톤 방식. 전역변수에 기능별 객체를 저장. (예: _STOR 는 DB저장소 역할.)
export const _DPR  = new Dpr();
export const _STOR = new Storage();
export const _TEDI = new Texteditor();

export const _SPCE = new Space();
export const _VIEW = new View({parentNode: app});
export const _CTRL = new Controller({parentNode: app});
export const _REMO = new Remocon({parentNode: app});

export const _LOOP = new Loop();
export const _TRAN = new Transaction();
export const _TEST = new Tester();
```