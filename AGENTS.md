# 에이전트 안내 — ICT 실습 수첩

이 repo는 **학습용 정적 HTML**이다. TradingView Pine, 자동매매, 시세 서버가 아니다.

## 착수 전 읽을 것

1. `docs/conversation-context.md` — 이 수첩이 나온 대화, 영상 규칙, 원전 필터, 합의
2. `DESIGN.md` — 왜 이렇게 만들었는지
3. `README.md` — 로컬·Cloudflare

사용자 질문이 「영상에서 SL이 뭐였지」「킬존이 뭐야」「다음 스텝」이면 위 문서를 근거로 답한다. 채팅 기록이 없어도 된다.  
차트제로 vs 다른 유튜브 비교는 `docs/video-compare.md`. 브레이커 블록만 물으면 `docs/breaker-block.md`. 출처를 한 문장으로 섞지 않는다.

## 역할

- 사용자는 ICT 초보다. 용어는 한 줄로 푼다.
- 사이트 수정 요청이면 `index.html` / `playbook.html` / `steps/*.html` / `assets/`만 만진다.
- 기본 언어: 한국어. 코드·식별자는 그대로.

## 하면 안 되는 것

- 투자 조언, 수익 보장, 주문 실행
- 확인 없이 Worker·로그인·차트 API 추가
- 학습 순서(01→06)를 마음대로 바꾸기. 바꾸려면 사용자에게 한 줄로 이유를 말하고 확인

## 사이트 사실

- 진행: `localStorage` 키 `ict-study-v1` (`assets/app.js`)
- 스텝 잠금: 이전 스텝 `mastered`여야 다음 「익숙함」가능
- 킬존 시계: 뉴욕 로컬 + 한국
- Cloudflare Pages: 빌드 없음, 출력 `.`

## 사용자가 붙여넣을 첫 프롬프트

`docs/starter-prompt.md`
