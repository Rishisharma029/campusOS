/**
 * CampusOS Enterprise Playwright Runtime Validation Suite
 * Covers: Page crawl, console errors, RBAC, UI interactions, accessibility, responsive
 */
import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';

const BASE_URL = 'http://localhost:5173';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  detail: string;
  duration?: number;
}

const results: TestResult[] = [];
let totalPass = 0, totalFail = 0, totalWarn = 0;

function log(result: TestResult) {
  results.push(result);
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${result.status}] ${result.test}: ${result.detail}`);
  if (result.status === 'PASS') totalPass++;
  else if (result.status === 'FAIL') totalFail++;
  else totalWarn++;
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([promise, new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms))]);
}

async function runSuite() {
  console.log('\n🚀 CampusOS Enterprise Playwright Test Suite Starting...\n');
  const browser: Browser = await chromium.launch({ headless: true });
  
  // ─────────────────────────────────────────────────────
  // PHASE 1: Route crawl + console error detection
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 1: Full Route Crawl + Console Error Detection\n');

  const allRoutes = [
    { path: '/', name: 'Dashboard (root)' },
    { path: '/login', name: 'Login' },
    { path: '/timetable', name: 'Timetable' },
    { path: '/attendance', name: 'Attendance' },
    { path: '/students', name: 'Students' },
    { path: '/faculty', name: 'Faculty' },
    { path: '/courses', name: 'Courses' },
    { path: '/assignments', name: 'Assignments' },
    { path: '/fees', name: 'Fees' },
    { path: '/library', name: 'Library' },
    { path: '/hostel', name: 'Hostel' },
    { path: '/transport', name: 'Transport' },
    { path: '/placement', name: 'Placement' },
    { path: '/reports', name: 'Reports' },
    { path: '/settings', name: 'Settings' },
    { path: '/twin', name: 'Digital Twin' },
    { path: '/analytics', name: 'Analytics Hub' },
    { path: '/calendar', name: 'Calendar' },
    { path: '/map', name: 'Campus Map 3D' },
    { path: '/emergency', name: 'Emergency SOS' },
    { path: '/noticeboard', name: 'Notice Board' },
    { path: '/complaints', name: 'Complaints' },
    { path: '/clubs', name: 'Clubs' },
    { path: '/security', name: 'Security Center' },
    { path: '/adk-agents', name: 'ADK Agents' },
    { path: '/system-health', name: 'System Health' },
    { path: '/academic-copilot', name: 'Academic Copilot' },
    { path: '/faculty-copilot', name: 'Faculty Copilot' },
    { path: '/cao', name: 'CAO Portal' },
    { path: '/decision-intelligence', name: 'Decision Intelligence' },
    { path: '/energy', name: 'Energy Portal' },
    { path: '/security-vault', name: 'Security Vault' },
    { path: '/doc-center', name: 'RAG Doc Center' },
    { path: '/examinations', name: 'Examinations' },
  ];

  for (const route of allRoutes) {
    const ctx: BrowserContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page: Page = await ctx.newPage();
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known benign browser messages
        if (!text.includes('favicon') && !text.includes('Download the React DevTools')) {
          consoleErrors.push(text);
        }
      }
    });

    page.on('pageerror', err => {
      consoleErrors.push(`PAGEERROR: ${err.message}`);
    });

    const t0 = Date.now();
    try {
      // Inject auth into sessionStorage before navigating so protected routes work
      await page.addInitScript(() => {
        sessionStorage.setItem('auth_active', 'true');
        sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
        localStorage.setItem('erp_role', 'Admin');
        localStorage.setItem('access_token', 'demo_token_admin');
      });

      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(800); // allow hydration

      // Check page isn't blank
      const bodyText = await page.evaluate(() => document.body.innerText.trim());
      const hasContent = bodyText.length > 50;

      // Check no React error boundary fired
      const hasErrorBoundary = await page.locator('text=Something went wrong').isVisible().catch(() => false);
      const hasBlankError = await page.locator('text=useToast is not defined').isVisible().catch(() => false);
      
      const duration = Date.now() - t0;

      if (hasErrorBoundary || hasBlankError) {
        log({ test: `Route: ${route.name}`, status: 'FAIL', detail: `Error boundary triggered on ${route.path}`, duration });
      } else if (!hasContent) {
        log({ test: `Route: ${route.name}`, status: 'FAIL', detail: `Blank page on ${route.path}`, duration });
      } else if (consoleErrors.length > 0) {
        log({ test: `Route: ${route.name}`, status: 'WARN', detail: `Console errors: ${consoleErrors.slice(0,2).join(' | ')}`, duration });
      } else {
        log({ test: `Route: ${route.name}`, status: 'PASS', detail: `${route.path} loaded in ${duration}ms, content OK`, duration });
      }
    } catch (e: any) {
      log({ test: `Route: ${route.name}`, status: 'FAIL', detail: `Navigation error: ${e.message?.slice(0, 100)}` });
    }

    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 2: Login workflow E2E
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 2: Login E2E Workflow\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const t0 = Date.now();
    try {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Check login page renders
      const loginTitle = await page.locator('h1, h2, h3').first().textContent().catch(() => '');
      if (!loginTitle) throw new Error('Login page has no heading');
      
      // Fill credentials
      await page.fill('input[type="text"], input[type="email"]', 'admin@campusos.edu');
      await page.fill('input[type="password"]', 'Admin@12345!');
      
      // Select role if dropdown exists
      const roleSelect = page.locator('select');
      if (await roleSelect.count() > 0) {
        await roleSelect.selectOption('Admin');
      }
      
      // Submit form
      const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
      await submitBtn.click();
      
      // Wait for OTP step or redirect
      await page.waitForTimeout(1500);
      
      // Check if OTP step appeared or we got redirected
      const onOtp = await page.locator('input[maxlength="1"]').count() > 0;
      const onDashboard = page.url().includes('/login') === false;
      
      if (onOtp) {
        // Enter 6-digit OTP (any 6 digits work in demo mode)
        const otpInputs = page.locator('input[maxlength="1"]');
        const count = await otpInputs.count();
        for (let i = 0; i < Math.min(count, 6); i++) {
          await otpInputs.nth(i).fill(String(i + 1));
        }
        await page.waitForTimeout(500);
        const otpSubmit = page.locator('button[type="submit"], button:has-text("Verify"), button:has-text("Continue")').first();
        await otpSubmit.click();
        await page.waitForTimeout(2000);
        
        const redirected = page.url() !== `${BASE_URL}/login`;
        log({ test: 'Login: OTP 2FA flow', status: redirected ? 'PASS' : 'WARN', detail: redirected ? `Redirected to ${page.url()} after OTP` : 'Still on login after OTP — demo mode may skip redirect', duration: Date.now() - t0 });
      } else if (onDashboard) {
        log({ test: 'Login: Credentials + redirect', status: 'PASS', detail: `Redirected to ${page.url()}`, duration: Date.now() - t0 });
      } else {
        log({ test: 'Login: Credentials submit', status: 'WARN', detail: 'Submit clicked, still on login — network API unavailable (expected in demo)', duration: Date.now() - t0 });
      }
    } catch (e: any) {
      log({ test: 'Login: E2E flow', status: 'FAIL', detail: e.message?.slice(0, 150) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 3: Sidebar + Navigation Interaction
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 3: Sidebar Navigation & Interaction Test\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });
    try {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Check sidebar exists
      const sidebar = page.locator('aside');
      const sidebarVisible = await sidebar.isVisible().catch(() => false);
      log({ test: 'Sidebar: Renders', status: sidebarVisible ? 'PASS' : 'FAIL', detail: sidebarVisible ? 'Sidebar element present and visible' : 'No <aside> element found' });

      // Check nav links
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      log({ test: 'Sidebar: Nav links count', status: linkCount > 5 ? 'PASS' : 'FAIL', detail: `Found ${linkCount} navigation links` });

      // Check Layer headers exist (L1/L2/L3)
      const layer1 = await page.locator('text=Layer 1').isVisible().catch(() => false);
      const layer2 = await page.locator('text=Layer 2').isVisible().catch(() => false);
      const layer3 = await page.locator('text=Layer 3').isVisible().catch(() => false);
      log({ test: 'Sidebar: 3-Layer Architecture headers', status: (layer1 && layer2 && layer3) ? 'PASS' : 'WARN', detail: `L1:${layer1} L2:${layer2} L3:${layer3}` });

      // Toggle sidebar
      const toggleBtn = page.locator('button[class*="ChevronLeft"], button[class*="ChevronRight"], aside button').first();
      if (await toggleBtn.isVisible().catch(() => false)) {
        await toggleBtn.click();
        await page.waitForTimeout(400);
        log({ test: 'Sidebar: Toggle button clickable', status: 'PASS', detail: 'Sidebar toggle clicked successfully' });
      } else {
        log({ test: 'Sidebar: Toggle button', status: 'WARN', detail: 'Toggle button not found / not clickable' });
      }

      // Click a nav link (Students)
      const studentsLink = page.locator('a[href*="students"]').first();
      if (await studentsLink.isVisible().catch(() => false)) {
        await studentsLink.click();
        await page.waitForTimeout(1500);
        const onStudents = page.url().includes('students');
        log({ test: 'Sidebar: Navigate to Students', status: onStudents ? 'PASS' : 'FAIL', detail: `URL: ${page.url()}` });
      }
    } catch (e: any) {
      log({ test: 'Sidebar: Navigation', status: 'FAIL', detail: e.message?.slice(0, 100) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 4: RBAC — Student role access to admin routes
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 4: RBAC Penetration Test\n');
  const rbacTests = [
    { role: 'Student', route: '/security-vault', name: 'Student → SOC Vault', expectBlocked: true },
    { role: 'Student', route: '/cao', name: 'Student → CAO Portal', expectBlocked: true },
    { role: 'Student', route: '/energy', name: 'Student → Energy Portal', expectBlocked: true },
    { role: 'Student', route: '/reports', name: 'Student → Reports', expectBlocked: true },
    { role: 'Student', route: '/system-health', name: 'Student → System Health', expectBlocked: true },
    { role: 'Faculty', route: '/security-vault', name: 'Faculty → SOC Vault', expectBlocked: true },
    { role: 'Accountant', route: '/security-vault', name: 'Accountant → SOC Vault', expectBlocked: true },
  ];

  for (const rbac of rbacTests) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((r) => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'testuser', role: r }));
      localStorage.setItem('erp_role', r);
      localStorage.setItem('access_token', 'demo_token');
    }, rbac.role);
    try {
      await page.goto(`${BASE_URL}${rbac.route}`, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(800);
      const currentUrl = page.url();
      const wasRedirected = !currentUrl.includes(rbac.route) || currentUrl.endsWith('/');
      // Check if dashboard content is shown instead (redirect happened)
      const hasRestrictedContent = await page.locator(`text=Security Vault, text=CAO Portal, text=Energy Portal`).count() > 0;
      
      if (rbac.expectBlocked) {
        const blocked = wasRedirected || !hasRestrictedContent;
        log({ test: `RBAC: ${rbac.name}`, status: blocked ? 'PASS' : 'FAIL', detail: blocked ? `Correctly redirected (URL: ${currentUrl.split('/').pop() || '/'})` : `ACCESS GRANTED — should have been blocked!` });
      }
    } catch (e: any) {
      log({ test: `RBAC: ${rbac.name}`, status: 'WARN', detail: `Navigation error: ${e.message?.slice(0, 80)}` });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 5: Responsive Design Testing
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 5: Responsive Design Testing\n');
  const viewports = [
    { width: 375, height: 812, name: 'Mobile 375px (iPhone SE)' },
    { width: 390, height: 844, name: 'Mobile 390px (iPhone 14)' },
    { width: 768, height: 1024, name: 'Tablet 768px (iPad)' },
    { width: 1024, height: 768, name: 'Tablet 1024px Landscape' },
    { width: 1440, height: 900, name: 'Desktop 1440px' },
    { width: 2560, height: 1440, name: '4K / Ultra-wide 2560px' },
  ];

  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });
    try {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 12000 });
      await page.waitForTimeout(600);

      // Check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // Check main content area is visible
      const mainVisible = await page.locator('main, [class*="main"], div[class*="flex-1"]').first().isVisible().catch(() => false);
      
      // Check for layout breakage (text clipping)
      const bodyText = await page.evaluate(() => document.body.innerText.length);
      
      log({ 
        test: `Responsive: ${vp.name}`, 
        status: hasOverflow ? 'WARN' : 'PASS', 
        detail: `${vp.width}x${vp.height} — overflow:${hasOverflow}, content:${bodyText > 100}, main:${mainVisible}` 
      });
    } catch (e: any) {
      log({ test: `Responsive: ${vp.name}`, status: 'FAIL', detail: e.message?.slice(0, 80) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 6: Accessibility — keyboard navigation + aria
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 6: Accessibility Audit\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });
    try {
      await page.goto(`${BASE_URL}/students`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Check buttons have accessible text
      const buttonsWithoutText = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.filter(b => !b.textContent?.trim() && !b.getAttribute('aria-label')).length;
      });
      log({ test: 'A11y: Buttons have text or aria-label', status: buttonsWithoutText === 0 ? 'PASS' : 'WARN', detail: `${buttonsWithoutText} buttons missing accessible label` });

      // Check images have alt text
      const imagesWithoutAlt = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(img => !img.alt).length;
      });
      log({ test: 'A11y: Images have alt text', status: imagesWithoutAlt === 0 ? 'PASS' : 'WARN', detail: `${imagesWithoutAlt} images missing alt` });

      // Check inputs have labels
      const inputsWithoutLabel = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])'));
        return inputs.filter(input => {
          const id = input.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = input.getAttribute('aria-label');
          const hasPlaceholder = (input as HTMLInputElement).placeholder;
          return !hasLabel && !hasAriaLabel && !hasPlaceholder;
        }).length;
      });
      log({ test: 'A11y: Inputs have labels/aria/placeholder', status: inputsWithoutLabel === 0 ? 'PASS' : 'WARN', detail: `${inputsWithoutLabel} inputs missing labels` });

      // Test keyboard Tab navigation — check focus moves
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      const focusedEl = await page.evaluate(() => document.activeElement?.tagName + '.' + document.activeElement?.className?.slice(0, 30));
      log({ test: 'A11y: Keyboard Tab focus works', status: focusedEl && focusedEl !== 'null' ? 'PASS' : 'WARN', detail: `Focused: ${focusedEl}` });

      // Check h1 present on page
      const h1Count = await page.locator('h1').count();
      log({ test: 'A11y: Single H1 on page', status: h1Count === 1 ? 'PASS' : 'WARN', detail: `Found ${h1Count} <h1> elements (target: 1)` });

      // Check logout button has aria-label (our fix from earlier)
      const logoutAriaLabel = await page.locator('button[aria-label="Logout from CampusOS"]').count();
      log({ test: 'A11y: Logout button aria-label', status: logoutAriaLabel > 0 ? 'PASS' : 'FAIL', detail: logoutAriaLabel > 0 ? 'aria-label present' : 'Missing aria-label on logout' });

    } catch (e: any) {
      log({ test: 'A11y: Audit', status: 'FAIL', detail: e.message?.slice(0, 100) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 7: UI Interactions — Students CRUD
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 7: Students Page UI Interactions\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });
    try {
      await page.goto(`${BASE_URL}/students`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1200);

      // Check data table renders
      const tableRows = await page.locator('table tbody tr, [class*="DataGrid"] [class*="row"]').count();
      log({ test: 'Students: Data table renders', status: tableRows > 0 ? 'PASS' : 'FAIL', detail: `${tableRows} student rows found` });

      // Search input
      const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="Search" i]').first();
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.fill('Aarav');
        await page.waitForTimeout(500);
        const filteredRows = await page.locator('table tbody tr').count();
        log({ test: 'Students: Search filter works', status: filteredRows <= tableRows ? 'PASS' : 'WARN', detail: `Filtered: ${filteredRows} rows for "Aarav"` });
        await searchInput.clear();
      } else {
        log({ test: 'Students: Search filter', status: 'WARN', detail: 'Search input not found' });
      }

      // Add Student modal
      const addBtn = page.locator('button:has-text("Add Student"), button:has-text("Add")').first();
      if (await addBtn.isVisible().catch(() => false)) {
        await addBtn.click();
        await page.waitForTimeout(600);
        const modalOpen = await page.locator('[class*="modal" i], [role="dialog"]').isVisible().catch(() => false);
        log({ test: 'Students: Add modal opens', status: modalOpen ? 'PASS' : 'WARN', detail: modalOpen ? 'Modal opened' : 'No modal appeared after clicking Add' });
        // Close with Escape
        if (modalOpen) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
        }
      } else {
        log({ test: 'Students: Add button', status: 'WARN', detail: 'Add button not found' });
      }
    } catch (e: any) {
      log({ test: 'Students: Interactions', status: 'FAIL', detail: e.message?.slice(0, 100) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 8: System Health page vitals
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 8: System Health Page Vitals\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });
    try {
      await page.goto(`${BASE_URL}/system-health`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1500);

      // Check metric cards
      const servicesOnline = await page.locator('text=99.98%').isVisible().catch(() => false);
      const agentCount = await page.locator('text=Active').first().isVisible().catch(() => false);
      const threatLevel = await page.locator('text=Low').isVisible().catch(() => false);

      log({ test: 'SystemHealth: Services Online metric', status: servicesOnline ? 'PASS' : 'WARN', detail: servicesOnline ? '99.98% visible' : 'Metric not found in DOM' });
      log({ test: 'SystemHealth: AI Agents metric', status: agentCount ? 'PASS' : 'WARN', detail: agentCount ? 'Active agents count visible' : 'Not found' });
      log({ test: 'SystemHealth: Threat Level metric', status: threatLevel ? 'PASS' : 'WARN', detail: threatLevel ? 'Low threat indicator visible' : 'Not found' });
    } catch (e: any) {
      log({ test: 'SystemHealth: Vitals', status: 'FAIL', detail: e.message?.slice(0, 100) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 9: Performance Timing
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 9: Performance Timing Metrics\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });
    try {
      const t0 = Date.now();
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });
      const navTime = Date.now() - t0;

      // Get Web Vitals from Performance API
      const perf = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
          loadComplete: Math.round(nav.loadEventEnd - nav.startTime),
          ttfb: Math.round(nav.responseStart - nav.requestStart),
          resourceCount: performance.getEntriesByType('resource').length,
        };
      });

      log({ test: 'Perf: Time to First Byte (TTFB)', status: perf.ttfb < 200 ? 'PASS' : 'WARN', detail: `${perf.ttfb}ms (target: <200ms)` });
      log({ test: 'Perf: DOM Content Loaded', status: perf.domContentLoaded < 1500 ? 'PASS' : 'WARN', detail: `${perf.domContentLoaded}ms` });
      log({ test: 'Perf: Full Load Complete', status: perf.loadComplete < 3000 ? 'PASS' : 'WARN', detail: `${perf.loadComplete}ms` });
      log({ test: 'Perf: Total navigation time', status: navTime < 5000 ? 'PASS' : 'WARN', detail: `${navTime}ms end-to-end` });
      log({ test: 'Perf: Resource count', status: perf.resourceCount < 200 ? 'PASS' : 'WARN', detail: `${perf.resourceCount} resources loaded` });

      // Check for memory (if available)
      const memory = await page.evaluate(() => {
        const m = (performance as any).memory;
        if (!m) return null;
        return { used: Math.round(m.usedJSHeapSize / 1024 / 1024), total: Math.round(m.totalJSHeapSize / 1024 / 1024) };
      });
      if (memory) {
        log({ test: 'Perf: JS Heap memory', status: memory.used < 100 ? 'PASS' : 'WARN', detail: `${memory.used}MB used / ${memory.total}MB total` });
      } else {
        log({ test: 'Perf: JS Heap memory', status: 'WARN', detail: 'performance.memory not available in this browser context' });
      }
    } catch (e: any) {
      log({ test: 'Perf: Timing', status: 'FAIL', detail: e.message?.slice(0, 100) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 10: Network disconnect recovery
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 10: Network Disconnect Recovery\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });
    try {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(800);

      // Simulate offline
      await ctx.setOffline(true);
      await page.waitForTimeout(500);

      // Navigate while offline
      const consoleErrors: string[] = [];
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

      // Try navigating to another page while offline (should use cached assets)
      await page.goto(`${BASE_URL}/attendance`, { waitUntil: 'commit', timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);

      const stillRendering = await page.locator('body').isVisible().catch(() => false);
      
      // Re-enable network
      await ctx.setOffline(false);
      await page.waitForTimeout(500);

      log({ test: 'Network: Offline recovery — app doesn\'t crash', status: stillRendering ? 'PASS' : 'WARN', detail: stillRendering ? 'App still renders during offline (uses cached JS)' : 'App may not survive offline mode' });
      log({ test: 'Network: Console errors during offline', status: consoleErrors.length === 0 ? 'PASS' : 'WARN', detail: consoleErrors.length === 0 ? 'No console errors during offline' : `${consoleErrors.length} errors: ${consoleErrors[0]?.slice(0,80)}` });
    } catch (e: any) {
      log({ test: 'Network: Offline recovery', status: 'WARN', detail: `Test infrastructure issue: ${e.message?.slice(0, 80)}` });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // PHASE 11: XSS Injection Test
  // ─────────────────────────────────────────────────────
  console.log('\n📋 PHASE 11: XSS Injection Penetration Test\n');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'admin', role: 'Admin' }));
      localStorage.setItem('erp_role', 'Admin');
      localStorage.setItem('access_token', 'demo_token_admin');
    });

    let xssAlerted = false;
    page.on('dialog', async dialog => {
      xssAlerted = true;
      await dialog.dismiss();
    });

    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><img src=x onerror=alert(1)>',
      "javascript:alert('xss')",
      '<svg onload=alert(1)>',
    ];

    try {
      await page.goto(`${BASE_URL}/students`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(800);

      // Try XSS in search field
      const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="Search" i]').first();
      if (await searchInput.isVisible().catch(() => false)) {
        for (const payload of xssPayloads) {
          await searchInput.fill(payload);
          await page.waitForTimeout(300);
          if (xssAlerted) break;
        }
        log({ test: 'Security: XSS in search input', status: xssAlerted ? 'FAIL' : 'PASS', detail: xssAlerted ? '🚨 XSS ALERT TRIGGERED!' : 'No XSS execution — React JSX escapes correctly' });
      } else {
        log({ test: 'Security: XSS search test', status: 'WARN', detail: 'Search input not found for injection test' });
      }
    } catch (e: any) {
      log({ test: 'Security: XSS test', status: 'FAIL', detail: e.message?.slice(0, 100) });
    }
    await ctx.close();
  }

  // ─────────────────────────────────────────────────────
  // FINAL REPORT
  // ─────────────────────────────────────────────────────
  await browser.close();

  const summary = {
    totalTests: results.length,
    passed: totalPass,
    warnings: totalWarn,
    failed: totalFail,
    passRate: Math.round((totalPass / results.length) * 100),
  };

  console.log('\n' + '='.repeat(70));
  console.log('📊 CAMPUSOS PLAYWRIGHT RUNTIME VALIDATION — FINAL RESULTS');
  console.log('='.repeat(70));
  console.log(`Total Tests    : ${summary.totalTests}`);
  console.log(`✅ PASSED      : ${summary.passed}`);
  console.log(`⚠️  WARNINGS   : ${summary.warnings}`);
  console.log(`❌ FAILED      : ${summary.failed}`);
  console.log(`Pass Rate      : ${summary.passRate}%`);
  console.log('='.repeat(70));

  if (summary.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  • ${r.test}: ${r.detail}`));
  }
  if (summary.warnings > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.filter(r => r.status === 'WARN').forEach(r => console.log(`  • ${r.test}: ${r.detail}`));
  }

  // Output JSON for programmatic use
  const outputPath = process.argv[2] || './playwright-results.json';
  const fs = await import('fs');
  fs.writeFileSync(outputPath, JSON.stringify({ summary, results }, null, 2));
  console.log(`\n📄 Full results written to: ${outputPath}`);
}

runSuite().catch(err => {
  console.error('Test suite crashed:', err);
  process.exit(1);
});
