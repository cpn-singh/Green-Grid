import puppeteer from 'puppeteer-core';

async function testMap() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  page.on('requestfailed', req => console.warn('REQUEST FAILED:', req.url(), req.failure()?.errorText));

  console.log('Navigating to http://localhost:5173/map ...');
  try {
    await page.goto('http://localhost:5173/map', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    console.log('Navigation timeout or error:', e.message);
  }

  const title = await page.title();
  console.log('Page title:', title);

  const html = await page.evaluate(() => {
    const root = document.querySelector('#root');
    const leafletPane = document.querySelector('.leaflet-tile-pane');
    return {
      rootChildren: root ? root.innerHTML.slice(0, 300) : 'NO ROOT',
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      mapContainers: document.querySelectorAll('.leaflet-container').length,
      tiles: document.querySelectorAll('.leaflet-tile').length,
      leafletPaneHtml: leafletPane ? leafletPane.innerHTML.slice(0, 200) : 'NO PANE',
    };
  });
  console.log('DOM Evaluation:', html);

  await page.screenshot({ path: 'map_screenshot.png' });
  console.log('Screenshot saved to map_screenshot.png');

  await browser.close();
}

testMap().catch(console.error);
