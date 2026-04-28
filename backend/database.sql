CREATE DATABASE IF NOT EXISTS sportshield;
USE sportshield;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user') DEFAULT 'user',
    status ENUM('active', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table (as explicitly requested)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'director', 'streamer') NOT NULL,
    status ENUM('active', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos / Uploads Table
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    quality VARCHAR(20),
    language VARCHAR(50),
    is_live BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT TRUE,
    tags VARCHAR(255),
    rating VARCHAR(10),
    url VARCHAR(255) DEFAULT '#',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active Streams Table
CREATE TABLE IF NOT EXISTS streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    streamer_name VARCHAR(100),
    viewers INT DEFAULT 0,
    status ENUM('live', 'offline') DEFAULT 'live',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications & Logs Table
CREATE TABLE IF NOT EXISTS security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    threat_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    target ENUM('system', 'user', 'stream') DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Piracy Tracking Table
CREATE TABLE IF NOT EXISTS piracy_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    site_name VARCHAR(100),
    url VARCHAR(255),
    severity ENUM('Medium', 'High', 'Critical'),
    status ENUM('active', 'reported', 'taken_down') DEFAULT 'active',
    video_id INT,
    found_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain Hashes Table
CREATE TABLE IF NOT EXISTS blockchain_hashes (
    hash VARCHAR(255) PRIMARY KEY,
    video_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Clear existing data if re-running
TRUNCATE TABLE users;
TRUNCATE TABLE admins;
TRUNCATE TABLE videos;
TRUNCATE TABLE streams;
TRUNCATE TABLE security_logs;
TRUNCATE TABLE piracy_records;

-- Seed Data (Initial Defaults)

-- Standard demo user
INSERT INTO users (username, email, password) VALUES 
('demo', 'desaivraj73@gmail.com', 'demo@123');

-- Admin users
INSERT INTO admins (name, username, email, password, role) VALUES 
('Super Admin', 'admin', 'admin@sportshield.com', 'admin', 'admin'),
('Alex Director', 'director', 'director@sportshield.com', 'director123', 'director'),
('Sam Streamer', 'streamer', 'streamer@sportshield.com', 'streamer123', 'streamer');
