# FortiGate CLI Hub

*[English](README.en.md)*

FortiOS komut referansı — troubleshooting, IPsec, SD-WAN, UTM ve politika yönetimi.

**→ [Canlı: altanmelihhh-web.github.io/fortios-cli-hub/](https://altanmelihhh-web.github.io/fortios-cli-hub/)**

Sahada tekrar tekrar ihtiyaç duyulan FortiGate komutlarını tek bir aranabilir
sayfada toplayan bir referans. Her kayıt komutun kendisini, ne işe yaradığını ve
ne zaman kullanılacağını içerir. `diagnose debug flow`, IPsec faz teşhisi,
sniffer filtreleri ve SD-WAN kural kontrolü gibi baskı altında hatırlanması zor
olan komutlar öne çıkarılmıştır.

| | |
|---|---|
| Komut | 320 |
| Kategori | 36 |
| Senaryo | 10 |
| Bağımlılık | yok — tek sayfa, tamamen istemci tarafında |
| Ağ çağrısı | yok |

## Kapsam

- ARP
- Auth
- BGP
- Connectivity
- Debug Flow
- FEXT
- FortiAP
- FortiGuard
- FortiSwitch
- GRE
- HA
- Hardware
- IPS
- IPsec
- IPsec Debug
- Interface
- LDAP
- Logging
- Multicast
- OSPF
- Objects
- Ping
- Policy
- Profiling
- Routing
- SD-WAN
- SIP
- SSL VPN
- Session
- Shaping
- Sniffer
- System
- UTM
- Users
- WAD
- ZTNA

## Kullanım

Sayfayı açın ve arayın. Filtreleme anlık; kategori başlıklarından da
gezinebilirsiniz. Komutlar tek tıkla kopyalanır.

```bash
git clone https://github.com/altanmelihhh-web/fortios-cli-hub.git
cd fortios-cli-hub
python3 -m http.server 8000    # ya da index.html'i doğrudan açın
```

Derleme adımı, paket yöneticisi veya arka uç yoktur — `index.html`, `app.js`,
`style.css`.

## Örnek verisi hakkında

Konfigürasyon örneklerindeki ve çıktı bloklarındaki tüm adresler dokümantasyon
aralıklarındandır (RFC 5737 · RFC 1918) ve kurgusaldır. Arayüz, tünel, VIP ve
nesne adları da jeneriktir. Topoloji kendi içinde tutarlı tutulmuştur — iki WAN
bağlantısı, merkeze IPsec tünelleri, SIP için DNAT — böylece örnekler öğretici
kalır, ama hiçbiri gerçek bir kuruluma karşılık gelmez.

Komutları kendi ortamınızda uygulamadan önce etkisini değerlendirin; bir kısmı
yapılandırmayı değiştirir veya trafiği etkiler.

## Lisans

MIT — bkz. [LICENSE](LICENSE).
