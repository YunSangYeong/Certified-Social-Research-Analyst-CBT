# Certified-Social-Research-Analyst-CBT
사회조사분석사 2급

사회조사분석사2급 필기 학습용 CBT. 비공식 서비스이며 Q-Net·한국산업인력공단과 무관합니다.

전기기능사 CBT의 실제 React/TypeScript/Vite 코드를 기준 커밋 `b9a682ccff1b460334b78d5bfad9375b7ec4fbb6`에서 재사용했습니다. 표준 스킬은 최신 main `76b990b8720adfa85c22a0a8f699b17094aa357b`의 v1.4.0 폴더 전체를 복사했습니다. 기존 README 제목과 설명은 위에 보존했습니다. 시작 당시 AGENTS.md는 없었으며 참조 양식으로 새로 연결했습니다. 다른 프로젝트는 수정·재배포하지 않습니다.

## 개발

Node 24.19.0 (engines >=22.12), Python 3(재생성 시), 서버·로그인·API 키 불필요.

```sh
npm ci
npm run dev
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

현재 클라우드의 시스템 Chromium을 사용할 때는 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`.
현재 체크아웃을 사용하며 별도 Git worktree는 만들지 않습니다.

## 기능과 자료

실전/랜덤, 절대 종료 시각·자동 제출·새로고침 복원, 과락 채점, 해설·오답 복습, 북마크·통계, 로컬 JSON/CSV 등록·검수·중복 제거·검색·내보내기, 기록 백업·초기화를 제공합니다.
학습 기준 선택 메뉴는 없고 두 모드에서 답안 선택 후 Space로 다음 문제로 이동합니다. 마지막 문제는 자동 제출하지 않습니다. 모바일 메뉴는 내부 세로 스크롤과 100dvh를 사용합니다.
자료 및 공식 규칙 확인 상태는 [출처·검수 문서](docs/SOURCES.md)를 확인하세요. 공식 규칙 원문 접근은 프록시 403으로 차단됐으며 100문항·150분·30/30/40·과목평균60/과락40은 잠정 학습용 설정입니다.
자체 제작 1,000문항(개념 60 + 계산 10유형의 조건 변형 940), 기출·복원 각 0. 과목별 300/300/400. 내부 검수 기준 부족 0이지만 외부 전문가·공식 출제기준 대조는 미완료입니다. 숫자 변형 비중과 범위의 한계는 출처 문서에 공개했습니다.

기록은 `social-research-analyst-cbt:v1` localStorage에 저장하며 응답 최근 5,000개, 시험 최근 30회만 보관합니다. 기기·브라우저·origin이 다르면 기록이 분리됩니다. 같은 origin의 다른 CBT와 키가 다릅니다. 저장 손상 시 원본을 덮어쓰지 않고 경고합니다. 백업 내보내기는 제공하지만 UI에서 백업 복원은 제공하지 않습니다. 초기화는 확인 후 개인 자료만 지웁니다. 기기 시계 변경, iframe/시크릿 모드의 저장 제한은 정적 앱의 한계입니다.

## 배포

사용자가 배포를 명시적으로 요청했습니다. `.github/workflows/pages.yml`: main push → 단위·빌드·PC/모바일 검증 → Pages 업로드/배포. PR은 검증만 합니다. 첫 필수 권한·인증·네트워크 거부·파이프라인 실패·승인 필요 후 재시도·우회 배포·추가 main push를 하지 않습니다. 자동 실행이 시작되면 수동 실행을 추가하지 않습니다.
예정 기본 주소: https://YunSangYeong.github.io/Certified-Social-Research-Analyst-CBT/ (배포 증거가 아님)
현재 실제 검증·원격·배포 상태는 [검증 보고서](docs/VERIFICATION.md)에 기록합니다.
