// Q-Net 원문 접근 차단: 공식 재확인 전의 학습용 설정. docs/SOURCES.md 참조.
export const PROFILE = {
 name: "사회조사분석사2급", bankId: "social-main", questionCount: 100,
 durationMinutes: 150, choiceCount: 4, passScore: 60, subjectCutoff: 40,
 subjects: ["조사방법과 설계", "조사관리와 자료처리", "통계분석과 활용"],
 subjectCounts: [30, 30, 40], rulesVerificationStatus: "pending",
} as const;
