const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.static('Toko'));

app.get('/api/toko', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM toko');
    res.json(rows);
  } catch (err) {
    console.log('Eror tmbh produk:', err)
    res.status(500).json({ pesan: 'Gagal mengambil data' });
  }
});

app.post('/api/toko', async (req, res) => {
  const { kode_produk, nama_produk, harga, stok } = req.body;
  if (!kode_produk || !nama_produk || harga === '' || stok === '')
    return res.status(400).json({ pesan: 'Isi semua kolom' });
  try {
    await db.execute(
      'INSERT INTO toko (kode_produk, nama_produk, harga, stok) VALUES (?, ?, ?, ?)',
      [kode_produk, nama_produk, harga, stok]
    );
    res.status(201).json({ pesan: 'Data berhasil ditambahkan' });
  } catch (err) {
  res.status(400).json({ pesan: 'Kode produk sudah ada / data salah' });
  }
});

app.post('/api/transaksi', async (req, res) => {
  const { nama_produk, jumlah } = req.body;
  if (!nama_produk || !Number.isInteger(Number(jumlah)) || Number(jumlah) <= 0)
    return res.status(400).json({ pesan: 'Jumlah pembelian tidak valid' });
  try {
    const [hasil] = await db.execute(
      'UPDATE toko SET stok = stok - ? WHERE nama_produk = ? AND stok >= ?',
      [jumlah, nama_produk, jumlah]
    );
    if (!hasil.affectedRows)
      return res.status(400).json({ pesan: 'Produk tidak ditemukan atau stok tidak cukup' });
    res.json({ pesan: 'Transaksi berhasil' });
  } catch (err) {
    res.status(500).json({ pesan: 'Transaksi gagal' });
  }
});

app.put('/api/toko/:kode_produk', async (req, res) => {
  const { nama_produk, harga, stok } = req.body;
  if (!nama_produk || !harga || !stok)
    return res.status(400).json({ pesan: 'Isi semua kolom' });
  try {
    const [hasil] = await db.execute(
      'UPDATE toko SET nama_produk=?,harga=?,stok=? WHERE kode_produk=?',
      [nama_produk, harga, stok, req.params.kode_produk]
    );
    if (!hasil.affectedRows) return res.sendStatus(404);
    res.json({ pesan: 'Data diperbarui' });
  } catch (err) {
  res.status(500).json({ pesan: 'Gagal mengambil data' });
  }
});

app.delete('/api/toko/:kode_produk', async (req, res) => {
  try {
    const [hasil] = await db.execute(
      'DELETE FROM toko WHERE kode_produk=?', [req.params.kode_produk]
    );
    if (!hasil.affectedRows) return res.sendStatus(404);
    res.json({ pesan: 'Data dihapus' });
  } catch (err) { res.sendStatus(500); }
});

app.listen(3000, () => console.log('Port 3000 aktif'));