# Anotador de Horas

Pequeña aplicación web para registrar horas de salida y calcular el total trabajado.

## 📦 Estructura del proyecto

- `index.html` - interfaz principal
- `styles.css` - estilos
- `script.js` - lógica de registro de horas y cálculo

## 🚀 Publicar en GitHub

1. Abre una terminal en la carpeta del proyecto:
   ```sh
   cd "c:/Users/LENOVO/Desktop/anotador de hs Proyect"
   ```
2. Inicializa el repositorio:
   ```sh
   git init
   git add .
   git commit -m "Inicio del proyecto"
   ```
3. Crea un repositorio en GitHub:
   - Opción web: ve a https://github.com/new y crea uno (ej. `anotador-de-hs`).
   - Opción CLI (requiere `gh`):
     ```sh
     gh repo create anotador-de-hs --public --source=. --remote=origin --push
     ```

## ☁️ Desplegar en Vercel

1. Ve a https://vercel.com y accede con tu cuenta.
2. Haz clic en **New Project** y elige tu repositorio de GitHub.
3. Configura el proyecto como sitio estático (Framework Preset: `Other` / `Static Site`).
4. Despliega.

Una vez desplegado, Vercel te dará una URL tipo `https://<proyecto>.vercel.app` donde se mostrará la app.

---

## 📌 Notas útiles

- Los datos se guardan en `localStorage`, por lo que son locales en cada navegador.
- Para reiniciar los datos, borra el almacenamiento local o abre las herramientas de desarrollo del navegador.
