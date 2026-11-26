# GeoSoil ML 2.1 beta
Prototipo académico web sin dependencias. No es software certificado ni apto para diseño de cimentaciones. Clasificación preliminar de suelos minerales, simulación de cimentación corrida y exportación local. No contiene modelos ML entrenados ni datos reales.

## Ejecutar
`python -m http.server 8000` y abrir http://localhost:8000. Pruebas: `node --test engine.test.mjs`.

## Vercel
Importar el repositorio en https://vercel.com/new, seleccionar Other, sin build ni instalación, directorio de salida raíz. No requiere secretos. El navegador procesa los datos localmente; no hay persistencia compartida.

## Pendiente
Auditoría de normas y casos limítrofes SUCS/AASHTO, datos vinculados, entrenamiento Python, calibración y evaluación independiente, ETL, base de datos persistente, autenticación y reportes avanzados. La clasificación actual excluye suelos orgánicos y partículas >75 mm; no es implementación normativa exhaustiva. El índice de grupo es preliminar. No hay correcciones de nivel freático ni asentamientos. La muestra de ejemplo es sintética.
