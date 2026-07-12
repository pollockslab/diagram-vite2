# 깃허브 사용법 정리 (VS Code 기준)

---

## 1. 기본 흐름

```
작업 → 스테이징(add) → 커밋(commit) → 푸시(push)
```

---

## 2. 자주 쓰는 명령어

### 📤 커밋 & 푸시 (Sync)
```bash
git add .              # 변경된 파일 전체 스테이징
git add 파일명         # 특정 파일만 스테이징
git commit -m "메시지" # 커밋
git push               # GitHub에 올리기
git pull               # GitHub에서 최신 받아오기
git pull && git push   # Sync Changes 와 동일
```

---

## 3. 이전 커밋으로 되돌리기 (Reset)

| 옵션 | 커밋 취소 | 파일 변경사항 | 언제 쓰나 |
|------|----------|--------------|----------|
| `--soft` | ✅ | 유지 (스테이징 상태) | 커밋 메시지 잘못 썼을 때 |
| `--mixed` | ✅ | 유지 (스테이징 해제) | 파일 다시 골라서 커밋할 때 |
| `--hard` | ✅ | **삭제됨 ⚠️** | 작업 전체를 완전히 없앨 때 |

```bash
# 바로 이전 커밋으로
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1   # ⚠️ 파일까지 삭제됨 주의!

# N단계 이전으로
git reset --soft HEAD~3   # 3단계 이전으로

# 특정 커밋으로 (커밋 해시 사용)
# 커밋 해시는 Git Graph에서 우클릭 → Copy Commit Hash
git reset --soft abc1234
git reset --hard abc1234
```

---

## 4. GitHub에 이미 Push한 커밋을 Reset했을 때

```bash
# 강제 push (혼자 쓰는 브랜치에서만 할 것!)
git push --force
```

---

## 5. VS Code에서 GUI로 하는 법

- **커밋**: 소스 제어 패널 → 메시지 입력 → `Ctrl+Enter`
- **Sync**: 소스 제어 패널 → `Sync Changes` 버튼
- **히스토리/Reset**: `Git Graph` 확장 설치 후 → 커밋 우클릭 → Reset

> 💡 **Git Graph 확장** 설치 추천 (`Ctrl+Shift+X` → "Git Graph" 검색)  
> GitHub Desktop처럼 시각적으로 커밋 히스토리를 보고 Reset 가능

---

## 6. 헷갈리기 쉬운 것

| 용어 | 설명 |
|------|------|
| `add` | 커밋할 파일을 선택(스테이징) |
| `commit` | 변경사항을 로컬에 저장 |
| `push` | 로컬 커밋을 GitHub에 올리기 |
| `pull` | GitHub 최신 내용을 로컬에 받기 |
| `reset` | 이전 커밋으로 되돌리기 |
| `HEAD~1` | 바로 이전 커밋을 의미 |