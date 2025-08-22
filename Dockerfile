# Usar una imagen base oficial de Python
FROM python:3.12-slim

# Establecer el directorio de trabajo en el contenedor
WORKDIR /code

# Copiar el archivo de dependencias y luego instalar las dependencias
# Esto aprovecha el cache de capas de Docker
COPY server/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copiar los archivos de la aplicación y el modelo al contenedor
COPY server/api /code/api
COPY saved_models /code/saved_models

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 8000

# Comando para ejecutar la aplicación usando uvicorn
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
