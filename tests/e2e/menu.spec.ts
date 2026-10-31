import { test, expect, type Page } from '@playwright/test';
async function open(page:Page) {
 await page.goto(''); await page.getByRole('button',{name:'메뉴 열기'}).click();
 await expect(page.locator('.sidebar')).toHaveClass(/open/); await page.waitForTimeout(250);
}
async function visibleInMenu(page:Page,name:string) {
 const button=page.getByRole('button',{name,exact:true});
 await expect.poll(async()=>{const box=await button.boundingBox();return !!box && box.y>=0 && box.y+box.height<=page.viewportSize()!.height;}).toBe(true);
}
for(const viewport of [{width:390,height:480},{width:740,height:360}]) {
 test(`실제 wheel 상하 ${viewport.width}×${viewport.height}`,async({page,isMobile})=>{
  test.skip(!isMobile);await page.setViewportSize(viewport);await open(page);
  await page.mouse.move(140,220);await page.mouse.wheel(0,1600);
  await expect.poll(()=>page.locator('.sidebar').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
  await visibleInMenu(page,'학습 기록 백업');await visibleInMenu(page,'데이터 초기화');
  const dl=page.waitForEvent('download');await page.getByRole('button',{name:'학습 기록 백업',exact:true}).click();await dl;
  await page.mouse.wheel(0,-2000);await expect.poll(()=>page.locator('.sidebar').evaluate(e=>e.scrollTop)).toBe(0);
  await visibleInMenu(page,'학습 대시보드');await page.getByRole('button',{name:'학습 대시보드',exact:true}).click();await expect(page.locator('.sidebar')).not.toHaveClass(/open/);
 });
 test(`실제 touch swipe 상하 ${viewport.width}×${viewport.height}`,async({page,isMobile})=>{
  test.skip(!isMobile);await page.setViewportSize(viewport);await open(page);
  const client=await page.context().newCDPSession(page);
  const swipe=async(start:number,end:number)=>{
   await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:140,y:start}]});
   for(let i=1;i<=12;i++) {await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:140,y:start+(end-start)*i/12}]});await page.waitForTimeout(20);}
   await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(350);
  };
  for(let i=0;i<4;i++) await swipe(viewport.height-40,75);
  await expect.poll(()=>page.locator('.sidebar').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
  await visibleInMenu(page,'데이터 초기화');await page.getByRole('button',{name:'데이터 초기화',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'돌아가기',exact:true}).click();
  for(let i=0;i<4;i++) await swipe(80,viewport.height-40);
  await expect.poll(()=>page.locator('.sidebar').evaluate(e=>e.scrollTop)).toBe(0);
  await visibleInMenu(page,'학습 대시보드');await page.getByRole('button',{name:'학습 대시보드',exact:true}).click();
 });
}
test('모든 메뉴 화면의 배너 부재·가로 넘침·글자 확대 메뉴',async({page,isMobile})=>{
 await page.goto('');
 await page.screenshot({path:`/tmp/social-${isMobile?'mobile':'desktop'}.png`,fullPage:true});
 for(const label of ['학습 대시보드','실전 모의시험','랜덤 문제풀이','오답노트','북마크','학습 통계','문제은행 관리']) {
  if(isMobile) {await page.getByRole('button',{name:'메뉴 열기'}).click();await page.waitForTimeout(250);}
  await page.getByRole('navigation').getByRole('button',{name:label,exact:true}).click();
  await expect(page.locator('main .criteria-note')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 if(isMobile) {
  await page.setViewportSize({width:390,height:480});await page.addStyleTag({content:'.sidebar {font-size:150%} .sidebar nav button {font-size:18px;min-height:60px}'});
  await page.getByRole('button',{name:'메뉴 열기'}).click();await page.waitForTimeout(250);
  await page.mouse.move(140,220);await page.mouse.wheel(0,2500);await visibleInMenu(page,'데이터 초기화');
  await page.mouse.wheel(0,-2500);await expect.poll(()=>page.locator('.sidebar').evaluate(e=>e.scrollTop)).toBe(0);await visibleInMenu(page,'학습 대시보드');
 }
});
