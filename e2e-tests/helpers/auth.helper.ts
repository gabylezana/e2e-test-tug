import { expect, type Page } from '@playwright/test';

const authSelectors = {
  // Tu pantalla real de auth todavía no expone data-testid, así que usamos selectores
  // estables disponibles hoy. Cuando agregues data-testid conviene migrar a eso.
  emailInput: '#emailInput, input[name="email"], input[placeholder="Correo Electrónico"]',
  passwordInput: 'input[name="password"], input[type="password"][placeholder="Contraseña"], input[type="password"]',
  submitButton: 'button:has-text("Ingresar"), button[onclick="validateForm()"]',
  loginHeading: 'text=Inicio de Sesión',
  userMenuButton: '[data-testid="user-menu-button"]',
  logoutButton: '[data-testid="logout-button"]'
} as const;

const defaultBaseUrl = process.env.BASE_URL ?? 'http://localhost:8080';
const defaultAuthBaseUrl = process.env.AUTH_BASE_URL ?? defaultBaseUrl;

export async function login(page: Page, email: string, password: string): Promise<void> {
  const emailInput = page.locator(authSelectors.emailInput).first();
  const passwordInput = page.locator(authSelectors.passwordInput).first();
  const submitButton = page.locator(authSelectors.submitButton).first();

  // Confirmamos que el formulario de auth realmente está visible antes de escribir.
  await expect(page.locator(authSelectors.loginHeading)).toBeVisible();
  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();

  // Completamos credenciales y enviamos el formulario real de autenticación.
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();
}

export async function loginToErp(page: Page, email: string, password: string): Promise<void> {
  const loginUrl = `${defaultAuthBaseUrl}/login?url_redirect=https://lobby.implementaconbubo.com/api/companies?url_redirect=${defaultBaseUrl}/principal&url_name=tugerente`;

  // Entramos al login con el redirect completo del ERP para reproducir el flujo real.
  await page.goto(loginUrl);
  await login(page, email, password);

  // Esperamos a que el usuario llegue a la pantalla principal del ERP.
  await expect(page).toHaveURL(new RegExp(`^${escapeRegExp(defaultBaseUrl)}/principal(?:/|$)`));
}

export async function dismissWelcomeModalIfVisible(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: '✕' });

  // Algunos usuarios ven un modal después del login. Si aparece, lo cerramos.
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
}

export async function logout(page: Page): Promise<void> {
  // Este helper queda preparado para cuando tengamos los testids reales del ERP autenticado.
  // Abrimos el menú del usuario autenticado.
  await page.locator(authSelectors.userMenuButton).click();

  // Cerramos la sesión y validamos que el login vuelva a mostrarse.
  await page.locator(authSelectors.logoutButton).click();
  await expect(page.locator(authSelectors.loginHeading)).toBeVisible();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
