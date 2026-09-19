import { test, expect } from '@playwright/test';
for(const theme of ['paper','dark'] as const){
  test(`${theme} documentation`,async({page})=>{
    await page.goto('/');
    await expect(page.getByRole('heading',{name:'Structure. Signal. Substance.'})).toBeVisible();
    if(theme==='dark')await page.getByRole('button',{name:'Switch to dark theme'}).click();
    await expect(page).toHaveScreenshot(`overview-${theme}.png`,{fullPage:true,animations:'disabled'});
  });
}
test('compact data table',async({page})=>{
  await page.goto('/#/data-table');
  await page.getByLabel('DENSITY',{exact:true}).selectOption('compact');
  await expect(page).toHaveScreenshot('table-compact.png',{fullPage:true,animations:'disabled'});
});
