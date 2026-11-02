# Gizlilik politikası

e-Yazışma İmza — BahriCanli. Güncelleme: 2 Kasım 2026.

Eklenti, e-Yazışma portallarındaki e-imza işlemini bilgisayarınızdaki
e-Yazışma imza uygulamasına bağlamak için kullanılır. Eklenti `*.eyazisma.com.tr`,
portal.lkd.org.tr ve portal.pkd.org.tr adreslerinde hazır çalışır; kendi portalını
kuran kurumların adresleri kullanıcı onayıyla tek tek eklenir. Onay verilmeyen
sitelere erişilmez.

- İmza bağlantısı yalnızca yerel uygulamaya Native Messaging üzerinden iletilir.
  Bu bağlantı geçici erişim anahtarıdır; eklenti onu diske veya günlüklere yazmaz.
- PIN, özel anahtar, PDF içeriği ve sertifika ayrıntıları eklentiye alınmaz.
  İmza onayı ve PIN girişi yerel uygulamanın ekranında gerçekleşir.
- Analitik, reklam, çerez takibi veya üçüncü taraf veri aktarımı yapılmaz.
- Portal sekmesinde yalnızca otomatik devam için sayfa yolu sessionStorage'da
  geçici olarak tutulur; imza bağlantısı burada saklanmaz. Devam sırasında silinir.
- Yerel uygulama imzalama için portalla kendi bağlantısını kurar; bu bağlantı
  eklentinin dışında, kullanıcının onayladığı imza işleminin parçasıdır.

Destek ve gizlilik soruları: bu deponun GitHub Issues bölümü.
