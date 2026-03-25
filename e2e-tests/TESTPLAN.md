# Test Plan E2E

Este documento sirve como mapa inicial de cobertura para los flujos principales del frontend.
El backend Django se valida de forma indirecta, porque los tests interactúan con la UI y dejan que el frontend consuma la API real.

## Leyenda

- `P0`: crítico para liberar o validar regresiones fuertes
- `P1`: importante para la operación diaria
- `P2`: útil, pero no bloqueante

## Flujos a cubrir

| Flujo | Prioridad | Estado | Notas |
| --- | --- | --- | --- |
| Registro de usuario nuevo | P0 | pendiente | Falta confirmar el flujo real de registro en auth |
| Login | P0 | escrito | Cubierto en `tests/flows/auth.spec.ts` |
| Logout | P0 | pendiente | Falta identificar el selector real de salida del ERP |
| Login con credenciales inválidas | P0 | escrito | Cubierto en `tests/flows/auth.spec.ts` |
| Crear producto | P0 | escrito | Cubierto en `tests/flows/products.spec.ts` |
| Listar producto creado | P0 | escrito | Cubierto en `tests/flows/products.spec.ts` |
| Editar producto existente | P0 | escrito | Cubierto en `tests/flows/products.spec.ts` |
| Ver historial del flujo principal | P1 | pendiente | Si el historial relevante es catálogo, se puede ampliar sobre productos |
| Editar perfil | P2 | pendiente | Cambios de datos personales y preferencias |

## Próximos pasos sugeridos

1. Ejecutar el nuevo spec de productos y confirmar si la edición se guarda con blur o necesita un botón extra.
2. Agregar `data-testid` estables en auth, dashboard, navegación y formulario de productos.
3. Crear un usuario de prueba aislado por entorno para evitar dependencia de datos manuales.
