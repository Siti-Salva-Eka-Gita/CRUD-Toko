const API = '/api/toko';
const $ = id => document.getElementById(id);

async function muatProduk() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    const tabel = $('dataPembeli');
    tabel.replaceChildren();
    data.forEach(m => {
      const tr = document.createElement('tr');
      [m.kode_produk, m.nama_produk, m.harga, m.stok].forEach(nilai => {
        const td = document.createElement('td');
        td.textContent = nilai;
        tr.appendChild(td);
      });
      tabel.appendChild(tr);
    });
  } catch (err) {
    $('Beli').textContent = 'Gagal mengambil data produk';
  }
}

$('FormBeli').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    nama_produk: $('nama_beli').value.trim(),
    jumlah: Number($('jumlah_beli').value)
  };
  try {
    const res = await fetch('/api/transaksi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const hasil = await res.json();
    $('Beli').textContent = hasil.pesan;
    if (res.ok) {
      $('FormBeli').reset();
      muatProduk();
    }
  } catch (err) {
    $('Beli').textContent = 'Transaksi gagal';
  }
});

muatProduk();