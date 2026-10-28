# Mağaza yayını

Ad: e-Yazışma İmza
Yayıncı: BahriCanli
Kısa açıklama: Dernek portalındaki elektronik imza işlemini yerel kart uygulamasına bağlar.
Kategori: Productivity / İş araçları

## Açıklama

LKD ve PKD portallarında elektronik imzalama ekranını tek tıklamayla açın.
Bilgisayarınıza kurulu e-Yazışma İmza uygulamasıyla bağlantı kurar; kart ve
sertifika kontrol ekranını da eklenti menüsünden açabilirsiniz.

Yerel imza uygulaması ve kartınıza uygun sürücü ayrıca kurulmalıdır. Eklenti tek
başına USB karta erişmez. PIN ve imza onayı yalnızca yerel uygulamada alınır.

## İzin gerekçeleri

nativeMessaging: kurulu yerel uygulamanın durumunu kontrol etmek ve imza/kart
ekranını açmak. İçerik betikleri: yalnız iki portalın yazışma sayfalarındaki
imzalama düğmelerini bağlamak. Başka sitelere erişilmez.

## İnceleyici notları

Yerel uygulama kaynağı: https://github.com/bahricanli/eyazisma-imza
En az sürüm: v0.2.9. Kalıcı klasöre kurup --install-browser-host çalıştırın.
Chrome mağazasının atadığı kimliği --chrome-extension-id ile kaydedin.
Eklenti menüsündeki kart kontrolü portal hesabı olmadan denenebilir. Gerçek
imza için portal hesabı ve fiziksel e-imza kartı gerekir; test erişimi için
kullanıcı/publisher ile iletişime geçilmelidir. Gerçek PIN veya kişisel hesap
mağaza metnine eklenmemelidir.

ZIP: npm run build. Gizlilik: PRIVACY.md. Kaynaklar minify edilmez.
Yayıncı hesabı ve mağaza ekran görüntüleri yayın sırasında tamamlanmalıdır.

Gizlilik sayfası: https://bahricanli.github.io/eyazisma-imza-firefox/
Destek: https://github.com/bahricanli/eyazisma-imza-firefox/issues

## Mağaza başvurusu

0.1.1 sürümü 28 Ekim 2026'da incelemeye gönderildi.
Listeleme: https://addons.mozilla.org/firefox/addon/eyazisma-imza/
İnceleme tamamlanana kadar herkese açık sayfa erişilebilir olmayabilir.
