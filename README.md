# Proyecto Ufinet Autos

Aplicación full-stack para gestión de autos, con:
- **Backend**: Spring Boot + SQL Server
- **Base de datos**: SQL Server 2022 en Docker
- **Frontend**: React + TypeScript + Material UI

## 📦 Requisitos previos

- **Docker Desktop** (mínimo 4 GB RAM asignada)
- **Java 17** o superior
- **Maven** (`mvn`)
- **Node.js** 20+ y **npm**
- **Git** (opcional, si usas repositorio)

---

## 1️⃣ Levantar la base de datos

### 1.1 Descargar y descomprimir configuración recomendada
Coloca el contenido de `ufinet-db-recommended.zip` en una carpeta `db/` dentro del proyecto.

Estructura esperada:

db/
docker-compose.yml
schema.sql
data.sql

### 1.2 Levantar SQL Server
```bash
cd db
docker compose up -d
docker compose ps
docker logs -f ufinet-mssql

Esperar hasta ver en los logs:

SQL Server is now ready for client connections.
```

### 1.3 Cargar esquema y datos iniciales

```bash
docker cp schema.sql ufinet-mssql:/tmp/schema.sql
docker cp data.sql   ufinet-mssql:/tmp/data.sql
docker exec -it ufinet-mssql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong!Passw0rd' -C -i /tmp/schema.sql
docker exec -it ufinet-mssql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong!Passw0rd' -C -i /tmp/data.sql

```
### 1.4 Probar conexión

```bash
docker exec -it ufinet-mssql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong!Passw0rd' -C -Q "SELECT 1"

```
## 2️⃣ Backend (Spring Boot)

```bash
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=autosdb;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourStrong!Passw0rd
spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=always
spring.sql.init.platform=sqlserver
spring.jpa.show-sql=true

```
### 2.2 Compilar y ejecutar

```bash
cd backend
mvn clean install
mvn spring-boot:run

El backend debería estar en:

http://localhost:8080

TEST:
GET http://localhost:8080/api/health
→ {"status":"OK"}

```

## 3️⃣ Frontend (React + TypeScript + Material UI)

### 3.1 Crear el proyecto

```bash
cd ..
mkdir frontend
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-router-dom axios

```
### 3.2 Configurar proxy en vite.config.ts

```bash
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}

```
### 3.3 Ejecutar

```bash
npm run dev