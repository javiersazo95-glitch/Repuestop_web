# RepuesTop Web

Landing oficial de RepuesTop, marketplace chileno para buscar repuestos por patente, conectar compradores con tiendas verificadas y comunicar la propuesta comercial para compradores y proveedores.

## Stack

- React 18
- TypeScript
- Vite
- React Router
- Lucide React
- CSS global en `src/styles.css`

## Requisitos

- Node.js 18 o superior
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

Por defecto Vite levanta el sitio en:

```bash
http://localhost:5174
```

## Scripts

```bash
npm run dev      # Servidor local de desarrollo
npm run build    # Compila TypeScript y genera dist/
npm run preview  # Previsualiza el build de producción
npm test         # Ejecuta Vitest
```

## Estructura

```text
src/
  App.tsx       # Landing principal y secciones comerciales
  config.ts     # Configuración pública del sitio
  main.tsx      # Entry point React/Vite
  styles.css    # Estilos globales
public/
  assets/       # Imágenes y recursos públicos
```

## Deploy

El sitio está preparado para Vercel.

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

No se debe versionar `dist/` ni `node_modules/`; Vercel instala dependencias y genera el build en cada despliegue.

## Notas de repositorio

- `node_modules/`, `dist/`, caches y archivos del sistema están ignorados por `.gitignore`.
- Los assets públicos deben vivir en `public/`.
- La fuente activa de la web está en `src/`; no mantener copias duplicadas en la raíz.
