# Web Diagram Engine: Core Square Architecture

## 1. 개요
본 문서는 커스텀 웹 다이어그램 엔진의 핵심 구성 요소인 `Square` 객체와 그 최적화 계층에 대한 기술 설계서입니다. 외부 라이브러리 의존성을 최소화하고, Canvas API를 직접 제어하여 고성능 렌더링을 지향합니다.

## 2. 클래스 계층 구조 (Class Hierarchy)

### 2.1 상속 다이어그램
`Axis` (Base) → `Square` (Domain)

* **Axis**: 시스템 전역에서 공유되는 객체의 기본 식별자 및 계층 정보 관리.
* **Square**: 화면에 그려지는 2차원 영역을 정의하며, 좌표 및 크기 유효성 검증을 담당.

### 2.2 컴포지션 (Composition)
* **Square**는 **Capture** 인스턴스를 소유합니다.
    * 렌더링 부하 분리를 위한 오프스크린 캔버스(`HTMLCanvasElement`) 관리.

## 3. 핵심 모듈 상세

### 3.1 `Axis` (기반 객체)
모든 다이어그램 객체의 부모 클래스로, 직렬화(Serialization)를 위한 공통 인터페이스를 구현합니다.
* **주요 메서드**: `SetData(args)`를 통한 동적 속성 할당.
* **관리 속성**: `type`, `id`, `zIndex`, `parentId`.

### 3.2 `Square` (영역 정의)
물리적 공간을 점유하는 사각형 객체입니다.
* **데이터 검증**: `x`, `y` 좌표의 `Number.isFinite` 체크, `w`, `h`의 `100~1000` 픽셀 제한.
* **렌더링**: `Snapshot()`을 통해 내부 상태를 오프스크린에 기록하고, `Draw()`에서 이를 메인 캔버스로 전송.

### 3.3 `Capture` (성능 최적화)
`Square`의 리사이징 중 발생하는 렌더링 부하를 제어합니다.
* **이중 모드 전략**:
    * `Expand (isExpand=1)`: PanStart 시점에 최대 크기(`1024x1024`)로 캐시하여 부드러운 리사이징 보장.
    * `Compact (isExpand=0)`: PanEnd 시점에 실제 크기로 최적화하여 메모리 점유율 절감.

## 4. 직렬화 (Serialization)
IndexedDB 저장을 위해 정의된 네임스페이스 구조입니다.
* `serialize.core`: 공통 속성(Axis, Line, Point, Square).
* `serialize.modules`: 각 비즈니스 로직(Memo, Button, Group 등)별 상세 데이터.

## 5. 설계 향후 과제
1. **렌더링 루프 분리**: 캔버스 렌더링 루프(`_ROOP`)와의 연동을 통한 최적화.
2. **이벤트 타겟 시스템**: `setPointerCapture`를 활용한 정밀한 마우스 이벤트 핸들링 강화.
3. **트랜잭션 연동**: 데이터 무결성을 위한 상태 변경(`Undo/Redo`) 관리 시스템과의 통합.

---
*본 문서는 Pollock의 웹다이어그램 프로젝트 설계를 위해 작성되었습니다.*

# EventPan.ts

## 1. 목적 (Intent)
- **포인터 입력 표준화**: 마우스(Wheel)와 터치(Pinch) 입력을 단일 로직으로 통합.
- **이벤트 격리**: 패널 내부 컴포넌트(리모콘 등)와의 이벤트 간섭을 차단하여 엔진 독립성 확보.

## 2. 핵심 로직 요약
- **상태 관리**: `Map<number, PointerEvent>`를 통해 0~2개의 포인터 상태를 추적. 3개 이상은 안정성을 위해 무시.
- **줌 연산 (Math.hypot)**: 
    - `Mouse`: `deltaY` 기반 선형 변환.
    - `Touch`: 두 포인터 간 거리 변화량(delta dist)을 감도와 곱하여 연산.
- **생명주기 제어 (Lifecycle)**: 
    - `Destroy()` 메서드 강제: 리스너 중첩 방지 및 메모리 누수 방지(자바스크립트 가비지 컬렉션 한계 보완).

## 3. Pollock의 검증 포인트 (Logic Guardrails)
- **[방어]** `e.target !== this.panel`: 자식 요소 이벤트 무시.
- **[방어]** `down.count`: 아이패드 멀티터치 후 한 손가락 뗄 때 발생하는 `PointerUp` 이슈 방지.
- **[설계 주의]** `Destroy()` 호출이 누락되면 리스너가 살아있어 메모리 누수 발생. 객체 파괴 시 반드시 호출할 것.