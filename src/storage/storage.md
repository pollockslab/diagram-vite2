[...목록으로 가기](./index.md)

# : : : [Module] STORAGE : : :

<br/>

## 스키마 목록
 ### 1. [Diagram](#diagram-link)
 ###  2. [Space](#space-link)
 ###  3. [Tab](#tab-link)
 ###  4. [Tab-Memento](#tab-memento-link)
 ###  5. [Settings](#settings-link)
 ###  6. [Log](#log-link)
 ###  7. [Assets](#assets-link)



<h1 id="diagram-link">[1. Diagram]</h1>

#### `Description: 다이어그램 serialize`
#### `PK: Axis.id.diagram` 
#### `Object: {axis, line, point, square, memo...}`

### Axis : {Axis}
> | No.   | Level 1   | Level 2   | DataType  | Memo |
> | :---: | :---      | :---      | :---:     | :--- | 
> | 1     | id        | diagram   | String    | 다이어그램 ID |
> | 2     | id        | space     | String    | 스페이스(부모) ID |
> | 3     | id        | tab       | String    | 탭 ID |
> | 4     | type      |           | String    | 다이어그램 Type |
<br/>

### Line: {...Axis, Line}
> | No.   | Level 1   | Level 2   | DataType  | Memo |
> | :---: | :---      | :---      | :---:     | :--- | 
> | 1     | x1        |           | Number    | 시작점 x |
> | 2     | y1        |           | Number    | 시작점 y |
> | 3     | x2        |           | Number    | 종료점 x |
> | 4     | y2        |           | Number    | 종료점 y |
<br/>

### Point: {...Axis, Point}
> | No.   | Level 1   | Level 2   | DataType  | Memo |
> | :---: | :---      | :---      | :---:     | :--- | 
> | 1     | x         |           | Number    | 좌표 x |
> | 2     | y         |           | Number    | 좌표 y |
<br/>

### Square: {...Axis, Square}
> | No.   | Level 1   | Level 2   | DataType  | Memo |
> | :---: | :---      | :---      | :---:     | :--- | 
> | 1     | left      |           | Number    | 좌측 위치 |
> | 2     | top       |           | Number    | 상단 위치 |
> | 3     | width     |           | Number    | 가로 길이 |
> | 4     | height    |           | Number    | 세로 길이 |
<br/>


<h1 id="space-link">[2. Space]</h1>

#### `Description: 스페이스 serialize`
#### `PK: Space.id.space`
#### `Object: {}`

### Space
> | No.   | Level 1   | Level 2     | DataType  | Memo |
> | :---: | :---      | :---        | :---:     | :--- | 
> | 1     | id        | space       | String    | 스페이스 ID |
> | 2     | grid      | `${x},${y}` | String    | 다이어그램 ID 목록 |
> | 3     | grid      | `...+`      | String    | ㄴ 목록 개수만큼 증가 |
<br/>


<h1 id="tab-link">[3. Tab]</h1>

#### `Description: 탭 정보(기본 최상위 저장단위)`
#### `PK: Tab.id.tab`
#### `Object: {}`

### Tab
> | No.   | Level 1   | Level 2     | DataType  | Memo |
> | :---: | :---      | :---        | :---:     | :--- | 
> | 1     | id        | tab         | String    | 탭 ID |
> | 2     | id        | space       | String    | Open 스페이스 ID |
> | 3     | favorite  |             | String[]  | 즐겨찾기 된 다이어그램 ID 목록 |
<br/>


<h1 id="tab-memento-link">[4. Tab_Memento]</h1>

#### `Description: 탭 별, 작업 상태 저장`
#### `PK: Tab_Memento.id.tab`
#### `Object: {}`

### Tab_Memento
> | No.   | Level 1   | Level 2     | DataType  | Memo |
> | :---: | :---      | :---        | :---:     | :--- | 
> | 1     | id        | tab         | String    | 탭 ID |
> | 2     | list      |             | Diagram.serialize[]    | 상태 저장 목록 |
<br/>


<h1 id="settings-link">[5. Settings]</h1>

#### `Description: 환경설정 (하나의 데이터 행 만 존재함)`
#### `PK: Settings.id.settings`
#### `Object: {}`
> | No.   | Level 1   | Level 2     | DataType  | Memo |
> | :---: | :---      | :---        | :---:     | :--- | 
> | 1     | id        | settings    | String    | 숫자 1 (유일함) |
> | 2     | id        | tab         | String    | 탭 ID |
<br/>


<h1 id="log-link">[6. Log]</h1>

#### `Description: 로그(오류, 경고, 확인, 업데이트)`
#### `PK: Log.timestamp`
#### `Object: {}`
> | No.   | Level 1   | Level 2     | DataType  | Memo |
> | :---: | :---      | :---        | :---:     | :--- | 
> | 1     | timestamp |             | Number    | 저장시간 |
> | 2     | code      |             | String    | 'error','warning','info', 'update' |
> | 3     | message   |             | String    | 로그 내용 |
<br/>


<h1 id="assets-link">[7. Assets]</h1>

#### `Description: 이미지, 음악파일 저장소`
#### `PK: Assets.id.assets`
#### `Object: {}`
> | No.   | Level 1   | Level 2     | DataType  | Memo |
> | :---: | :---      | :---        | :---:     | :--- | 
> | 1     | id        | assets      | String    | 다른곳에서 부를 id |
> | 2     | blob      |             | blob      | 바이너리화 된 이미지 및 음악파일 |
> | 3     | filename  |             | String    | 파일명 |
> | 4     | timestamp |             | Number    | 저장시간 |
<br/>