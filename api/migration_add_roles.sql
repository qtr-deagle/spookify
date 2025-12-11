-- SQL Migration Script for Role-Based Access Control
-- Run this script in your MySQL database to add role support

-- Add 'role' column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER email;

-- Add index for faster role-based queries (optional but recommended)
CREATE INDEX idx_role ON users(role);

-- Insert a sample admin user (if needed - modify credentials as needed)
-- INSERT INTO users (username, email, password_hash, role) VALUES ('admin', 'admin@spookify.com', PASSWORD('admin123'), 'admin');

-- Verify the changes
SELECT id, username, email, role FROM users LIMIT 5;
