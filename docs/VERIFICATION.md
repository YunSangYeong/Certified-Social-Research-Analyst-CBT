# 검증 및 배포 인수 기록

2026-10-31 (Asia/Seoul). 작업 경로 `/workspace/Certified-Social-Research-Analyst-CBT`.
최초 상태: README.md 1개, 초기 커밋 `940f482fe78f2f947f316aaea8e3fc32b62fee6e`, AGENTS.md 및 사용자 변경 없음.

## 표준 적용

- 표준 저장소 main 읽기 결과 `76b990b8720adfa85c22a0a8f699b17094aa357b`.
- 스킬 v1.4.0 전체 폴더 및 references 복사, AGENTS.md 신규 연결. 앱 소스는 지정 기준 `b9a682ccff1b460334b78d5bfad9375b7ec4fbb6`에서 직접 재사용.
- 원본 프로젝트는 읽기용 임시 clone만 사용. 원격 수정·재배포 없음.
- 시험 설정과 저장 키 분리, 과목 평균/과락 적용, 상단 고정 안내 배너 제거, 양 모드 Space 및 모바일 스크롤 보존.

## 최종 로컬 결과

| 검사 | 명령 / 결과 |
|---|---|
| 의존성 | `npm ci` 종료 0 (Node 24.19.0, lockfile 사용) |
| 단위/데이터 | `npm test -- --reporter=json --outputFile=/tmp/social-unit.json` 종료 0, **953 통과 / 실패 0** |
| 타입/배포 빌드 | `npm run build` 종료 0, TypeScript 및 Vite 성공 |
| PC/모바일 | `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium ./node_modules/.bin/playwright test` 종료 0, **24 통과 / 4 건너뜀 / 실패 0**, 39.3초 |
| 데이터 재생성 | 생성 전후 SHA-256 일치, 1,000개 고유 ID 및 정규화 본문·정렬 보기 지문 중복 없음 |
| 화면 육안 | 데스크톱·모바일 전체 화면 스크린샷 확인 |

940개 계산 문항별로 생성 코드와 다른 수식 경로로 재계산, 숫자 보기의 정답 1개 여부 검사.
세 과목 배분, 평균·과락 경계(총 정답 수와 과목평균의 차이 포함), 절대 종료 시각, 만료 답안 차단, 중복 제출 방지, 손상 저장 검출, JSON/CSV 등록, 보기 순서 무관 중복 검출, 1,000문항 랜덤 순회 중 ID 중복 방지 검증.
브라우저에서는 실제 100번까지 진행, 합격·미응답·해설·오답 복습, 북마크, 새로고침, 자동 제출·만료 재접속, 등록·로컬 검수·초기화, Space 키다운/키업·포커스·마지막 문제·수정키 보호를 확인했다.
원본의 59 인덱스 제한 때문에 60번 다음 버튼이 비활성화되는 로컬 결함을 발견하고 실제 시험 길이 기준으로 수정한 뒤 전체 브라우저 검사를 통과했다.

작은 세로 390×480과 가로 740×360에서 wheel 및 CDP touchStart/move/end 실제 입력으로 아래 이동→백업/초기화 접근→위 이동→대시보드 선택을 확인했다. scrollTop 강제 대입은 사용하지 않았다. 확대 글자에서도 휠로 상하 접근했다. 메뉴 전환 애니메이션과 비동기 스크롤 반영을 기다린 후 검사했다.
Chromium의 Desktop Chrome / Pixel 7 **에뮬레이션**이다. 모바일 전용 검사 4개의 데스크톱 중복 실행은 의도적으로 건너뛰었다. 실기기·Safari·Firefox·실제 블로그 iframe은 미실행이다.
저장 손상 경고 보존은 검증했고 상단 criteria-note 제거와 메뉴 화면 가로 넘침 부재를 검사했다. 모든 저장 장치/쿼터 실패 상황을 검증한 것은 아니다.
Vite는 약 1.24 MB(압축 약 130 KB) JS chunk 크기 경고를 출력한다. 빌드는 성공하며 경고를 숨기지 않았다.

## 문항과 규칙 한계

[출처 문서](SOURCES.md) 참조. 자체 제작 1,000: 개념 60 + 계산 조건 변형 940(10유형). 기출·복원 0. 과목별 300/300/400. 대기·중복 제외 후 내부 검수 부족 0.
AI 내부 검토와 자동 검산이며 외부 전문가 검수·공식 출제기준 대조 미완료. 공식 시험 규칙도 Q-Net 원문 프록시 403으로 미확인이다. 학습용 잠정 설정을 공식 검증 완료라고 표시하지 않았다. 전체 시험 범위를 균형 있게 포괄한다고 주장하지 않는다.

## 첫 배포 차단 — 재시도 없음

배포 사전 확인의 첫 GitHub API 요청:

```text
GET https://api.github.com/repos/YunSangYeong/Certified-Social-Research-Analyst-CBT
curl: (56) CONNECT tunnel failed, response 403
HTTP 000
exit 56
```

이 시점에 배포 진행 중단. API에 도달하지 못했으므로 저장소 권한·Pages Source·기존 게시 상태·Actions 결과는 확인하지 못했다. API 차단으로부터 Git 토큰 부재나 저장소 권한 부족을 추정하지 않았다.
main 푸시·workflow 수동 실행·재실행·대체 배포·배포 유발 추가 푸시는 **0회**. CI/Pages 성공을 주장하지 않는다.
`.github/workflows/pages.yml`은 main push 후 검증 성공→Pages 배포, PR 검증만 수행하도록 준비했다. 자동 재시도 경로 없음.
사용자가 직접 마무리할 때 필요한 첫 동작: 클라우드 환경 설정의 네트워크 허용 목록에 `api.github.com` 추가. 이후 조치와 재시도를 에이전트가 자동 진행하지 않는다.
최초 Pages 설정이 실제 필요한지는 API를 조회하지 못해 알 수 없다.

코드 보존용 브랜치: `implementation/social-research-cbt` (main 자동 배포 트리거와 일치하지 않음). 원격 푸시 결과·최종 SHA는 최종 응답에서 별도로 보고한다.
예정 기본 URL: https://YunSangYeong.github.io/Certified-Social-Research-Analyst-CBT/
이 URL의 존재·게시·공개 기능 동작은 확인하지 않았다. 로컬 테스트와 공개 확인은 별개다.

환경 재사용용 install_script/start_skill 초안을 저장했다. 저장은 실행·환경 게시·GitHub Pages 배포가 아니며 새 환경 복원도 검증하지 않았다. 환경 설정에서 검토·저장 후 환경 게시가 필요하다.
