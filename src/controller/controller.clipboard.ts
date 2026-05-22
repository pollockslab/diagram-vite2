
// 이벤트 리스너 안에서만 동작함.
// 예시: 리모콘 버튼 클릭 이벤트 리스너
const pasteButton = document.getElementById('paste-btn');

pasteButton?.addEventListener('pointerdown', async (event: PointerEvent) => {
    // 1. 브라우저가 사용자 동작으로 인식하는 즉시 호출 (이벤트 핸들러 내부)
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            // 여기에 웹다이어그램 데이터 생성 로직
            console.log('클립보드 데이터:', text);
        }
    } catch (err) {
        // 보안상 이유나 클립보드에 텍스트가 없을 경우 발생
        console.error('붙여넣기 실패:', err);
    }
});