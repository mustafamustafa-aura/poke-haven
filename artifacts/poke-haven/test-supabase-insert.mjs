import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
const envPath = resolve('.env');
const envFile = readFileSync(envPath, 'utf8');
const env = envFile.split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
  if (!line.trim() || line.startsWith('#')) return acc;
  const [k, ...rest] = line.split('=');
  acc[k] = rest.join('=');
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const insertPayload = [{
  customer_name: 'TEST SUPABASE CHECK',
  phone: '0000000000',
  items: [{ id: 'test-1', name: 'Test item', price: '€1.00', quantity: 1, image: '' }],
  total: 1.00,
}];
const insertRes = await supabase.from('orders').insert(insertPayload).select('*');
console.log('insertRes', insertRes);
if (insertRes.error || !insertRes.data?.length) {
  process.exit(1);
}
const insertedId = insertRes.data[0].id;
const deleteRes = await supabase.from('orders').delete().eq('id', insertedId);
console.log('deleteRes', deleteRes);
