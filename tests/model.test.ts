import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { answerExam, BASE_BANK as bank, checkPractice, createExam, emptyStore, fingerprint, grade, importQuestions, nextPractice, parseCsv, remainingSeconds, restoreStore, startPractice, SUBJECTS, submitExam, validateQuestion } from '../src/model';
import { PROFILE } from '../src/profile';
const make = () => createExam(bank, 'social-main', 1000);
describe('기본 은행·출처·계산 검증', () => {
 it('실제 수량과 부족분, 과목, 중복·보기 재배열·미확인 연도', () => {
  expect(bank).toHaveLength(1000); expect(1000-bank.length).toBe(0);
  expect(new Set(bank.map(q=>q.id)).size).toBe(bank.length);
  expect(new Set(bank.map(fingerprint)).size).toBe(bank.length);
  SUBJECTS.forEach((s,i)=>expect(bank.filter(q=>q.subject===s)).toHaveLength(PROFILE.subjectCounts[i]*10));
  bank.forEach(q=>{validateQuestion(q);expect(q.year).toBeNull();expect(q.session).toBeNull();expect(q.type).toBe('original');expect(new Set(q.choices).size).toBe(4);});
  expect(new Set(bank.filter(q=>q.family).map(q=>q.family)).size).toBe(10);
 });
 for(const q of bank.filter(q=>q.calculation)) it(`독립 계산·단일 정답 ${q.id}`,()=>{
  const {kind, values:v}=q.calculation!;
  // Independent arithmetic path, without importing generator output as expected values.
  const extra:Record<string,number>={allocation:v[0]*v[1]/v[2], 'sampling-fraction':100*v[0]/v[1], interval:v[0]/v[1], 'response-rate':100*v[0]/v[1], 'missing-rate':100*v[0]/v[1], weight:v[1]/v[0]};
  const expected=kind in extra ? extra[kind] : kind==='mean' ? v.reduce((sum,x)=>sum+x/v.length,0) : kind==='probability' ? 1-(v[1]-v[0])/v[1] : kind==='zscore' ? v[0]/v[2]-v[1]/v[2] : Math.sqrt(v[0]**2/v[1]);
  expect(q.calculation!.result).toBeCloseTo(expected,10);
  expect(Number(q.choices[q.answer-1])).toBeCloseTo(expected,10);
  expect(q.choices.filter(c=>Math.abs(Number(c)-expected)<1e-9)).toHaveLength(1);
 });
 it('JSON/CSV 양식을 실제 parser로 검증',()=>{
  const rows=parseCsv(readFileSync('public/templates/questions.csv','utf8'));
  expect(importQuestions(rows,bank).added).toHaveLength(1);
  expect(importQuestions(JSON.parse(readFileSync('public/templates/questions.json','utf8')),bank).added[0].verificationStatus).toBe('pending');
 });
 it('보기 순서와 공백을 바꾼 중복도 제거하고 불량 일괄 입력을 거부',()=>{
  const q={...bank[0],id:'new',choices:[...bank[0].choices].reverse()};
  expect(importQuestions([q],bank).duplicates).toBe(1);
  expect(()=>importQuestions([{...q,question:'독립 문항'},{}],bank)).toThrow();
 });
});
describe('시험 구성·시간·과락',()=>{
 it('100개 고유 ID 및 30/30/40 분포, 잠정 설정, family 부족 시 보충',()=>{
  const e=make(); expect(e.questions).toHaveLength(100); expect(new Set(e.questions.map(q=>q.id)).size).toBe(100);
  SUBJECTS.forEach((s,i)=>expect(e.questions.filter(q=>q.subject===s)).toHaveLength(PROFILE.subjectCounts[i]));
  expect(e.deadline-e.startedAt).toBe(9000000); expect(PROFILE.rulesVerificationStatus).toBe('pending');
  expect(()=>createExam(bank.filter(q=>q.subject!==SUBJECTS[0]),'social-main')).toThrow();
 });
 for(const [counts,passed] of [[[18,18,24],true],[[18,18,23],false],[[11,25,40],false],[[12,24,24],true],[[30,12,17],true],[[12,12,36],false]] as const) it(`평균·과락 경계 ${counts}`,()=>{
  const e=make(); SUBJECTS.forEach((s,i)=>e.questions.filter(q=>q.subject===s).slice(0,counts[i]).forEach(q=>e.answers[q.id]=q.answer));
  expect(grade(e).passed).toBe(passed);
 });
 it('만료 후 답안 반영 금지·정확히 한 번 제출·새로고침 보존',()=>{
  let s={...emptyStore(),exam:make()}; const q=s.exam.questions[0];
  const answered=answerExam(s,q.id,q.answer,2000); expect(restoreStore(JSON.stringify(answered)).exam?.answers[q.id]).toBe(q.answer);
  const expired=answerExam(s,q.id,q.answer,s.exam.deadline);expect(expired.results[0].answers).toEqual({});expect(expired.results[0].reason).toBe('timeout');
  expect(submitExam(expired).results).toHaveLength(1);expect(remainingSeconds(s.exam.deadline,s.exam.deadline)).toBe(0);
 });
 it('손상 저장 원본을 복원 성공으로 오인하지 않는다',()=>expect(()=>restoreStore('{bad')).toThrow());
});
describe('랜덤·오답·저장',()=>{
 it('한 순회 ID 중복 없음·채점 중복 방지·오답 재학습 해제',()=>{
  let s=emptyStore();s.practice=startPractice(bank,'social-main','전체');const seen=new Set<string>();
  for(let i=0;i<bank.length;i++){
   const q=bank.find(q=>q.id===s.practice!.currentId)!;expect(seen.has(q.id)).toBe(false);seen.add(q.id);
   s={...s,practice:{...s.practice!,selected:q.answer}};s=checkPractice(s,bank);const n=s.attempts.length;s=checkPractice(s,bank);expect(s.attempts).toHaveLength(n);
   s={...s,practice:nextPractice(s.practice!,bank)};
  }
  expect(seen.size).toBe(bank.length);
 });
});
