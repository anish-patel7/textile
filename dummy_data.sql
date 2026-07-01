-- ================================================
-- Textile Design Manager - Dummy Data for Testing
-- Run this in Supabase SQL Editor
-- ================================================

-- Insert dummy designs
INSERT INTO designs (design_number, design_name, dn, dn_code, reed, pick, cards, patti, total_dc, total_cut, work, blue_apt, description, remarks, created_date, updated_date) VALUES

('D-001', 'Royal Banarasi Silk', 'DN-101', 'BRS-01', '72', '96', '24', '4', '1200', '48', 'Jacquard Weave', 'B+A 12', 'Traditional Banarasi design with floral motifs and gold zari work', 'Premium quality, export grade', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),

('D-002', 'Kanjivaram Gold Border', 'DN-102', 'KGB-02', '80', '108', '32', '6', '1600', '64', 'Dobby Weave', 'B+A 16', 'Classic Kanjivaram with gold border and temple design', 'High demand during wedding season', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),

('D-003', 'Chanderi Cotton Floral', 'DN-103', 'CCF-03', '60', '80', '16', '3', '960', '32', 'Plain Weave', 'B+A 8', 'Light weight chanderi cotton with printed floral pattern', 'Summer collection', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),

('D-004', 'Mysore Silk Classic', 'DN-104', 'MSC-04', '76', '100', '28', '5', '1400', '56', 'Satin Weave', 'B+A 14', 'Pure Mysore silk with traditional peacock motif', 'GI tagged product', NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),

('D-005', 'Paithani Peacock', 'DN-105', 'PP-05', '88', '120', '36', '7', '1800', '72', 'Tapestry Weave', 'B+A 18', 'Handwoven Paithani with peacock and lotus design', 'Heritage collection piece', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

('D-006', 'Ikat Geometric', 'DN-106', 'IG-06', '64', '88', '20', '4', '1100', '44', 'Ikat Weave', 'B+A 10', 'Double ikat geometric pattern in earthy tones', 'Trending design', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),

('D-007', 'Pochampally Diamond', 'DN-107', 'PD-07', '72', '96', '24', '4', '1200', '48', 'Ikat Weave', 'B+A 12', 'Traditional Pochampally with diamond pattern in silk', 'Export quality', NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),

('D-008', 'Jamdani Floral Net', 'DN-108', 'JFN-08', '100', '140', '48', '8', '2200', '88', 'Supplementary Weft', 'B+A 22', 'Fine muslin jamdani with delicate floral net pattern', 'Very fine count yarn required', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),

('D-009', 'Patola Double Ikat', 'DN-109', 'PDI-09', '80', '108', '32', '6', '1600', '64', 'Double Ikat', 'B+A 16', 'Authentic Patola double ikat with geometric elephants', 'Rare and precious design', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),

('D-010', 'Bhagalpuri Tussar', 'DN-110', 'BT-10', '56', '72', '12', '2', '840', '24', 'Plain Weave', 'B+A 6', 'Natural tussar silk with ethnic tribal border', 'Eco-friendly natural dye', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

('D-011', 'Maheshwari Checks', 'DN-111', 'MC-11', '68', '92', '22', '4', '1050', '40', 'Dobby Weave', 'B+A 11', 'Classic Maheshwari checks in cotton silk blend', 'All season design', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

('D-012', 'Sambalpuri Tribal', 'DN-112', 'ST-12', '76', '100', '28', '5', '1400', '56', 'Ikat Weave', 'B+A 14', 'Sambalpuri tribal motifs with deer and fish patterns', 'Odisha handloom board approved', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

('D-013', 'Baluchari Mythology', 'DN-113', 'BM-13', '92', '124', '40', '8', '2000', '80', 'Jacquard Weave', 'B+A 20', 'Baluchari silk depicting mythological Mahabharata scenes', 'Museum quality piece', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

('D-014', 'Phulkari Embroidery', 'DN-114', 'PE-14', '60', '80', '16', '3', '960', '32', 'Embroidery Base', 'B+A 8', 'Punjab phulkari base fabric with dense floral embroidery', 'Bridal collection', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

('D-015', 'Kashmiri Pashmina', 'DN-115', 'KP-15', '120', '160', '64', '10', '3000', '120', 'Twill Weave', 'B+A 30', 'Ultra fine pashmina with traditional kashmiri paisley', 'Grade A pashmina only', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');


-- Insert dummy feeders for each design

-- D-001 Royal Banarasi Silk
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5831' FROM designs WHERE design_number = 'D-001';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Gold Zari', '1001' FROM designs WHERE design_number = 'D-001';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Red', '2201' FROM designs WHERE design_number = 'D-001';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Green', '3301' FROM designs WHERE design_number = 'D-001';

-- D-002 Kanjivaram Gold Border
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5832' FROM designs WHERE design_number = 'D-002';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Gold', '1002' FROM designs WHERE design_number = 'D-002';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Black', '2670' FROM designs WHERE design_number = 'D-002';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Maroon', '2202' FROM designs WHERE design_number = 'D-002';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 5, 'Cream', '4401' FROM designs WHERE design_number = 'D-002';

-- D-003 Chanderi Cotton Floral
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'White', '5001' FROM designs WHERE design_number = 'D-003';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Pink', '2501' FROM designs WHERE design_number = 'D-003';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Yellow', '4101' FROM designs WHERE design_number = 'D-003';

-- D-004 Mysore Silk Classic
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5833' FROM designs WHERE design_number = 'D-004';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Silver Zari', '1101' FROM designs WHERE design_number = 'D-004';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Blue', '3101' FROM designs WHERE design_number = 'D-004';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Purple', '2601' FROM designs WHERE design_number = 'D-004';

-- D-005 Paithani Peacock
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5834' FROM designs WHERE design_number = 'D-005';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Gold Zari', '1003' FROM designs WHERE design_number = 'D-005';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Peacock Green', '3401' FROM designs WHERE design_number = 'D-005';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Peacock Blue', '3102' FROM designs WHERE design_number = 'D-005';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 5, 'Orange', '2301' FROM designs WHERE design_number = 'D-005';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 6, 'Red', '2203' FROM designs WHERE design_number = 'D-005';

-- D-006 Ikat Geometric
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5835' FROM designs WHERE design_number = 'D-006';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Brown', '2401' FROM designs WHERE design_number = 'D-006';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Rust', '2302' FROM designs WHERE design_number = 'D-006';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Beige', '4501' FROM designs WHERE design_number = 'D-006';

-- D-007 Pochampally Diamond
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5836' FROM designs WHERE design_number = 'D-007';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Black', '2671' FROM designs WHERE design_number = 'D-007';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Red', '2204' FROM designs WHERE design_number = 'D-007';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'White', '5002' FROM designs WHERE design_number = 'D-007';

-- D-008 Jamdani Floral Net
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'White', '5003' FROM designs WHERE design_number = 'D-008';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Off White', '5004' FROM designs WHERE design_number = 'D-008';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Gold', '1004' FROM designs WHERE design_number = 'D-008';

-- D-009 Patola Double Ikat
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Red', '2205' FROM designs WHERE design_number = 'D-009';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Black', '2672' FROM designs WHERE design_number = 'D-009';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Green', '3302' FROM designs WHERE design_number = 'D-009';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Yellow', '4102' FROM designs WHERE design_number = 'D-009';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 5, 'White', '5005' FROM designs WHERE design_number = 'D-009';

-- D-010 Bhagalpuri Tussar
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Natural', '5837' FROM designs WHERE design_number = 'D-010';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Brown', '2402' FROM designs WHERE design_number = 'D-010';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Black', '2673' FROM designs WHERE design_number = 'D-010';

-- D-011 Maheshwari Checks
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5838' FROM designs WHERE design_number = 'D-011';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Black', '2674' FROM designs WHERE design_number = 'D-011';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'White', '5006' FROM designs WHERE design_number = 'D-011';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Red', '2206' FROM designs WHERE design_number = 'D-011';

-- D-012 Sambalpuri Tribal
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5839' FROM designs WHERE design_number = 'D-012';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Black', '2675' FROM designs WHERE design_number = 'D-012';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Red', '2207' FROM designs WHERE design_number = 'D-012';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'White', '5007' FROM designs WHERE design_number = 'D-012';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 5, 'Yellow', '4103' FROM designs WHERE design_number = 'D-012';

-- D-013 Baluchari Mythology
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5840' FROM designs WHERE design_number = 'D-013';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Gold Zari', '1005' FROM designs WHERE design_number = 'D-013';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Maroon', '2208' FROM designs WHERE design_number = 'D-013';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Black', '2676' FROM designs WHERE design_number = 'D-013';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 5, 'Cream', '4402' FROM designs WHERE design_number = 'D-013';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 6, 'Blue', '3103' FROM designs WHERE design_number = 'D-013';

-- D-014 Phulkari Embroidery
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Ground', '5841' FROM designs WHERE design_number = 'D-014';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Orange', '2303' FROM designs WHERE design_number = 'D-014';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Pink', '2502' FROM designs WHERE design_number = 'D-014';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Yellow', '4104' FROM designs WHERE design_number = 'D-014';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 5, 'Green', '3303' FROM designs WHERE design_number = 'D-014';

-- D-015 Kashmiri Pashmina
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 1, 'Natural White', '5008' FROM designs WHERE design_number = 'D-015';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 2, 'Saffron', '2304' FROM designs WHERE design_number = 'D-015';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 3, 'Blue', '3104' FROM designs WHERE design_number = 'D-015';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 4, 'Green', '3304' FROM designs WHERE design_number = 'D-015';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 5, 'Red', '2209' FROM designs WHERE design_number = 'D-015';
INSERT INTO feeders (design_id, feeder_number, color_name, old_number) SELECT id, 6, 'Gold', '1006' FROM designs WHERE design_number = 'D-015';
