# ICT 실습 수첩

차트 앞에서 ICT를 **같은 체크리스트 순서**로 반복하는 정적 학습 사이트입니다.  
주문을 넣거나 시세를 가져오지 않습니다.

`trading-to-fire`의 `ict-study/` **안 파일만** 새 GitHub repo **루트**에 두면 됩니다.  
폴더를 한 겹 더 넣지 마세요 (`ict-study/ict-study/...` 가 되면 안 됩니다).

## 새 repo로 옮긴 뒤

1. GitHub에서 빈 repo를 만든다 (이름 예: `ict-study`).
2. 이 디렉터리의 내용(숨김 파일 `.cursor` 포함)을 그 repo 루트에 커밋·푸시한다.
3. Cloudflare Pages는 빌드 없이 루트(`.`)를 배포한다.
4. Cursor에서 그 repo를 연 다음, [`docs/starter-prompt.md`](docs/starter-prompt.md)의 프롬프트를 첫 메시지에 붙인다. `AGENTS.md`와 `docs/conversation-context.md`를 같이 `@`하면 이전 대화를 기억한 것처럼 답한다.

## 로컬에서 보기

새 repo 루트(또는 이 폴더)에서:

```bash
python3 -m http.server 4173
```

브라우저에서 `http://127.0.0.1:4173` 을 엽니다. `file://`로 열어도 동작하지만, 진행 저장·가져오기는 서버로 여는 편이 안전합니다.

## 학습 경로

1. 구조 — BOS · 초크  
2. 자리 — FVG · 오더블록  
3. 위치 — 프리미엄 · 디스카운트  
4. 시간 — 킬존  
5. 되돌림 — OTE  
6. 모델 — 실버불릿  

각 스텝에서 「익숙함」을 눌러야 다음 스텝이 열립니다.  
언제든 [실전 수첩](playbook.html)을 차트 옆에 둘 수 있습니다.

진행·체크·실습 기록은 브라우저 `localStorage`에만 있습니다. 폰/PC를 같이 쓰면 「오늘 실습」에서 JSON을 보내 가져오세요.

## Cloudflare Pages에 올리기

1. GitHub에 빈 repo를 만듭니다. 이름 예: `ict-study`  
2. 이 폴더 내용만 그 repo 루트에 넣습니다.

```bash
# trading-to-fire 안에서
cd ict-study
git init
git add .
git commit -m "feat: ICT 실습 수첩 정적 사이트"
git remote add origin https://github.com/<you>/ict-study.git
git branch -M main
git push -u origin main
```

3. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → Git 연결  
4. 프로젝트 이름 `ict-study`, 빌드 명령 **비움**, 출력 디렉터리 `/` (또는 `.`)  
5. 저장 후 `*.pages.dev` 주소가 나옵니다. 원하는 도메인을 붙이면 됩니다.

이미 Wrangler가 있으면 폴더에서:

```bash
npx wrangler pages deploy . --project-name=ict-study
```

`wrangler.toml`의 `pages_build_output_dir`은 `.` 입니다. 빌드 스텝은 없습니다.

## 이 폴더의 파일

| 경로 | 역할 |
|---|---|
| `index.html` | 목차·경로 |
| `playbook.html` | 실전 체크리스트 |
| `session.html` | 오늘 실습 기록·백업 |
| `steps/01.html`–`06.html` | 스텝 |
| `assets/` | 스타일·진행 스크립트 |
| `DESIGN.md` | 설계 메모 |
| `AGENTS.md` | 에이전트 역할 |
| `docs/conversation-context.md` | 이전 대화 요약 (영상·필터·합의) |
| `docs/video-compare.md` | 차트제로·트레이더 블랙 영상 vs 수첩 비교 |
| `docs/starter-prompt.md` | 새 채팅에 붙여넣을 프롬프트 |
| `.cursor/rules/ict-study.mdc` | Cursor가 항상 읽는 규칙 |

## 하지 않는 것

투자 조언, 자동매매, 시세 API, 계정 로그인, 수익 주장.
