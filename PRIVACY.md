# Gizlilik politikası

e-Yazışma İmza — BahriCanli. Güncelleme: 28 Ekim 2026.

Eklenti, portal.lkd.org.tr ve portal.pkd.org.tr üzerindeki e-imza işlemini
bilgisayarınızdaki e-Yazışma imza uygulamasına bağlamak için kullanılır.

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
