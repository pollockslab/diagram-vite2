[...목록으로 가기](./index.md)

# : : : [Module] TRANSACTION : : :

<br/>

## 기능목록
1. 메멘토 기능
    - exec
    - redo
    - undo
2. 호출기능
    - action <- 루프나 다른 모듈에서 호출 많이함
    - filter <- 필요한가 모르겠는데
    - render <- 루프나 다른 모듈에서 호출 많이함
    - collision <- 이부분은 다이어그램에게 돌려주자
3. 분별기능
    - loop 에 예약(예약명령어로 입력하면 loop에서 트랜잭션 실행함수 호출)


## Action 함수목록
`필요한 함수면 (O), 아니면 (X), 모르면 (ㅁ)`
1. (ㅁ) Init - 접속시 마지막 저장정보 로드하여 화면에 보여주는것까지 함
2. (O) LoadSpace -  화면 로드 (파라미터 space.id)
3. (O) MoveFront - 선택한 다이어그램 z-index를 맨 앞으로 가져오기
4. (O) AddDiagram - 다이어그램 추가 (파라미터 type, x, y)
5. () 

## Render 함수목록
`필요한 함수면 (O), 아니면 (X), 모르면 (ㅁ)`
1. (ㅇ) Draw - loop.draw 호출
2. (ㅁ) Resize - loop.render 호출
3. (ㅁ) zoom - loop.render 호출 


다이어그램으로 루프와 상관관계 그려야 하는데
2. *트랜잭션 호출받았을 때 일 처리방법*
```mermaid
graph LR
    Start([시작]) --> Input[/다른 모듈에서<br/> Transacion 함수 호출/]
    Input --> Decision{Loop<br/>예약유뮤}
    Decision -- Yes --> Loop[Loop 예약시간에<br/>파라미터로 보낸함수 호출]
    Decision -- No --> Note[Transaction 에서 다른 모듈함수들<br/> 호출하여 결과 조합]
    Loop --> Note
    Note --> End[종료]
```