
// [Rainbow] 기본 색상 톤
export const rainbow = {
    thema: {title: 'Rainbow', color: 'red'},
    colorList: [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'navy',
        'purple',
        'black',
        'white'
    ]
};

// [Pastel] 부드럽고 편안한 파스텔 톤
export const pastel = {
    thema: { title: 'Pastel', color: '#FFB7B2' },
    colorList: [
        '#FFB7B2', // 파스텔 핑크 (Baby Pink)
        '#FFDAC1', // 살구빛 피치 (Peach)
        '#FFF5B7', // 소프트 옐로우 (Pastel Yellow)
        '#E2F0CB', // 연두빛 그린 (Light Lime)
        '#B5EAD7', // 민트 그린 (Mint)
        '#C7CEEA', // 파스텔 블루 (Soft Blue)
        '#E8C7DE'  // 은은한 라벤더 (Lavender)
    ]
};

// [Metallic] 세련된 금속 톤
export const metallic = {
    thema: { title: 'Metallic', color: '#D4AF37' },
    colorList: [
        '#D4AF37', // 메탈릭 골드 (Gold)
        '#B76E79', // 은은한 로즈 골드 (Rose Gold)
        '#C0C0C0', // 매트 실버 (Silver)
        '#E5E4E2', // 백금빛 플래티넘 (Platinum)
        '#B87333', // 구리빛 코퍼 (Copper)
        '#CD7F32', // 중후한 브론즈 (Bronze)
        '#4A4A4A'  // 건메탈 (Gunmetal)
    ]
};

// [Cyberpunk / Neon] 야간 모드 / 미래지향적 특수 네온 톤
export const cyberpunkNeon = {
    thema: { title: 'Cyberpunk', color: '#FF007F' },
    colorList: [
        '#FF007F', // 네온 핫핑크
        '#39FF14', // 형광 네온 라임
        '#00F3FF', // 사이버 시안 (Cyan)
        '#BD00FF', // 네온 퍼플
        '#CCFF00', // 일렉트릭 옐로우
        '#FF5F00'  // 네온 오렌지
    ]
};

// [Muted / Nordic] 차분하고 트렌디한 북유럽 뮤트 톤
export const mutedNordic = {
    thema: { title: 'Muted', color: '#4A6B82' },
    colorList: [
        '#4A6B82', // 딥 오션 블루 (Muted Blue)
        '#7D9D9C', // 세이지 그린 (Sage)
        '#B1A6A4', // 웜 그레이 (Warm Gray)
        '#C49483', // 테라코타 오렌지 (Muted Orange)
        '#E8D3C3', // 샌드 베이지 (Beige)
        '#5C5259'  // 뮤트 버건디 (Muted Wine)
    ]
};

// [Cool Gray / Slate] 차가운 도시 느낌의 쿨 그레이
export const coolGray = {
    thema: { title: 'Cool Gray', color: '#9FB3C8' }, // 탭 아이콘 가시성을 위해 중간 톤 지정
    colorList: [
        '#F0F4F8', // 아주 밝은 알루미늄
        '#D9E2EC', // 은은한 블루 그레이
        '#BCCCDC', // 플래티넘 실버
        '#9FB3C8', // 라이트 슬레이트
        '#829AB1', // 미디움 스틸 그레이
        '#627D98', // 차분한 데님 그레이
        '#486581'  // 딥 네이비 그레이
    ]
};

// [Warm Gray / Taupe] 따뜻하고 편안한 웜 그레이
export const warmGray = {
    thema: { title: 'Warm Gray', color: '#C7C1B4' }, // 탭 아이콘 가시성을 위해 중간 톤 지정
    colorList: [
        '#F7F5F0', // 크림 화이트 그레이
        '#EFECE6', // 부드러운 오트밀
        '#E1DDD5', // 라이트 스톤
        '#C7C1B4', // 웜 실버
        '#A8A090', // 프렌치 그레이
        '#8A8074', // 매트 타우페 (Taupe)
        '#6B6055'  // 딥 에스프레소 그레이
    ]
};

// [Neutral / Monochrome] 정석 그대로의 뉴트럴 그레이
export const neutralGray = {
    thema: { title: 'Neutral Gray', color: '#9E9E9E' }, // 50% 표준 회색 지정
    colorList: [
        '#F5F5F5', // 화이트에 가까운 회색
        '#E0E0E0', // 연한 회색
        '#BDBDBD', // 중간 라이트 그레이
        '#9E9E9E', // 표준 회색 (50% Gray)
        '#757575', // 짙은 회색
        '#616161', // 쥐색 (Charcoal)
        '#424242'  // 다크 그레이
    ]
};

// [Dark Charcoal] 묵직한 다크 모드용 차콜 & 제트 블랙
export const darkCharcoal = {
    thema: { title: 'Dark Charcoal', color: '#2B2B2B' },
    colorList: [
        '#333333', // 소프트 블랙
        '#2B2B2B', // 리치 차콜
        '#222222', // 오프 블랙
        '#1A1A1A', // 제트 블랙
        '#121212', // 머티리얼 다크배경 표준
        '#0D0D0D'  // 심해 블랙
    ]
};

// [IDE & DevTools Gray] 웹다이어그램 배경 톤
export const ideDevToolsGray = {
    thema: { title: 'DevTools', color: '#1E1E1E' },
    colorList: [
        '#252526', // VS Code 패널/사이드바 배경 (안정감 있는 다크 그레이)
        '#1E1E1E', // VS Code 에디터 메인 배경 (가장 대중적인 코드 배경색)
        '#242424', // 크롬 개발자 도구(DevTools) 메인 배경
        '#2D2D2D', // 사진 속 활성화된 탭/입력창 강조 배경
        '#181818', // 아주 어두운 액티비티 바 / 경계선용 다크
        '#333333'  // 패널 구분선 및 가벼운 테두리선
    ]
};

// [Google Gemini Dark] 제미나이 다크 모드 톤
export const geminiDark = {
    thema: { title: 'Gemini Dark', color: '#131314' },
    colorList: [
        '#131314', // 제미나이 메인 다크 배경 (완전 블랙 대신 쓰는 깊은 차콜)
        '#1E1E20', // 제미나이 채팅창/카드 컴포넌트 배경 (계층 분리용)
        '#2D2F31', // 요소 호버(Hover) 또는 선택 시 강조되는 배경
        '#3E4143', // 검색창 테두리 또는 비활성화된 아이콘 색상
        '#E3E3E3', // 제미나이 기본 말풍선 텍스트 (눈 안 아픈 오프화이트)
        '#C4C7C5'  // 본문 서브 텍스트 / 설명글용 뮤트 그레이
    ]
};

// [Eye-Comfort Light & Dark] 눈이 편안한 오프화이트 & 소프트 블랙
export const eyeComfort = {
    thema: { title: 'Eye Comfort', color: '#F8F9FA' },
    colorList: [
        '#F8F9FA', // 눈부심을 줄인 부드러운 화이트 (Google 표준 배경)
        '#F0F0F0', // 아주 밝은 회색 (도형 기본 배경으로 추천)
        '#E5E5E5', // 종이 느낌의 차분한 라이트 그레이
        '#808080', // 가독성을 해치지 않는 표준 보조선/그리드 색상
        '#202124', // 눈이 편안한 텍스트용 다크 (진한 잉크색)
        '#111111'  // 완전 블랙을 대체하는 가장 어두운 매트 블랙
    ]
};

// [Synthwave / City Pop] 80년대 레트로 신스웨이브 & 시티팝 톤
export const synthwaveCityPop = {
    thema: { title: 'Synthwave', color: '#FF0055' },
    colorList: [
        '#FF0055', // 네온 푸시아 (Hot Pink)
        '#00FFCC', // 사이버 시안 (Hyper Cyan)
        '#9B5DE5', // 일렉트릭 퍼플 (Electric Purple)
        '#F15BB5', // 레트로 마젠타 (Retro Magenta)
        '#EEFE00', // 에이리언 옐로우 (Laser Yellow)
        '#00F0FF'  // 레이저 블루 (Laser Blue)
    ]
};

// [Mid-Century Modern] 70년대 빈티지 미드센추리 모던 톤
export const midCenturyModern = {
    thema: { title: 'Mid-Century', color: '#E09F3E' },
    colorList: [
        '#E09F3E', // 머스터드 옐로우 (Mustard)
        '#9E2A2B', // 칠리 레드 (Terracotta)
        '#355C7D', // 빈티지 피콕 블루 (Peacock)
        '#6E7841', // 매트 올리브 그린 (Olive)
        '#A06A42', // 피넛 버터 브라운 (Wood)
        '#544741'  // 에스프레소 차콜 (Vintage Dark)
    ]
};

// [Ghibli Nostalgia] 지브리 애니메이션 감성 오가닉 톤
export const ghibliNostalgia = {
    thema: { title: 'Ghibli', color: '#2A623D' },
    colorList: [
        '#2A623D', // 깊은 이끼 숲색 (Forest)
        '#72A06A', // 햇살 가득한 풀잎색 (Grass)
        '#6B9AC4', // 맑은 시골 하늘색 (Sky)
        '#F4A261', // 따뜻한 장작 불빛색 (Amber)
        '#E76F51', // 노을빛 벽돌색 (Sunset)
        '#FDF0D5'  // 포근한 구름 화이트 (Cream)
    ]
};

// [Sweet Dessert] 당 충전되는 달콤한 디저트 카페 톤
export const sweetDessert = {
    thema: { title: 'Dessert', color: '#FFC6FF' },
    colorList: [
        '#7A431D', // 진한 리치 초콜릿 (Chocolate)
        '#FFC6FF', // 딸기 마카롱 핑크 (Strawberry)
        '#E8FFB7', // 쌉싸름한 말차 그린 (Matcha)
        '#BDB2FF', // 타로 밀크티 보라 (Taro)
        '#9BF6FF', // 소다 팝 블루 (Soda)
        '#CAFFBF'  // 부드러운 피스타치오 (Pistachio)
    ]
};