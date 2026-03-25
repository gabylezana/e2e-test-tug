import { expect, test } from '@playwright/test';

import { login, logout } from '../../helpers/auth.helper';
import {
  buildUniqueRegistrationData,
  defaultTestUser,
  invalidLoginAttempt
} from '../../helpers/test-data';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';
const authBaseUrl = process.env.AUTH_BASE_URL ?? process.env.BASE_URL ?? 'http://localhost:8080';
const dashboardPath = '/principal';
const invalidCredentialsMessage = 'El usuario o la contraseña son incorrectos.';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test.describe('Flujos de autenticación', () => {
  test('happy path: login exitoso con credenciales válidas', async ({ page }) => {
    // En este sistema el login vive en un servicio de auth separado del ERP principal.
    await page.goto(`${authBaseUrl}/login`);

    // Reutilizamos el helper para no repetir pasos comunes en otros tests.
    await login(page, defaultTestUser.email, defaultTestUser.password);

    // Validamos el éxito usando la URL real del dashboard principal.
    await expect(page).toHaveURL(new RegExp(`^${escapeRegExp(baseUrl)}${escapeRegExp(dashboardPath)}(?:/|$)`));
  });

  test.fixme('happy path: registro exitoso de un usuario nuevo', async ({ page }) => {
    // Generamos un email único para que el test no falle por colisión entre ejecuciones.
    const newUser = buildUniqueRegistrationData();

    // Asumimos que el registro también vive dentro del servicio de autenticación.
    await page.goto(`${authBaseUrl}/register`);

    // Completamos el formulario usando únicamente data-testid.
    await page.getByTestId('register-first-name-input').fill(newUser.firstName);
    await page.getByTestId('register-last-name-input').fill(newUser.lastName);
    await page.getByTestId('register-email-input').fill(newUser.email);
    await page.getByTestId('register-password-input').fill(newUser.password);
    await page.getByTestId('register-confirm-password-input').fill(newUser.password);
    await page.getByTestId('register-submit-button').click();

    // Este assert asume que, al registrarse, el usuario entra a la app o ve un estado autenticado.
    // Si tu aplicación redirige a otra vista, cambia este testid por el indicador estable correcto.
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('caso negativo: login con password incorrecto muestra error', async ({ page }) => {
    await page.goto(`${authBaseUrl}/login`);

    // Reutilizamos el helper también en negativo para que el llenado del formulario
    // sea consistente con el flujo real.
    await login(page, invalidLoginAttempt.email, invalidLoginAttempt.password);

    // Validamos el mensaje real que renderiza la pantalla cuando las credenciales son inválidas.
    await expect(
      page.locator('small.text-danger').filter({ hasText: invalidCredentialsMessage })
    ).toHaveText(invalidCredentialsMessage);

    // Además confirmamos que no haya llegado al dashboard principal.
    await expect(page).not.toHaveURL(new RegExp(`^${escapeRegExp(baseUrl)}${escapeRegExp(dashboardPath)}(?:/|$)`));
    await expect(page.locator('#emailInput, input[name="email"]')).toBeVisible();
  });

  test.fixme('happy path: logout exitoso', async ({ page }) => {
    await page.goto(`${authBaseUrl}/login`);
    await login(page, defaultTestUser.email, defaultTestUser.password);
    await logout(page);
  });
});
