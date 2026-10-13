# Super PdPR Cikgu Heryani — PWA

Pakej lengkap untuk GitHub Pages. Reka bentuk Mario dan sambungan Apps Script/Google Sheets asal dikekalkan.

## Perubahan

- Tarikh dalam kad tugasan murid: **DD/MM/YYYY**, contohnya **13/10/2026**.
- Tarikh panjang daripada Google Sheets yang mengandungi nama zon waktu diproses semula; nama zon tidak dipaparkan.
- Semua penukaran cap masa, tarikh hari ini dan masa penghantaran menggunakan **Asia/Kuala_Lumpur (UTC+8)**.
- Penapis tarikh murid turut menyokong rekod tarikh lama dan cap masa ISO.
- Tarikh dalam rekod guru dan CSV menggunakan format Malaysia. Masa penghantaran dalam semakan guru dan CSV dikekalkan.
- PWA dengan manifest, service worker, ikon 192/512, ikon maskable, ikon iPhone dan butang **PASANG APP**.
- Fail gaya, fon dan ikon disertakan untuk paparan asas tanpa internet selepas lawatan pertama berjaya.
- Banner tiada internet dan pemberitahuan kemas kini aplikasi.

## Muat naik ke GitHub

1. Ekstrak fail ZIP ini.
2. Buka atau cipta repository GitHub untuk sistem ini.
3. Pilih **Add file → Upload files**.
4. Muat naik **semua kandungan folder `pdpr-pwa`**, bukan fail ZIP. Pastikan `index.html`, `sw.js`, `pwa.js`, `date-my.js`, `manifest.webmanifest`, folder `assets` dan folder `icons` berada pada aras utama repository. Muat naik juga `.nojekyll`, `README.md` dan folder `licenses`.
5. Klik **Commit changes**.
6. Pergi ke **Settings → Pages**. Di **Build and deployment**, pilih **Deploy from a branch**.
7. Pilih branch **main**, folder **/(root)**, kemudian **Save**.
8. Tunggu penerbitan selesai dan buka URL GitHub Pages yang dipaparkan, contohnya `https://NAMA-AKAUN.github.io/NAMA-REPOSITORY/`.

Pautan fail adalah relatif, jadi pakej menyokong GitHub Pages di bawah nama repository dan juga domain sendiri. Tiada langkah build diperlukan. Kata laluan guru dan rekod kekal **JBA1077**.

## Pasang sebagai aplikasi

- **Android/komputer:** buka URL GitHub Pages melalui pelayar yang menyokong pemasangan, kemudian tekan **PASANG APP**. Jika prompt tidak tersedia, semak menu pelayar untuk **Install app / Pasang aplikasi**.
- **iPhone/iPad:** buka URL itu dalam **Safari**, tekan **Kongsi**, kemudian **Add to Home Screen / Tambah ke Skrin Utama**.

Gunakan URL GitHub Pages melalui HTTPS untuk pemasangan. Membuka `index.html` terus sebagai fail tempatan tidak mengaktifkan service worker. Pemasangan hendaklah dibuat dari URL sistem utama.

## Penggunaan tanpa internet

Selepas lawatan dalam talian pertama selesai dan fail asas disimpan oleh service worker, halaman serta gaya boleh dibuka tanpa internet. **Nama murid, tugasan, gambar bukti, simpanan, semakan dan penghantaran masih memerlukan internet.** Data Google Sheets tidak disimpan untuk kegunaan luar talian. Aplikasi menyekat tindakan simpan/hantar semasa peranti melaporkan tiada sambungan.

Apps Script asal mesti masih aktif dan boleh diakses oleh pengguna sistem. Kod backend tidak disertakan dalam sumber asal dan tidak diubah dalam pakej ini.

## Kemas kini seterusnya

Gantikan fail yang diubah dalam repository. Jika mengubah kod atau aset, tukar nilai `VERSION` dalam `sw.js`, contohnya kepada `2026-10-14-v2`, supaya cache versi baharu dipasang. Simpan kerja sebelum menekan **Kemas kini aplikasi** apabila notis dipaparkan.

## Semakan pakej

Kod JavaScript, format tarikh merentas zon waktu, penapis tugasan, pautan fail tempatan, ikon dan logik service worker diperiksa secara setempat. Pakej belum diterbitkan ke repository cikgu; pemasangan pada peranti dan akses backend sebenar perlu disemak selepas penerbitan.

## Rujukan

- [GitHub — Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN — Intl.DateTimeFormat.formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)

Lesen Tailwind CSS, Font Awesome, Fredoka dan Press Start 2P disertakan dalam folder `licenses`. Ikon aplikasi baharu ialah aset SVG dalam folder `icons`.
