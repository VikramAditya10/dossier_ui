import { test, expect } from '@playwright/test';
test('mobile navigation, docs and dense tables remain usable',async({page})=>{
  await page.goto('/');
  const mobile=await page.getByRole('button',{name:'Open navigation',exact:true}).isVisible();
  if(mobile)await page.getByRole('button',{name:'Open navigation',exact:true}).click();
  await page.getByRole('complementary',{name:'Documentation navigation'}).getByRole('link',{name:'DataTable',exact:true}).click();
  await expect(page.getByRole('heading',{name:'DataTable',exact:true})).toBeVisible();
  if(mobile)await expect(page.getByRole('button',{name:'Open navigation',exact:true})).toHaveAttribute('aria-expanded','false');
  const overflows=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflows).toBe(false);
  await expect(page.getByRole('region',{name:'Data table, scrollable'})).toBeVisible();
  await page.getByRole('button',{name:'Next page',exact:true}).click();
  await expect(page.getByText('6–10 of 100 records',{exact:true})).toBeVisible();
});
