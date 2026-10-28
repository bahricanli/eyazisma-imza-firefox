# e-Yazışma İmza — Firefox

Bahricanlı tarafından geliştirilen Firefox eklentisi. LKD/PKD portalındaki imza
isteğini bilgisayarınızdaki yerel imza uygulamasına bağlar. İmza ekranı yerel
uygulamada açılır; PIN eklentiye aktarılmaz.

## Kurulum

1. [Yerel imza uygulamasının](https://github.com/bahricanli/eyazisma-imza/releases)
   v0.2.9 veya daha yeni sürümünü kalıcı bir klasöre yerleştirin.
2. Karta uygun sürücüyü kurun.
3. Uygulamanın bulunduğu klasörde `--install-browser-host` çalıştırın.
   Gerekirse `--pkcs11 /sürücü/yolu` ile sürücüyü belirtin. Chrome için eklentinin
   gerçek kimliğini `--chrome-extension-id KIMLIK` ile verin; eklenti menüsündeki
   kurulum komutu bunu otomatik gösterir. Yönetici yetkisi gerekmeyen kullanıcı
   kaydı kurulur. Uygulamanın dosyasını taşırsanız kaydı yeniden kurun.
4. Eklentiyi yükleyin. Portalda “İmza uygulamasıyla imzala” seçeneğini kullanın.
   İlk portal güven onayını ve her imzanın PIN girişini yerel ekranda tamamlayın.

Yerel uygulama kapalıysa eklenti gerektiğinde başlatır. Kart bulunamazsa yerel
sürücü yardım ekranı açılır. Eklenti kurulu değilse portalın mevcut akışı çalışır.

## Geliştirme

`npm test` ve `npm run build`. Eklenti kaynağı `extension/` altındadır; derleme
bağımlılığı ve gizli anahtar gerektirmez. Mağazaya yüklenecek ZIP `dist/` içinde.

Firefox: about:debugging#/runtime/this-firefox içinde geçici eklenti olarak extension/manifest.json dosyasını seçin.

[Gizlilik](PRIVACY.md) · [Yayın bilgileri](STORE.md)
