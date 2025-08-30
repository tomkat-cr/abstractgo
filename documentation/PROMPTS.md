# Prompts

## Kickoff Prompt

Eres un experto asesor y arquitecto de sistemas.
Somos un equipo de dos desarrolladores y un ingeniero de datos y queremos participar en el siguiente reto:

```
# Challenge de Clasificación Biomédica con IA

## Introducción
¿List@ para construir algo de alto impacto? Crea un modelo de IA que ayude a clasificar investigación médica. Perfecto para desarrollar habilidades avanzadas en Data Science y destacar en tu portafolio profesional.

## El desafío
Tu reto es construir una solución de Inteligencia Artificial para apoyar la clasificación de literatura médica.

Tu objetivo será implementar un sistema capaz de asignar artículos médicos a uno o varios dominios médicos, utilizando como insumo únicamente el título y el abstract. Podrás usar machine learning tradicional, modelos de lenguaje, flujos de trabajo con agentes de IA o un enfoque híbrido, siempre que justifiques tu elección y demuestres su efectividad.

## Dataset

File : "challenge_data-18-ago.csv" (adjunto)
3,565 registros de NCBI, BC5CDR y datos sintéticos.

## Estructura del dataset

* `title`
Título del artículo médico
Texto principal para análisis de contenido

* `abstract`
Resumen científico del artículo
Fuente rica en terminología médica especializada

* `group`
Categoría(s) médica o grupo al que pertenece el artículo
Variable objetivo a predecir con tu modelo

## La meta
Dado un artículo médico, tu sistema debe clasificar correctamente si pertenece a uno o varios de los siguientes grupos:

- Cardiovascular
- Neurological
- Hepatorenal
- Oncological

## Tecnologías a utilizar
El proyecto debe estar en un repositorio público de GitHub, con toda la documentación necesaria para reproducir la solución (README, dependencias, instrucciones de uso).

Si tu enfoque se basa en código, este deberá implementarse en Python.
Si optas por un flujo de trabajo alternativo (por ejemplo, con agentes de IA o herramientas low/no-code), deberás asegurarte de que el repositorio documente claramente el proceso, configuraciones y cómo se evaluó el modelo.

Además, podrás apoyarte en distintas librerías y herramientas de tu preferencia. 

Stack y habilidades recomendadas:
- Python
- pandas
- scikit-learn
- numpy
- Herramientas de NLP
- NLTK
- spaCy
- transformers
- Librerías de visualización
- matplotlib
- seaborn
- Herramientas de desarrollo
- Jupyter Notebooks
- Git
- V0
- AI Agents
- Agentbricks
- AutoGen
- OpenAI
- Claude
- Cursor

## Visualización con V0
Utiliza V0 para crear una experiencia visual de tus resultados

¡Bonus Especial!
10 puntos adicionales por usar V0

¿Por qué V0?
- Diferenciación profesional en tu portfolio
- Habilidad esencial en ciencia de datos
- ¡10 puntos de bonus garantizados!
- Ventaja competitiva significativa

### Ideas para incluir
- Dashboard con F1-score y Accuracy
- Matriz de confusión interactiva
- Demo de clasificación en tiempo real
```

Queremos estructurar el proyecto para poder desarrollarlo en 5 días.
Necesitamos la documentación sobre la estructura de aplicación, tecnologías sugeridas, workflows, prompt para desarrollar la UI/UX en V0,  justificación de las decisiones y estructura del proyecto, sugerencias, etc.

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

## Final Report Prompt

Eres una experto redactor creativo y tecnico.

Nosotros somos participantes del reto [Challenge de Clasificación Biomédica con IA](https://techspherecolombia.com/ai-data-challenge/) y ya tenemos listo el proyecto en el repositorio de Github [Abstractgo](https://github.com/tomkat-cr/abstractgo).

Ahora necesitamos hacer el informe final y queremos que tenga estas características:

```
# Requerimientos

1. Idioma del informe: ingles

2. Formato del documento: markdown
   Nombre: "FINAL_REPORT.md"

3. Que sea corto, conciso y directo, para no aburrir al lector.

4. Debe seguir estos lineamientos del reto:

    ```
    Un informe final que incluya resultados, evidencias y reflexiones, siguiendo las rúbricas de evaluación. El informe debe incluir el apartado de Visualización con V0 si decidiste aprovechar el bonus.
    ```

5. Los prompts iniciales que utilizamos están en el documento adjunto "SM Challenge Clasificacion Biomedica con IA - Melo-Dramatics"

6. El plan que seguimos prácticamente al pie de la letra están en el documento adjunto "Plan de Proyecto Clasificación Biomédica"

7. La documentación del proyecto están en el documento adjunto "README.md".

8. La documentación del procedimiento para construir el modelo de ML "Hiver77/MDT" están en los archivos adjuntos "README-ML.md" y "AbstractGo_Final_Training_Model.ipynb" .

Analiza todos estos datos y haz el informe final. Recuerda que eres una parte muy importannte de este equipo, el 4to elemento.
```