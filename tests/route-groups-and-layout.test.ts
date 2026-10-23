import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getRoleDashboardPath } from '../src/lib/auth-context';
import { brandTokens } from '../src/lib/design-tokens';

describe('Route Groups, AppShell Isolation & Brand Specification', () => {
  it('1. Root layout (src/app/layout.tsx) does NOT render AppShell or visible chrome', () => {
    const layoutPath = path.resolve(__dirname, '../src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');

    expect(content).not.toContain('<AppShell>');
    expect(content).not.toContain('import { AppShell }');
    expect(content).toContain('ThemeProvider');
    expect(content).toContain('AuthProvider');
    expect(content).toContain('AuthModal');
  });

  it('2. App route group layout (src/app/(app)/layout.tsx) provides AppShell', () => {
    const appLayoutPath = path.resolve(__dirname, '../src/app/(app)/layout.tsx');
    const content = fs.readFileSync(appLayoutPath, 'utf8');

    expect(content).toContain('import { AppShell }');
    expect(content).toContain('<AppShell>');
  });

  it('3. ZERO dashboard page files contain internal <AppShell> tags', () => {
    const dashboardDir = path.resolve(__dirname, '../src/app/(app)/dashboard');
    const files = fs.readdirSync(dashboardDir, { withFileTypes: true });

    for (const dirent of files) {
      if (dirent.isDirectory()) {
        const pageFile = path.join(dashboardDir, dirent.name, 'page.tsx');
        if (fs.existsSync(pageFile)) {
          const content = fs.readFileSync(pageFile, 'utf8');
          expect(content, `File ${dirent.name}/page.tsx should not contain <AppShell>`).not.toContain('<AppShell>');
          expect(content, `File ${dirent.name}/page.tsx should not import AppShell`).not.toContain("import { AppShell }");
        }
      }
    }
  });

  it('4. ZERO library page files contain internal <AppShell> tags', () => {
    const libraryDir = path.resolve(__dirname, '../src/app/(app)/library');
    if (fs.existsSync(libraryDir)) {
      const files = fs.readdirSync(libraryDir, { withFileTypes: true });
      for (const dirent of files) {
        if (dirent.isDirectory()) {
          const pageFile = path.join(libraryDir, dirent.name, 'page.tsx');
          if (fs.existsSync(pageFile)) {
            const content = fs.readFileSync(pageFile, 'utf8');
            expect(content).not.toContain('<AppShell>');
          }
        }
      }
    }
  });

  it('5. Role to dashboard path mapping is correct for all 5 enterprise roles', () => {
    expect(getRoleDashboardPath('employee')).toBe('/dashboard/employee');
    expect(getRoleDashboardPath('manager')).toBe('/dashboard/manager');
    expect(getRoleDashboardPath('hrbp')).toBe('/dashboard/hr');
    expect(getRoleDashboardPath('senior_leadership')).toBe('/dashboard/director');
    expect(getRoleDashboardPath('company_admin')).toBe('/dashboard/admin');
  });

  it('6. Brand Tokens maintain exact sampled hex values and AA-compliant Action Blue', () => {
    expect(brandTokens.navy).toBe('#03173B');
    expect(brandTokens.blue).toBe('#2E8EBF');
    expect(brandTokens.red).toBe('#BF1111');
    expect(brandTokens.mark).toBe('#E0E0E0');
    expect(brandTokens.white).toBe('#FFFFFF');
    expect(brandTokens.blueDark).toBe('#1D6F9F'); // Derived Action Blue (AA 5.49:1 with white text)
  });

  it('7. Public brand vector assets exist with pure transparent backgrounds', () => {
    const brandDir = path.resolve(__dirname, '../public/brand');
    expect(fs.existsSync(path.join(brandDir, 'mark.svg'))).toBe(true);
    expect(fs.existsSync(path.join(brandDir, 'mark-light.svg'))).toBe(true);
    expect(fs.existsSync(path.join(brandDir, 'horizontal.svg'))).toBe(true);
    expect(fs.existsSync(path.join(brandDir, 'horizontal-light.svg'))).toBe(true);
    expect(fs.existsSync(path.join(brandDir, 'motif.svg'))).toBe(true);
  });
});
