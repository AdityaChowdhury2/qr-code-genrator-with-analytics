-- Example data for testing the QR redirect service

-- Insert sample links
INSERT INTO links (id, code, type, payload, createdAt, updatedAt) VALUES
('link1', 'test123', 'URL', 'https://example.com', NOW(), NOW()),
('link2', 'demo456', 'MESSAGE', 'Welcome to our QR code service!', NOW(), NOW()),
('link3', 'card789', 'VCARD', '{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"+1234567890"}', NOW(), NOW());

-- Insert sample scans for analytics testing
INSERT INTO scans (id, linkId, timestamp, ipAddress, userAgent, deviceType, os, city, country) VALUES
('scan1', 'link1', DATE_SUB(NOW(), INTERVAL 1 DAY), '192.168.1.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'mobile', 'ios', 'New York', 'United States'),
('scan2', 'link1', DATE_SUB(NOW(), INTERVAL 2 DAY), '192.168.1.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'desktop', 'windows', 'London', 'United Kingdom'),
('scan3', 'link2', DATE_SUB(NOW(), INTERVAL 1 HOUR), '192.168.1.3', 'Mozilla/5.0 (Linux; Android 11)', 'mobile', 'android', 'Tokyo', 'Japan');
