require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const designs = [
  { design_number: 'D-001', design_name: 'Royal Banarasi Silk', dn: 'DN-101', dn_code: 'BRS-01', reed: '72', pick: '96', cards: '24', patti: '4', total_dc: '1200', total_cut: '48', work: 'Jacquard Weave', blue_apt: 'B+A 12', description: 'Traditional Banarasi design with floral motifs and gold zari work', remarks: 'Premium quality, export grade' },
  { design_number: 'D-002', design_name: 'Kanjivaram Gold Border', dn: 'DN-102', dn_code: 'KGB-02', reed: '80', pick: '108', cards: '32', patti: '6', total_dc: '1600', total_cut: '64', work: 'Dobby Weave', blue_apt: 'B+A 16', description: 'Classic Kanjivaram with gold border and temple design', remarks: 'High demand during wedding season' },
  { design_number: 'D-003', design_name: 'Chanderi Cotton Floral', dn: 'DN-103', dn_code: 'CCF-03', reed: '60', pick: '80', cards: '16', patti: '3', total_dc: '960', total_cut: '32', work: 'Plain Weave', blue_apt: 'B+A 8', description: 'Light weight chanderi cotton with printed floral pattern', remarks: 'Summer collection' },
  { design_number: 'D-004', design_name: 'Mysore Silk Classic', dn: 'DN-104', dn_code: 'MSC-04', reed: '76', pick: '100', cards: '28', patti: '5', total_dc: '1400', total_cut: '56', work: 'Satin Weave', blue_apt: 'B+A 14', description: 'Pure Mysore silk with traditional peacock motif', remarks: 'GI tagged product' },
  { design_number: 'D-005', design_name: 'Paithani Peacock', dn: 'DN-105', dn_code: 'PP-05', reed: '88', pick: '120', cards: '36', patti: '7', total_dc: '1800', total_cut: '72', work: 'Tapestry Weave', blue_apt: 'B+A 18', description: 'Handwoven Paithani with peacock and lotus design', remarks: 'Heritage collection piece' },
  { design_number: 'D-006', design_name: 'Ikat Geometric', dn: 'DN-106', dn_code: 'IG-06', reed: '64', pick: '88', cards: '20', patti: '4', total_dc: '1100', total_cut: '44', work: 'Ikat Weave', blue_apt: 'B+A 10', description: 'Double ikat geometric pattern in earthy tones', remarks: 'Trending design' },
  { design_number: 'D-007', design_name: 'Pochampally Diamond', dn: 'DN-107', dn_code: 'PD-07', reed: '72', pick: '96', cards: '24', patti: '4', total_dc: '1200', total_cut: '48', work: 'Ikat Weave', blue_apt: 'B+A 12', description: 'Traditional Pochampally with diamond pattern in silk', remarks: 'Export quality' },
  { design_number: 'D-008', design_name: 'Jamdani Floral Net', dn: 'DN-108', dn_code: 'JFN-08', reed: '100', pick: '140', cards: '48', patti: '8', total_dc: '2200', total_cut: '88', work: 'Supplementary Weft', blue_apt: 'B+A 22', description: 'Fine muslin jamdani with delicate floral net pattern', remarks: 'Very fine count yarn required' },
  { design_number: 'D-009', design_name: 'Patola Double Ikat', dn: 'DN-109', dn_code: 'PDI-09', reed: '80', pick: '108', cards: '32', patti: '6', total_dc: '1600', total_cut: '64', work: 'Double Ikat', blue_apt: 'B+A 16', description: 'Authentic Patola double ikat with geometric elephants', remarks: 'Rare and precious design' },
  { design_number: 'D-010', design_name: 'Bhagalpuri Tussar', dn: 'DN-110', dn_code: 'BT-10', reed: '56', pick: '72', cards: '12', patti: '2', total_dc: '840', total_cut: '24', work: 'Plain Weave', blue_apt: 'B+A 6', description: 'Natural tussar silk with ethnic tribal border', remarks: 'Eco-friendly natural dye' },
  { design_number: 'D-011', design_name: 'Maheshwari Checks', dn: 'DN-111', dn_code: 'MC-11', reed: '68', pick: '92', cards: '22', patti: '4', total_dc: '1050', total_cut: '40', work: 'Dobby Weave', blue_apt: 'B+A 11', description: 'Classic Maheshwari checks in cotton silk blend', remarks: 'All season design' },
  { design_number: 'D-012', design_name: 'Sambalpuri Tribal', dn: 'DN-112', dn_code: 'ST-12', reed: '76', pick: '100', cards: '28', patti: '5', total_dc: '1400', total_cut: '56', work: 'Ikat Weave', blue_apt: 'B+A 14', description: 'Sambalpuri tribal motifs with deer and fish patterns', remarks: 'Odisha handloom board approved' },
  { design_number: 'D-013', design_name: 'Baluchari Mythology', dn: 'DN-113', dn_code: 'BM-13', reed: '92', pick: '124', cards: '40', patti: '8', total_dc: '2000', total_cut: '80', work: 'Jacquard Weave', blue_apt: 'B+A 20', description: 'Baluchari silk depicting mythological Mahabharata scenes', remarks: 'Museum quality piece' },
  { design_number: 'D-014', design_name: 'Phulkari Embroidery', dn: 'DN-114', dn_code: 'PE-14', reed: '60', pick: '80', cards: '16', patti: '3', total_dc: '960', total_cut: '32', work: 'Embroidery Base', blue_apt: 'B+A 8', description: 'Punjab phulkari base fabric with dense floral embroidery', remarks: 'Bridal collection' },
  { design_number: 'D-015', design_name: 'Kashmiri Pashmina', dn: 'DN-115', dn_code: 'KP-15', reed: '120', pick: '160', cards: '64', patti: '10', total_dc: '3000', total_cut: '120', work: 'Twill Weave', blue_apt: 'B+A 30', description: 'Ultra fine pashmina with traditional kashmiri paisley', remarks: 'Grade A pashmina only' },
];

const feederMap = {
  'D-001': [{ feeder_number: 1, color_name: 'Ground', old_number: '5831' }, { feeder_number: 2, color_name: 'Gold Zari', old_number: '1001' }, { feeder_number: 3, color_name: 'Red', old_number: '2201' }, { feeder_number: 4, color_name: 'Green', old_number: '3301' }],
  'D-002': [{ feeder_number: 1, color_name: 'Ground', old_number: '5832' }, { feeder_number: 2, color_name: 'Gold', old_number: '1002' }, { feeder_number: 3, color_name: 'Black', old_number: '2670' }, { feeder_number: 4, color_name: 'Maroon', old_number: '2202' }, { feeder_number: 5, color_name: 'Cream', old_number: '4401' }],
  'D-003': [{ feeder_number: 1, color_name: 'White', old_number: '5001' }, { feeder_number: 2, color_name: 'Pink', old_number: '2501' }, { feeder_number: 3, color_name: 'Yellow', old_number: '4101' }],
  'D-004': [{ feeder_number: 1, color_name: 'Ground', old_number: '5833' }, { feeder_number: 2, color_name: 'Silver Zari', old_number: '1101' }, { feeder_number: 3, color_name: 'Blue', old_number: '3101' }, { feeder_number: 4, color_name: 'Purple', old_number: '2601' }],
  'D-005': [{ feeder_number: 1, color_name: 'Ground', old_number: '5834' }, { feeder_number: 2, color_name: 'Gold Zari', old_number: '1003' }, { feeder_number: 3, color_name: 'Peacock Green', old_number: '3401' }, { feeder_number: 4, color_name: 'Peacock Blue', old_number: '3102' }, { feeder_number: 5, color_name: 'Orange', old_number: '2301' }, { feeder_number: 6, color_name: 'Red', old_number: '2203' }],
  'D-006': [{ feeder_number: 1, color_name: 'Ground', old_number: '5835' }, { feeder_number: 2, color_name: 'Brown', old_number: '2401' }, { feeder_number: 3, color_name: 'Rust', old_number: '2302' }, { feeder_number: 4, color_name: 'Beige', old_number: '4501' }],
  'D-007': [{ feeder_number: 1, color_name: 'Ground', old_number: '5836' }, { feeder_number: 2, color_name: 'Black', old_number: '2671' }, { feeder_number: 3, color_name: 'Red', old_number: '2204' }, { feeder_number: 4, color_name: 'White', old_number: '5002' }],
  'D-008': [{ feeder_number: 1, color_name: 'White', old_number: '5003' }, { feeder_number: 2, color_name: 'Off White', old_number: '5004' }, { feeder_number: 3, color_name: 'Gold', old_number: '1004' }],
  'D-009': [{ feeder_number: 1, color_name: 'Red', old_number: '2205' }, { feeder_number: 2, color_name: 'Black', old_number: '2672' }, { feeder_number: 3, color_name: 'Green', old_number: '3302' }, { feeder_number: 4, color_name: 'Yellow', old_number: '4102' }, { feeder_number: 5, color_name: 'White', old_number: '5005' }],
  'D-010': [{ feeder_number: 1, color_name: 'Natural', old_number: '5837' }, { feeder_number: 2, color_name: 'Brown', old_number: '2402' }, { feeder_number: 3, color_name: 'Black', old_number: '2673' }],
  'D-011': [{ feeder_number: 1, color_name: 'Ground', old_number: '5838' }, { feeder_number: 2, color_name: 'Black', old_number: '2674' }, { feeder_number: 3, color_name: 'White', old_number: '5006' }, { feeder_number: 4, color_name: 'Red', old_number: '2206' }],
  'D-012': [{ feeder_number: 1, color_name: 'Ground', old_number: '5839' }, { feeder_number: 2, color_name: 'Black', old_number: '2675' }, { feeder_number: 3, color_name: 'Red', old_number: '2207' }, { feeder_number: 4, color_name: 'White', old_number: '5007' }, { feeder_number: 5, color_name: 'Yellow', old_number: '4103' }],
  'D-013': [{ feeder_number: 1, color_name: 'Ground', old_number: '5840' }, { feeder_number: 2, color_name: 'Gold Zari', old_number: '1005' }, { feeder_number: 3, color_name: 'Maroon', old_number: '2208' }, { feeder_number: 4, color_name: 'Black', old_number: '2676' }, { feeder_number: 5, color_name: 'Cream', old_number: '4402' }, { feeder_number: 6, color_name: 'Blue', old_number: '3103' }],
  'D-014': [{ feeder_number: 1, color_name: 'Ground', old_number: '5841' }, { feeder_number: 2, color_name: 'Orange', old_number: '2303' }, { feeder_number: 3, color_name: 'Pink', old_number: '2502' }, { feeder_number: 4, color_name: 'Yellow', old_number: '4104' }, { feeder_number: 5, color_name: 'Green', old_number: '3303' }],
  'D-015': [{ feeder_number: 1, color_name: 'Natural White', old_number: '5008' }, { feeder_number: 2, color_name: 'Saffron', old_number: '2304' }, { feeder_number: 3, color_name: 'Blue', old_number: '3104' }, { feeder_number: 4, color_name: 'Green', old_number: '3304' }, { feeder_number: 5, color_name: 'Red', old_number: '2209' }, { feeder_number: 6, color_name: 'Gold', old_number: '1006' }],
};

async function seed() {
  console.log('🚀 Starting data push to Supabase...\n');

  let inserted = 0;
  let skipped = 0;

  for (const design of designs) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('designs')
      .select('id')
      .eq('design_number', design.design_number)
      .single();

    if (existing) {
      console.log(`⏭  Skipped  ${design.design_number} (already exists)`);
      skipped++;
      continue;
    }

    // Insert design
    const { data, error } = await supabase
      .from('designs')
      .insert(design)
      .select()
      .single();

    if (error) {
      console.log(`❌ Failed   ${design.design_number} — ${error.message}`);
      continue;
    }

    // Insert feeders
    const feeders = (feederMap[design.design_number] || []).map(f => ({
      ...f,
      design_id: data.id,
    }));

    if (feeders.length > 0) {
      const { error: fErr } = await supabase.from('feeders').insert(feeders);
      if (fErr) console.log(`   ⚠️  Feeders failed for ${design.design_number} — ${fErr.message}`);
    }

    console.log(`✅ Inserted ${design.design_number} — ${design.design_name} (${feeders.length} feeders)`);
    inserted++;
  }

  console.log(`\n=============================`);
  console.log(`✅ Inserted : ${inserted} designs`);
  console.log(`⏭  Skipped  : ${skipped} designs`);
  console.log(`=============================`);
  console.log('\n🎉 Done! Open your app to see the data.');
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
