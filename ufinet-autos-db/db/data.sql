USE autosdb;
GO
IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email='demo@example.com')
BEGIN
  INSERT INTO dbo.users (email, password_hash, full_name)
  VALUES ('demo@example.com', '$2a$10$Dem0HashForNow', 'Demo User');
END;
GO