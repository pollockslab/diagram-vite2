# 웹다이어그램 프로젝트 설계 지도

이 문서는 프로젝트의 구조와 설계 원칙을 담고 있습니다. 
새로운 기능을 추가하거나 아키텍처를 수정할 때 반드시 참조하십시오.

## 1. 프로젝트 개요
- **목표**: 호크룩스(웹다이어그램) 완성 및 축기(축기기-결단기-합체기)
- **현재 단계**: 축기기 (엔진 아키텍처 최적화 중)

## 2. 설계 원칙 (Specs)
- [아키텍처 구조](./specs/architecture.md): 렌더링 루프 및 데이터 흐름
- [코딩 및 명명 규칙](./specs/coding-rules.md): Global/Local 상수 규칙 및 도메인 기반 네이밍
- [트랜잭션/메멘토](./specs/transaction-design.md): 커맨드 패턴 적용 방식

## 3. 로그 (Logs)
- [변경 로그 대시보드](./logs/changelog.md): 전체 작업 요약
- [일일 작업 기록](./logs/daily/): 상세 수행 일지 (YYYY-MM-DD)

## 4. 참조 자료 (References)
- [학습 및 트레이싱 테이블](./refs/tracing-tables.md): 알고리즘 분석 및 변수 변화도 기록
- [OSI 7계층 및 DB 정규화 규칙](./refs/theory.md): 설계 이론 근거