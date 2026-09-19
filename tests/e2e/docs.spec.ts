import { test, expect } from '@playwright/test';
import axe from 'axe-core';
import { catalog } from '../../apps/docs/src/catalog';

test('documentation search navigates to a component and source code is available', async ({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Structure. Signal. Substance.'})).toBeVisible();
  await page.getByRole('button',{name:/Search documentation/}).click();
  await page.getByRole('dialog').getByLabel('SEARCH',{exact:true}).fill('DataTable');
  await page.getByRole('dialog').getByRole('button',{name:'DataTable Data display'}).click();
  await expect(page.getByRole('heading',{name:'DataTable',exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(page.getByRole('tabpanel',{name:'Code'})).toContainText('pageSize={5}');
  await page.getByRole('tab',{name:'Preview',exact:true}).click();
  await expect(page.getByRole('table',{name:'Data table'})).toBeVisible();
});

test('all component pages render without runtime errors', async ({page})=>{
  test.setTimeout(90_000);
  const errors:string[]=[];
  page.on('pageerror', error=>errors.push(error.message));
  for(const component of catalog){
    await page.goto(`/#/${component.id}`);
    await expect(page.getByRole('heading',{name:component.name,exact:true}).first()).toBeVisible();
    await expect(page.locator('#component-preview-panel')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('theme and density preferences persist', async ({page})=>{
  await page.goto('/#/button');
  await page.getByRole('button',{name:'Switch to dark theme'}).click();
  await page.getByLabel('DENSITY',{exact:true}).selectOption('compact');
  await expect(page.locator('html')).toHaveAttribute('data-dossier-theme','dark');
  await expect(page.locator('html')).toHaveAttribute('data-dossier-density','compact');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-dossier-theme','dark');
  await expect(page.locator('html')).toHaveAttribute('data-dossier-density','compact');
});

test('dashboard filtering, pagination and accessible dialog work',async({page})=>{
  await page.goto('/#/dashboard');
  await page.getByRole('button',{name:'Next page',exact:true}).click();
  await expect(page.getByText('6–10 of 100 records',{exact:true})).toBeVisible();
  await page.getByRole('combobox',{name:'Filter by status'}).selectOption('FAILED');
  await expect(page.getByRole('table')).not.toContainText('DELIVERED');
  await page.getByRole('searchbox',{name:'Filter events'}).fill('no-match');
  await expect(page.getByRole('heading',{name:'No records found'})).toBeVisible();
  await page.getByRole('button',{name:'Configure',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Provider configuration'});
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Configure',exact:true})).toBeFocused();
});

test('table sorting and selection keep stable row identity', async({page})=>{
  await page.goto('/#/data-table');
  const first=page.getByRole('checkbox',{name:'Select row evt_001048',exact:true});
  await first.check();
  await page.getByRole('button',{name:/LATENCY/}).click();
  await expect(page.getByRole('columnheader',{name:/LATENCY/})).toHaveAttribute('aria-sort','ascending');
  await expect(page.getByText(/1 selected/)).toBeVisible();
  await page.getByRole('button',{name:/EVENT ID/}).click();
  await page.getByRole('button',{name:/EVENT ID/}).click();
  await expect(first).toBeChecked();
});

test('representative pages pass automated accessibility checks in both themes',async({page})=>{
  test.setTimeout(90_000);
  for(const route of ['overview','input','data-table','tabs','dashboard']){
    await page.goto(`/#/${route}`);
    await expect(page.locator('main h1').first()).toBeVisible();
    for(const theme of ['paper','dark']){
      if(theme==='dark')await page.getByRole('button',{name:'Switch to dark theme'}).click();
      await page.addScriptTag({content:axe.source});
      const violations=await page.evaluate(async()=>{
        const result=await (window as unknown as {axe:typeof axe}).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});
        return result.violations.map(v=>({id:v.id,description:v.description,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));
      });
      expect(violations,`${route}/${theme}`).toEqual([]);
      if(theme==='dark')await page.getByRole('button',{name:'Switch to paper theme'}).click();
    }
  }
});
