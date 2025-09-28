# Prompts

## V0 Prompt

Crea un dashboard interactivo para un sistema de clasificación de literatura médica con las siguientes características:

```
## Diseño General
- Tema médico profesional con colores azul marino, verde médico y gris claro
- Layout responsive con sidebar de navegación
- Header con título "Medical Literature Classifier" y logo médico minimalista

## Componentes Principales

### 1. Panel de Métricas (Top Section)
- 4 cards con métricas principales:
  - Overall F1-Score (con gauge circular)
  - Overall Accuracy (con percentage bar)
  - Total Articles Classified
  - Processing Speed (articles/second)

### 2. Matriz de Confusión Interactiva
- Heatmap 4x4 para las categorías: Cardiovascular, Neurological, Hepatorenal, Oncological
- Tooltips con valores exactos al hover
- Colores graduales del verde claro al verde oscuro

### 3. Performance por Categoría
- Bar chart horizontal mostrando F1-score por categoría
- Colores diferentes para cada categoría médica
- Labels con valores numéricos

### 4. Demo de Clasificación en Tiempo Real
- Text area para ingresar título del artículo
- Text area para ingresar abstract
- Botón "Classify Article" prominente
- Panel de resultados con:
  - Predicciones con porcentajes de confianza
  - Visualización tipo pills para las categorías
  - Timeline de clasificaciones recientes

### 5. Análisis de Distribución
- Pie chart mostrando distribución de categorías en el dataset
- Sidebar con estadísticas detalladas

## Funcionalidad Interactiva
- Filtros por categoría médica
- Toggle entre vista de training y test results
- Export de resultados en PDF
- Modo oscuro/claro

## Estilo Visual
- Iconos médicos (estetoscopio, corazón, cerebro, riñón, célula)
- Gradientes sutiles
- Sombras suaves para profundidad
- Tipografía clean (Inter o similar)
- Animaciones micro para transiciones

Haz que se vea profesional, moderno y apropiado para una presentación médica/académica.
Prompt para el reporte final
```
