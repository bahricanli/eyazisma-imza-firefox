# e-Yazışma İmza — Firefox

BahriCanli tarafından geliştirilen Firefox eklentisi. e-Yazışma portallarındaki imza
isteğini bilgisayarınızdaki yerel imza uygulamasına bağlar. İmza ekranı yerel
uygulamada açılır; PIN eklentiye aktarılmaz.

Eklenti tek bir kuruma bağlı değildir. `*.eyazisma.com.tr`, portal.lkd.org.tr ve
portal.pkd.org.tr hazır gelir; kendi portalını kuran her kurum da kullanılabilir.

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

## Kendi portalınızı ekleyin

Portalınızın sayfasındayken eklenti menüsünü açın ve “Bu portalı ekle” düğmesine
basın. Tarayıcı yalnız o adres için izin ister, ardından sayfayı yenileyin. İlk
imzada yerel uygulama da portala güvenip güvenmediğinizi ayrıca sorar. İzni
tarayıcının eklenti ayarlarından istediğiniz zaman kaldırabilirsiniz.

Eklenen portallar için yerel uygulamanın v0.2.10 veya daha yeni sürümü gerekir.

Portal şu kurallara uymalıdır:

- HTTPS ile sunulur.
- İmza bağlantısı portalla aynı adrestedir: `https://portal.ornek.org/imza/<anahtar>`.
  Anahtar 16-256 karakterdir (`A-Z a-z 0-9 _ -`), sorgu dizgisi veya parça içermez.
- Bağlantı sayfada `data-signing-link` niteliğiyle verilir ya da imza
  `pdf-signing-form` kimlikli formla başlatılır.

## Geliştirme

`npm test` ve `npm run build`. Eklenti kaynağı `extension/` altındadır; derleme
bağımlılığı ve gizli anahtar gerektirmez. Mağazaya yüklenecek ZIP `dist/` içinde.

Firefox: about:debugging#/runtime/this-firefox içinde geçici eklenti olarak extension/manifest.json dosyasını seçin.

[Gizlilik](PRIVACY.md) · [Yayın bilgileri](STORE.md)
