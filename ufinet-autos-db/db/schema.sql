IF DB_ID('autosdb') IS NULL
BEGIN
  CREATE DATABASE autosdb;
END;
GO
USE autosdb;
GO

IF OBJECT_ID('dbo.users', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL
  );
END;
GO

IF OBJECT_ID('dbo.cars', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cars (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    brand NVARCHAR(100) NOT NULL,
    model NVARCHAR(100) NOT NULL,
    year INT NOT NULL,
    plate_number NVARCHAR(50) NOT NULL UNIQUE,
    color NVARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NULL,
    CONSTRAINT fk_cars_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
  );
END;
GO

-- Si la tabla ya existía pero no tiene las columnas, agrégalas
IF COL_LENGTH('dbo.cars', 'created_at') IS NULL
BEGIN
  ALTER TABLE dbo.cars 
    ADD created_at DATETIME2 NOT NULL 
        CONSTRAINT DF_cars_created_at DEFAULT SYSUTCDATETIME();
END;
GO

IF COL_LENGTH('dbo.cars', 'updated_at') IS NULL
BEGIN
  ALTER TABLE dbo.cars 
    ADD updated_at DATETIME2 NULL;
END;
GO