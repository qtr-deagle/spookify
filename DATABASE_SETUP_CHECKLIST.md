# 🗄️ Database Setup Checklist

## Required: Run Before Using Role-Based Features

### Step 1: ✅ Verify Database Connection
```bash
mysql -u root
# You should see: mysql>
```

### Step 2: ✅ Select Database
```sql
USE spookify;
```

### Step 3: ✅ Run Migration Script

**Option A: From command line**
```bash
mysql -u root spookify < api/migration_add_roles.sql
```

**Option B: In MySQL Workbench/PhpMyAdmin**
Copy and run this SQL:
```sql
-- Add role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER email;

-- Add index for faster role-based queries
CREATE INDEX idx_role ON users(role);
```

### Step 4: ✅ Verify Changes
```sql
-- Check column exists
DESCRIBE users;
-- You should see: role | varchar(20) | YES | | user |

-- Check existing users got default role
SELECT id, username, email, role FROM users;
-- All should show role = 'user'
```

### Step 5: ✅ Verify Index
```sql
-- Check index was created
SHOW INDEX FROM users;
-- You should see: idx_role in the output
```

---

## 🔍 Troubleshooting

### Error: "Duplicate column name 'role'"
**Cause**: Column already exists (migration already ran)
**Solution**: This is normal, the migration was successful

### Error: "Access denied for user 'root'"
**Cause**: Wrong password or not in MySQL
**Solution**: 
```bash
mysql -u root -p
# Enter your MySQL password
```

### Error: "Database 'spookify' doesn't exist"
**Cause**: Database not created yet
**Solution**: Create it first:
```bash
mysql -u root
mysql> CREATE DATABASE spookify;
mysql> USE spookify;
# Then run the migration
```

### Command Not Found: "mysql"
**Cause**: MySQL not in system PATH
**Solution**: 
- Windows: Add MySQL bin folder to PATH
- Mac: Install MySQL via Homebrew: `brew install mysql`
- Linux: `sudo apt-get install mysql-server`

---

## ✅ Verification Commands

Run these after migration to verify everything works:

### 1. Check Table Structure
```sql
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'spookify';
```

Should show columns including:
- id
- username
- email
- password_hash
- **role** ← This should be present

### 2. Check Indexes
```sql
SHOW INDEX FROM users WHERE KEY_NAME = 'idx_role';
```

Should return one row with index on 'role' column

### 3. Check Default Values
```sql
SELECT id, username, role FROM users LIMIT 1;
```

Should show existing users with `role = 'user'`

---

## 🧪 Test Data (Optional)

### Insert Test Users
```sql
-- Test regular user
INSERT INTO users (username, email, password_hash, role) 
VALUES ('testuser', 'test@example.com', PASSWORD('test123'), 'user');

-- Test admin user
INSERT INTO users (username, email, password_hash, role) 
VALUES ('testadmin', 'admin@example.com', PASSWORD('admin123'), 'admin');
```

### Verify Test Data
```sql
SELECT id, username, email, role FROM users 
WHERE username IN ('testuser', 'testadmin');
```

---

## 🔄 Rollback Instructions (If Needed)

### Remove Role Column
```sql
ALTER TABLE users DROP COLUMN role;
```

### Remove Index
```sql
DROP INDEX idx_role ON users;
```

**Note**: This will lose all role data. Use only if absolutely necessary.

---

## 📋 Pre-Launch Checklist

- [ ] Database migration executed without errors
- [ ] Column 'role' exists in users table
- [ ] Index 'idx_role' created successfully
- [ ] Existing users have default role = 'user'
- [ ] App compiles without errors
- [ ] User registration with "User" role works
- [ ] User registration with "Admin" role works
- [ ] Login works for both roles
- [ ] Profile avatar displays for both roles
- [ ] Admin button visible only for admins
- [ ] Admin panel opens correctly
- [ ] All documentation reviewed

---

## 📞 If Migration Fails

### Step 1: Check Current Table Structure
```sql
DESCRIBE users;
```

### Step 2: Look for 'role' column
- **If present**: Migration already ran, no action needed
- **If missing**: Continue to Step 3

### Step 3: Try Alternative Migration
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
CREATE INDEX idx_role ON users(role);
```

### Step 4: Verify Again
```sql
SELECT * FROM users LIMIT 1;
```

Should now have 'role' column with 'user' as default value

---

## ✨ Success Indicators

Migration is successful when:
1. ✅ No error messages during execution
2. ✅ Column 'role' exists in users table
3. ✅ All existing users have role = 'user'
4. ✅ Index 'idx_role' created
5. ✅ App loads without errors
6. ✅ Users can register with role selection

---

**After completing this checklist, your role-based access system is ready to use!** 🎉

For more information, see:
- `QUICK_SETUP_GUIDE.md` - Complete setup guide
- `ROLE_BASED_ACCESS_IMPLEMENTATION.md` - Technical documentation
