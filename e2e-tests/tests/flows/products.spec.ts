import { expect, test } from '@playwright/test';

import { dismissWelcomeModalIfVisible, loginToErp } from '../../helpers/auth.helper';
import { defaultTestUser, buildUniqueProductFlowData } from '../../helpers/test-data';

test.describe('Flujo de productos', () => {
  test('happy path: crear, listar y editar un producto', async ({ page }) => {
    const product = buildUniqueProductFlowData();

    // Iniciamos sesión usando el redirect real hacia el ERP.
    await loginToErp(page, defaultTestUser.email, defaultTestUser.password);
    await dismissWelcomeModalIfVisible(page);

    // Navegamos al módulo de productos desde el menú principal.
    await page.getByRole('link', { name: 'Ventas' }).click();
    await page.getByRole('link', { name: 'Productos/Servicios' }).click();

    // Abrimos el formulario para crear un nuevo producto.
    await page.getByRole('button', { name: '+ Producto' }).click();

    // Completamos el campo principal con un nombre único para no chocar con datos previos.
    await page.getByRole('textbox', { name: 'Escriba el nombre del producto' }).nth(1).fill(product.createdName);

    // Registramos el producto. El codegen detectó varios botones iguales, por eso usamos nth(4).
    // Cuando tengas testids, esto debe reemplazarse por un selector estable.
    await page.getByRole('button', { name: 'Registrar' }).nth(4).click();

    // Validamos que el producto recién creado aparezca en la tabla.
    await expect(page.getByRole('cell', { name: product.createdName })).toBeVisible();

    // Abrimos el registro desde la lista para editarlo.
    await page.getByRole('cell', { name: product.createdName }).click();

    // Cambiamos el nombre para validar el flujo de edición.
    await page.getByRole('textbox', { name: 'Escriba el nombre del producto' }).nth(1).fill(product.editedName);

    // Hacemos blur fuera del input porque el flujo grabado sugiere que así se confirma la edición.
    await page.getByRole('cell', { name: 'Producto Terminado' }).nth(1).click();

    // El producto editado debe reflejarse en la lista visible.
    await expect(page.getByRole('cell', { name: product.editedName })).toBeVisible();
  });
});
