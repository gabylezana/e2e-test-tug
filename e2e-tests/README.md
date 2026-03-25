# Proyecto E2E con Playwright

Proyecto base para probar flujos completos de usuario desde el navegador contra tu frontend React.
Los tests pegan al frontend, y el frontend consume la API real del backend Django durante la ejecución.

## Instalación

```bash
cd e2e-tests
npm install
npx playwright install chromium
```

## Ejecutar tests

Local:

```bash
npm run test:local
```

Staging:

```bash
npm run test:stg
```

Si solo quieres usar el valor por defecto de `BASE_URL`, puedes correr:

```bash
npm test
```

## Grabar tests nuevos

Playwright puede abrir un navegador y generar pasos base:

```bash
npm run codegen -- http://localhost:8080
```

Si prefieres apuntar manualmente a una URL:

```bash
npm run codegen -- https://erp.implementaconbubo.com
```

## Ver el reporte

```bash
npm run report
```

## Convenciones del proyecto

- Todo está escrito en TypeScript.
- Los selectores deben usar `data-testid`.
- Los flujos felices viven en `tests/flows`.
- Los tests de bugs o regresiones específicas vivirán en `tests/bugs`.
- Los helpers reutilizables viven en `helpers`.
- Cada test debe ser independiente y no depender del orden de ejecución.
- Evita `waitForTimeout`; Playwright ya hace auto-wait en acciones y asserts.

## Notas importantes

- `.env.local` y `.env.staging` definen `BASE_URL`, `AUTH_BASE_URL` y credenciales por entorno.
- `BASE_URL` debe apuntar al frontend principal.
- `AUTH_BASE_URL` debe apuntar al servicio donde viven login y registro.
- El archivo `.env.staging` quedó con una URL placeholder; cámbiala por tu entorno real antes de ejecutar.
