# Usa una imagen base de Node.js
FROM node:14

# Directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente de la aplicación al contenedor
COPY . .

CMD ["node","app.js"]