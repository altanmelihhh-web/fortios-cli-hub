/* ═══════════════════════════════════════════════════════════════
   FortiGate CLI Hub — Vanilla JS App
   Data models + Rendering + Navigation + Search + Copy
   ═══════════════════════════════════════════════════════════════ */

/* ───────── DATA: ALL COMMANDS (500+) ───────── */
const COMMANDS = [
  // ═════════════════════ SYSTEM ═════════════════════
  { cat: "System", code: "get system status", desc: "Firmware versiyonu, seri no, hostname, uptime, HA modu (master/slave/standalone), operation mode (NAT/Transparent). HA'da hangi cihazda oldugunuzu seri no'dan anlarsiniz", sev: "i" },
  { cat: "System", code: "get system performance status", desc: "CPU kullanimi (user/system/idle per core), memory kullanimi (%), network throughput (kbps), session sayisi. idle<%30 = KRITIK, memory>%88 = conserve mode riski", sev: "i" },
  { cat: "System", code: "execute time", desc: "Sistem saatini gosterir. NTP senkron degilse loglar yanlis zaman damgali olur. Sertifika dogrulama hatalarina da yol acabilir", sev: "i" },
  { cat: "System", code: "diagnose sys top", desc: "Process listesi — CPU% ve MEM% ile. 'R'=Running, 'S'=Sleep, 'Z'=Zombie, 'D'=Disk Sleep. 'm' tusuna basinca memory'ye gore siralar. ipsengine yuksekse IPS agir, wad yuksekse proxy agir", sev: "w" },
  { cat: "System", code: "diagnose sys top-summary", desc: "Process ozet tablosu — her process'in toplam CPU ve memory kullanimi. diagnose sys top'tan daha ozet ve okunakli", sev: "i" },
  { cat: "System", code: "get system performance firewall packet-distribution", desc: "Paket boyutu dagilimi (64byte, 128, 256, 512, 1024, 1518+). Kucuk paketler coksa (64byte) CPU yuklenir. VoIP/gaming ortaminda normal olabilir", sev: "i" },
  { cat: "System", code: "get system info admin status", desc: "Su anda login olan admin kullanicilari ve oturum bilgileri. Yetkisiz erisim kontrolu icin kullanilir", sev: "i" },
  { cat: "System", code: "get system global | grep two", desc: "Two-factor authentication ayarini kontrol eder. two-factor-* satirlari two-factor auth durumunu gosterir", sev: "i" },
  { cat: "System", code: "show full-configuration system global | grep port", desc: "Admin GUI portu (default 443), SSH portu (default 22) gibi global port ayarlarini gosterir", sev: "i" },
  { cat: "System", code: "diagnose hardware sysinfo memory", desc: "Detayli bellek bilgisi: MemTotal, MemFree, Buffers, Cached, SwapTotal/Free. 'MemFree + Buffers + Cached' = kullanilabilir bellek", sev: "i" },
  { cat: "System", code: "diagnose hardware sysinfo cpu", desc: "CPU modeli, core sayisi, clock hizi. Cihaz kapasitesini dogrulamak icin", sev: "i" },
  { cat: "System", code: "diagnose hardware deviceinfo disk", desc: "Disk bilgisi: tip, boyut, bos alan. Log diski doluysa loglar yazilmaz. 'execute formatlogdisk' ile formatlanabilir", sev: "i" },
  { cat: "System", code: "diagnose sys flash list", desc: "Flash partition listesi — hangi firmware aktif, boyut, bos alan. Dual firmware destegi varsa yedek image burada gorulur", sev: "i" },
  { cat: "System", code: "diagnose hardware sysinfo interrupts", desc: "Hardware interrupt sayaclari. Anormal yuksek interrupt CPU sorununa isaret edebilir. NIC driver veya hardware sorunu teshisi icin", sev: "i" },
  { cat: "System", code: "diagnose hardware test suite all", desc: "HQIP hardware diagnostic — CPU, memory, disk, NIC, PSU, fan testi. Sonuc PASS/FAIL olarak doner. RMA oncesi calistirilir", sev: "w" },
  { cat: "System", code: "diagnose sys mpstat {n}", desc: "Her {n} saniyede bir core bazli CPU kullanimi. Tek core'da bottleneck varsa gorunur. Parametre: {n}=yenileme suresi (saniye)", sev: "i" },
  { cat: "System", code: "diagnose firewall packet distribution", desc: "Firewall engine uzerinden gecen paketlerin boyut dagilimi istatistikleri", sev: "i" },
  { cat: "System", code: "diagnose sys vd list", desc: "VDOM (Virtual Domain) listesi ve her VDOM'un istatistikleri — session sayisi, trafik. Multi-VDOM ortaminda onemli", sev: "i" },
  { cat: "System", code: "diagnose sys cmdb info", desc: "Son konfigurasyon degisiklikleri — ne zaman, hangi admin. Config degisiklik takibi icin. Beklenmeyen degisiklikleri tespit eder", sev: "i" },
  { cat: "System", code: "diagnose debug config-error-log read", desc: "Konfigurasyon dosyasindaki syntax hatalari. Firmware upgrade sonrasi uyumsuz config satirlarini gosterir. Bos cikti = sorun yok", sev: "e" },
  { cat: "System", code: "diagnose debug crashlog read", desc: "Daemon crash loglari — hangi process ne zaman crash olmus. Tekrar eden crash'ler firmware bug isareti olabilir. TAC'a gonderin", sev: "e" },
  { cat: "System", code: "execute tac report", desc: "Fortinet TAC (Technical Assistance Center) icin detayli sistem raporu olusturur. Destek bileti acilirken istenir", sev: "i" },
  { cat: "System", code: "execute reboot", desc: "Cihazi yeniden baslatir. Onay ister: 'Do you want to continue? (y/n)'. Aktif trafik KESILIR", sev: "e" },
  { cat: "System", code: "execute factoryreset", desc: "Tum konfigurasyonu siler, fabrika ayarlarina doner ve reboot eder. GERI ALINAMAZ! VM'de [keepvmlicense] parametresi lisansi korur", sev: "e" },
  { cat: "System", code: "execute factoryreset2", desc: "factoryreset gibi ama system settings (interface IP, routing, admin password) KORUNUR. Firewall policy vs. silinir", sev: "e" },
  { cat: "System", code: "show", desc: "Sadece default'tan farkli (degistirilmis) konfigurasyonu gosterir. Daha kisa ve okunakli. Konfig yedegi icin idealdir", sev: "i" },
  { cat: "System", code: "show full-configuration", desc: "TUM konfigurasyonu gosterir (default degerler dahil). Cok uzun cikti. Karsilastirma veya tam yedek icin", sev: "i" },
  { cat: "System", code: "tree", desc: "Tum CLI komut agacini gosterir — mevcut tum komutlari kesfetmek icin. Cok uzun cikti verir", sev: "i" },
  { cat: "System", code: "tree execute", desc: "Sadece 'execute' altindaki komut agaci. Ping, traceroute, reboot gibi calistirma komutlarini listeler", sev: "i" },
  { cat: "System", code: "tree diagnose", desc: "Sadece 'diagnose' altindaki komut agaci. Debug, sniffer, vpn, sys gibi teshis komutlarini listeler", sev: "i" },

  // ═════════════════════ HARDWARE ═════════════════════
  { cat: "Hardware", code: "get hardware status", desc: "Model adi, seri no, BIOS versiyonu, RAM boyutu, disk tipi/boyutu. Cihaz envanter bilgisi icin kullanilir", sev: "i" },
  { cat: "Hardware", code: "get hardware nic port3", desc: "NIC detayi: MAC adresi, driver, state (up/down), speed, duplex, Rx/Tx paket sayilari, drop/error sayaclari. Hata sayaclari 0'dan buyukse fiziksel sorun var", sev: "i" },
  { cat: "Hardware", code: "diagnose hardware deviceinfo nic port3", desc: "get hardware nic ile ayni ciktiyi verir. CRC_errors>0 ise kablo/port kotu. Collisions>0 ise duplex mismatch", sev: "i" },
  { cat: "Hardware", code: "get system interface physical", desc: "Tum fiziksel interface'lerin ozeti: status (up/down), IP adresi, speed (1000full/100half/n/a), Rx/Tx byte. Hizli genel bakis icin", sev: "i" },
  { cat: "Hardware", code: "diagnose sys modem detect", desc: "USB/dahili modem tespiti. 3G/4G modem takiliysa burada gorulur. FEXT olmayan cihazlarda dahili modem kontrolu icin", sev: "i" },
  { cat: "Hardware", code: "execute disk list", desc: "Mount edilmis diskleri listeler: tip (SSD/HDD/Flash), boyut, partition bilgisi. Log diski kontrol etmek icin", sev: "i" },
  { cat: "Hardware", code: "execute formatlogdisk", desc: "Log diskini formatlar — TUM LOGLAR SILINIR! Disk doluysa veya bozuksa kullanilir. Onay ister, GERI ALINAMAZ", sev: "e" },
  { cat: "Hardware", code: "fnsysctl ifconfig -a wan", desc: "Linux ifconfig ciktisi — interface MTU, flags, Rx/Tx istatistikleri. MTU degerini gormek icin TEK yol budur. fnsysctl = FortiOS shell komutu", sev: "i" },

  // ═════════════════════ INTERFACE ═════════════════════
  { cat: "Interface", code: "show system interface", desc: "Tum interface konfigurasyonu — default'tan farkli ayarlar. IP, mode (static/dhcp/pppoe), allowaccess, vdom, status gorunur", sev: "i" },
  { cat: "Interface", code: "show system interface FEXT", desc: "Belirli interface'in konfigurasyonunu goster. Interface adi buyuk/kucuk harf duyarlidir", sev: "i" },
  { cat: "Interface", code: "get system interface", desc: "Tum interface'lerin ozet listesi: ad, IP, status, MTU, vdom. Hizli genel bakis icin", sev: "i" },
  { cat: "Interface", code: "get system interface physical", desc: "Fiziksel interface'ler: status=up/down, IP, speed (1000full/100half/n/a), Rx/Tx byte. down=kablo yok veya admin down, speed=n/a ise link yok", sev: "i" },
  { cat: "Interface", code: "diagnose ip address list", desc: "Tum interface'lerdeki IP/subnet bilgisi listesi. Secondary IP'ler dahil gorunur. IP catisma kontrolu icin kullanilir", sev: "i" },
  { cat: "Interface", code: "get sys interface transceiver", desc: "SFP/SFP+ transceiver bilgisi: vendor, seri no, sicaklik, voltaj, TX/RX sinyal gucu (dBm). Fiber baglantilarda sinyal kalitesi kontrolu icin", sev: "i" },
  { cat: "Interface", code: "show system interface port1 | grep -A2 ip", desc: "port1 konfigurasyonunda 'ip' iceren satir ve sonraki 2 satiri filtreler. Hizlica IP adresini bulmak icin", sev: "i" },
  { cat: "Interface", code: "config system interface", desc: "Interface konfigurasyonu moduna girer. Ardindan 'edit <interface_adi>' ile belirli interface secilir. 'end' ile cikilir", sev: "i" },
  { cat: "Interface", code: "edit dsl", desc: "Config modunda belirli interface'i sec. Ardindan set/show/get komutlari bu interface icin calisir", sev: "i" },
  { cat: "Interface", code: "show full-configuration", desc: "Config modu icinde: tum ayarlari goster (default dahil). 'show' ise sadece degistirilmisleri gosterir", sev: "i" },
  { cat: "Interface", code: "set status down", desc: "Interface'i administratif olarak kapatir. Trafik KESILIR! HA failover testi veya sorun izolasyonu icin kullanilir", sev: "e" },
  { cat: "Interface", code: "set status up", desc: "Interface'i tekrar acar. Fiziksel link varsa trafik akmaya baslar. HA testinden sonra mutlaka UP yapin", sev: "ok" },
  { cat: "Interface", code: "show system interface internal7", desc: "FEXT (FortiExtender) bagli internal switch portunun konfigurasyonu. DHCP server, allowaccess ayarlari burada", sev: "i" },

  // ═════════════════════ SESSION ═════════════════════
  { cat: "Session", code: "get system session status", desc: "Toplam aktif session sayisi. Model limitine yaklasiyorsa conserve mode riski. Limit asildiysa yeni baglanti kabul edilmez", sev: "i" },
  { cat: "Session", code: "get system session-info full-stat", desc: "Detayli istatistikler: mevcut sayi, global limit, TCP per-state breakdown, clash sayilari. memory_tension_drop>0 ise memory yetersiz", sev: "i" },
  { cat: "Session", code: "get system session list", desc: "Tum session'lari basit formatta listeler. Cikti cok buyuk olabilir! Belirli IP icin 'grep' ile filtreleyin", sev: "i" },
  { cat: "Session", code: "get system session list | grep 10.20.9.84", desc: "Belirli IP'nin session'larini filtreler. Hizli kontrol icin ama detay icin diagnose sys session kullanin", sev: "i" },
  { cat: "Session", code: "get system session-ttl", desc: "Default TCP idle timeout suresi (varsayilan 3600sn=1saat). Bu sure dolunca inaktif session silinir. Kisa tutmak session sayisini dusurur", sev: "i" },
  { cat: "Session", code: "get system global | grep -i timer", desc: "Global TCP/UDP session timeout degerleri. tcp-halfclose-timer, tcp-halfopen-timer, tcp-timewait-timer gibi ince ayarlar", sev: "i" },
  { cat: "Session", code: "diagnose sys session stat", desc: "Session engine istatistikleri: clash, memory_tension_drop, TCP state dagilimlari. memory_tension_drop>0 = conserve mode belirtisi", sev: "i" },
  { cat: "Session", code: "diagnose sys session exp-stat", desc: "Expectation (beklenen) session istatistikleri. FTP, SIP gibi multi-port protokollerde data channel icin olusturulan bekleme kayitlari", sev: "i" },
  { cat: "Session", code: "diagnose sys session filter", desc: "Aktif filtreleri goster. Liste/clear oncesi mevcut filtreleri kontrol edin. Filtre yoksa list/clear TUM session'lari etkiler!", sev: "i" },
  { cat: "Session", code: "diagnose sys session filter <filter>", desc: "Filtre parametreleri: src, dst, sport, dport, proto (6=TCP,17=UDP), policy, vd, sintf, dintf, duration, expire, negate. Birden fazla filtre AND mantigi ile calisir", sev: "i" },
  { cat: "Session", code: "diagnose sys session list", desc: "Filtrelenmis session detayi: proto, proto_state (TCP:00=yeni/01=established/02=closing), policy_id, state flags (may_dirty/dirty/npu/local), duration/expire/timeout, NAT bilgisi, byte sayaclari", sev: "i" },
  { cat: "Session", code: "diagnose sys session clear", desc: "Filtreye uyan session'lari SILER. DIKKAT: Filtre yoksa TUM session'lar silinir! Once 'diagnose sys session filter' ile filtreyi dogrulayin", sev: "e" },

  // ═════════════════════ ROUTING ═════════════════════
  { cat: "Routing", code: "get router info routing-table all", desc: "Tam routing tablosu (RIB). Kodlar: S=Static, C=Connected, O=OSPF, B=BGP, *=default route. [distance/metric] dusuk distance=oncelikli (S=10, O=110, B=200)", sev: "i" },
  { cat: "Routing", code: "get router info routing-table database", desc: "Tum bilinen route'lar — aktif olmayanlar dahil. RIB'e girmeyen (daha yuksek distance) route'lar da gorulur. Neden secilmedigini anlamak icin", sev: "i" },
  { cat: "Routing", code: "get router info routing-table static", desc: "Sadece statik route'lari gosterir. 'via' next-hop IP ve cikis interface'ini belirtir", sev: "i" },
  { cat: "Routing", code: "show router static", desc: "Konfigure edilmis statik route'larin konfigurasyonu. dst/gateway/device/distance/priority alanlari gorunur. 'get' ciktisini gostermez, konfig'u gosterir", sev: "i" },
  { cat: "Routing", code: "get router info kernel", desc: "Kernel FIB (Forwarding Information Base) — gercekte kullanilan routing tablosu. tab, vf (VDOM), type, proto, prio, pref, Gwy (gateway), dev (device) alanlari var", sev: "i" },
  { cat: "Routing", code: "diagnose ip route list", desc: "Kernel seviyesinde IP route listesi. get router info kernel ile benzer ama farkli format. Routing daemon'undan bagimsiz", sev: "i" },
  { cat: "Routing", code: "diagnose ip rtcache list", desc: "Route cache — son kullanilan route'lar onbellekte tutulur. Eski/yanlis cache routing sorununa yol acabilir", sev: "i" },
  { cat: "Routing", code: "diagnose firewall proute list", desc: "Policy route (PBR/SD-WAN) listesi. Normal routing'den ONCE uygulanir! src/dst/out/gateway/used alanlari. used=0 ise hic eslesme olmamis", sev: "i" },
  { cat: "Routing", code: "diagnose firewall proute list 2132082689", desc: "ID ile belirli policy route detayi. Uzun ID numarasi 'diagnose firewall proute list' ciktisindaki id alanından alinir", sev: "i" },
  { cat: "Routing", code: "get router info protocols", desc: "Aktif routing protokollerini gosterir: static, connected, OSPF, BGP, RIP. Hangi protokollerin calistigini dogrulamak icin", sev: "i" },
  { cat: "Routing", code: "execute router restart", desc: "Routing daemon'unu (zebos) yeniden baslatir. OSPF/BGP komsulari KOPAR ve yeniden kurulur. Son care olarak kullanin, trafik etkilenir", sev: "e" },
  { cat: "Routing", code: "show router policy 1", desc: "PBR (Policy Based Routing) kural konfigurasyonunu gosterir: src/dst adresleri, cikis interface, gateway, protocol", sev: "i" },

  // ═════════════════════ ROUTING — OSPF ═════════════════════
  { cat: "OSPF", code: "get router info ospf status", desc: "OSPF process durumu: Router ID, area listesi, SPF hesaplama sayisi, son SPF zamani. OSPF calisiyor mu kontrolu icin ilk komut", sev: "i" },
  { cat: "OSPF", code: "get router info ospf neighbor", desc: "OSPF komsulari: Neighbor ID, Priority, State, Dead Time, Address, Interface. State: Full=OK, Init/2Way=sorun var, Down=komsu kayip", sev: "i" },
  { cat: "OSPF", code: "get router info ospf neighbor all", desc: "TUM OSPF komsulari (farkli area'lar dahil). Full/DR veya Full/BDR=normal. Init=hello aliniyor ama ilerlemiyor (timer/area/auth sorunu)", sev: "i" },
  { cat: "OSPF", code: "get router info ospf interface", desc: "OSPF interface'leri: network type, area, cost, hello/dead interval, DR/BDR election durumu. Timer mismatch komsu sorununa yol acar", sev: "i" },
  { cat: "OSPF", code: "get router info ospf database brief", desc: "OSPF LSDB (Link State Database) ozeti: Router/Network/Summary/External LSA sayilari. Database buyuklugu OSPF performansini etkiler", sev: "i" },
  { cat: "OSPF", code: "diagnose ip router ospf all enable", desc: "OSPF debug baslat — hello paketleri, LSA exchange, SPF hesaplamasi. Yogun cikti uretir! 'diagnose debug enable' ile birlikte kullanin", sev: "w" },
  { cat: "OSPF", code: "diagnose ip router ospf level info", desc: "OSPF debug seviyesini info'ya ayarlar. Debug baslatmadan ONCE calistirin. error/warning/info/debug seviyeleri var", sev: "i" },

  // ═════════════════════ ROUTING — BGP ═════════════════════
  { cat: "BGP", code: "get router info bgp summary", desc: "BGP ozet tablosu: Neighbor IP, AS, MsgRcvd/Sent, Up/Down time, State/PfxRcd. State=Established=OK, Idle/Active/Connect=sorun. PfxRcd=alinan prefix sayisi", sev: "i" },
  { cat: "BGP", code: "get router info bgp neighbors", desc: "BGP neighbor detaylari: remote AS, local AS, hold time, keepalive, capabilities (route-refresh, 4-byte AS, graceful-restart)", sev: "i" },
  { cat: "BGP", code: "get router info bgp neighbors <x.x.x.x> advertised-routes", desc: "Bu peer'a gondigimiz route'lar. Bos ise route-map/prefix-list filtreliyor olabilir veya redistribute yapilandirilmamis", sev: "i" },
  { cat: "BGP", code: "get router info bgp neighbors <x.x.x.x> received-routes", desc: "Bu peer'dan ALINAN tum route'lar (filtre oncesi). Peer'in gonderdigini dogrulamak icin. soft-reconfiguration inbound gerekli", sev: "i" },
  { cat: "BGP", code: "get router info bgp neighbors <x.x.x.x> routes", desc: "Bu peer'dan alinan ve RIB'e KURULAN route'lar. received-routes ile farki: route-map filtresi uygulanmis hali", sev: "i" },
  { cat: "BGP", code: "diagnose ip router bgp all enable", desc: "BGP debug baslat — update, notification, keepalive mesajlari. 'diagnose debug enable' ile birlikte. Yogun peer ortaminda filtresiz calistirilmamali", sev: "w" },
  { cat: "BGP", code: "diagnose ip router bgp level info", desc: "BGP debug seviyesini info'ya ayarlar. Debug oncesi calistirin", sev: "i" },
  { cat: "BGP", code: "execute router clear bgp all", desc: "TUM BGP peer'lari HARD reset — TCP session kopar, tum route'lar silinir, yeniden negotiate. TRAFIK KESILIR! Son care", sev: "e" },
  { cat: "BGP", code: "execute router clear bgp all soft in", desc: "Inbound policy degisikligini uygulamak icin soft reset. Peer baglantisi KOPMAZ, sadece route'lar yeniden islenir. Guvenli", sev: "w" },
  { cat: "BGP", code: "execute router clear bgp all soft out", desc: "Outbound policy degisikligini uygulamak icin soft reset. Peer'lara yeniden update gonderilir. Baglanti kopmaz", sev: "w" },
  { cat: "BGP", code: "execute router clear bgp ip x.x.x.x soft in", desc: "Belirli peer icin inbound soft reset. Sadece bu peer'dan alinan route'lar yeniden islenir. En guvenli yontem", sev: "w" },

  // ═════════════════════ ARP / PING / TELNET ═════════════════════
  { cat: "ARP", code: "get system arp", desc: "ARP tablosu: Address (IP), Age (dk), Hardware Addr (MAC), Interface. Age=0 ise taze kayit. Ayni IP farkli MAC = IP catismasi!", sev: "i" },
  { cat: "ARP", code: "get system arp | grep 192.168.1.2", desc: "Belirli IP'nin ARP kaydini filtreler. MAC gorunuyorsa L2 baglanti var. 00:00:00:00:00:00 ise cozumlenemedi (hedef yanit vermiyor)", sev: "i" },
  { cat: "ARP", code: "diagnose ip arp list", desc: "Detayli ARP bilgisi: port, IP, MAC, state, flag. 'get system arp' ile benzer ama daha fazla teknik detay icerir", sev: "i" },
  { cat: "ARP", code: "diagnose ip arp list | grep 192.168.1.57", desc: "Belirli IP icin detayli ARP. State alaninda incomplete=cozumlenemedi, reachable=OK, stale=eski kayit (yenilenmedi)", sev: "i" },
  { cat: "ARP", code: "execute clear system arp table", desc: "TUM ARP tablosunu siler. Gecici L2 kesintisi olusabilir — cihazlar yeniden ARP yapana kadar. IP catismasi cozumu icin kullanilir", sev: "e" },
  { cat: "Ping", code: "execute ping-options view-settings", desc: "Mevcut ping ayarlarini gosterir: repeat-count, data-size, timeout, source, ttl, df-bit, interface. Ayar degistirildiyse kalici olur!", sev: "i" },
  { cat: "Ping", code: "execute ping-options repeat-count 19", desc: "Ping tekrar sayisini 19 yapar (default 5). Uzun sureli baglanti testi icin artirin. Paket kaybi oranini daha iyi gosterir", sev: "i" },
  { cat: "Ping", code: "execute ping-options source 192.168.1.1", desc: "Ping kaynak IP'sini ayarlar. KRITIK: VPN uzerinden ping icin kaynak IP'nin VPN selector'undeki subnet'te olmasi gerekir. Yanlis source = yanit gelmez", sev: "i" },
  { cat: "Ping", code: "execute ping 192.168.1.28", desc: "ICMP echo request gonderir. 0% loss=OK, 100% loss=hedef ulasilamaz (firewall/routing/hedef down). TTL: 64=Linux, 128=Windows, 255=network cihazi", sev: "i" },
  { cat: "Ping", code: "execute ping -c 3 10.10.0.29", desc: "FEXT'te 3 paketlik ping. -c parametresi sadece bazi cihazlarda calisir. FortiGate'de repeat-count kullanin", sev: "i" },
  { cat: "Ping", code: "execute traceroute <x.x.x.x>", desc: "Hedefe giden yolu gosterir: her hop'un IP'si ve response suresi. * * * = ICMP engellenmis veya timeout. Routing sorunlarini tespitte cok onemli", sev: "i" },
  { cat: "Ping", code: "execute traceroute-options {options}", desc: "Traceroute ayarlari: source (kaynak IP), device (cikis interface), use-sdwan yes (SD-WAN uzerinden). view-settings ile mevcut ayarlari gorun", sev: "i" },
  { cat: "Connectivity", code: "execute telnet 1.1.1.2", desc: "Telnet ile uzak cihaza baglanir. Port erisimi testi icin: port aciksa 'Connected' gorulur. Timeout = port kapali veya firewall engeller", sev: "i" },
  { cat: "Connectivity", code: "execute telnet 192.0.2.5", desc: "FEXT'e veya uzak cihaza telnet. CPE yonetimi icin kullanilir. Telnet guvenli degildir — sadece LAN/yonetim amaciyla", sev: "i" },
  { cat: "Connectivity", code: "execute ssh admin@1.1.1.2", desc: "SSH ile uzak cihaza baglanir. admin=kullanici adi. FortiGate'den baska FortiGate veya switch'e yonetim amacli erisim icin", sev: "i" },
  { cat: "Connectivity", code: "execute ssh-options {options}", desc: "SSH ayarlari: source (kaynak IP), port (hedef port, default 22). Farkli porttan SSH baglantisi icin 'port 2222' gibi", sev: "i" },

  // ═════════════════════ SNIFFER ═════════════════════
  { cat: "Sniffer", code: "diagnose sniffer packet any 'host 10.40.30.2' 4 0", desc: "Belirli IP'nin tum trafigini yakala. verbose=4 interface adi gosterir (en cok kullanilan). count=0 sinirsiz (Ctrl+C ile dur). Trafik var mi yok mu ilk kontrol", sev: "i" },
  { cat: "Sniffer", code: "diagnose sniffer packet any 'host 10.40.30.2 and port 443' 4 0", desc: "IP + port filtreli — sadece HTTPS trafigini yakalar. 'and' operatoru iki kosulu birlestirir. BPF (Berkeley Packet Filter) syntax kullanilir", sev: "i" },
  { cat: "Sniffer", code: "diagnose sniffer packet any 'host 192.0.2.42 and port 500' 4 0 1", desc: "IKE (port 500) trafik yakalama — IPsec VPN troubleshoot icin. Son parametre 1=UTC timestamp. Karsi taraftan IKE paketi geliyor mu kontrolu", sev: "i" },
  { cat: "Sniffer", code: "diagnose sniffer packet any 'src host 192.0.2.152 and dst host 10.30.4.6' 4 a", desc: "Tek yonlu filtre — sadece bu kaynak'tan bu hedef'e. 'a'=absolute timestamp (tarih+saat). Asimetrik routing tespiti icin ideal", sev: "i" },
  { cat: "Sniffer", code: "diagnose sniffer packet any 'host 172.16.1.1' 6", desc: "Verbose 6 = en detayli: Ethernet header + IP header + payload hex + ASCII dump. Paket icerigini okumak icin (sifrelenmemis trafik). CPU yogun!", sev: "i" },
  { cat: "Sniffer", code: "diagnose sniffer packet <interface> <'filter'> <verbose> <count> <a|l>", desc: "Genel syntax. interface: any/wan1/port5. filter: BPF syntax (host/port/src/dst/and/or/not). verbose: 1-6. count: 0=sinirsiz. timestamp: a=UTC, l=local", sev: "i" },

  // ═════════════════════ DEBUG FLOW ═════════════════════
  { cat: "Debug Flow", code: "diagnose debug enable", desc: "Debug ciktisini konsola baslat. BU OLMADAN hicbir debug ciktisi gelmez. Tum debug islemleri 'enable' gerektirir. 'diagnose debug info' ile durum kontrol edilir", sev: "w" },
  { cat: "Debug Flow", code: "diagnose debug flow filter addr 192.168.2.169", desc: "IP filtresi — kaynak VEYA hedef olarak bu IP'yi iceren paketler. Birden fazla filtre (addr+port) AND mantigi ile calisir. Filtre koymadan trace baslatMAyin", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow filter port 23", desc: "Port filtresi — kaynak VEYA hedef port. addr ile birlikte kullanildiginda AND olur: sadece o IP VE o port eslesince cikti gelir", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow filter dport 8099", desc: "Sadece destination port filtresi. 'port' her iki yonu filtrelerken, 'dport' sadece hedef portu filtreler. 'sport' da kaynak portu filtreler", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow show console enable", desc: "Debug ciktisini SSH konsolunda goster. Bazi ortamlarda bu olmadan cikti gelmez. Default olarak acik olmayabilir", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow show function-name enable", desc: "Her satirdaki FortiOS fonksiyon adini gosterir (init_ip_session, vf_ip_route_input, fw_forward_handler vs). Sorunun hangi asamada oldugunu anlamak icin KRITIK", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow show iprope enable", desc: "Internal firewall policy (iprope) kontrol detaylarini gosterir. Policy eslesme sürecini adim adim gormenizi saglar. Gizli policy sorunlari icin", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow trace start 100", desc: "100 satir debug ciktisi al. Sayi buyukse cok cikti gelir, kucukse sorunu yakalayamayabilirsiniz. Genellikle 50-200 arasi yeterli. Ctrl+C ile erken durdurulabilir", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow trace start6 <n>", desc: "IPv6 trafik icin debug flow baslat. IPv4 ile ayni cikti formatinda. IPv6 routing/policy sorunlari icin", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug console timestamp enable", desc: "Debug satirlarina tarih+saat damgasi ekler. Zamanlama analizleri icin onemli. Loglari baskasina gonderirken timestamp olmazsa anlamsiz olur", sev: "i" },
  { cat: "Debug Flow", code: "diagnose debug flow filter clear", desc: "Tum IPv4 filtrelerini temizler. Debug bittikten sonra MUTLAKA calistirin. Filtre kalirsa bir sonraki debug yanlis sonuc verebilir", sev: "ok" },
  { cat: "Debug Flow", code: "diagnose debug flow filter6 clear", desc: "IPv6 debug flow filtrelerini temizler. IPv6 debug sonrasi kullanin", sev: "ok" },
  { cat: "Debug Flow", code: "diagnose debug flow trace stop", desc: "Aktif trace'i durdurur. 'disable' ile birlikte kullanin. Once stop, sonra disable, sonra filter clear sirasi idealdir", sev: "ok" },
  { cat: "Debug Flow", code: "diagnose debug disable", desc: "Debug ciktisini durdurur ama background'da calisan debug'lar devam edebilir. Tam temizlik icin 'diagnose debug reset' kullanin", sev: "ok" },
  { cat: "Debug Flow", code: "diagnose debug reset", desc: "TUM aktif debug'lari durdurur — foreground ve background. En temiz kapatma yontemi. Debug sonrasi MUTLAKA calistirin", sev: "ok" },
  { cat: "Debug Flow", code: "diagnose debug duration 0", desc: "Debug suresini sinirsiz yapar (default 30dk). 0=sinirsiz, reboot sifirlar. Uzun sureli izleme icin. Unutursaniz cihaz yuklenir!", sev: "w" },

  // ═════════════════════ VPN — IPsec ═════════════════════
  { cat: "IPsec", code: "get vpn ipsec tunnel summary", desc: "Tum tunnel'larin ozeti: isim, up/down durumu, local/remote IP, selector sayisi. DOWN gorurseniz Phase1/2 kontrol edin. 0.0.0.0 = peer IP alinamadi (Phase1 basarisiz)", sev: "i" },
  { cat: "IPsec", code: "get vpn ipsec tunnel details", desc: "Detayli tunnel bilgisi: Rx/Tx paket/byte, peer IP, algorithm, selector, lifetime, NAT-T durumu. Trafik 0 ise tunnel calismiyordur", sev: "i" },
  { cat: "IPsec", code: "get vpn ipsec tunnel name S_BRANCH_DSL_0", desc: "Belirli tunnel'in detayli bilgisi. Isim Phase1 config'deki isimdir. Tab ile otomatik tamamlanir", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn tunnel list name S_BRANCH_DSL_0", desc: "Phase 2 (IPsec SA) bilgisi: selector (src/dst subnet), SPI, enc/auth algorithm, NPU offload, MTU, lifetime, DPD durumu. Packets=0 ise trafik akmiyordur", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ike gateway list name S_BRANCH_DSL_0", desc: "Phase 1 (IKE SA) bilgisi: status (established/connecting), created suresi, direction (initiator/responder), proposal (enc-hash). established 0/1 = SORUN", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ike gateway list", desc: "TUM Phase 1 durumu. status:established=OK. XAuth dial-up icin kullanici adi da gorunur. Toplu kontrol icin", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn tunnel list", desc: "TUM Phase 2 durumu. Her tunnel icin selector, SPI, algorithm, paket sayaclari. Toplu kontrol icin", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ipsec status", desc: "IPsec sifreleme istatistikleri: ASIC vs software crypto sayaclari. Software crypto yuksekse NPU offload calismiyordur (performans sorunu)", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ike counts", desc: "IKE SA sayaclari: aktif tunnel sayisi, basarili/basarisiz negotiation sayilari. Basarisiz sayi artiyorsa surekli deneme var", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ike errors", desc: "IKE hata sayaclari: no-proposal, auth-fail, timeout vs. Hangi hata tipinin en cok oldugunu gosterir. Sorunun kok nedenini bulmak icin", sev: "e" },
  { cat: "IPsec", code: "diagnose vpn ike stats", desc: "IKE performans istatistikleri: negotiation sureleri, paket sayilari", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ike routes", desc: "IKE tarafindan olusturulan route'lar. Tunnel UP olunca otomatik eklenen route'lar burada gorulur", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ike status", desc: "IKE engine genel durum bilgisi", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn ike crypto", desc: "IKE crypto engine bilgisi: desteklenen algoritmalar, hardware acceleration durumu", sev: "i" },
  { cat: "IPsec", code: "diagnose vpn tunnel flush", desc: "TUM Phase 2 SA'lari siler ve yeniden negotiate eder. Aktif tunnel trafigi KESILIR. Toplu VPN reset icin (dikkatli!)", sev: "e" },
  { cat: "IPsec", code: "diagnose vpn tunnel flush <name>", desc: "Belirli tunnel'in Phase 2 SA'sini siler. Tunnel otomatik yeniden kurulur. Tek tunnel sorununda tercih edin", sev: "e" },
  { cat: "IPsec", code: "diagnose vpn ike gateway clear name <name>", desc: "Phase 1 IKE SA'yi temizler. clear=graceful kapatma (notify gonderir). Karsi tarafa bildirim gider", sev: "e" },
  { cat: "IPsec", code: "diagnose vpn ike gateway flush name <name>", desc: "Phase 1 IKE SA'yi flush eder. flush=zorla sil (notify gondermez). Karsi taraf timeout'a kadar eski SA'yi kullanmaya devam edebilir", sev: "e" },
  { cat: "IPsec", code: "diagnose vpn ike restart", desc: "IKE daemon'unu yeniden baslatir. TUM VPN tunnel'lari KOPAR ve yeniden kurulur. Son care, cok sayida tunnel varsa dakikalarca surebilir", sev: "e" },

  // ═════════════════════ VPN — IPsec Debug ═════════════════════
  { cat: "IPsec Debug", code: "diagnose vpn ike log-filter dst-addr4 203.0.113.37", desc: "IKE debug'u belirli peer IP'ye filtreler. Cok tunnel varsa filtresiz debug okunmaz olur. Parametreler: dst-addr4, src-addr4, name, interface, vd", sev: "i" },
  { cat: "IPsec Debug", code: "diag vpn ike log filter name mlp_dbs", desc: "IKE debug'u tunnel ismine gore filtreler. Belirli bir tunnel'in negotiation surecini izlemek icin. 'list' ile aktif filtreleri, 'clear' ile temizleyin", sev: "i" },
  { cat: "IPsec Debug", code: "diagnose debug application ike 1", desc: "IKE debug seviye 1 — temel bilgi. Default 30dk sonra otomatik kapanir. Phase1/2 negotiation mesajlari: my proposal, incoming proposal, matched/no-match", sev: "w" },
  { cat: "IPsec Debug", code: "diagnose debug application ike -1", desc: "IKE debug maximum verbosity (-1=tum seviyeler). Cok fazla cikti uretir! Filtre ile kullanin. Phase1/2 detaylari, crypto islemleri, paket hex dump dahil", sev: "w" },
  { cat: "IPsec Debug", code: "diagnose debug enable", desc: "Debug ciktisini konsola baslat. IKE debug icin MUTLAKA gerekli. Once filter koyun, sonra 'application ike' acin, en son 'enable' yapin", sev: "w" },
  { cat: "IPsec Debug", code: "diagnose debug disable", desc: "Debug ciktisini durdurur. Islem bittikten sonra MUTLAKA kapatin. Acik birakilan debug CPU tuketir ve konsolu kirletir", sev: "ok" },

  // ═════════════════════ VPN — SSL ═════════════════════
  { cat: "SSL VPN", code: "get vpn ssl monitor", desc: "Bagli SSL VPN kullanicilari: index, username, auth type, timeout countdown, source IP, HTTP/HTTPS in/out byte. Bos liste = kimse bagli degil", sev: "i" },
  { cat: "SSL VPN", code: "get vpn ssl settings", desc: "SSL VPN konfigurasyonu: dinleme portu (default 443), interface, IP pool araligi, tunnel-ip-pools, dns-server. Port catismasi kontrolu icin onemli", sev: "i" },
  { cat: "SSL VPN", code: "diagnose vpn ssl list", desc: "Aktif SSL VPN session listesi — tunnel mode ve web mode dahil. Her session'in detayli bilgisi: kullanici, IP, baglanti suresi, trafik", sev: "i" },
  { cat: "SSL VPN", code: "execute vpn sslvpn list", desc: "SSL VPN baglanti listesi — get vpn ssl monitor'e benzer ama farkli format. Hizli kontrol icin", sev: "i" },
  { cat: "SSL VPN", code: "diagnose vpn ssl statistics", desc: "SSL VPN motor istatistikleri: toplam baglanti, aktif session, max concurrent, hata sayaclari. Kapasite planlamasi icin", sev: "i" },
  { cat: "SSL VPN", code: "diagnose vpn ssl mux-stat", desc: "SSL VPN multiplexing istatistikleri. Tunnel performansi analizi icin. Yuksek queue degeri bottleneck isareti", sev: "i" },
  { cat: "SSL VPN", code: "execute vpn sslvpn del-tunnel", desc: "TUM tunnel mode kullanicilarini keser. Belirli kullanici secimi YOKTUR — hepsi kesilir! Acil durumlarda veya IP pool sifirlama icin", sev: "e" },
  { cat: "SSL VPN", code: "execute vpn sslvpn del-web", desc: "TUM web mode kullanicilarini keser. Web portal erisimlerini sonlandirir. Toplu oturum temizligi icin", sev: "e" },
  { cat: "SSL VPN", code: "diagnose vpn ssl debug-filter <filter>", desc: "SSL VPN debug filtresi: src-addr4 (client IP), vd (VDOM). 'list' ile aktif filtreleri, 'clear' ile temizleyin. Filtresiz debug cok yogun!", sev: "i" },
  { cat: "SSL VPN", code: "diagnose debug application sslvpn -1", desc: "SSL VPN debug — SSL protokol negotiation, cipher secimi, tunnel kurulumu. Kullanici adi/grup bilgisi GOSTERMEZ, bunun icin auth debug gerekir", sev: "w" },

  // ═════════════════════ VPN — GRE ═════════════════════
  { cat: "GRE", code: "show system gre-tunnel", desc: "GRE tunnel konfigurasyonu: isim, local/remote IP, interface. IPsec uzerine GRE kuruluyorsa burada gorunur. Routing protokolleri GRE uzerinden calisir", sev: "i" },
  { cat: "GRE", code: "diagnose sys gre list", desc: "Aktif GRE tunnel'larin operasyonel durumu ve istatistikleri. Tunnel UP/DOWN durumu ve paket sayaclari", sev: "i" },

  // ═════════════════════ FIREWALL POLICY ═════════════════════
  { cat: "Policy", code: "show firewall policy 1", desc: "Policy ID 1'in konfigurasyonu: srcintf/dstintf, srcaddr/dstaddr, action (accept/deny), service, NAT, UTM profilleri, schedule, logtraffic. Policy ID debug flow ciktisinda gorulur", sev: "i" },
  { cat: "Policy", code: "show firewall policy", desc: "TUM firewall policy'leri — yukaridan asagiya sirayla. Ilk eslesen uygulanir! Cikti uzun olabilir, 'grep' ile filtreleyin", sev: "i" },
  { cat: "Policy", code: "diagnose firewall iprope list", desc: "Internal compiled firewall tablosu — FortiGate'in gercekte kullandigi tablo. Policy siralama sorunlarini tespit etmek icin. Normal policy listesinden farkli olabilir", sev: "i" },
  { cat: "Policy", code: "show router policy 1", desc: "PBR (Policy Based Routing) kural 1: src/dst adres, protocol, cikis interface, gateway. Normal routing'den ONCE uygulanir", sev: "i" },

  // ═════════════════════ OBJECTS ═════════════════════
  { cat: "Objects", code: "show firewall address IP_10.20.8.120/32", desc: "IP address nesnesi: subnet tipi, IP/mask. /32 = tek host. Policy'lerde srcaddr/dstaddr olarak kullanilir. Isim bosluk iceriyorsa tirnak icine alin", sev: "i" },
  { cat: "Objects", code: "show firewall address intranet.example.com", desc: "FQDN address nesnesi: DNS ile cozumlenir, IP degisirse otomatik guncellenir. DNS sunucu dogru yapilandirilmis olmali", sev: "i" },
  { cat: "Objects", code: "show firewall vip 203.0.113.50_10.20.1.153_5060_UDP", desc: "VIP (Virtual IP/DNAT): extip (WAN IP) -> mappedip (LAN IP). portforward=enable ise port bazli, disable ise 1:1 NAT. extport/mappedport farkli olabilir", sev: "i" },

  // ═════════════════════ USERS / AUTH ═════════════════════
  { cat: "Users", code: "show user local", desc: "Lokal (FortiGate uzerinde tanimli) kullanicilar: isim, status (enable/disable), two-factor ayari, email. SSL VPN/admin kullanicilari burada", sev: "i" },
  { cat: "Users", code: "show user fortitoken", desc: "FortiToken (2FA) ile eslesmis kullanicilar: token SN, status (active/locked), kullanici eslesmesi. Token locked ise admin reset etmeli", sev: "i" },
  { cat: "Users", code: "show user ldap Migros\\ AD\\ For\\ SOL", desc: "LDAP sunucu konfigurasyonu: server IP/FQDN, port (389/636), cnid, dn, type (regular/simple), source-ip, secure (ldaps/starttls). Bosluklu isimler \\\\ ile escape edilir", sev: "i" },
  { cat: "Users", code: "show user password-policy", desc: "Sifre politikasi: minimum uzunluk, karmasiklik gereksinimleri, expire-days, reuse-password. Compliance gereksinimleri icin", sev: "i" },
  { cat: "Users", code: "diagnose user device list", desc: "FortiGate tarafindan tespit edilmis cihazlar: MAC, IP, OS tipi, device tipi. Device identification ozelligini kullanir. BYOD kontrolu icin", sev: "i" },
  { cat: "Auth", code: "diagnose test authserver ldap <server> <user> <pass>", desc: "LDAP auth testi: succeeded=OK, failed=sifre yanlis, connect error=sunucuya ulasilamiyor. Sonucta grup uyelikleri de gorulur. Sifre musteriden istenir!", sev: "i" },
  { cat: "Auth", code: "diagnose test authserver ldap LDAP_11 username pass", desc: "Gercek LDAP test ornegi. server_name = 'show user ldap' ciktisindaki isim. Sifre acik metin olarak yazilir — dikkatli olun!", sev: "w" },
  { cat: "Auth", code: "diagnose test authserver radius <server> <type> <user> <pass>", desc: "RADIUS auth testi. type: chap/pap/mschap/mschap2. succeeded/failed/timeout donebilir. RADIUS shared secret'i kontrol edin", sev: "i" },
  { cat: "Auth", code: "diagnose debug authd fsso list", desc: "FSSO ile authenticate olmus kullanicilar: IP, username, domain, grup uyelikleri. Total=0 ise FSSO calismiyor veya DC'ye ulasilamiyor", sev: "i" },
  { cat: "Auth", code: "diagnose debug authd fsso server-status", desc: "FortiGate ve Domain Controller arasindaki FSSO agent baglanti durumu. Status connected=OK, disconnected=SORUN. IP ve port kontrol edin", sev: "i" },
  { cat: "Auth", code: "diagnose debug authd fsso refresh-logons", desc: "FSSO kullanici bilgilerini DC'den tekrar cekmesini tetikler. Kullanici listesi guncel degilse veya eksik kullanicilar varsa kullanin", sev: "i" },
  { cat: "Auth", code: "diagnose debug fsso-polling detail", desc: "FSSO polling modu detayi — FortiGate dogrudan DC'den event log okuyor. Poll suresi, okunan event sayisi, hatalar", sev: "i" },
  { cat: "Auth", code: "diagnose debug fsso-polling summary", desc: "FSSO polling ozeti: son poll zamani, basarili/basarisiz poll sayisi, bagli DC listesi", sev: "i" },
  { cat: "Auth", code: "diagnose debug fsso-polling user", desc: "FSSO polling ile tespit edilmis login olan kullanicilar listesi. Kullanici burada yoksa DC event log'unda gorunmuyor demektir", sev: "i" },
  { cat: "Auth", code: "execute fsso refresh", desc: "FSSO kullanici tablosunu tamamen yeniler. Cache sifirlanir, tum kullanicilar DC'den tekrar alinir. Buyuk ortamda biraz surebilir", sev: "i" },
  { cat: "Auth", code: "diagnose debug application fnbamd -1", desc: "Lokal auth daemon debug — FortiGate uzerindeki local/LDAP/RADIUS auth islemlerini gosterir. Auth failed detaylarini gormek icin", sev: "w" },
  { cat: "Auth", code: "diagnose debug application authd -1", desc: "Remote auth daemon debug — FSSO, captive portal, policy-based auth islemlerini gosterir. Kullanici login surecini izlemek icin", sev: "w" },
  { cat: "Auth", code: "diagnose debug application authd 8256", desc: "DC baglanti debug — ozellikle DC ile iletisim sorunlarini izlemek icin. 8256 seviyesi DC handshake detaylarini gosterir", sev: "w" },
  { cat: "Auth", code: "diagnose debug application fssod -1", desc: "FSSO daemon debug — FSSO agent ile iletisim, kullanici logon/logoff event'leri. Agent-based FSSO sorunlari icin", sev: "w" },
  { cat: "Auth", code: "diagnose debug application samld -1", desc: "SAML authentication debug — SAML IdP ile iletisim, assertion dogrulama, metadata exchange. SSO sorunlari icin", sev: "w" },
  { cat: "Auth", code: "diagnose firewall auth filter <filter>", desc: "Auth filtresi ayarla — belirli IP veya kullanici icin auth durumunu kontrol etmek icin. Ardindan 'auth list' calistirin", sev: "i" },
  { cat: "Auth", code: "diagnose firewall auth list", desc: "Firewall tarafindan authenticate olmus IPv4 kullanicilar: IP, username, grup, auth method, idle time. Policy-based auth kontrolu", sev: "i" },
  { cat: "Auth", code: "diagnose wad user list", desc: "WAD (proxy engine) tarafindan authenticate olmus kullanicilar. Explicit proxy veya ZTNA proxy auth icin. wad user =/= firewall auth", sev: "i" },
  { cat: "Auth", code: "diagnose test authserver ldap CORP_LDAP FSSO fortigate123", desc: "FSSO account ile LDAP test ornegi. FSSO service account sifresi ile baglanti testi yapilir", sev: "i" },

  // ═════════════════════ HA ═════════════════════
  { cat: "HA", code: "get system ha status", desc: "HA durumu: Health Status (OK/Critical), mode (A-P/A-A), master/slave seri no, cluster uptime, son state change, heartbeat interface durumu (up/down), CPU/memory/session ortalamalari, sync durumu (in-sync/out-of-sync)", sev: "i" },
  { cat: "HA", code: "diagnose system ha status", desc: "Daha detayli HA bilgisi: uptime, monitored link failures, priority, override durumu. 'get' versiyonundan daha teknik cikti verir", sev: "i" },
  { cat: "HA", code: "execute ha manage 0", desc: "Diger HA member'in CLI'ina atlar. '?' ile tum member index'lerini gorursunuz. 0=ilk slave. Atlayinca get system status ile seri no dogrulayin!", sev: "i" },
  { cat: "HA", code: "diagnose sys ha checksum cluster", desc: "Her member'in konfig checksum'u: global ve VDOM bazli. Iki member'in checksum'lari AYNI olmali. Farkli ise out-of-sync — konfig eslesmiyordur", sev: "i" },
  { cat: "HA", code: "diagnose sys ha checksum show <vdom>", desc: "Belirli VDOM veya 'global' icin detayli checksum — hangi config bolumunun farkli oldugunu gosterir. Out-of-sync root cause bulmak icin", sev: "i" },
  { cat: "HA", code: "diagnose sys ha checksum recalculate", desc: "Checksum'lari yeniden hesaplar. Out-of-sync uyarisi varsa once bunu deneyin — genellikle zararsizdir ve sorunu cozebilir", sev: "w" },
  { cat: "HA", code: "diagnose sys ha reset-uptime", desc: "HA member uptime'ini sifirlar — bu member'in priority'si duser ve failover tetiklenir (override disable ise). Kontrollü failover testi icin", sev: "w" },
  { cat: "HA", code: "diagnose sys ha history read", desc: "HA gecmis olaylari: failover tarihleri, sebepleri, state degisiklikleri. Neden failover oldugunu anlamak icin ilk bakilacak yer", sev: "i" },
  { cat: "HA", code: "execute ha synchronize stop", desc: "HA config senkronizasyonunu durdurur. Debug amacli — stop, debug ac, start sirasiyla verbose cikti alinir. Uzun sure acik BIRAKMAYIN!", sev: "e" },
  { cat: "HA", code: "execute ha synchronize start", desc: "HA config senkronizasyonunu baslatir. stop ile durdurulduysa tekrar baslatin. Config sync olmadan master/slave farkli calisir!", sev: "ok" },
  { cat: "HA", code: "diagnose debug application hatalk -1", desc: "HA heartbeat iletisimi debug — member'lar arasi heartbeat paketleri. state=work (normal), chg_time=son failover zamani. Heartbeat interface sorunlari icin", sev: "w" },
  { cat: "HA", code: "diagnose debug application hasync -1", desc: "HA senkronizasyon debug — config/session sync islemleri. Ilk sync sonrasi cikti gelmeyebilir (sync tamamlanmissa). Out-of-sync sorunlari icin", sev: "w" },
  { cat: "HA", code: "diagnose debug application harelay -1", desc: "HA relay debug — cluster member'lar arasi komut/veri iletimi. execute ha manage ile yapilan islemlerin relay mekanizmasi", sev: "w" },

  // ═════════════════════ UTM / IPS / WAD ═════════════════════
  { cat: "UTM", code: "show webfilter profile Net_Kisitli", desc: "Web filter profil konfigi: ftgd-wf (FortiGuard kategori filtreleme), url-filter (URL bazli), content-filter, override ayarlari. Policy'de hangi profil atanmis kontrol icin", sev: "i" },
  { cat: "UTM", code: "show application list APP_kisitli", desc: "Application Control profili: hangi uygulamalar block/monitor/allow. Kategori bazli (social-media, p2p, gaming) veya uygulama bazli (WhatsApp, BitTorrent) kurallar", sev: "i" },
  { cat: "UTM", code: "show dlp sensor CORP_DLP", desc: "DLP (Data Loss Prevention) sensor konfigi: kredi karti, TC kimlik, custom regex pattern'ler. Hassas veri sizintisi onleme kurallari", sev: "i" },
  { cat: "UTM", code: "diagnose debug application urlfilter -1", desc: "Web filter debug — URL kategori sorgulari, FortiGuard rating sonuclari, block/allow kararlari. Neden bir site engelleniyor anlamak icin", sev: "w" },
  { cat: "UTM", code: "diagnose test application urlfilter", desc: "Web filter test secenekleri menusu — belirli URL'yi test etme, cache durumu, istatistikler. Numara girerek secenek calistirin", sev: "i" },
  { cat: "UTM", code: "diagnose debug application dnsproxy -1", desc: "DNS proxy debug — DNS sorgu/yanit islemleri, DNS filtreleme kararlari. DNS bazli sorunlarda (domain cozumlenemiyor, yanlis IP donuyor)", sev: "w" },
  { cat: "UTM", code: "diagnose test application dnsproxy", desc: "DNS proxy test menusu — DNS cache, forwarding, statistics. Numara ile test calistirin. Cache flush icin de kullanilir", sev: "i" },
  { cat: "IPS", code: "diagnose ips filter set \"host <x.x.x.x> and port <port>\"", desc: "IPS debug filtresi — tcpdump syntax. Belirli IP/port icin IPS engine davranisini izlemek icin. Filtresiz cok yogun cikti!", sev: "i" },
  { cat: "IPS", code: "diagnose ips debug enable all", desc: "TUM IPS engine debug'unu acar — signature match, protocol decode, action (block/pass/reset). CPU yogun! Kisa sureli kullanin", sev: "w" },
  { cat: "IPS", code: "diagnose ips debug enable av", desc: "Sadece antivirus debug'unu acar — dosya tarama, virus tespit, karantina islemleri. Dosya download sorunlarinda", sev: "w" },
  { cat: "IPS", code: "diagnose ips debug status show", desc: "Aktif IPS debug ayarlarini gosterir — hangi modullerin debug'u acik", sev: "i" },
  { cat: "IPS", code: "diagnose ips session list", desc: "IPS engine tarafindan islenen aktif session'lar. Session bazli IPS detaylari: signature match durumu, inspection modu", sev: "i" },
  { cat: "IPS", code: "diagnose test application ipsmonitor 1", desc: "IPS engine durum bilgisi: running/not running, instance sayisi, her instance'in rolu (IPS/AV). 'not running' ise acil restart gerekir", sev: "i" },
  { cat: "IPS", code: "diagnose test application ipsmonitor 99", desc: "Tum IPS engine'leri yeniden baslatir. IPS crash veya donma durumunda kullanin. Kisa sureli inspection kesintisi olur. 97=start, 98=stop da var", sev: "e" },
  { cat: "WAD", code: "diagnose test application wad 1000", desc: "Tum WAD (Web Application Detection) worker process'leri listeler. Her worker'in PID, CPU, memory kullanimi. Proxy inspection engine'i", sev: "i" },
  { cat: "WAD", code: "diagnose test application wad 2", desc: "WAD toplam bellek kullanimi. Proxy-based inspection aktifse WAD onemli miktarda memory tuketir. Memory sorunu teshisi icin", sev: "i" },
  { cat: "WAD", code: "diagnose test application wad 99", desc: "TUM WAD process'leri restart. Proxy-based inspection gecici olarak DURUR. SSL inspection, explicit proxy etkilenir. Son care olarak", sev: "e" },
  { cat: "WAD", code: "diagnose wad debug display pid enable", desc: "WAD debug ciktisinda worker PID'sini gosterir. Birden fazla worker varsa hangi worker'in logunu gordugunuzu anlamak icin", sev: "i" },
  { cat: "WAD", code: "diagnose wad filter <filter>", desc: "WAD debug filtresi: src/dst IP, port, policy bazli. Proxy inspection sorunlarini belirli trafik icin izlemek icin", sev: "i" },
  { cat: "WAD", code: "diagnose wad filter list", desc: "Aktif WAD filtrelerini goster. Yeni filtre eklemeden once mevcut filtreleri kontrol edin", sev: "i" },
  { cat: "WAD", code: "diagnose wad filter clear", desc: "Tum WAD filtrelerini temizler. Debug sonrasi MUTLAKA calistirin", sev: "ok" },

  // ═════════════════════ SD-WAN ═════════════════════
  { cat: "SD-WAN", code: "diagnose sys sdwan health-check status", desc: "Health check sonuclari: state (alive/dead), packet-loss (%), latency (ms), jitter (ms), sla_map (SLA eslesmesi). dead=link down veya SLA karsilamiyor", sev: "i" },
  { cat: "SD-WAN", code: "diagnose sys sdwan service4", desc: "SD-WAN IPv4 kurallari: hangi trafik hangi member'a yonlendirilir, strategy (manual/best-quality/lowest-cost), member durumu ve secimi", sev: "i" },
  { cat: "SD-WAN", code: "diagnose sys sdwan service6", desc: "SD-WAN IPv6 kurallari — IPv4 ile ayni format. IPv6 SD-WAN trafik yonlendirme kurallari", sev: "i" },
  { cat: "SD-WAN", code: "diagnose sys sdwan member", desc: "SD-WAN member'lari: interface, gateway, priority, weight, volume ratio, session sayisi. Member status alive/dead. Weight dagilima gore trafik orani belirlenir", sev: "i" },
  { cat: "SD-WAN", code: "diagnose firewall proute list", desc: "SD-WAN policy route listesi — SD-WAN aktifse burada SD-WAN kurallari gorulur. used=0 ise kural eslesmiyor. Normal routing'den ONCE uygulanir", sev: "i" },
  { cat: "SD-WAN", code: "diagnose sys link-monitor status", desc: "Link monitoring (SD-WAN olmadan da calisir): her link'in durumu, latency, jitter. WAN link kalitesi izleme", sev: "i" },
  { cat: "SD-WAN", code: "diagnose sys link-monitor interface <interface>", desc: "Belirli interface'in link monitor detayi: health check hedefi, son kontrol zamani, ortalama latency/loss", sev: "i" },
  { cat: "SD-WAN", code: "diagnose debug application link-monitor -1", desc: "Link monitor debug — probe gonderme/alma, durum degisiklikleri (alive->dead/dead->alive). SD-WAN failover sorunlari icin", sev: "w" },

  // ═════════════════════ FEXT ═════════════════════
  { cat: "FEXT", code: "get system interface physical", desc: "FEXT interface'lerin fiziksel durumu. FortiGate'den bagimsiz olarak FEXT uzerindeki interface'leri gosterir", sev: "i" },
  { cat: "FEXT", code: "get system interface", desc: "FEXT uzerindeki tum interface'ler: LTE modem, WAN, LAN portlari. IP adresi ve status bilgisi", sev: "i" },
  { cat: "FEXT", code: "get system arp", desc: "FEXT ARP tablosu — LAN tarafindaki cihazlarin MAC/IP eslesmesi. FEXT arkasindaki cihaz erisim kontrolu icin", sev: "i" },
  { cat: "FEXT", code: "execute ping 192.0.2.5", desc: "FEXT'ten uzak hedefe ping. FEXT'in WAN/LTE erisimini dogrulamak icin. FortiGate'den FEXT uzerinden ping farkli sonuc verebilir", sev: "i" },
  { cat: "FEXT", code: "execute dhcp lease-list", desc: "FEXT DHCP server lease listesi: kimlere IP verilmis, lease suresi, MAC adresi. FEXT LAN tarafindaki cihaz envanteri", sev: "i" },
  { cat: "FEXT", code: "execute telnet 192.0.2.5", desc: "FEXT'ten uzak cihaza telnet. CPE/modem yonetimi icin. FEXT uzerinden L3 erisim testi", sev: "i" },
  { cat: "FEXT", code: "get system status", desc: "FEXT firmware versiyonu, model, seri no, uptime. FortiGate'in 'get system status'undan farkli — FEXT'in kendi durumu", sev: "i" },
  { cat: "FEXT", code: "get extender status", desc: "Extender baglanti durumu: connected/disconnected, sinyal gucu (dBm), operator (Turkcell/Vodafone), teknoloji (LTE/3G). -50/-75=iyi, -75/-90=zayif, >-90=kotu", sev: "i" },
  { cat: "FEXT", code: "get system version", desc: "FEXT firmware versiyonu. Guncelleme gerekip gerekmedigi kontrolu icin. FortiGate ile uyumlu versiyon olmali", sev: "i" },
  { cat: "FEXT", code: "config lte plan", desc: "LTE data plan konfigurasyonu: APN, monthly limit, overage action. 'show' ile mevcut plani gorun, 'set' ile degistirin", sev: "i" },
  { cat: "FEXT", code: "execute reboot", desc: "FEXT'i yeniden baslatir. LTE baglantisi KESILIR! Modem donma, sinyal sorunu sonrasi kullanin. FortiGate uzerinden de yapilabilir", sev: "e" },
  { cat: "FEXT", code: "execute exit", desc: "FEXT CLI'dan cikar ve FortiGate CLI'a doner. FEXT'e FortiGate uzerinden execute extender-cli <FEXT_SN> ile girilir", sev: "i" },

  // ═════════════════════ LOGGING ═════════════════════
  { cat: "Logging", code: "diagnose log test", desc: "Her kategoriden (traffic, event, utm) birer test log uretir. Log pipeline'in calistigini dogrulamak icin. FAZ/syslog'a ulasiyorsa OK", sev: "i" },
  { cat: "Logging", code: "execute log filter <filter>", desc: "Log filtreleme: category (traffic/event/utm), field (srcip/dstip/action/etc), view-lines (satir sayisi), start-line, device (memory/disk/fortianalyzer)", sev: "i" },
  { cat: "Logging", code: "execute log filter", desc: "Aktif log filtrelerini gosterir. Filtre yoksa tum loglar gorulur. Her yeni arama oncesi filtreleri temizleyin", sev: "i" },
  { cat: "Logging", code: "exec log display", desc: "Filtrelenmis loglari CLI'da gosterir. Her log satiri: date, time, logid, type, subtype, level, srcip, dstip, action, policyid bilgileri icerir", sev: "i" },
  { cat: "Logging", code: "execute log delete", desc: "Filtreye uyan loglari SILER. Disk/memory uzerindeki loglar icin gecerli. FAZ'daki loglar etkilenmez. GERI ALINAMAZ!", sev: "e" },
  { cat: "Logging", code: "execute log fortianalyzer test-connectivity", desc: "FAZ baglanti testi: Registration (registered/unregistered), Connection (allow/deny), OFTP session (connected/disconnected). Tum satirlar OK olmali", sev: "i" },
  { cat: "Logging", code: "show log syslogd setting", desc: "Syslog konfigurasyonu: server IP, port (default 514), facility, format (default/csv/cef), source-ip, status (enable/disable). Loglar syslog'a gidiyor mu kontrolu", sev: "i" },
  { cat: "Logging", code: "show log syslogd override-setting", desc: "VDOM bazli syslog override ayarlari. Multi-VDOM ortaminda her VDOM farkli syslog sunucusuna gonderebilir", sev: "i" },
  { cat: "Logging", code: "diagnose debug application miglogd -1", desc: "Log daemon debug — log yazma, FAZ/syslog gonderme islemleri. Log kaybi veya gecikme sorunlarinda. -1=maximum verbosity", sev: "w" },

  // ═════════════════════ FORTISWITCH ═════════════════════
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info mac-table", desc: "FortiSwitch MAC tablosu: port, VLAN, MAC, type (dynamic/static). Hangi cihaz hangi porta bagli gormek icin. Cihaz bulunamazsa burada kontrol edin", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info port-stats", desc: "Port istatistikleri: Rx/Tx packets/bytes, errors, drops, CRC. Errors/CRC>0 ise fiziksel sorun (kablo/port). High drops ise congestion", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info trunk status", desc: "Trunk (LAG/LACP) durumu: up/down, member portlar, LACP state. Trunk down ise member portlarin link durumunu kontrol edin", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info stp", desc: "STP durumu: port state (forwarding/blocking/disabled), root bridge, path cost. Blocking state ise loop onleme aktif veya topoloji sorunu", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info poe", desc: "PoE durumu: port, power (W), max, status (delivering/searching/disabled). Budget asilmissa yeni cihazlara guc verilmez", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info lldp", desc: "LLDP bilgisi: komsu cihaz adi, port, model. Topoloji kesfetme icin. Yanlis kablolama tespiti", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info igmp-snooping", desc: "IGMP snooping: multicast group, port uyelikleri. IPTV/multicast sorunlarinda hangi portun hangi gruba uye oldugu kontrolu", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose switch-controller switch-info 802.1X", desc: "802.1X NAC durumu: port, auth status (authorized/unauthorized), kullanici. Unauthorized ise RADIUS/cert sorunu olabilir", sev: "i" },
  { cat: "FortiSwitch", code: "execute switch-controller get-conn-status <SN>", desc: "FortiSwitch baglanti durumu (SN=seri numarasi): connected/disconnected, firmware, model. FortiLink kopuklugu kontrolu", sev: "i" },
  { cat: "FortiSwitch", code: "execute switch-controller diagnose-connection <SN>", desc: "FortiSwitch baglanti teshisi: FortiLink interface, authorization, management tunnel durumu. Detayli troubleshoot icin", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose netlink brctl list", desc: "FortiGate dahili software switch'leri: internal, lan gibi. Bridge interface'lerin member portlarini ve durumlarini gosterir", sev: "i" },
  { cat: "FortiSwitch", code: "diagnose netlink brctl name host <switch-name>", desc: "Belirli software switch'in forwarding (MAC) tablosu: MAC, port, age. L2 trafik yonlendirme kontrolu icin", sev: "i" },

  // ═════════════════════ FORTIGUARD ═════════════════════
  { cat: "FortiGuard", code: "diagnose autoupdate status", desc: "FortiGuard guncelleme durumu: son guncelleme zamani, sonraki planlanan guncelleme, baglanti durumu. 'Unreachable' ise internet/DNS kontrol edin", sev: "i" },
  { cat: "FortiGuard", code: "diagnose autoupdate versions", desc: "Lisans ve veritabani bilgileri: AV, IPS, App Control, Web Filter veritabani tarihleri. Expired lisanslar UTM ozelliklerini devre disi birakir", sev: "i" },
  { cat: "FortiGuard", code: "execute update-now", desc: "Manual FortiGuard guncelleme tetikler. AV/IPS/App imzalari hemen guncellenir. Internet erisimi gerektirir (update.fortiguard.net)", sev: "i" },
  { cat: "FortiGuard", code: "diagnose webfilter fortiguard statistics", desc: "Web filter rating cache istatistikleri: cache hit/miss, rating daemon durumu. Yuksek miss orani DNS/baglanti sorununa isaret edebilir", sev: "i" },
  { cat: "FortiGuard", code: "diagnose debug rating", desc: "FortiGuard web rating sunucu bilgisi: hangi rating sunucuya baglaniliyor, latency, durum. Web filter yavasliginda kontrol edin", sev: "i" },

  // ═════════════════════ SIP ═════════════════════
  { cat: "SIP", code: "diagnose sys sip status", desc: "SIP ALG (Application Layer Gateway) durumu: aktif session sayisi, session helper modu. VoIP sorunlarinda ilk kontrol noktasi", sev: "i" },
  { cat: "SIP", code: "diagnose sys sip mapping list", desc: "SIP NAT mapping listesi: ic/dis IP:port eslesmesi. SIP cihazi NAT arkasindaysa mapping dogru mu kontrolu. Tek yonlu ses sorunlarinda bakin", sev: "i" },
  { cat: "SIP", code: "diagnose sys sip dialog list", desc: "Aktif SIP diyalog/cagri listesi: Call-ID, from/to, state. Aktif VoIP cagrilarini gormek icin", sev: "i" },
  { cat: "SIP", code: "diagnose debug application sip -1", desc: "SIP ALG debug — SIP mesaj islemleri, NAT cevirisi, header modifikasyonu. Tek yonlu ses, cagri kurulamama sorunlarinda. Yogun cikti!", sev: "w" },
  { cat: "SIP", code: "diagnose sys sip-proxy calls list", desc: "SIP proxy modundaki aktif cagrilar. Session-helper degil proxy modu kullaniliyorsa bu komut gecerli", sev: "i" },
  { cat: "SIP", code: "diagnose sys sip-proxy stats", desc: "SIP proxy istatistikleri: toplam cagri, basarili/basarisiz, aktif cagri sayisi", sev: "i" },
  { cat: "SIP", code: "diagnose sys sip-proxy session list", desc: "SIP proxy session listesi: her session'in detayli bilgisi, media (RTP) port eslesmesi", sev: "i" },

  // ═════════════════════ ZTNA ═════════════════════
  { cat: "ZTNA", code: "diagnose endpoint fctems test-connectivity <EMS>", desc: "FortiClient EMS baglanti testi: EMS sunucusuna TCP erisim, sertifika dogrulama. ZTNA calisabilmesi icin EMS baglantisi sart", sev: "i" },
  { cat: "ZTNA", code: "execute fctems verify <EMS>", desc: "EMS sertifika dogrulama: sertifika zinciri gecerli mi kontrol eder. Sertifika hatasi ZTNA'yi kirar", sev: "i" },
  { cat: "ZTNA", code: "diagnose test application fcnacd 2", desc: "FortiClient NAC daemon — EMS baglanti detaylari: IP, port, durum, son sync zamani. ZTNA tag senkronizasyonu kontrolu", sev: "i" },
  { cat: "ZTNA", code: "diagnose firewall dynamic list", desc: "ZTNA security posture tag'leri: EMS'den alinan endpoint durumu tag'leri. Policy'lerde ZTNA tag eslesme kontrolu icin", sev: "i" },

  // ═════════════════════ TRAFFIC SHAPING ═════════════════════
  { cat: "Shaping", code: "diagnose firewall shaper traffic-shaper list", desc: "Tanimli traffic shaper'lar: isim, guaranteed/maximum bandwidth (kbps), priority, per-policy. Bant genisligi yonetimi kontrolu", sev: "i" },
  { cat: "Shaping", code: "diagnose firewall shaper traffic-shaper stats list", desc: "Traffic shaper istatistikleri: current bandwidth, drop sayisi, queued packets. Drop yuksekse shaper limiti yetersiz", sev: "i" },

  // ═════════════════════ CPU PROFILING ═════════════════════
  { cat: "Profiling", code: "diagnose sys profile cpumask <cpu_id>", desc: "Profil icin CPU core secimi. cpu_id: 0=ilk core. Belirli core'da bottleneck analizi icin", sev: "i" },
  { cat: "Profiling", code: "diagnose sys profile start", desc: "CPU profiling baslatir — kernel fonksiyonlarinin ne kadar sure harcadigini olcer. Performans analizi icin. CPU yuklenir!", sev: "w" },
  { cat: "Profiling", code: "diagnose sys profile stop", desc: "CPU profiling durdurur. Ardindan 'show detail/order' ile sonuclari gorun", sev: "ok" },
  { cat: "Profiling", code: "diagnose sys profile module", desc: "Kernel modulleri ve CPU kullanim dagilimlari. Hangi modul (networking, crypto, etc.) en cok CPU kullaniyor", sev: "i" },
  { cat: "Profiling", code: "diagnose sys profile show detail", desc: "Detayli profil sonuclari: her fonksiyonun harcadigi CPU suresi. Performans bottleneck root cause analizi. TAC'a gondermek icin", sev: "i" },

  // ═════════════════════ LDAP CONFIG ═════════════════════
  { cat: "LDAP", code: "edit AD_VPN", desc: "'config user ldap' icerisinde: LDAP sunucu duzenleme. AD_VPN = sunucu konfigurasyondaki isim. Tab ile otomatik tamamlama", sev: "i" },
  { cat: "LDAP", code: "set source-ip 10.25.0.2", desc: "LDAP sorgularinda kullanilacak kaynak IP. Multi-interface ortamda LDAP sunucusuna dogru interface'den cikmayi saglar. Routing/firewall source-ip eslesmeli", sev: "i" },

  // ═════════════════════ FORTIAP ═════════════════════
  { cat: "FortiAP", code: "diagnose wireless-controller wlac -c wtp", desc: "FortiAP cihaz listesi: SN, model, IP, state (online/offline/rogue), uptime, firmware. Bagli AP'lerin genel durumu", sev: "i" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac -d wtp", desc: "FortiAP detayli bilgi: her AP'nin tum konfigurasyonu, radio ayarlari, kanal, guc, client sayisi", sev: "i" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac -c sta", desc: "Bagli wireless client listesi: MAC, IP, SSID, signal, AP adi, VLAN, bandwidth", sev: "i" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac -d sta", desc: "Wireless client detayli bilgi: her client'in baglanti detaylari, SNR, data rate, channel", sev: "i" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac help", desc: "Wireless controller debug secenekleri listesi. Tum alt komutlari gosterir", sev: "i" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac sta_filter <mac> 255", desc: "Belirli client MAC'ine debug filtresi koy. Sadece bu client'in debug ciktisi gorulur", sev: "i" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac sta_filter clear", desc: "Client debug filtresini temizle", sev: "ok" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac wtp_filter <SN> 0-<ip>:5246 255", desc: "Belirli AP'ye debug filtresi. SN=AP seri numarasi, IP=AP IP. Sadece bu AP'nin debug ciktisi", sev: "i" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac wtp_filter clear", desc: "AP debug filtresini temizle", sev: "ok" },
  { cat: "FortiAP", code: "diagnose wireless-controller wlac -c vap", desc: "VAP (Virtual Access Point) listesi: SSID'ler, VLAN, security mode, bagli client sayisi", sev: "i" },
  { cat: "FortiAP", code: "diagnose debug application cw_acd 0x7ff", desc: "Wireless controller daemon debug baslat. AP discovery, join, konfigurasyonu izleme. Cok yogun cikti!", sev: "w" },
  { cat: "FortiAP", code: "diagnose debug application cw_acd 0", desc: "Wireless controller debug'u kapat", sev: "ok" },
  { cat: "FortiAP", code: "config wireless-controller wtp", desc: "FortiAP konfigurasyonu: authorize, firmware, radio ayarlari. 'edit <SN>' ile belirli AP secilir", sev: "i" },
  { cat: "FortiAP", code: "config wireless-controller vap", desc: "VAP (SSID) konfigurasyonu: SSID adi, security (wpa2/wpa3), VLAN, schedule, rate-limit", sev: "i" },
  { cat: "FortiAP", code: "config wireless-controller wtp-profile", desc: "AP profil konfigurasyonu: radio1/radio2, kanal, guc, band (2.4/5GHz), DTIM, beacon interval", sev: "i" },
  { cat: "FortiAP", code: "execute wireless-controller restart-acd", desc: "Wireless controller daemon restart. TUM AP'ler gecici olarak kopar ve yeniden baglanir!", sev: "e" },
  { cat: "FortiAP", code: "get wireless-controller wtp-status", desc: "FortiAP durum ozeti: authorize edilmis AP sayisi, online/offline/rogue sayilari", sev: "i" },

  // ═════════════════════ MULTICAST ═════════════════════
  { cat: "Multicast", code: "get router info multicast igmp interface", desc: "IGMP interface istatistikleri: hangi interface'lerde IGMP aktif, join/leave sayilari, query interval. Multicast routing teshisi", sev: "i" },
  { cat: "Multicast", code: "get router info multicast igmp groups", desc: "Uye olunan multicast gruplari: grup adresi (224.x.x.x), interface, uye sayisi. IPTV/video streaming sorunlarinda", sev: "i" },
  { cat: "Multicast", code: "get router info multicast pim sparse-mode rp-mapping", desc: "PIM RP (Rendezvous Point) eslemesi: hangi multicast grubunun RP'si kim. RP erisimi yoksa multicast calismaz", sev: "i" },
  { cat: "Multicast", code: "get router info multicast pim sparse-mode table", desc: "PIM sparse-mode routing tablosu: (S,G) ve (*,G) kayitlari. Multicast trafik akisinin yolunu gosterir", sev: "i" },
];

/* ───────── SECTIONS LIST ───────── */
const SECTIONS = [
  "dashboard","commands","sniffer","debugflow","vpn","ha",
  "routing","interfaces","arpping","system","session","policy",
  "objects","users","utm","sdwan","fext","logging","managed","fortiap","scenarios","github"
];

/* ───────── TROUBLESHOOTING SCENARIOS ───────── */
const SCENARIOS = [
  {
    title: "IPsec VPN Tunnel Gelmiyorsa",
    severity: "err",
    symptom: "VPN tunnel UP olmuyor, Phase 1 veya Phase 2 kurulmuyor.",
    steps: [
      { code: "get vpn ipsec tunnel summary", desc: "Tunnel durumunu kontrol et" },
      { code: "diagnose vpn ike gateway list name <tunnel_name>", desc: "Phase 1 (IKE) durumunu incele" },
      { code: "diagnose vpn tunnel list name <tunnel_name>", desc: "Phase 2 durumunu incele" },
      { code: "diagnose vpn ike log-filter dst-addr4 <peer_ip>", desc: "IKE debug icin IP filtresi koy" },
      { code: "diagnose debug application ike -1", desc: "IKE debug baslat" },
      { code: "diagnose debug enable", desc: "Debug ciktisini etkinlestir" },
      { code: "diagnose sniffer packet any 'host <peer_ip> and port 500' 4 0 1", desc: "IKE trafigini sniffer ile kontrol et" },
    ],
    hint: "Pre-shared key, encryption/hash algoritmalari, Phase 2 subnet'leri her iki tarafta eslesmelidir. NAT-T icin port 4500'u de kontrol edin."
  },
  {
    title: "SSL VPN Kullanicisi Baglanamiyorsa",
    severity: "warn",
    symptom: "SSL VPN kullanicisi portal'a ulasamiyor veya tunnel kurulamiyor.",
    steps: [
      { code: "get vpn ssl monitor", desc: "Bagli kullanicilari kontrol et" },
      { code: "get vpn ssl settings", desc: "SSL VPN ayarlarini kontrol et (port, interface)" },
      { code: "diagnose vpn ssl list", desc: "SSL VPN session'lari listele" },
      { code: "diagnose debug application sslvpn -1", desc: "SSL VPN debug baslat" },
      { code: "diagnose debug enable", desc: "Debug etkinlestir" },
      { code: "diagnose firewall auth list", desc: "Kullanici auth durumunu kontrol et" },
    ],
    hint: "SSL VPN portal/realm mapping, firewall policy (sslvpn interface), IP pool tukenmesi kontrol edilmeli."
  },
  {
    title: "Yuksek CPU Kullanimi",
    severity: "err",
    symptom: "Cihaz yavasliyor, CPU %80+ gosteriyor.",
    steps: [
      { code: "get system performance status", desc: "CPU/memory ozeti" },
      { code: "diagnose sys top", desc: "En cok CPU kullanan process" },
      { code: "diagnose sys top-summary", desc: "Process ozeti" },
      { code: "get system session status", desc: "Toplam session sayisi" },
      { code: "diagnose sys mpstat 1", desc: "Core bazli CPU kullanimi" },
      { code: "diagnose firewall packet distribution", desc: "Paket dagilimi" },
    ],
    hint: "IPS engine (ipsengine), proxy (WAD), veya session overflow genellikle yuksek CPU'nun sebebidir. Conserve mode'a girmemek icin session limit'leri kontrol edin."
  },
  {
    title: "Trafik Gecmiyorsa (Debug Flow)",
    severity: "err",
    symptom: "Kullanici internete cikamiyorsa veya belirli hedefe ulasamiyorsa.",
    steps: [
      { code: "diagnose debug flow filter addr <kaynak_ip>", desc: "Kaynak IP filtresi koy" },
      { code: "diagnose debug flow show function-name enable", desc: "Fonksiyon adlarini goster" },
      { code: "diagnose debug flow show console enable", desc: "Konsol ciktisini ac" },
      { code: "diagnose debug enable", desc: "Debug etkinlestir" },
      { code: "diagnose debug flow trace start 100", desc: "100 satir debug al" },
      { code: "diagnose debug disable", desc: "Bitince debug kapat" },
      { code: "diagnose debug flow filter clear", desc: "Filtreleri temizle" },
    ],
    hint: "Debug flow ciktisinda 'Denied by forward policy check' gorurseniz firewall policy eksiktir. 'iprope_in_check() check failed' mesaji da policy eslesme sorununa isaret eder. 'addr+port' filtreleri AND mantigi ile calisir."
  },
  {
    title: "HA Failover / Gecis Testi",
    severity: "warn",
    symptom: "HA cluster'da master/slave gecisi yapilmak isteniyor veya sorun var.",
    steps: [
      { code: "get system status", desc: "Seri numarasi ile hangi cihazda oldugunuzu dogrulayin" },
      { code: "get system ha status", desc: "HA durum bilgisi" },
      { code: "execute ha manage 0", desc: "Diger member'a atla" },
      { code: "get system status", desc: "Yedek cihazin seri numarasini dogrulayin" },
      { code: "config system interface", desc: "Interface config moduna girin" },
      { code: "edit wan1", desc: "wan1 interface'ini secin" },
      { code: "set status down", desc: "Interface'i DOWN yapin (failover tetiklenir)" },
      { code: "set status up", desc: "Interface'i tekrar UP yapin" },
    ],
    hint: "Bu islem slave cihaza master cihazdan atlayip wan1 portunu down/up yaparak test eder. Once get system status ile seri numaralarindan hangi cihazda oldugunuzu dogrulayin!"
  },
  {
    title: "Routing Sorunu — Trafik Yanlis Yoldan Gidiyorsa",
    severity: "warn",
    symptom: "Trafik beklenmeyen interface'den cikiyor veya hedefe ulasamiyor.",
    steps: [
      { code: "get router info routing-table all", desc: "Tam routing tablosuna bak" },
      { code: "get router info routing-table database", desc: "Routing veritabanini kontrol et" },
      { code: "get router info kernel", desc: "Kernel routing tablosuna bak" },
      { code: "diagnose firewall proute list", desc: "Policy route (PBR/SD-WAN) kontrol et" },
      { code: "diagnose ip rtcache list", desc: "Route cache kontrol et" },
      { code: "diagnose ip route list", desc: "IP route listesi" },
      { code: "show router static", desc: "Statik route konfigurasyonu" },
    ],
    hint: "Policy route'lar statik route'lardan once uygulanir. SD-WAN aktifse diagnose sys sdwan ile kontrol edin."
  },
  {
    title: "Session / Baglanti Sorunlari",
    severity: "warn",
    symptom: "Belirli IP veya servis icin baglanti kurulamiyor / kesiyor.",
    steps: [
      { code: "get system session status", desc: "Session sayisi kontrol (limit asildiysa sorun)" },
      { code: "diagnose sys session filter dst <hedef_ip>", desc: "Hedef IP icin session filtrele" },
      { code: "diagnose sys session list", desc: "Filtrelenmis session'lari goster" },
      { code: "diagnose sniffer packet any 'host <ip>' 4 0", desc: "Trafik var mi sniffer ile kontrol" },
      { code: "diagnose debug flow filter addr <ip>", desc: "Debug flow ile paket izle" },
      { code: "diagnose debug flow trace start 50", desc: "50 satir debug al" },
    ],
    hint: "Session limit asildiysa 'conserve mode' mesaji gorursunuz. Session-ttl ile timeout'lari kontrol edin."
  },
  {
    title: "FortiAnalyzer Baglanti Sorunu",
    severity: "info",
    symptom: "Loglar FortiAnalyzer'a gitmiyor.",
    steps: [
      { code: "execute log fortianalyzer test-connectivity", desc: "FAZ baglanti testi" },
      { code: "show log syslogd setting", desc: "Syslog ayarlarini kontrol et" },
      { code: "diagnose debug application miglogd -1", desc: "Logging debug baslat" },
      { code: "diagnose debug enable", desc: "Debug etkinlestir" },
    ],
    hint: "FortiAnalyzer IP, port 514 (syslog) veya 443 (OFTP) erisimi kontrol edilmeli."
  },
  {
    title: "LDAP Authentication Testi",
    severity: "info",
    symptom: "LDAP kullanici dogrulama calismiyorsa.",
    steps: [
      { code: "diagnose test authserver ldap <server_name> <username> <password>", desc: "LDAP sunucusuna test sorgusu" },
      { code: "show user ldap", desc: "LDAP konfig kontrol" },
      { code: "diagnose debug application fnbamd -1", desc: "Auth debug baslat" },
      { code: "diagnose debug enable", desc: "Debug etkinlestir" },
    ],
    hint: "Sifre musteriden istenir. source-ip ayari dogru olmalidir (set source-ip x.x.x.x)."
  },
  {
    title: "Sniffer ile Paket Yakalama",
    severity: "info",
    symptom: "Trafik akisini anlamak icin paket yakalama gerekiyorsa.",
    steps: [
      { code: "diagnose sniffer packet any 'host <ip>' 4 0", desc: "Temel: IP bazli yakalama" },
      { code: "diagnose sniffer packet any 'host <ip> and port 443' 4 0", desc: "IP + Port filtreli" },
      { code: "diagnose sniffer packet any 'src host <src_ip> and dst host <dst_ip>' 4 a", desc: "Kaynak+Hedef filtreli (absolute timestamp)" },
      { code: "diagnose sniffer packet any 'host <ip>' 6", desc: "Verbose 6: hex+ascii detay" },
    ],
    hint: "Verbose seviyeleri: 1=IP header, 2=+IP payload, 3=+ether header, 4=+interface name, 5=+hex, 6=+hex+ascii. 'a' parametresi absolute timestamp verir."
  },
];

/* ═══════════════════════════════════════════════════════════════
   ADIM ADIM YAPILANDIRMA / HATA GIDERME REHBERLERI
   Sirali konfigurasyon + debug cikti ornekleri
   ═══════════════════════════════════════════════════════════════ */
const CONFIG_GUIDES = {
  "vpn": [
    { title: "IPsec Site-to-Site VPN Tam Yapilandirma", steps: [
      "! === ADIM 1: Phase 1 (IKE) ===",
      "config vpn ipsec phase1-interface",
      " edit S_SITE_DSL_0",
      "  set interface wan1",
      "  set ike-version 2",
      "  set peertype any",
      "  set remote-gw 203.0.113.1",
      "  set psksecret MyPreSharedKey123",
      "  set proposal aes256-sha256",
      "  set dhgrp 14",
      "  set dpd on-idle",
      "  set dpd-retryinterval 10",
      "  set dpd-retrycount 3",
      " next",
      "end",
      "!",
      "! === ADIM 2: Phase 2 (IPsec SA) ===",
      "config vpn ipsec phase2-interface",
      " edit S_SITE_DSL_0_P2",
      "  set phase1name S_SITE_DSL_0",
      "  set proposal aes256-sha256",
      "  set dhgrp 14",
      "  set pfs enable",
      "  set src-subnet 10.200.1.0 255.255.255.0",
      "  set dst-subnet 10.100.1.0 255.255.255.0",
      " next",
      "end",
      "!",
      "! === ADIM 3: Firewall Policy (tunnel trafigine izin) ===",
      "config firewall policy",
      " edit 0",
      "  set name VPN_TO_SUBE",
      "  set srcintf port5",
      "  set dstintf S_SITE_DSL_0",
      "  set srcaddr LAN_SUBNET",
      "  set dstaddr SUBE_SUBNET",
      "  set action accept",
      "  set schedule always",
      "  set service ALL",
      "  set logtraffic all",
      " next",
      "end",
      "!",
      "! === ADIM 4: Static Route (tunnel uzerinden) ===",
      "config router static",
      " edit 0",
      "  set dst 10.100.1.0 255.255.255.0",
      "  set device S_SITE_DSL_0",
      " next",
      "end",
    ], note: "Sira: 1) Phase1 (IKE parametreleri + peer IP + PSK), 2) Phase2 (IPsec SA + src/dst subnet), 3) Firewall policy (HER IKI YON icin ayri policy!), 4) Static route (tunnel interface uzerinden). Karsi tarafta DA ayni parametreler MIRROR olmali (src/dst ters)." },

    { title: "IPsec VPN Debug — Cikti Ornekleri ve Yorumlama", steps: [
      "! === Phase 1 Debug ===",
      "diagnose vpn ike log-filter dst-addr4 203.0.113.1",
      "diagnose debug application ike -1",
      "diagnose debug enable",
      "!",
      "! BASARILI Phase 1 ciktisi:",
      "! ike 0:S_SITE_DSL_0: created connection",
      "! ike 0:S_SITE_DSL_0: IKE SA proposal: AES256-SHA256-DH14",
      "! ike 0:S_SITE_DSL_0: established IKE SA",
      "!   -> Phase 1 TAMAMLANDI (basarili!)",
      "!",
      "! BASARISIZ ornekler:",
      "! 'no proposal chosen' = encryption/hash/DH UYUSMAZ",
      "!   -> COZUM: Phase1'de proposal, dhgrp ayni olmali her iki tarafta",
      "! 'pre-shared key does not match' = PSK YANLIS",
      "!   -> COZUM: psksecret kontrol, bosluk/buyuk-kucuk harf",
      "! 'peer not reachable' = Karsi tarafa ULASILAMADI",
      "!   -> COZUM: ping <remote-gw>, routing, WAN interface kontrol",
      "! 'negotiation timeout' = Yanit GELMEDI",
      "!   -> COZUM: UDP 500/4500 acik mi? Karsi taraf UP mi?",
      "! 'received notify: AUTHENTICATION_FAILED' = Kimlik dogrulama HATASI",
      "!   -> COZUM: PSK veya sertifika kontrol",
      "!",
      "! === Phase 2 Debug ===",
      "! 'phase2 sa not found' = Phase 2 KURULAMADI",
      "!   -> COZUM: Phase2 src-subnet/dst-subnet eslesmesi kontrol",
      "!   -> Taraf A src=10.200.1.0, dst=10.100.1.0",
      "!   -> Taraf B src=10.100.1.0, dst=10.200.1.0 (MIRROR!)",
      "!",
      "! === Bitince Debug Kapat ===",
      "diagnose debug disable",
      "diagnose debug reset",
    ], note: "IPsec en yaygin 5 hata: 1) no proposal chosen (Phase1 mismatch), 2) PSK mismatch, 3) peer not reachable (routing/firewall), 4) Phase2 subnet mismatch, 5) Firewall policy eksik (tunnel trafikine izin verilmemis). HER ZAMAN her iki tarafi da kontrol edin!" },

    { title: "SSL VPN Tam Yapilandirma", steps: [
      "! === ADIM 1: SSL VPN Portal ===",
      "config vpn ssl web portal",
      " edit full-access",
      "  set tunnel-mode enable",
      "  set web-mode enable",
      "  set split-tunneling enable",
      "  set split-tunneling-routing-address 10.200.0.0 255.255.0.0",
      " next",
      "end",
      "!",
      "! === ADIM 2: Kullanici Grubu ===",
      "config user group",
      " edit SSL_VPN_USERS",
      "  set member user1 user2",
      " next",
      "end",
      "!",
      "! === ADIM 3: SSL VPN Ayarlari ===",
      "config vpn ssl settings",
      " set servercert Fortinet_Factory",
      " set tunnel-ip-pools SSLVPN_POOL",
      " set source-interface wan1",
      " set source-address all",
      " set default-portal full-access",
      " set port 10443",
      " append authentication-rule",
      "  set groups SSL_VPN_USERS",
      "  set portal full-access",
      " end",
      "end",
      "!",
      "! === ADIM 4: IP Pool ===",
      "config firewall address",
      " edit SSLVPN_POOL",
      "  set type iprange",
      "  set start-ip 10.50.100.1",
      "  set end-ip 10.50.100.100",
      " next",
      "end",
      "!",
      "! === ADIM 5: Firewall Policy ===",
      "config firewall policy",
      " edit 0",
      "  set name SSLVPN_TO_LAN",
      "  set srcintf ssl.root",
      "  set dstintf port5",
      "  set srcaddr SSLVPN_POOL",
      "  set dstaddr LAN_SUBNET",
      "  set action accept",
      "  set schedule always",
      "  set service ALL",
      "  set groups SSL_VPN_USERS",
      " next",
      "end",
    ], note: "Sira: 1) Portal (tunnel/web mode, split-tunnel), 2) User group, 3) SSL VPN settings (port, cert, pool, auth-rule), 4) IP pool (SSLVPN kullanicilarina verilecek IP'ler), 5) Firewall policy (ssl.root -> LAN). Port 443 kullaniyorsaniz admin GUI portuyla catisabilir — farkli port kullanin (10443 gibi)." },
  ],
  "ha": [
    { title: "HA Active-Passive Tam Yapilandirma", steps: [
      "! === HER IKI CIHAZDA AYNI (sadece priority farkli) ===",
      "!",
      "! ADIM 1: HA Konfigurasyonu",
      "config system ha",
      " set mode a-p",
      " set group-name FG-HA-CLUSTER",
      " set group-id 1",
      " set password haSecretPass123",
      " set hbdev port1 50 port2 50",
      " set session-pickup enable",
      " set override disable",
      " set priority 200",
      "   ! (Master icin 200, Slave icin 100)",
      " set monitor port3 port4 wan1 wan2",
      " set pingserver-monitor-interface wan1",
      " set pingserver-slave-force-reset enable",
      "end",
      "!",
      "! === HA Sonrasi Kontrol ===",
      "get system ha status",
      "diagnose sys ha checksum cluster",
      "! Checksum'lar AYNI olmali — farkli ise sync sorunu",
    ], note: "Sira: 1) mode a-p (Active-Passive), 2) group-name/id/password (her iki tarafta AYNI), 3) hbdev = heartbeat interface'leri (fiziksel kablo ile bagli olmali!), 4) priority (yuksek = master), 5) monitor = izlenecek interface'ler (down olursa failover). override disable = mevcut master kalir (preempt yok)." },

    { title: "HA Failover Test ve Hata Giderme", steps: [
      "! === FAILOVER TEST PROSEDURU ===",
      "! 1. Once HA durumunu dogrula",
      "get system ha status",
      "get system status",
      "! Seri numarasindan hangi cihazda oldugunuzu dogrulayin!",
      "!",
      "! 2. Config sync durumu",
      "diagnose sys ha checksum cluster",
      "! Iki cihazin checksum'lari AYNI olmali",
      "! FARKLI ise: diagnose sys ha checksum recalculate",
      "!",
      "! 3. Slave cihaza atla",
      "execute ha manage 0",
      "get system status",
      "! Seri numarasindan slave'de oldugunuzu dogrulayin",
      "!",
      "! 4. WAN interface down/up (failover tetikleme)",
      "config system interface",
      " edit wan1",
      "  set status down",
      " end",
      "! Failover tetiklendi mi kontrol edin",
      "! Sonra tekrar UP yapin:",
      "config system interface",
      " edit wan1",
      "  set status up",
      " end",
      "!",
      "! === HA DEBUG ===",
      "! Failover sebebini anlamak icin:",
      "diagnose sys ha history read",
      "! Son failover olaylari ve sebepleri",
      "!",
      "diagnose debug application hatalk -1",
      "diagnose debug enable",
      "! Heartbeat mesajlarini izle:",
      "! state=work = normal, chg_time = son failover zamani",
      "! Heartbeat gelmiyorsa = heartbeat kablo/port sorunu",
      "diagnose debug disable",
    ], note: "HA debug mesajlari: 'state/chg_time/now=2(work)' = calisiyor. 'state=1(init)' = baslatiliyor. Failover sebepleri: 1) Monitor interface down, 2) Heartbeat kaybi, 3) Memory/CPU threshold, 4) Admin failover (execute ha manage). override enable ise yuksek priority HER ZAMAN master olur." },
  ],
  "debugflow": [
    { title: "Debug Flow — Tam Surec ve Cikti Yorumlama", steps: [
      "! === SUREC: Trafik neden gecmiyor? ===",
      "!",
      "! ADIM 1: Filtre koy (ZORUNLU!)",
      "diagnose debug flow filter addr 10.200.1.50",
      "diagnose debug flow filter port 443",
      "! addr + port = AND mantigi (ikisi de eslesmeli)",
      "!",
      "! ADIM 2: Fonksiyon isimleri ac (onemli!)",
      "diagnose debug flow show function-name enable",
      "diagnose debug flow show console enable",
      "!",
      "! ADIM 3: Debug baslat",
      "diagnose debug enable",
      "diagnose debug flow trace start 100",
      "!",
      "! === CIKTI YORUMLAMA ===",
      "!",
      "! 'received a packet(proto=6, 10.200.1.50:51234->93.184.216.34:443) from port5'",
      "!   -> Paket ALINDI, port5 interface'inden geldi",
      "!",
      "! 'find a route: flag=00000000 gw-93.184.216.34 via wan1'",
      "!   -> Route BULUNDU, wan1'den cikacak (IYI!)",
      "!",
      "! 'Allowed by Policy-5: SNAT'",
      "!   -> Policy 5 IZIN VERDI ve SNAT uygulandi (IYI!)",
      "!",
      "! 'Denied by forward policy check'",
      "!   -> ENGELLENDI! Hicbir policy eslemedi. Policy EKLEYIN!",
      "!",
      "! 'iprope_in_check() check failed, drop'",
      "!   -> Internal policy check BASARISIZ. Policy/route kontrol edin",
      "!",
      "! 'no matching route, drop'",
      "!   -> Route YOK! Hedef icin static route veya default route ekleyin",
      "!",
      "! 'reverse path check fail, drop'",
      "!   -> RPF (anti-spoofing) DROP. Kaynak IP'nin gelme yonu yanlis",
      "!",
      "! 'blocked by ftgd'",
      "!   -> FortiGuard web filter ENGELLEDI. URL kategori kontrol",
      "!",
      "! 'no session matched'",
      "!   -> Mevcut session YOK. Asimetrik routing olabilir",
      "!",
      "! === BITINCE KAPAT ===",
      "diagnose debug disable",
      "diagnose debug flow trace stop",
      "diagnose debug flow filter clear",
      "diagnose debug reset",
    ], note: "Debug flow sirasi: 1) received (paket alindi), 2) find a route (routing), 3) Allowed/Denied by Policy (firewall), 4) SNAT/DNAT (NAT). Bu siraya gore sorunun hangi asamada oldugunu anlarsiniz. 'Denied' = policy eksik. 'no route' = routing eksik. 'reverse path' = asimetrik routing." },
  ],
  "sniffer": [
    { title: "Sniffer — Farkli Senaryolar icin Ornek Komutlar", steps: [
      "! === Senaryo 1: Temel baglanti kontrolu ===",
      "diagnose sniffer packet any 'host 10.200.1.50' 4 0",
      "! Trafik var mi yok mu? Verbose 4 = interface adi gorunur",
      "!",
      "! === Senaryo 2: Belirli servis kontrolu ===",
      "diagnose sniffer packet any 'host 10.200.1.50 and port 443' 4 100",
      "! HTTPS trafigi. 100 paket yakala sonra dur",
      "!",
      "! === Senaryo 3: VPN IKE kontrolu ===",
      "diagnose sniffer packet wan1 'host 203.0.113.1 and port 500' 4 0 a",
      "! IKE (UDP 500) trafigi. wan1'den. 'a' = absolute timestamp",
      "! NAT-T icin port 4500 de ekleyin: 'port 500 or port 4500'",
      "!",
      "! === Senaryo 4: Tek yonlu trafik kontrolu (asimetrik?) ===",
      "diagnose sniffer packet any 'src host 10.200.1.50 and dst host 10.100.1.10' 4 0",
      "! Sadece A->B yonu. Karsi yon icin src/dst ters cevirip tekrar calistirin",
      "!",
      "! === Senaryo 5: PCAP dosyasina kaydet ===",
      "diagnose sniffer packet any 'host 10.200.1.50' 6 1000 l",
      "! Verbose 6 + 1000 paket + local timestamp",
      "! CLI ciktisini kopyalayip Wireshark'ta acabilirsiniz",
      "!",
      "! === CIKTI YORUMLAMA ===",
      "! SYN -> SYN-ACK -> ACK = 3-way handshake TAMAMLANDI (IYI!)",
      "! SYN -> (yanit yok) = Karsi taraf yanit VERMIYOR (firewall/down)",
      "! SYN -> RST = Port KAPALI veya firewall REJECT ediyor",
      "! Tek yonlu trafik = Asimetrik routing (giden var, gelen yok)",
    ], note: "Sniffer filtre syntax'i = BPF (Berkeley Packet Filter). Operatorler: host, src host, dst host, port, src port, dst port, and, or, not. Verbose 4 en cok kullanilan — interface adi gosterir. Verbose 6 hex+ASCII dump (en detayli). 'any' = tum interface, wan1/port5 = belirli interface." },
  ],
  "routing": [
    { title: "OSPF Yapilandirma (FortiGate)", steps: [
      "config router ospf",
      " set router-id 1.1.1.1",
      " config area",
      "  edit 0.0.0.0",
      "  next",
      "  edit 0.0.0.1",
      "   set stub-type summary",
      "  next",
      " end",
      " config ospf-interface",
      "  edit port5_ospf",
      "   set interface port5",
      "   set dead-interval 40",
      "   set hello-interval 10",
      "   set priority 1",
      "   set cost 10",
      "   set network-type point-to-point",
      "  next",
      " end",
      " config network",
      "  edit 1",
      "   set prefix 10.200.1.0 255.255.255.0",
      "   set area 0.0.0.0",
      "  next",
      " end",
      " config redistribute connected",
      "  set status enable",
      " end",
      " set default-information-originate always",
      "end",
    ], note: "FortiGate OSPF yapisi: router ospf > area > ospf-interface > network > redistribute. IOS'tan farki: network komutu wildcard degil subnet mask kullanir. ospf-interface ile per-interface ayar yapilir. default-information-originate = default route advertise." },

    { title: "BGP Yapilandirma (FortiGate)", steps: [
      "config router bgp",
      " set as 65001",
      " set router-id 1.1.1.1",
      " set bestpath-as-path-ignore disable",
      " config neighbor",
      "  edit 203.0.113.1",
      "   set remote-as 65002",
      "   set password bgpSecret123",
      "   set soft-reconfiguration enable",
      "   set prefix-list-in ALLOWED_IN",
      "   set route-map-in BGP_IN_MAP",
      "   set route-map-out BGP_OUT_MAP",
      "   set maximum-prefix 1000",
      "   set maximum-prefix-warning-only enable",
      "  next",
      " end",
      " config network",
      "  edit 1",
      "   set prefix 10.200.0.0 255.255.0.0",
      "  next",
      " end",
      " config redistribute connected",
      "  set status enable",
      "  set route-map REDISTRIBUTE_MAP",
      " end",
      "end",
    ], note: "FortiGate BGP: router bgp > as > neighbor (edit IP) > remote-as + ayarlar > network > redistribute. IOS'tan farki: neighbor IP direkt edit ile girilir. route-map ve prefix-list ayri konfigure edilir. soft-reconfiguration = policy degisikliginde session kirmadan uygula." },

    { title: "Static Route + PBR (Policy Route)", steps: [
      "! === Static Route ===",
      "config router static",
      " edit 0",
      "  set dst 10.100.0.0 255.255.0.0",
      "  set gateway 10.60.216.196",
      "  set device wan1",
      "  set distance 10",
      "  set comment SUBE_ROUTE",
      " next",
      "end",
      "!",
      "! === Default Route ===",
      "config router static",
      " edit 0",
      "  set dst 0.0.0.0 0.0.0.0",
      "  set gateway 203.0.113.1",
      "  set device wan1",
      " next",
      "end",
      "!",
      "! === Policy Route (PBR) ===",
      "config router policy",
      " edit 1",
      "  set input-device port5",
      "  set srcaddr 10.200.1.0/24",
      "  set dstaddr 0.0.0.0/0",
      "  set output-device wan2",
      "  set gateway 198.51.100.1",
      " next",
      "end",
      "! PBR normal routing'den ONCE uygulanir!",
      "! Belirli subnet'in trafigini farkli WAN'dan cikarma",
    ], note: "FortiGate routing: static > distance (dusuk=oncelikli). PBR (policy route) normal route'tan ONCE uygulanir. SD-WAN aktifse PBR yerine SD-WAN rule kullanilir. diagnose firewall proute list ile PBR kontrol edin." },
  ],
  "system": [
    { title: "Conserve Mode Kontrolu ve Onleme", steps: [
      "! === Conserve Mode Nedir? ===",
      "! Memory %88 doluluga ulasinca FortiGate conserve mode'a girer",
      "! Conserve mode'da yeni session KABUL EDILMEZ!",
      "! %95'te session DROP baslar, %82'ye dusunce cikar",
      "!",
      "! === Kontrol ===",
      "get system performance status",
      "! Memory used > %88 ise TEHLIKE! idle < %30 ise CPU SORUN",
      "!",
      "diagnose sys top",
      "! Hangi process memory/CPU yiyor? (m tusu = memory sirala)",
      "! ipsengine = IPS/AV yogun",
      "! wad = proxy inspection yogun",
      "! miglogd = log yazma yogun (FAZ baglanti sorunu?)",
      "!",
      "diagnose hardware sysinfo memory",
      "! MemFree + Buffers + Cached = kullanilabilir bellek",
      "!",
      "! === Onleme ===",
      "! 1. Session TTL dusurme (session sayisini azalt):",
      "config system session-ttl",
      " set default 1800",
      "end",
      "! 2. Gereksiz UTM profilleri kaldir",
      "! 3. Proxy-based yerine flow-based inspection kullan",
      "! 4. Session limit kontrol: get system session status",
    ], note: "Conserve mode esikleri: %88=giris (red), %82=cikis (green), %95=session drop (extreme). get system performance status ile anlik kontrol. diagnose sys top ile CPU/memory yiyen process'i bulun. Cozum: UTM hafifllet, session TTL dusur, proxy->flow gecis." },

    { title: "Firmware Upgrade Oncesi/Sonrasi Kontrol Listesi", steps: [
      "! ═══════════════════════════════════════",
      "! FIRMWARE UPGRADE ONCESI (PRE-CHECK)",
      "! ═══════════════════════════════════════",
      "!",
      "! 1. Mevcut durumu kaydet",
      "get system status",
      "! Firmware versiyon, seri no, uptime, HA durumu NOT EDIN",
      "!",
      "! 2. Konfigurasyon yedegi al",
      "execute backup config tftp <dosya_adi> <tftp_server_ip>",
      "! VEYA:",
      "execute backup full-config tftp <dosya_adi> <tftp_server_ip>",
      "!",
      "! 3. Performans baseline",
      "get system performance status",
      "! CPU, memory, session sayisi NOT EDIN",
      "!",
      "! 4. HA durumu (HA varsa)",
      "get system ha status",
      "diagnose sys ha checksum cluster",
      "! Sync durumu: checksum'lar AYNI olmali",
      "!",
      "! 5. Aktif session ve VPN sayisi",
      "get system session status",
      "get vpn ipsec tunnel summary",
      "get vpn ssl monitor",
      "!",
      "! 6. Routing tablosu",
      "get router info routing-table all",
      "! Route sayisi ve kritik route'lar NOT EDIN",
      "!",
      "! ═══════════════════════════════════════",
      "! FIRMWARE UPGRADE SONRASI (POST-CHECK)",
      "! ═══════════════════════════════════════",
      "!",
      "! 1. Sistem durumu",
      "get system status",
      "! Yeni firmware versiyonu dogru mu?",
      "!",
      "! 2. Konfigurasyon hata kontrolu",
      "diagnose debug config-error-log read",
      "! BOS CIKTI = sorun yok (harika!)",
      "! Hata satiri gorurseniz = uyumsuz konfig (eski komut kalkmis olabilir)",
      "!",
      "! 3. Crash log kontrolu",
      "diagnose debug crashlog read",
      "! Yeni crash var mi? Upgrade sonrasi crash = firmware bug olabilir",
      "!",
      "! 4. Performans kontrolu",
      "get system performance status",
      "! CPU/memory onceki degerlerle karsilastirin",
      "!",
      "! 5. HA senkronizasyon",
      "get system ha status",
      "diagnose sys ha checksum cluster",
      "! Sync OK mi? Checksum'lar eslesiyor mu?",
      "!",
      "! 6. VPN tunnel kontrolu",
      "get vpn ipsec tunnel summary",
      "! Tum tunnel'lar UP mi?",
      "get vpn ssl monitor",
      "! SSL VPN kullanicilar baglanabiliyor mu?",
      "!",
      "! 7. Routing kontrolu",
      "get router info routing-table all",
      "! Route sayisi ayni mi? Kritik route'lar var mi?",
      "!",
      "! 8. Session kontrolu",
      "get system session status",
      "! Session sayisi normal mi?",
      "!",
      "! 9. Log kontrolu",
      "execute log fortianalyzer test-connectivity",
      "! FAZ baglantisi OK mi?",
      "!",
      "! 10. Interface kontrolu",
      "get system interface physical",
      "! Tum interface'ler UP mi? Speed dogru mu?",
    ], note: "Upgrade oncesi MUTLAKA yedek alin! diagnose debug config-error-log read = upgrade sonrasi en ONEMLI komut. Hata varsa uyumsuz konfig satirlarini gosterir. Crash log'da yeni entry varsa TAC'a bildirin. HA ortaminda once SLAVE upgrade edilir, sonra failover, sonra eski MASTER upgrade edilir." },

    { title: "Genel Sistem Saglilk Kontrolu", steps: [
      "! === Hizli Sistem Saglilk Kontrolu ===",
      "!",
      "get system status",
      "! Firmware, uptime, HA mode",
      "!",
      "get system performance status",
      "! CPU idle > %70 = OK, Memory < %80 = OK",
      "!",
      "diagnose sys top-summary",
      "! Process'ler normal mi?",
      "!",
      "get system session status",
      "! Session sayisi model limitinin altinda mi?",
      "!",
      "diagnose debug config-error-log read",
      "! Konfig hatasi var mi? Bos = temiz",
      "!",
      "diagnose debug crashlog read",
      "! Son 24 saatte crash var mi?",
      "!",
      "get system interface physical",
      "! Tum interface'ler expected durumda mi?",
      "!",
      "execute log fortianalyzer test-connectivity",
      "! FAZ baglantisi OK mi?",
      "!",
      "diagnose hardware sysinfo memory",
      "! Memory durumu detay",
      "!",
      "get vpn ipsec tunnel summary",
      "! VPN tunnel'lar UP mi?",
    ], note: "Bu kontrol listesini duzenli olarak (haftada 1) veya sorun supheliyken calistirin. Sonuclari karsilastirmak icin bir baseline NOT EDIN. diagnose debug config-error-log read ve crashlog read en onemli iki komut — upgrade sonrasi, reboot sonrasi, beklenmeyen davranislarda ILK kontrol edin." },
  ],
  "session": [
    { title: "Session Filtreleme ve Analiz", steps: [
      "! === ADIM 1: Filtre koy ===",
      "diagnose sys session filter dst 10.20.9.84",
      "! Filtre parametreleri: src, dst, sport, dport, proto, policy, vd",
      "! Birden fazla filtre = AND mantigi",
      "!",
      "! === ADIM 2: Session listele ===",
      "diagnose sys session list",
      "!",
      "! === CIKTI YORUMLAMA ===",
      "! proto=6 = TCP, proto=17 = UDP, proto=1 = ICMP",
      "! proto_state=01 = ESTABLISHED (normal)",
      "! proto_state=00 = NEW (henuz kurulmamis)",
      "! proto_state=02 = CLOSING (kapaniyor)",
      "! policy id=5 = Policy 5 ile eslesti",
      "! state=may_dirty = session guncellenebilir (normal)",
      "! state=dirty = session guncellendi (policy degisikligi sonrasi)",
      "! state=npu = NPU hardware acceleration aktif",
      "! state=local = FortiGate'in kendi trafigi",
      "! duration/expire/timeout = sure bilgileri (saniye)",
      "!",
      "! === ADIM 3: Session temizle (dikkatli!) ===",
      "diagnose sys session clear",
      "! DIKKAT: Filtresiz calistirilirsa TUM session'lar SILINIR!",
      "! Once filter ile dogrulayin: diagnose sys session filter",
    ], note: "Session analizi: proto_state en onemli alan. TCP icin: 00=SYN gonderildi, 01=Established, 02=FIN/RST. UDP icin: 0=tek yonlu, 1=cift yonlu. Session clear oncesi MUTLAKA filter kontrol edin! Filtresiz clear = tum trafik KESILIR." },
  ],
  "users": [
    { title: "LDAP Sunucu + Kullanici Grubu Yapilandirma", steps: [
      "! === ADIM 1: LDAP Sunucu Tanimla ===",
      "config user ldap",
      " edit SIRKET_LDAP",
      "  set server 10.1.1.100",
      "  set cnid sAMAccountName",
      "  set dn DC=sirket,DC=local",
      "  set type regular",
      "  set username CN=fortigate_svc,OU=Service,DC=sirket,DC=local",
      "  set password LdapServicePass123",
      "  set source-ip 10.200.1.1",
      " next",
      "end",
      "!",
      "! === ADIM 2: Test Et ===",
      "diagnose test authserver ldap SIRKET_LDAP testuser TestPass123",
      "! 'succeeded!' = OK, 'failed!' = sifre/kullanici yanlis",
      "! 'connect error' = sunucuya ulasilamiyor (IP/port/source-ip)",
      "!",
      "! === ADIM 3: Kullanici Grubu ===",
      "config user group",
      " edit VPN_KULLANICILAR",
      "  set member SIRKET_LDAP",
      "  config match",
      "   edit 1",
      "    set server-name SIRKET_LDAP",
      "    set group-name CN=VPN_Users,OU=Groups,DC=sirket,DC=local",
      "   next",
      "  end",
      " next",
      "end",
      "!",
      "! === ADIM 4: Policy'de Grubu Kullan ===",
      "config firewall policy",
      " edit 10",
      "  set groups VPN_KULLANICILAR",
      " next",
      "end",
    ], note: "LDAP sirasi: 1) Sunucu tanimla (server IP, cnid, dn, service account), 2) Test et (diagnose test authserver), 3) Kullanici grubu olustur (LDAP group match), 4) Policy/VPN'de grubu kullan. source-ip KRITIK — LDAP sunucusuna dogru interface'den cikmayi saglar. cnid=sAMAccountName (AD icin standart)." },

    { title: "FSSO (Fortinet Single Sign-On) Yapilandirma", steps: [
      "! === ADIM 1: FSSO Agent Baglantisi ===",
      "config user fsso",
      " edit FSSO_DC",
      "  set server 10.1.1.50",
      "  set password FssoAgentPass",
      "  set source-ip 10.200.1.1",
      " next",
      "end",
      "!",
      "! === ADIM 2: FSSO Kullanici Grubu ===",
      "config user adgrp",
      " edit SIRKET\\\\VPN_Users",
      "  set server-name FSSO_DC",
      " next",
      "end",
      "!",
      "! === ADIM 3: Kontrol ===",
      "diagnose debug authd fsso list",
      "! Login olan kullanicilar gorulur. Total=0 ise FSSO calismiyor",
      "diagnose debug authd fsso server-status",
      "! DC baglanti durumu: connected = OK",
    ], note: "FSSO = Active Directory'den otomatik kullanici tespiti. DC'ye agent kurulmali (collector agent). FortiGate agent ile iletisir ve login olan kullanicilari ogenir. Policy'de kullanici/grup bazli kural icin FSSO veya LDAP gerekli." },
  ],
  "interfaces": [
    { title: "Interface Yapilandirma ve Hata Giderme", steps: [
      "! === Interface Config ===",
      "config system interface",
      " edit wan1",
      "  set mode static",
      "  set ip 203.0.113.50 255.255.255.252",
      "  set allowaccess ping https ssh",
      "  set alias ISP_PRIMARY",
      "  set role wan",
      " next",
      "end",
      "!",
      "! === Interface Durumu ===",
      "get system interface physical",
      "! status: up/down, speed: 1000full/100half/n/a",
      "! down = kablo yok veya admin down",
      "! 100half = duplex mismatch (kotu!)",
      "!",
      "! === NIC Hata Sayaclari ===",
      "diagnose hardware deviceinfo nic wan1",
      "! Rx_CRC_errors > 0 = KOTU KABLO",
      "! Collisions > 0 = DUPLEX MISMATCH",
      "! Rx_errors > 0 = fiziksel sorun",
      "!",
      "! === MTU Kontrolu ===",
      "fnsysctl ifconfig wan1",
      "! MTU degerini gormek icin TEK yol budur",
      "! Tunnel/VPN'de MTU sorunu varsa ip tcp adjust-mss kullanin",
    ], note: "Interface mode: static (IP manuel), dhcp (DHCP ile), pppoe (ISP baglantisi). allowaccess = hangi servisler bu IP'ye erisebilir (ping/https/ssh/snmp). role wan/lan/dmz = GUI'de gruplama. speed/duplex otomatik olmali, manual ayar karsi tarafla eslesmeli." },
  ],
  "policy": [
    { title: "Firewall Policy Olusturma Mantigi", steps: [
      "! === Policy SIRALAMA KURALI ===",
      "! Policy'ler YUKARIDAN ASAGIYA kontrol edilir",
      "! ILK ESLESEN kural uygulanir, geri kalan ATLANIR",
      "! En ALTTA implicit deny vardir (gorulmez ama vardir)",
      "!",
      "! === Ornek Policy ===",
      "config firewall policy",
      " edit 0",
      "  set name LAN_TO_INTERNET",
      "  set srcintf port5",
      "  set dstintf wan1",
      "  set srcaddr LAN_SUBNET",
      "  set dstaddr all",
      "  set action accept",
      "  set schedule always",
      "  set service ALL",
      "  set nat enable",
      "  set logtraffic all",
      "  set utm-status enable",
      "  set av-profile default",
      "  set ips-sensor default",
      "  set ssl-ssh-profile certificate-inspection",
      " next",
      "end",
      "!",
      "! === Policy Kontrol ===",
      "! Debug flow ile hangi policy eslestigini gorun:",
      "diagnose debug flow filter addr 10.200.1.50",
      "diagnose debug flow trace start 10",
      "! 'Allowed by Policy-5' = Policy 5 eslesti",
      "! 'Denied by forward policy check' = HIC policy eslemedi",
    ], note: "Policy olusturma: srcintf > dstintf > srcaddr > dstaddr > service > action > NAT > UTM > logging. nat enable = SNAT (ic IP -> WAN IP). utm-status = AV/IPS/WebFilter etkinlestir. logtraffic all = tum trafik logla. Policy siralama KRITIK — spesifik kurallar USTE, genel kurallar ALTA!" },
  ],
  "objects": [
    { title: "VIP (DNAT) Yapilandirma", steps: [
      "! === ADIM 1: VIP (Virtual IP / DNAT) Olustur ===",
      "config firewall vip",
      " edit WEB_SERVER_VIP",
      "  set extip 203.0.113.55",
      "  set mappedip 10.200.1.100",
      "  set extintf wan1",
      "  set portforward enable",
      "  set protocol tcp",
      "  set extport 443",
      "  set mappedport 8443",
      " next",
      "end",
      "!",
      "! === ADIM 2: Firewall Policy (VIP trafigine izin) ===",
      "config firewall policy",
      " edit 0",
      "  set name INTERNET_TO_WEB",
      "  set srcintf wan1",
      "  set dstintf port5",
      "  set srcaddr all",
      "  set dstaddr WEB_SERVER_VIP",
      "  set action accept",
      "  set schedule always",
      "  set service HTTPS",
      " next",
      "end",
    ], note: "VIP = Dis IP'yi ic IP'ye cevir (DNAT). extip = WAN'da gorunen IP, mappedip = LAN'daki gercek sunucu. portforward enable = belirli port yonlendir (extport -> mappedport farkli olabilir!). Policy'de dstaddr = VIP objesi. NAT enable GEREKMEZ — VIP kendi NAT'ini yapar." },
  ],
  "sdwan": [
    { title: "SD-WAN Tam Yapilandirma", steps: [
      "! === ADIM 1: SD-WAN Zone Olustur ===",
      "config system sdwan",
      " set status enable",
      " config zone",
      "  edit virtual-wan-link",
      "  next",
      " end",
      "!",
      "! === ADIM 2: SD-WAN Member (WAN linkleri) ===",
      " config members",
      "  edit 1",
      "   set interface wan1",
      "   set gateway 203.0.113.1",
      "  next",
      "  edit 2",
      "   set interface wan2",
      "   set gateway 198.51.100.1",
      "  next",
      " end",
      "!",
      "! === ADIM 3: Health Check (SLA) ===",
      " config health-check",
      "  edit PING_GOOGLE",
      "   set server 8.8.8.8",
      "   set protocol ping",
      "   set interval 10",
      "   set failtime 3",
      "   set recoverytime 3",
      "   config sla",
      "    edit 1",
      "     set latency-threshold 100",
      "     set jitter-threshold 50",
      "     set packetloss-threshold 5",
      "    next",
      "   end",
      "   set members 1 2",
      "  next",
      " end",
      "!",
      "! === ADIM 4: SD-WAN Rule ===",
      " config service",
      "  edit 1",
      "   set name CRITICAL_APPS",
      "   set mode sla",
      "   set dst CRITICAL_SERVERS",
      "   set src LAN_SUBNET",
      "   set health-check PING_GOOGLE",
      "   set sla 1",
      "   set priority-members 1",
      "  next",
      " end",
      "end",
    ], note: "SD-WAN sirasi: 1) status enable, 2) member (WAN interface + gateway), 3) health-check (SLA tanimlama: latency/jitter/loss esikleri), 4) service rule (hangi trafik hangi member'dan gidecek). SD-WAN aktifken static default route OTOMATIK olusturulur — manual eklemeyin!" },
  ],
  "logging": [
    { title: "FortiAnalyzer + Syslog Yapilandirma", steps: [
      "! === FortiAnalyzer Baglantisi ===",
      "config log fortianalyzer setting",
      " set status enable",
      " set server 10.1.1.200",
      " set upload-option realtime",
      " set reliable enable",
      " set source-ip 10.200.1.1",
      "end",
      "!",
      "! === FAZ Baglanti Testi ===",
      "execute log fortianalyzer test-connectivity",
      "! Registration: registered = OK",
      "! Connection: allow = OK",
      "! OFTP session: connected = OK",
      "! Herhangi biri basarisizsa: IP/port/source-ip/registration kontrol",
      "!",
      "! === Syslog Yapilandirma ===",
      "config log syslogd setting",
      " set status enable",
      " set server 10.1.1.60",
      " set port 514",
      " set facility local7",
      " set source-ip 10.200.1.1",
      "end",
      "!",
      "! === Log Seviyesi ===",
      "config log syslogd filter",
      " set severity information",
      "end",
      "! Severity seviyeleri: emergency(0) > alert(1) > critical(2) > error(3)",
      "! > warning(4) > notification(5) > information(6) > debug(7)",
    ], note: "FAZ baglantisi: server IP + registration (FAZ tarafinda cihazi authorize edin). reliable = TCP kullan (UDP yerine). Syslog: port 514 (default), facility local0-7. source-ip = dogru interface'den cikmak icin. FAZ test-connectivity ile TUM alanlarin OK oldugunu dogrulayin." },
  ],
  "utm": [
    { title: "UTM Profil Olusturma ve Policy'ye Atama", steps: [
      "! === ADIM 1: AntiVirus Profili ===",
      "config antivirus profile",
      " edit CUSTOM_AV",
      "  config http",
      "   set av-scan enable",
      "  end",
      "  config ftp",
      "   set av-scan enable",
      "  end",
      " next",
      "end",
      "!",
      "! === ADIM 2: IPS Sensor ===",
      "config ips sensor",
      " edit CUSTOM_IPS",
      "  config entries",
      "   edit 1",
      "    set severity high critical",
      "    set status enable",
      "    set action block",
      "   next",
      "  end",
      " next",
      "end",
      "!",
      "! === ADIM 3: Web Filter Profili ===",
      "config webfilter profile",
      " edit CUSTOM_WF",
      "  config ftgd-wf",
      "   config filters",
      "    edit 1",
      "     set category 2",
      "     set action block",
      "    next",
      "   end",
      "  end",
      " next",
      "end",
      "!",
      "! === ADIM 4: Policy'ye Ata ===",
      "config firewall policy",
      " edit 5",
      "  set utm-status enable",
      "  set av-profile CUSTOM_AV",
      "  set ips-sensor CUSTOM_IPS",
      "  set webfilter-profile CUSTOM_WF",
      "  set ssl-ssh-profile deep-inspection",
      " next",
      "end",
    ], note: "UTM sirasi: 1) AV profil, 2) IPS sensor, 3) Web filter profil, 4) Policy'ye ata (utm-status enable + profiller). ssl-ssh-profile = HTTPS trafikini incelemek icin (certificate-inspection veya deep-inspection). Deep inspection = MITM proxy (sertifika hatasi verebilir, CA cert dagitilmali)." },
  ],
  "fext": [
    { title: "FortiExtender LTE Yapilandirma", steps: [
      "! === ADIM 1: FortiExtender Authorize ===",
      "config extender-controller extender",
      " edit FX201E0000000001",
      "  set authorized enable",
      " next",
      "end",
      "!",
      "! === ADIM 2: FortiExtender Profil ===",
      "config extender-controller extender-profile",
      " edit DEFAULT",
      "  set allowaccess ping https ssh",
      "  config cellular",
      "   config modem1",
      "    set auto-switch enable",
      "   end",
      "  end",
      " next",
      "end",
      "!",
      "! === ADIM 3: Kontrol ===",
      "get extender status",
      "! Status: connected/disconnected",
      "! Signal: -50 ile -75 dBm = iyi, -75 ile -90 = zayif",
    ], note: "FEXT = FortiExtender (LTE/DSL yedek hat). Once seri numarasi ile authorize edin, sonra profil atanir. auto-switch = sinyal kalitesine gore SIM degistirme. Signal gucu: -50/-75=iyi, -75/-90=zayif, >-90=cok kotu." },
  ],
  "managed": [
    { title: "FortiSwitch Yapilandirma (FortiLink)", steps: [
      "! === ADIM 1: FortiLink Interface ===",
      "config system interface",
      " edit fortilink",
      "  set fortilink enable",
      " next",
      "end",
      "!",
      "! === ADIM 2: FortiSwitch Authorize ===",
      "execute switch-controller get-conn-status <SN>",
      "! Status kontrol, authorized degilse:",
      "config switch-controller managed-switch",
      " edit <SN>",
      "  set fsw-wan1-peer <FortiGate_intf>",
      " next",
      "end",
      "!",
      "! === ADIM 3: VLAN + Port Profil ===",
      "config switch-controller managed-switch",
      " edit <SN>",
      "  config ports",
      "   edit port1",
      "    set vlan VLAN_10",
      "    set allowed-vlans VLAN_10 VLAN_20",
      "    set type trunk",
      "   next",
      "  end",
      " next",
      "end",
    ], note: "FortiSwitch yonetimi FortiGate uzerinden (FortiLink). Once FortiLink interface olustur, sonra switch authorize et, ardindan port/VLAN yapilandirmasi yap. FortiSwitch CLI'a dogrudan girilmez — tum yonetim FortiGate'ten." },
  ],
  "fortiap": [
    { title: "FortiAP SSID (VAP) Yapilandirma", steps: [
      "! === ADIM 1: SSID (VAP) Olustur ===",
      "config wireless-controller vap",
      " edit SIRKET_WIFI",
      "  set ssid SIRKET-KABLOSUZ",
      "  set security wpa2-only-enterprise",
      "  set auth usergroup",
      "  set usergroup WIFI_KULLANICILAR",
      "  set schedule always",
      "  set vlanid 100",
      "  set local-bridging disable",
      "  set broadcast-ssid enable",
      " next",
      "end",
      "!",
      "! === ADIM 2: WTP Profil (Radio Ayarlari) ===",
      "config wireless-controller wtp-profile",
      " edit DEFAULT",
      "  config radio-1",
      "   set band 802.11n-5G",
      "   set vaps SIRKET_WIFI",
      "   set channel 36 40 44 48",
      "   set auto-power-level enable",
      "   set auto-power-low 10",
      "   set auto-power-high 17",
      "  end",
      "  config radio-2",
      "   set band 802.11ax-2G",
      "   set vaps SIRKET_WIFI",
      "   set channel 1 6 11",
      "   set auto-power-level enable",
      "  end",
      " next",
      "end",
      "!",
      "! === ADIM 3: AP Authorize Et ===",
      "config wireless-controller wtp",
      " edit FP231FTF12345678",
      "  set admin enable",
      "  set wtp-profile DEFAULT",
      " next",
      "end",
    ], note: "Sira: 1) SSID (VAP) olustur, 2) WTP profil (radio ayarlari, kanal, guc), 3) AP authorize et (SN ile). security: open/wpa2-only-personal/wpa2-only-enterprise/wpa3-sae. local-bridging disable = trafik tunnel uzerinden FortiGate'e gelir (daha guvenli). vlanid = client VLAN'i." },

    { title: "FortiAP Hata Giderme", steps: [
      "! === AP Baglanti Durumu ===",
      "diagnose wireless-controller wlac -c wtp",
      "! State: online = OK, offline = SORUN, rogue = yetkisiz",
      "! offline ise: AP'ye fiziksel erisim, ping, CAPWAP kontrolu",
      "!",
      "! === Client Baglanti Sorunu ===",
      "diagnose wireless-controller wlac -c sta",
      "! Client listesi: signal, SNR, data rate kontrol",
      "! Signal: -30 ile -50 = mukemmel, -50 ile -70 = iyi, -70 ile -80 = zayif",
      "! SNR > 20 = iyi, < 10 = kotu (girisim/mesafe sorunu)",
      "!",
      "! === CAPWAP Debug (AP-Controller iletisimi) ===",
      "diagnose wireless-controller wlac wtp_filter <SN> 0-<ap_ip>:5246 255",
      "diagnose debug application cw_acd 0x7ff",
      "diagnose debug enable",
      "! CAPWAP mesajlari gorulur: discovery, join, config, data",
      "! 'join request' = AP baglanti istiyor",
      "! 'join response' = FortiGate kabul etti",
      "! 'config update' = AP konfigurasyonu gonderiliyor",
      "!",
      "diagnose debug disable",
      "diagnose debug application cw_acd 0",
    ], note: "FortiAP CAPWAP (UDP 5246/5247) ile FortiGate'e baglanir. AP offline ise: 1) Fiziksel baglanti/PoE, 2) AP IP adresi (DHCP veya static), 3) DNS/CAPWAP discovery (option 138 veya FortiGate IP), 4) Firewall ACL (UDP 5246/5247 acik mi), 5) AP firmware uyumu." },
  ],
};

/* ───────── GITHUB RESOURCES ───────── */
const GITHUB_RESOURCES = [
  { name: "Fortigate-Firewall-Complete-Guide", url: "https://github.com/hegdepavankumar/Fortigate-Firewall-Complete-Guide", desc: "En kapsamli rehber. Interface'den VPN'e kadar her seyi kapsiyor." },
  { name: "yuriskinfo/cheat-sheets", url: "https://github.com/yuriskinfo/cheat-sheets", desc: "FortiGate debug/diagnose komutlarinin tam listesi (AsciiDoc)." },
  { name: "yuriskinfo/Fortinet-tools", url: "https://github.com/yuriskinfo/Fortinet-tools", desc: "Gunluk konfigurasyon/debug/monitoring araclari ve scriptler." },
  { name: "jeffbildz/Fortinet Cheat Sheet", url: "https://github.com/jeffbildz/Fortinet/blob/main/Fortinet_Cheat_Sheet.md", desc: "FortiGate + FortiSwitch CLI komutlari." },
  { name: "GhostKellz/fortigate", url: "https://github.com/GhostKellz/fortigate/blob/main/CHEATSHEET.md", desc: "Otomasyon ve CLI referansi." },
  { name: "oelu/cheatsheets (fortigate.md)", url: "https://github.com/oelu/cheatsheets/blob/master/fortigate.md", desc: "VPN, OSPF, debug flow dahil cheat sheet." },
  { name: "ondrejholecek/fortidebug", url: "https://github.com/ondrejholecek/fortidebug", desc: "SSH uzerinden FortiGate troubleshoot araclari (simdi FortiLightHouse CLI)." },
  { name: "malwan23/FG-CLI", url: "https://github.com/malwan23/FG-CLI", desc: "REST API uzerinden FortiGate yonetim araci." },
  { name: "rrrrrrri/fgt-gadgets", url: "https://github.com/rrrrrrri/fgt-gadgets", desc: "FortiGate yardimci araclar." },
  { name: "henri's FortiGate CLI Gist", url: "https://gist.github.com/henri/75aacdcc8dbaa815b275385b6ac87383", desc: "Fortigate Command Line Cheat Sheet (Gist)." },
  { name: "cetinajero's Useful CLI Gist", url: "https://gist.github.com/cetinajero/1effb04ee9ae9fc6f65faaf43d4bff9b", desc: "Useul Fortigate CLI commands." },
];

const WEB_RESOURCES = [
  { name: "Fortinet Resmi CLI Cheat Sheet (7.6)", url: "https://docs.fortinet.com/document/fortigate/7.6.0/cli-troubleshooting-cheat-sheet/420966/cli-troubleshooting-cheat-sheet", desc: "Resmi dokumanasyon — CLI troubleshooting referansi." },
  { name: "Tuncay Bas — FortiGate Yararli Komutlar", url: "https://www.tuncaybas.com/index.php/fortigate-yararli-komutlar/", desc: "Turkce FortiGate CLI komut referansi." },
  { name: "Cemal Taner — FortiGate CLI Rehberi", url: "https://www.korvo.co/cemaltaner/digital-products/4325", desc: "Kapsamli Turkce FortiGate CLI rehberi (ucretli)." },
  { name: "Fortinet Community — Sniffer Kullanimi", url: "https://community.fortinet.com/t5/FortiGate/Troubleshooting-Tip-Using-the-FortiOS-built-in-packet-sniffer/ta-p/196856", desc: "Resmi sniffer kullanim rehberi." },
  { name: "Fortinet Docs — Debug Flow", url: "https://docs.fortinet.com/document/fortigate/6.4.5/administration-guide/54688/debugging-the-packet-flow", desc: "Resmi debug flow rehberi." },
  { name: "cmdref.net — FortiGate CLI", url: "https://cmdref.net/hardware/fortigate/index.html", desc: "Hizli CLI referansi ve ornekler." },
  { name: "defencedev.com — FortiGate Cheat Sheet", url: "https://defencedev.com/network-tutorials/fortigate/fortigate-useful-cli-commands/", desc: "Ultimate FortiGate Command Cheat Sheet." },
];

/* ═══════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const t = document.getElementById("toast");
    t.textContent = "Kopyalandi: " + text.substring(0, 50) + (text.length > 50 ? "..." : "");
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1800);
  });
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-list a").forEach(a => a.classList.remove("active"));
  const section = document.getElementById(id);
  if (section) section.classList.add("active");
  const nav = document.querySelector(`.nav-list a[data-section="${id}"]`);
  if (nav) nav.classList.add("active");
  localStorage.setItem("fg-section", id);
  document.getElementById("main").scrollTo(0, 0);
}

function makeCodeCell(code) {
  return `<span class="filter-code" onclick="copyToClipboard('${code.replace(/'/g, "\\'")}')">${escHtml(code)}</span>`;
}

function escHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function sevDot(sev) {
  return `<span class="sev-badge sev-${sev}"></span>`;
}

function renderConfigGuides(sectionKey) {
  const guides = CONFIG_GUIDES[sectionKey];
  if (!guides || guides.length === 0) return "";
  return `<div class="content-block"><h3>Adim Adim Yapilandirma / Hata Giderme Rehberi</h3>` +
    guides.map(g => `
      <details class="output-example">
        <summary>${escHtml(g.title)}</summary>
        <div class="output-body">
          <pre><code>${g.steps.map(s => escHtml(s)).join("\n")}</code></pre>
          ${g.note ? `<div class="hint-box" style="margin:12px 16px"><span class="note-label">Not:</span> ${escHtml(g.note)}</div>` : ""}
        </div>
      </details>
    `).join("") + `</div>`;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

// ─── DASHBOARD ───
function renderDashboard() {
  const cats = [...new Set(COMMANDS.map(c => c.cat))];
  const el = document.getElementById("dashboard");
  el.innerHTML = `
    <div class="hero">
      <h2>FortiGate CLI Hub</h2>
      <p class="lead">Network Security Engineer icin FortiGate CLI komut referansi, troubleshooting rehberi ve kaynak merkezi.<br>
      Komutlara tikla &rarr; kopyala &rarr; CLI'a yapistir.</p>
      <div class="stats-grid">
        <div class="stat-card"><div class="num">${COMMANDS.length}</div><div class="label">CLI Komut</div></div>
        <div class="stat-card"><div class="num">${cats.length}</div><div class="label">Kategori</div></div>
        <div class="stat-card"><div class="num">${SCENARIOS.length}</div><div class="label">Senaryo</div></div>
        <div class="stat-card"><div class="num">${GITHUB_RESOURCES.length + WEB_RESOURCES.length}</div><div class="label">Kaynak</div></div>
      </div>
    </div>
    <div class="content-block">
      <h3>Hizli Erisim</h3>
      <div class="card-grid">
        <div class="card" onclick="showSection('commands')" style="cursor:pointer">
          <h3>Komut Kutuphanesi</h3>
          <p>Tum ${COMMANDS.length} komutu kategorilere gore filtrele ve kopyala.</p>
        </div>
        <div class="card" onclick="showSection('debugflow')" style="cursor:pointer">
          <h3>Debug Flow</h3>
          <p>Paket izleme ve trafik debug rehberi. Adim adim.</p>
        </div>
        <div class="card" onclick="showSection('sniffer')" style="cursor:pointer">
          <h3>Sniffer</h3>
          <p>Dahili paket yakalama syntax ve ornekleri.</p>
        </div>
        <div class="card" onclick="showSection('vpn')" style="cursor:pointer">
          <h3>VPN (IPsec/SSL/GRE)</h3>
          <p>VPN troubleshooting ve debug komutlari.</p>
        </div>
        <div class="card" onclick="showSection('ha')" style="cursor:pointer">
          <h3>HA / Cluster</h3>
          <p>High Availability yonetimi ve failover testi.</p>
        </div>
        <div class="card" onclick="showSection('scenarios')" style="cursor:pointer">
          <h3>Sorun Senaryolari</h3>
          <p>${SCENARIOS.length} hazir troubleshooting senaryosu.</p>
        </div>
      </div>
    </div>
  `;
}

// ─── COMMANDS LIBRARY ───
function renderCommands() {
  const cats = [...new Set(COMMANDS.map(c => c.cat))];
  const el = document.getElementById("commands");
  el.innerHTML = `
    <div class="section-header">
      <h2>Komut Kutuphanesi</h2>
      <div class="description">${COMMANDS.length} komut, ${cats.length} kategoride. Komuta tikla &rarr; kopyala.</div>
    </div>
    <div class="category-tabs" id="cmd-tabs"></div>
    <input type="text" id="cmd-search" placeholder="Komut ara..." style="width:100%;background:var(--bg-2);border:1px solid var(--border);color:var(--text-0);padding:8px 10px;border-radius:6px;font-size:13px;margin-bottom:12px;outline:none;font-family:var(--mono);">
    <div id="cmd-table-wrap"></div>
  `;

  const tabsEl = document.getElementById("cmd-tabs");
  tabsEl.innerHTML = `<span class="category-tab active" data-cat="Tumu">Tumu (${COMMANDS.length})</span>` +
    cats.map(c => {
      const count = COMMANDS.filter(cmd => cmd.cat === c).length;
      return `<span class="category-tab" data-cat="${c}">${c} (${count})</span>`;
    }).join("");

  let activeCat = "Tumu";

  function renderTable(filter) {
    let cmds = activeCat === "Tumu" ? COMMANDS : COMMANDS.filter(c => c.cat === activeCat);
    if (filter) {
      const f = filter.toLowerCase();
      cmds = cmds.filter(c => c.code.toLowerCase().includes(f) || c.desc.toLowerCase().includes(f) || c.cat.toLowerCase().includes(f));
    }
    const wrap = document.getElementById("cmd-table-wrap");
    if (cmds.length === 0) {
      wrap.innerHTML = `<p class="muted">Sonuc bulunamadi.</p>`;
      return;
    }
    wrap.innerHTML = `<table class="filter-table"><thead><tr><th style="width:30px"></th><th>Komut</th><th>Aciklama</th><th>Kategori</th></tr></thead><tbody>` +
      cmds.map(c => `<tr><td>${sevDot(c.sev)}</td><td>${makeCodeCell(c.code)}</td><td class="filter-desc">${escHtml(c.desc)}</td><td class="muted" style="font-size:11px;">${escHtml(c.cat)}</td></tr>`).join("") +
      `</tbody></table>`;
  }

  tabsEl.querySelectorAll(".category-tab").forEach(tab => {
    tab.onclick = () => {
      tabsEl.querySelectorAll(".category-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeCat = tab.dataset.cat;
      renderTable(document.getElementById("cmd-search").value);
    };
  });

  document.getElementById("cmd-search").addEventListener("input", e => {
    renderTable(e.target.value);
  });

  renderTable("");
}

// ─── SNIFFER ───
function renderSniffer() {
  const sniffCmds = COMMANDS.filter(c => c.cat === "Sniffer");
  const el = document.getElementById("sniffer");
  el.innerHTML = `
    ${renderConfigGuides("sniffer")}
    <div class="section-header">
      <h2>Sniffer — Paket Yakalama</h2>
      <div class="description">FortiGate dahili paket yakalama araci. tcpdump benzeri syntax kullanir.</div>
    </div>
    <div class="content-block">
      <h3>Syntax</h3>
      <pre><code>diagnose sniffer packet &lt;interface&gt; '&lt;filter&gt;' &lt;verbose&gt; &lt;count&gt; &lt;timestamp&gt;</code></pre>
      <h4>Verbose Seviyeleri</h4>
      <table class="filter-table">
        <tr><th>Seviye</th><th>Aciklama</th><th>Ne Zaman Kullan?</th></tr>
        <tr><td>1</td><td>IP header ozeti</td><td class="muted">Hizli kontrol: trafik var mi yok mu?</td></tr>
        <tr><td>2</td><td>1 + IP payload</td><td class="muted">Payload icerigi onemli degilse</td></tr>
        <tr><td>3</td><td>2 + Ethernet header</td><td class="muted">MAC adreslerini gormek istiyorsan</td></tr>
        <tr><td>4</td><td>3 + Interface adi</td><td class="muted"><strong>En cok kullanilan.</strong> Hangi interface'den gectigini gosterir</td></tr>
        <tr><td>5</td><td>4 + Hex dump</td><td class="muted">Paket icerigini hex olarak inceleme</td></tr>
        <tr><td>6</td><td>5 + Hex + ASCII (en detayli)</td><td class="muted">SSL/TLS disinda payload icerigi okuma</td></tr>
      </table>
      <h4>Timestamp</h4>
      <p><code>a</code> = absolute timestamp, <code>l</code> = local timestamp, <code>1</code> = UTC</p>
    </div>

    <div class="content-block">
      <h3>Ornek Komutlar</h3>
      <div class="filter-list">
        ${sniffCmds.map(c => `<div class="filter-item">${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>

    <details class="output-example">
      <summary>Ornek Cikti: Verbose 4 ile sniffer</summary>
      <div class="output-body">
        <pre><code>interfaces=[any]
filters=[host 10.40.30.2 and port 443]
10.200.1.5.52341 -> 10.40.30.2.443: syn 1836547290
<span style="color:var(--ok)">10.40.30.2.443 -> 10.200.1.5.52341: syn 947281635 ack 1836547291</span>
10.200.1.5.52341 -> 10.40.30.2.443: ack 947281636
10.200.1.5.52341 -> 10.40.30.2.443: psh 1836547291 ack 947281636</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">syn ... syn ack ... ack</td><td><span class="status-ok">NORMAL</span> — 3-way handshake tamamlandi, baglanti kuruldu</td></tr>
          <tr><td class="val">syn ... (yanit yok)</td><td><span class="status-err">SORUN</span> — Karsi taraf yanit vermiyor. Firewall/routing/hedef down olabilir</td></tr>
          <tr><td class="val">syn ... rst</td><td><span class="status-err">SORUN</span> — Port kapali veya firewall reject ediyor</td></tr>
          <tr><td class="val">Tek yonlu trafik</td><td><span class="status-warn">UYARI</span> — Asimetrik routing olabilir. Giden var ama gelen yok</td></tr>
          <tr><td class="val">icmp unreachable</td><td><span class="status-err">SORUN</span> — Hedef veya port ulasilamaz</td></tr>
        </table>
      </div>
    </details>

    <div class="hint-box">
      <span class="note-label">Ipucu:</span> Sniffer filtrelerinde tcpdump syntax kullanilir. <code>host</code>, <code>src host</code>, <code>dst host</code>, <code>port</code>, <code>and</code>, <code>or</code> operatorleri gecerlidir.
      <code>count</code> parametresine 0 verirseniz sinirsiz yakalar (Ctrl+C ile durdurun).
    </div>

    <div class="warn-box">
      <span class="note-label">Dikkat:</span> Sniffer calistirirken <strong>interface secimi onemli!</strong> <code>any</code> tum interface'lerden yakalar ama yuksek trafik ortaminda CPU'yu yorabilir. Mumkunse belirli interface secin: <code>diagnose sniffer packet wan1 ...</code>
    </div>
  `;
}

// ─── DEBUG FLOW ───
function renderDebugFlow() {
  const dbgCmds = COMMANDS.filter(c => c.cat === "Debug Flow");
  const el = document.getElementById("debugflow");
  el.innerHTML = `
    ${renderConfigGuides("debugflow")}
    <div class="section-header">
      <h2>Debug Flow — Paket Izleme</h2>
      <div class="description">Trafigin FortiGate icinden nasil gectigini adim adim gorun. En onemli troubleshooting araci.</div>
    </div>
    <div class="content-block">
      <h3>Adim Adim Debug Flow</h3>
      <ol class="step-list">
        <li>Filtre koy: <span class="filter-code" onclick="copyToClipboard('diagnose debug flow filter addr 192.168.2.169')">diagnose debug flow filter addr &lt;IP&gt;</span></li>
        <li>(Opsiyonel) Port filtresi ekle: <span class="filter-code" onclick="copyToClipboard('diagnose debug flow filter port 443')">diagnose debug flow filter port &lt;port&gt;</span></li>
        <li>Fonksiyon adlarini ac: <span class="filter-code" onclick="copyToClipboard('diagnose debug flow show function-name enable')">diagnose debug flow show function-name enable</span></li>
        <li>Konsol ciktisi: <span class="filter-code" onclick="copyToClipboard('diagnose debug flow show console enable')">diagnose debug flow show console enable</span></li>
        <li>Debug etkinlestir: <span class="filter-code" onclick="copyToClipboard('diagnose debug enable')">diagnose debug enable</span></li>
        <li>Trace baslat: <span class="filter-code" onclick="copyToClipboard('diagnose debug flow trace start 100')">diagnose debug flow trace start 100</span></li>
        <li>Analiz et, bitince kapat:</li>
      </ol>
      <pre><code>diagnose debug disable
diagnose debug flow trace stop
diagnose debug flow filter clear</code></pre>
    </div>

    <div class="warn-box">
      <span class="note-label">Onemli:</span> <code>addr</code> ve <code>port</code> filtreleri birlikte kullanildiginda <strong>AND</strong> mantigi ile calisir. Yani her ikisi de eslesmeli.
      <code>dport</code> sadece destination port icin filtreler.
    </div>

    <details class="output-example" open>
      <summary>Ornek Cikti: Basarili Trafik (policy eslesti, NAT yapildi)</summary>
      <div class="output-body">
        <pre><code>id=20085 trace_id=1 func=print_pkt_detail line=5765 msg="<span style="color:var(--info)">vd-root:0</span> received a packet(proto=6, 10.200.1.50:51234->93.184.216.34:443) <span style="color:var(--ok)">from port5</span>. type=8, flag=0, flag2=0, flag3=0"
id=20085 trace_id=1 func=init_ip_session_common line=6010 msg="allocate a new session-01onal2b3"
id=20085 trace_id=1 func=vf_ip_route_input_common line=2588 msg="<span style="color:var(--ok)">find a route: flag=00000000 gw-93.184.216.34 via wan1</span>"
id=20085 trace_id=1 func=fw_forward_handler line=882 msg="<span style="color:var(--ok)">Allowed by Policy-5: SNAT</span>"
id=20085 trace_id=1 func=__ip_session_run_tuple line=3520 msg="SNAT 10.200.1.50:51234->203.0.113.50:51234"</code></pre>
        <table class="interpret-table">
          <tr><th>Satir</th><th>Anlami</th></tr>
          <tr><td class="val">received a packet ... from port5</td><td><span class="status-ok">NORMAL</span> — Paket port5 interface'inden geldi</td></tr>
          <tr><td class="val">find a route: ... via wan1</td><td><span class="status-ok">NORMAL</span> — Routing tablosunda esleme buldu, wan1'den cikacak</td></tr>
          <tr><td class="val">Allowed by Policy-5: SNAT</td><td><span class="status-ok">GECTI</span> — Policy 5 izin verdi ve SNAT uygulandi</td></tr>
          <tr><td class="val">SNAT 10.200.1.50 -> 203.0.113.50</td><td><span class="status-info">NAT</span> — Kaynak IP, WAN IP'ye cevirildi</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek Cikti: Trafik ENGELLENDI (policy deny)</summary>
      <div class="output-body">
        <pre><code>id=20085 trace_id=7 func=print_pkt_detail line=5765 msg="vd-root:0 received a packet(proto=6, 10.200.1.50:44821->172.16.5.10:22) from port5."
id=20085 trace_id=7 func=vf_ip_route_input_common line=2588 msg="find a route: flag=00000000 gw-172.16.5.10 via port3"
id=20085 trace_id=7 func=fw_forward_handler line=882 msg="<span style="color:var(--err)">Denied by forward policy check</span>"</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun Mesaj</th><th>Anlami</th><th>Cozum</th></tr>
          <tr><td class="val" style="color:var(--err)">Denied by forward policy check</td><td><span class="status-err">ENGELLENDI</span> — Hicbir firewall policy eslemedi</td><td>Bu kaynak/hedef icin izin veren bir policy olusturun</td></tr>
          <tr><td class="val" style="color:var(--err)">iprope_in_check() check failed, drop</td><td><span class="status-err">ENGELLENDI</span> — Internal policy check basarisiz</td><td>Policy veya route tanimini kontrol edin</td></tr>
          <tr><td class="val" style="color:var(--err)">Denied by forward policy check (IP pool)</td><td><span class="status-err">ENGELLENDI</span> — IP pool ile ilgili sorun</td><td>IP Pool konfigurasyonunu kontrol edin</td></tr>
          <tr><td class="val" style="color:var(--warn)">no session matched</td><td><span class="status-warn">UYARI</span> — Mevcut session bulunamadi</td><td>Asimetrik trafik olabilir, session tablosunu kontrol edin</td></tr>
          <tr><td class="val" style="color:var(--err)">reverse path check fail, drop</td><td><span class="status-err">RPF DROP</span> — Reverse Path Forwarding kontrolu basarisiz</td><td>RPF (anti-spoofing) ayarini kontrol edin veya route ekleyin</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek Cikti: Route bulunamadi</summary>
      <div class="output-body">
        <pre><code>id=20085 trace_id=3 func=print_pkt_detail line=5765 msg="vd-root:0 received a packet(proto=6, 10.200.1.50:33821->10.99.99.1:80) from port5."
id=20085 trace_id=3 func=vf_ip_route_input_common line=2588 msg="<span style="color:var(--err)">no matching route, drop</span>"</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th><th>Cozum</th></tr>
          <tr><td class="val" style="color:var(--err)">no matching route, drop</td><td><span class="status-err">DROP</span> — Hedef IP icin route yok</td><td>Statik route veya default route ekleyin. <code>get router info routing-table all</code> ile kontrol edin</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Debug Flow Cikti Sozlugu</h3>
      <table class="interpret-table">
        <tr><th>Mesaj / Anahtar Kelime</th><th>Anlami</th><th>Durum</th></tr>
        <tr><td class="val">Allowed by Policy-X</td><td>Policy X tarafindan izin verildi</td><td><span class="status-ok">OK</span></td></tr>
        <tr><td class="val">SNAT / DNAT</td><td>NAT islemi uygulandi</td><td><span class="status-ok">OK</span></td></tr>
        <tr><td class="val">find a route: ... via &lt;interface&gt;</td><td>Route bulundu, ilgili interface'den cikacak</td><td><span class="status-ok">OK</span></td></tr>
        <tr><td class="val">Denied by forward policy check</td><td>Hicbir policy eslemedi &rarr; DROP</td><td><span class="status-err">HATA</span></td></tr>
        <tr><td class="val">iprope_in_check() check failed</td><td>Internal policy check basarisiz</td><td><span class="status-err">HATA</span></td></tr>
        <tr><td class="val">reverse path check fail</td><td>RPF (anti-spoofing) drop</td><td><span class="status-err">HATA</span></td></tr>
        <tr><td class="val">no matching route</td><td>Hedef icin route bulunamadi</td><td><span class="status-err">HATA</span></td></tr>
        <tr><td class="val">no session matched</td><td>Mevcut session yok (asimetrik?)</td><td><span class="status-warn">UYARI</span></td></tr>
        <tr><td class="val">blocked by ftgd</td><td>FortiGuard web filter tarafindan engellendi</td><td><span class="status-warn">UYARI</span></td></tr>
        <tr><td class="val">UTM scan</td><td>UTM (AV/IPS/WAF) taramasi uygulaniyor</td><td><span class="status-info">BILGI</span></td></tr>
        <tr><td class="val">allocate a new session</td><td>Yeni session olusturuldu</td><td><span class="status-ok">OK</span></td></tr>
      </table>
    </div>

    <div class="content-block">
      <h3>Tum Debug Flow Komutlari</h3>
      <div class="filter-list">
        ${dbgCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── VPN ───
function renderVPN() {
  const ipsecCmds = COMMANDS.filter(c => c.cat === "IPsec" || c.cat === "IPsec Debug");
  const sslCmds = COMMANDS.filter(c => c.cat === "SSL VPN");
  const greCmds = COMMANDS.filter(c => c.cat === "GRE");
  const el = document.getElementById("vpn");
  el.innerHTML = `
    ${renderConfigGuides("vpn")}
    <div class="section-header">
      <h2>VPN — IPsec / SSL / GRE</h2>
      <div class="description">VPN tunnel yonetimi, troubleshooting ve debug komutlari.</div>
    </div>

    <div class="content-block">
      <h3>IPsec Tunnel Durum Kontrol</h3>
      <p>Tunnel'in UP/DOWN oldugunu hizlica anlamak icin:</p>
    </div>

    <details class="output-example" open>
      <summary>Ornek: get vpn ipsec tunnel summary</summary>
      <div class="output-body">
        <pre><code>'S_BRANCH_DSL_0' <span style="color:var(--ok)">up</span>     10.1.1.1:0   <span style="color:var(--ok)">203.0.113.37:0</span>
'S_BRANCH_LTE_0' <span style="color:var(--err)">down</span>   10.1.1.1:0   0.0.0.0:0
'S_HQ_0'  <span style="color:var(--ok)">up</span>     10.1.1.1:0   198.51.100.100:0</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th><th>Aksiyon</th></tr>
          <tr><td class="val"><span style="color:var(--ok)">up</span></td><td><span class="status-ok">NORMAL</span> — Tunnel calisiyor, trafik akabilir</td><td>Sorun yoksa dokunma</td></tr>
          <tr><td class="val"><span style="color:var(--err)">down</span></td><td><span class="status-err">SORUN</span> — Tunnel kurulamamis</td><td>Phase 1/2 kontrol et, IKE debug baslat</td></tr>
          <tr><td class="val">0.0.0.0:0</td><td>Karsi taraf IP'si alinamadi &rarr; Phase 1 basarisiz</td><td>PSK, proposal, peer IP kontrol et</td></tr>
          <tr><td class="val">Peer IP gorunuyor ama down</td><td>Phase 1 olabilir ama Phase 2 basarisiz</td><td>Phase 2 subnet eslesmesi kontrol et</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: diagnose vpn ike gateway list (Phase 1 detay)</summary>
      <div class="output-body">
        <pre><code>vd: root/0
name: S_BRANCH_DSL_0
version: 1
interface: wan1 10
addr: 10.1.1.1:500 -> 203.0.113.37:500
<span style="color:var(--ok)">created: 150s ago</span>
IKE SA: created 1/1  established 1/1  time 0/0/0 ms
IPsec SA: created 1/1  established 1/1  time 0/0/0 ms

  id/spi: 135 abcdef1234567890/1234567890abcdef
  direction: initiator
  <span style="color:var(--ok)">status: established 150-150s ago</span>
  proposal: aes256-sha256</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">status: <span style="color:var(--ok)">established</span></td><td><span class="status-ok">NORMAL</span> — Phase 1 basarili, IKE SA kuruldu</td></tr>
          <tr><td class="val">established 1/1</td><td><span class="status-ok">NORMAL</span> — 1 SA denendi, 1'i basarili</td></tr>
          <tr><td class="val">established 0/1</td><td><span class="status-err">SORUN</span> — Denendi ama kurulamadi. Proposal/PSK hatasi</td></tr>
          <tr><td class="val">created 0/0</td><td><span class="status-err">SORUN</span> — Hic deneme yapilmamis. Routing/interface kontrol et</td></tr>
          <tr><td class="val">direction: initiator</td><td>Bu taraf baglatiyor (dial-up degilse her iki taraf da olabilir)</td></tr>
          <tr><td class="val">direction: responder</td><td>Karsi taraf baslatmis, bu cihaz kabul etmis</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: get vpn ssl monitor (SSL VPN bagli kullanicilar)</summary>
      <div class="output-body">
        <pre><code>SSL VPN Login Users:
 Index   User    Auth Type   Timeout   From       HTTP in/out   HTTPS in/out
 0       ahmet   1(1)        291       10.0.0.5   0/0           154832/48291
 1       mehmet  1(1)        300       10.0.0.8   0/0           98421/32187</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">Kullanici listeleniyor</td><td><span class="status-ok">NORMAL</span> — Kullanici basariyla bagli</td></tr>
          <tr><td class="val">Bos liste</td><td><span class="status-warn">UYARI</span> — Kimse bagli degil. Kullanici giris yapamamis olabilir</td></tr>
          <tr><td class="val">Timeout: 0</td><td><span class="status-warn">UYARI</span> — Session zaman asimina ugramak uzere</td></tr>
          <tr><td class="val">HTTP in/out buyuk degerler</td><td>Kullanici aktif olarak trafik gonderiyor/aliyor</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>IPsec VPN Komutlari (${ipsecCmds.length})</h3>
      <div class="filter-list">
        ${ipsecCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>

    <div class="content-block">
      <h3>IKE Debug Yaparken Sik Gorulen Hatalar</h3>
      <table class="interpret-table">
        <tr><th>IKE Debug Mesaji</th><th>Anlami</th><th>Cozum</th></tr>
        <tr><td class="val">no proposal chosen</td><td><span class="status-err">Phase 1/2 proposal uyumsuz</span></td><td>Encryption, hash, DH group her iki tarafta ayni olmali</td></tr>
        <tr><td class="val">pre-shared key does not match</td><td><span class="status-err">PSK hatasi</span></td><td>Her iki taraftaki Pre-Shared Key'i kontrol edin</td></tr>
        <tr><td class="val">peer not reachable</td><td><span class="status-err">Karsi tarafa ulasilamadi</span></td><td>Routing, firewall, ISP seviyesinde kontrol edin. Port 500/4500 acik mi?</td></tr>
        <tr><td class="val">negotiation timeout</td><td><span class="status-err">Zaman asimi</span></td><td>Karsi taraf yanit vermiyor. Interface/routing/NAT kontrol</td></tr>
        <tr><td class="val">invalid id received</td><td><span class="status-warn">Peer ID uyumsuz</span></td><td>Local/Remote ID ayarlarini kontrol edin</td></tr>
        <tr><td class="val">phase2 sa not found</td><td><span class="status-err">Phase 2 kurulamamis</span></td><td>Phase 2 selector (subnet) eslesmesi kontrol edin</td></tr>
        <tr><td class="val">received notify: AUTHENTICATION_FAILED</td><td><span class="status-err">Kimlik dogrulama basarisiz</span></td><td>PSK veya sertifika hatasi. Her iki tarafta kontrol edin</td></tr>
      </table>
    </div>

    <div class="content-block">
      <h3>SSL VPN Komutlari (${sslCmds.length})</h3>
      <div class="filter-list">
        ${sslCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>

    <div class="content-block">
      <h3>GRE Tunnel (${greCmds.length})</h3>
      <div class="filter-list">
        ${greCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── HA ───
function renderHA() {
  const haCmds = COMMANDS.filter(c => c.cat === "HA");
  const el = document.getElementById("ha");
  el.innerHTML = `
    ${renderConfigGuides("ha")}
    <div class="section-header">
      <h2>HA — High Availability / Cluster</h2>
      <div class="description">HA durum kontrolu, failover testi ve senkronizasyon yonetimi.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: get system ha status</summary>
      <div class="output-body">
        <pre><code>HA Health Status: OK
Model: FortiGate-100F
Mode: HA A-P
Group: 0
Debug: 0
Cluster Uptime: 45 days 12:35:22
Cluster state change time: 2024-01-15 08:22:11

Master: <span style="color:var(--ok)">FG100FTK20000001</span> , HA cluster index = 0
Slave : <span style="color:var(--warn)">FG100FTK20000002</span> , HA cluster index = 1

number of vcluster: 1
vcluster 1: work 169.254.0.2
Master: FG100FTK20000001, operating cluster index = 0
Slave : FG100FTK20000002, operating cluster index = 1</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th><th>Aksiyon</th></tr>
          <tr><td class="val">HA Health Status: <span style="color:var(--ok)">OK</span></td><td><span class="status-ok">NORMAL</span> — Cluster saglikli</td><td>Sorun yok</td></tr>
          <tr><td class="val">HA Health Status: <span style="color:var(--err)">Critical</span></td><td><span class="status-err">KRITIK</span> — Cluster sorunu var</td><td>Interface/heartbeat/config sync kontrol et</td></tr>
          <tr><td class="val">Mode: HA A-P</td><td>Active-Passive mod</td><td>&mdash;</td></tr>
          <tr><td class="val">Mode: HA A-A</td><td>Active-Active mod</td><td>&mdash;</td></tr>
          <tr><td class="val">Master: FG100FTK2000<span style="color:var(--ok)">0001</span></td><td>Bu seri no aktif (master) cihaz</td><td>get system status ile karsilastir</td></tr>
          <tr><td class="val">Slave: FG100FTK2000<span style="color:var(--warn)">0002</span></td><td>Bu seri no yedek (slave) cihaz</td><td>&mdash;</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: diagnose sys ha checksum cluster (config senkron mu?)</summary>
      <div class="output-body">
        <pre><code>================== FG100FTK20000001 ==================
is_manage_master()=1, is_root_master()=1
global: <span style="color:var(--ok)">ab cd ef 12 34 56 78 90</span>
root: <span style="color:var(--ok)">12 34 ab cd ef 56 78 90</span>
all: <span style="color:var(--ok)">aa bb cc dd ee ff 00 11</span>

================== FG100FTK20000002 ==================
is_manage_master()=0, is_root_master()=0
global: <span style="color:var(--ok)">ab cd ef 12 34 56 78 90</span>
root: <span style="color:var(--ok)">12 34 ab cd ef 56 78 90</span>
all: <span style="color:var(--ok)">aa bb cc dd ee ff 00 11</span></code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">Iki cihazin checksum'lari <span style="color:var(--ok)">AYNI</span></td><td><span class="status-ok">SENKRON</span> — Konfigurasyonlar esit, sorun yok</td></tr>
          <tr><td class="val">Checksum'lar <span style="color:var(--err)">FARKLI</span></td><td><span class="status-err">SENKRON DEGIL</span> — Config farkli! <code>diagnose sys ha checksum recalculate</code> veya <code>execute ha synchronize start</code> deneyin</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>HA Failover Test Proseduru</h3>
      <ol class="step-list">
        <li>Ana cihaza SSH ile CLI'dan girin</li>
        <li><span class="filter-code" onclick="copyToClipboard('get system status')">get system status</span> ile seri numarasina bakin</li>
        <li><span class="filter-code" onclick="copyToClipboard('execute ha manage 0')">execute ha manage 0</span> ile diger cihaza atlayin</li>
        <li><span class="filter-code" onclick="copyToClipboard('get system status')">get system status</span> ile yedek cihazin seri numarasini dogrulayin</li>
        <li><span class="filter-code" onclick="copyToClipboard('config system interface')">config system interface</span> ile interface icine girin</li>
        <li><span class="filter-code" onclick="copyToClipboard('edit wan1')">edit wan1</span> ile wan1'i secin</li>
        <li><span class="filter-code" onclick="copyToClipboard('set status down')">set status down</span> ile DOWN'a cekin (failover tetiklenir)</li>
        <li><span class="filter-code" onclick="copyToClipboard('set status up')">set status up</span> ile tekrar UP yapin</li>
      </ol>
      <div class="warn-box">
        <span class="note-label">Dikkat:</span> Bu prosedur slave cihaza master'dan atlayip WAN portunu down/up yapar. Failover oncesi mutlaka <strong>get system status</strong> ile seri numarasindan dogru cihazda oldugunuzu dogrulayin!
      </div>
    </div>

    <div class="content-block">
      <h3>Tum HA Komutlari (${haCmds.length})</h3>
      <div class="filter-list">
        ${haCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── ROUTING ───
function renderRouting() {
  const routeCmds = COMMANDS.filter(c => c.cat === "Routing");
  const ospfCmds = COMMANDS.filter(c => c.cat === "OSPF");
  const bgpCmds = COMMANDS.filter(c => c.cat === "BGP");
  const mcastCmds = COMMANDS.filter(c => c.cat === "Multicast");
  const allRouteCmds = COMMANDS.filter(c => c.cat === "Routing" || c.cat === "OSPF" || c.cat === "BGP" || c.cat === "Multicast");
  const el = document.getElementById("routing");
  el.innerHTML = `
    ${renderConfigGuides("routing")}
    <div class="section-header">
      <h2>Routing — Static / OSPF / BGP / Multicast</h2>
      <div class="description">Routing tablosu, dinamik protokoller ve troubleshooting.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: get router info routing-table all</summary>
      <div class="output-body">
        <pre><code>Codes: K - kernel, C - connected, S - static, R - RIP, B - BGP
       O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area
       * - candidate default

<span style="color:var(--ok)">S*     0.0.0.0/0 [10/0] via 203.0.113.1, wan1</span>
<span style="color:var(--info)">C      10.200.1.0/24 is directly connected, port5</span>
<span style="color:var(--info)">C      10.200.2.0/24 is directly connected, port6</span>
<span style="color:var(--purple)">O      10.10.0.0/24 [110/200] via 10.1.1.2, vpn_hq, 01:23:45</span>
<span style="color:var(--purple)">O E2   172.16.0.0/16 [110/20] via 10.1.1.2, vpn_hq, 00:45:12</span>
<span style="color:var(--warn)">B      192.168.100.0/24 [200/0] via 10.5.5.1, port3, 02:15:30</span>
<span style="color:var(--ok)">S      10.20.0.0/16 [10/0] via 10.1.1.2, vpn_branch</span></code></pre>
        <table class="interpret-table">
          <tr><th>Kod</th><th>Anlami</th><th>Aciklama</th></tr>
          <tr><td class="val" style="color:var(--ok)">S*</td><td>Default Static Route</td><td>Internet cikisi — * candidate default demek</td></tr>
          <tr><td class="val" style="color:var(--ok)">S</td><td>Static Route</td><td>Manuel eklenmis route</td></tr>
          <tr><td class="val" style="color:var(--info)">C</td><td>Connected</td><td>Dogrudan bagli network (interface'in kendi subnet'i)</td></tr>
          <tr><td class="val" style="color:var(--purple)">O</td><td>OSPF</td><td>OSPF ile ogrenilmis route</td></tr>
          <tr><td class="val" style="color:var(--purple)">O E2</td><td>OSPF External Type 2</td><td>Baska routing domain'den redistrubute edilmis</td></tr>
          <tr><td class="val" style="color:var(--warn)">B</td><td>BGP</td><td>BGP ile ogrenilmis route</td></tr>
          <tr><td class="val">[10/0]</td><td>[distance/metric]</td><td>Dusuk distance = daha oncelikli. 10=static, 110=OSPF, 200=BGP</td></tr>
          <tr><td class="val">via 10.1.1.2, vpn_hq</td><td>Next-hop ve cikis interface</td><td>Trafik bu adres/interface uzerinden gidecek</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: diagnose firewall proute list (Policy Route / SD-WAN)</summary>
      <div class="output-body">
        <pre><code>id=0x0100000a tos=0x00 tos_mask=0x00 protocol=0 flag=0x0
  src=10.200.1.0-10.200.1.255:0-65535
  dst=0.0.0.0-255.255.255.255:0-65535
  out(0)=wan2  gateway: 198.51.100.1
  action=accept  used=1234</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">src=10.200.1.0-10.200.1.255</td><td>Bu subnet'ten gelen trafik icin gecerli</td></tr>
          <tr><td class="val">out=wan2 gateway: 198.51.100.1</td><td>Trafik wan2'den 198.51.100.1 uzerinden cikacak</td></tr>
          <tr><td class="val">used=1234</td><td>Bu policy route 1234 kez kullanilmis</td></tr>
          <tr><td class="val">used=0</td><td><span class="status-warn">Hic kullanilmamis</span> — Policy route eslesmiyor olabilir</td></tr>
        </table>
        <div class="hint-box" style="margin:12px 16px">
          <span class="note-label">Onemli:</span> Policy route'lar normal routing'den <strong>ONCE</strong> uygulanir. SD-WAN aktifse bu listede SD-WAN kurallari da gorulur. Trafik beklenmeyen yoldan gidiyorsa once buraya bakin!
        </div>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: get router info ospf neighbor (OSPF komsulari)</summary>
      <div class="output-body">
        <pre><code>OSPF process 0, VRF 0:
Neighbor ID     Pri   State            Dead Time   Address         Interface
10.1.1.2          1   <span style="color:var(--ok)">Full/BDR</span>         00:00:38    10.1.1.2        vpn_hq
10.2.2.2          1   <span style="color:var(--ok)">Full/DR</span>          00:00:35    10.2.2.2        port3
10.3.3.3          1   <span style="color:var(--err)">Init/DROther</span>     00:00:12    10.3.3.3        port4</code></pre>
        <table class="interpret-table">
          <tr><th>State</th><th>Anlami</th><th>Aksiyon</th></tr>
          <tr><td class="val" style="color:var(--ok)">Full/DR veya Full/BDR</td><td><span class="status-ok">NORMAL</span> — OSPF komsu iliskisi tam</td><td>Sorun yok, route'lar paylasiliyor</td></tr>
          <tr><td class="val" style="color:var(--warn)">2-Way/DROther</td><td><span class="status-warn">UYARI</span> — Komsu goruldu ama Full degil</td><td>Network type veya area eslesmesi kontrol</td></tr>
          <tr><td class="val" style="color:var(--err)">Init</td><td><span class="status-err">SORUN</span> — Hello aliniyor ama 2-way olmuyor</td><td>Hello/Dead timer, area ID, authentication kontrol</td></tr>
          <tr><td class="val" style="color:var(--err)">Down</td><td><span class="status-err">SORUN</span> — Komsu tamamen kayip</td><td>Fiziksel baglanti, interface durumu, ACL kontrol</td></tr>
          <tr><td class="val">Dead Time azaliyor</td><td>Countdown — 0'a duserse komsu kaybolur</td><td>Hello paketleri geliyorsa timer resetlenir</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Static/Kernel Routing (${routeCmds.length})</h3>
      <div class="filter-list">
        ${routeCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
    <div class="content-block">
      <h3>OSPF (${ospfCmds.length})</h3>
      <div class="filter-list">
        ${ospfCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
    <div class="content-block">
      <h3>BGP (${bgpCmds.length})</h3>
      <div class="filter-list">
        ${bgpCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
    ${mcastCmds.length > 0 ? `<div class="content-block">
      <h3>Multicast (${mcastCmds.length})</h3>
      <div class="filter-list">
        ${mcastCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>` : ""}
  `;
}

// ─── INTERFACES ───
function renderInterfaces() {
  const ifCmds = COMMANDS.filter(c => c.cat === "Interface");
  const el = document.getElementById("interfaces");
  el.innerHTML = `
    ${renderConfigGuides("interfaces")}
    <div class="section-header">
      <h2>Interface Yonetimi</h2>
      <div class="description">Interface konfigurasyonu, durum kontrolu ve yonetimi.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: get system interface physical</summary>
      <div class="output-body">
        <pre><code>== [wan1]
    mode: static
    ip: 203.0.113.50 255.255.255.252
    status: <span style="color:var(--ok)">up</span>
    speed: <span style="color:var(--ok)">1000full</span>
    rx_packets: 12345678  rx_bytes: 9876543210
    tx_packets: 8765432   tx_bytes: 7654321098

== [wan2]
    mode: static
    ip: 198.51.100.50 255.255.255.252
    status: <span style="color:var(--err)">down</span>
    speed: n/a

== [port5]
    mode: static
    ip: 10.200.1.1 255.255.255.0
    status: <span style="color:var(--ok)">up</span>
    speed: <span style="color:var(--ok)">1000full</span></code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th><th>Aksiyon</th></tr>
          <tr><td class="val">status: <span style="color:var(--ok)">up</span></td><td><span class="status-ok">NORMAL</span> — Interface calisiyor</td><td>Sorun yok</td></tr>
          <tr><td class="val">status: <span style="color:var(--err)">down</span></td><td><span class="status-err">SORUN</span> — Interface kapalı veya kablo yok</td><td>Kablo kontrolu, karsi taraf switch port kontrolu, <code>set status up</code></td></tr>
          <tr><td class="val">speed: <span style="color:var(--ok)">1000full</span></td><td><span class="status-ok">NORMAL</span> — 1Gbps full-duplex</td><td>Sorun yok</td></tr>
          <tr><td class="val">speed: <span style="color:var(--warn)">100half</span></td><td><span class="status-warn">UYARI</span> — 100Mbps half-duplex</td><td>Duplex mismatch! Karsi tarafla auto-neg veya sabit ayar kontrol</td></tr>
          <tr><td class="val">speed: <span style="color:var(--warn)">10full</span></td><td><span class="status-warn">UYARI</span> — 10Mbps, kotu kablo veya kotu port olabilir</td><td>Kablo/patch panel degisikligi dene</td></tr>
          <tr><td class="val">speed: n/a</td><td>Interface down oldugu icin hiz bilgisi yok</td><td>Once interface'i UP yapin</td></tr>
          <tr><td class="val">mode: dhcp</td><td>IP adresi DHCP ile aliniyor</td><td>IP yoksa DHCP server kontrol et</td></tr>
          <tr><td class="val">mode: pppoe</td><td>PPPoE ile baglanti (DSL/Fiber)</td><td>ISP credential'lari ve link durumunu kontrol et</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: diagnose hardware deviceinfo nic port3</summary>
      <div class="output-body">
        <pre><code>Name:           port3
Driver:         igb
Version:        5.3.0-k
Firmware:       0x800009fa
Bus:            0000:06:00.0
Hwaddr:         00:09:0f:ab:cd:ef
Permanent Hwaddr: 00:09:0f:ab:cd:ef
<span style="color:var(--ok)">State:          up</span>
<span style="color:var(--ok)">Link:           yes</span>
<span style="color:var(--ok)">Speed:          1000</span>
<span style="color:var(--ok)">Duplex:         full</span>
<span style="color:var(--err)">Rx_CRC_errors:  153</span>
Rx_errors:      0
Tx_errors:      0
Collisions:     0</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">Link: <span style="color:var(--ok)">yes</span></td><td><span class="status-ok">NORMAL</span> — Fiziksel link var</td></tr>
          <tr><td class="val">Link: <span style="color:var(--err)">no</span></td><td><span class="status-err">SORUN</span> — Kablo takilmamis veya karsi taraf kapali</td></tr>
          <tr><td class="val">Rx_CRC_errors: <span style="color:var(--err)">> 0</span></td><td><span class="status-err">SORUN</span> — Kotu kablo, kotu port veya EMI (elektromanyetik girişim)</td></tr>
          <tr><td class="val">Collisions: <span style="color:var(--err)">> 0</span></td><td><span class="status-warn">UYARI</span> — Duplex mismatch isareti (full/half karisikligi)</td></tr>
          <tr><td class="val">Rx_errors / Tx_errors > 0</td><td><span class="status-warn">UYARI</span> — Fiziksel katmanda sorun var</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Interface Config Ornegi</h3>
      <p>Bir interface'in konfigurasyonunu gormek ve duzenlemek icin:</p>
      <div class="filter-list">
        <div class="filter-item">${makeCodeCell("show system interface wan1")}<span class="filter-desc">wan1 konfigurasyonunu goster</span></div>
        <div class="filter-item">${makeCodeCell("config system interface")}<span class="filter-desc">Interface config moduna gir</span></div>
        <div class="filter-item">${makeCodeCell("edit wan1")}<span class="filter-desc">wan1'i sec</span></div>
        <div class="filter-item">${makeCodeCell("show")}<span class="filter-desc">Sadece degistirilmis ayarlari goster</span></div>
        <div class="filter-item">${makeCodeCell("show full-configuration")}<span class="filter-desc">Tum ayarlari (default dahil) goster</span></div>
        <div class="filter-item">${makeCodeCell("set status down")}<span class="filter-desc">Interface'i kapat</span></div>
        <div class="filter-item">${makeCodeCell("set status up")}<span class="filter-desc">Interface'i ac</span></div>
        <div class="filter-item">${makeCodeCell("end")}<span class="filter-desc">Config modundan cik</span></div>
      </div>
    </div>

    <div class="content-block">
      <h3>Tum Interface Komutlari (${ifCmds.length})</h3>
      <div class="filter-list">
        ${ifCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── ARP / PING / TELNET ───
function renderArpPing() {
  const arpCmds = COMMANDS.filter(c => c.cat === "ARP" || c.cat === "Ping" || c.cat === "Connectivity");
  const el = document.getElementById("arpping");
  el.innerHTML = `
    <div class="section-header">
      <h2>ARP / Ping / Telnet / SSH</h2>
      <div class="description">Temel network teshis araclari — baglanti kontrolu icin ilk adim.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: get system arp</summary>
      <div class="output-body">
        <pre><code>Address         Age(min)  Hardware Addr      Interface
10.200.1.50     2         <span style="color:var(--ok)">00:0c:29:ab:cd:ef</span>  port5
10.200.1.51     0         <span style="color:var(--ok)">00:50:56:12:34:56</span>  port5
203.0.113.1    0         <span style="color:var(--ok)">00:1a:2b:3c:4d:5e</span>  wan1
10.200.2.100    15        <span style="color:var(--warn)">00:00:00:00:00:00</span>  port6</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">Normal MAC adresi goruluyor</td><td><span class="status-ok">NORMAL</span> — ARP cozumlendi, L2 baglanti var</td></tr>
          <tr><td class="val">00:00:00:00:00:00</td><td><span class="status-warn">UYARI</span> — ARP cozumlenemedi, hedef ulasilamaz veya yanit vermiyor</td></tr>
          <tr><td class="val">Age(min) = 0</td><td>ARP yeni olusturulmus veya taze</td></tr>
          <tr><td class="val">Ayni IP farkli MAC</td><td><span class="status-err">IP CATISMASI</span> — Iki cihaz ayni IP'yi kullaniyor!</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: execute ping (sonuc yorumlama)</summary>
      <div class="output-body">
        <pre><code>PING 192.168.1.28 (192.168.1.28): 56 data bytes
64 bytes from 192.168.1.28: icmp_seq=0 ttl=64 time=1.2 ms
64 bytes from 192.168.1.28: icmp_seq=1 ttl=64 time=0.8 ms
64 bytes from 192.168.1.28: icmp_seq=2 ttl=64 time=1.1 ms
64 bytes from 192.168.1.28: icmp_seq=3 ttl=64 time=0.9 ms
64 bytes from 192.168.1.28: icmp_seq=4 ttl=64 time=1.0 ms

--- 192.168.1.28 ping statistics ---
5 packets transmitted, 5 packets received, <span style="color:var(--ok)">0% packet loss</span>
round-trip min/avg/max = 0.8/1.0/1.2 ms</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val"><span style="color:var(--ok)">0% packet loss</span></td><td><span class="status-ok">NORMAL</span> — Hedef erisilebilir</td></tr>
          <tr><td class="val"><span style="color:var(--warn)">%1-10 packet loss</span></td><td><span class="status-warn">UYARI</span> — Arasindan paket kayboluyor, link kalitesi kotu</td></tr>
          <tr><td class="val"><span style="color:var(--err)">100% packet loss</span></td><td><span class="status-err">SORUN</span> — Hedef tamamen ulasilamaz</td></tr>
          <tr><td class="val">ttl=64</td><td>Linux/Unix cihaz (default TTL: 64)</td></tr>
          <tr><td class="val">ttl=128</td><td>Windows cihaz (default TTL: 128)</td></tr>
          <tr><td class="val">ttl=255</td><td>Network cihazi (router/switch, default TTL: 255)</td></tr>
          <tr><td class="val">time > 100ms</td><td><span class="status-warn">Yuksek latency</span> — WAN/VPN uzerinden olabilir veya congestion var</td></tr>
          <tr><td class="val">Destination Host Unreachable</td><td><span class="status-err">ARP cozumlenemedi</span> — L2 baglanti yok veya gateway yanit vermiyor</td></tr>
          <tr><td class="val">Request timeout</td><td><span class="status-err">ICMP engellenmis olabilir</span> — Firewall ICMP drop ediyor olabilir</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Kaynak IP ile Ping (Onemli!)</h3>
      <p>FortiGate'ten ping atarken <strong>kaynak IP secimi</strong> kritiktir. Varsayilan olarak en yakin interface IP'si kullanilir, ama VPN/routing test ederken belirli interface'den test etmeniz gerekir:</p>
      <div class="filter-list">
        <div class="filter-item">${makeCodeCell("execute ping-options source 192.168.1.1")}<span class="filter-desc">Kaynak IP'yi belirle</span></div>
        <div class="filter-item">${makeCodeCell("execute ping-options repeat-count 19")}<span class="filter-desc">Tekrar sayisi (default 5)</span></div>
        <div class="filter-item">${makeCodeCell("execute ping-options view-settings")}<span class="filter-desc">Mevcut ping ayarlarini goster</span></div>
        <div class="filter-item">${makeCodeCell("execute ping 192.168.1.28")}<span class="filter-desc">Ayarlanmis opsiyonlarla ping at</span></div>
      </div>
    </div>

    <div class="content-block">
      <h3>Tum Komutlar (${arpCmds.length})</h3>
      <div class="filter-list">
        ${arpCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span><span class="muted" style="font-size:10px;margin-left:auto;">${c.cat}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── SYSTEM ───
function renderSystem() {
  const sysCmds = COMMANDS.filter(c => c.cat === "System" || c.cat === "Hardware");
  const el = document.getElementById("system");
  el.innerHTML = `
    ${renderConfigGuides("system")}
    <div class="section-header">
      <h2>System / Hardware</h2>
      <div class="description">Sistem bilgisi, performans, hardware ve genel yonetim.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: get system status</summary>
      <div class="output-body">
        <pre><code>Version: FortiGate-100F v7.2.5,build1517,230811 (GA.F)
Virus-DB: 1.00000(2018-04-09 18:07)
IPS-DB: 24.00741(2023-08-10 02:38)
Serial-Number: <span style="color:var(--info)">FG100FTK20xxxxxx</span>
<span style="color:var(--ok)">Operation Mode: NAT</span>
Current HA mode: <span style="color:var(--ok)">a-p, master</span>
Hostname: <span style="color:var(--info)">M74KMRKOPR6351SOLf01</span>
Uptime: 45 days, 12 hours, 33 minutes</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">Serial-Number: FG100FTK...</td><td>Cihaz modeli ve seri no &mdash; HA'da hangi cihazda oldugunuzu buradan anlarsiniz</td></tr>
          <tr><td class="val">Operation Mode: NAT</td><td><span class="status-ok">NORMAL</span> &mdash; NAT/Route modu (en yaygin)</td></tr>
          <tr><td class="val">Operation Mode: Transparent</td><td>Transparent/bridge modu &mdash; L2 calisir, IP'siz</td></tr>
          <tr><td class="val">Current HA mode: a-p, <span style="color:var(--ok)">master</span></td><td><span class="status-ok">BU MASTER</span> &mdash; Active-Passive HA, bu cihaz aktif</td></tr>
          <tr><td class="val">Current HA mode: a-p, <span style="color:var(--warn)">slave</span></td><td><span class="status-warn">BU SLAVE</span> &mdash; Yedek cihazdasiniz. Konfig degisikligi master'dan yapilmali</td></tr>
          <tr><td class="val">Current HA mode: standalone</td><td>HA yok, tek cihaz</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: get system performance status</summary>
      <div class="output-body">
        <pre><code>CPU states: <span style="color:var(--ok)">12% user 3% system 0% nice 85% idle</span>
CPU0 states: 15% user 4% system 0% nice 81% idle
CPU1 states: 9% user 2% system 0% nice 89% idle
Memory: 8155864K total, <span style="color:var(--ok)">4892516K used (60%)</span>
Average network usage: 156832 kbps in 1 minute
Uptime: 45 days, 12 hours, 34 minutes</code></pre>
        <table class="interpret-table">
          <tr><th>Deger</th><th>Durum</th><th>Aksiyon</th></tr>
          <tr><td class="val">CPU idle > 70%</td><td><span class="status-ok">NORMAL</span></td><td>Sorun yok</td></tr>
          <tr><td class="val">CPU idle 30-70%</td><td><span class="status-warn">UYARI</span></td><td>diagnose sys top ile hangi process yukledigine bak</td></tr>
          <tr><td class="val">CPU idle < 30%</td><td><span class="status-err">KRITIK</span></td><td>Acil mudahale. IPS/proxy/session overflow olabilir</td></tr>
          <tr><td class="val">Memory used < 70%</td><td><span class="status-ok">NORMAL</span></td><td>Sorun yok</td></tr>
          <tr><td class="val">Memory used 70-85%</td><td><span class="status-warn">UYARI</span></td><td>Session sayisi artiyorsa conserve mode yaklasabilir</td></tr>
          <tr><td class="val">Memory used > 85%</td><td><span class="status-err">KRITIK</span></td><td><strong>Conserve mode riski!</strong> Yeni session kabul edilmeyebilir</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: diagnose sys top (hangi process CPU yiyor?)</summary>
      <div class="output-body">
        <pre><code>Run Time:  45 days, 12 hours, 35 minutes
0U, 0N, 3S, 97I, 0WA, 0HI, 0SI, 0ST; 7968T, 3063F
       ipsengine    83      S <  <span style="color:var(--err)">45.2</span>     3.8
       wad          92      S       8.1     2.1
       miglogd     105      S       2.3     1.5
       httpsd      201      S       1.1     0.8
       sslvpnd     118      S       0.5     0.4</code></pre>
        <table class="interpret-table">
          <tr><th>Process</th><th>Yuksekse Ne Anlama Gelir?</th><th>Cozum</th></tr>
          <tr><td class="val">ipsengine</td><td><span class="status-err">IPS/AV/App Control taramasi agir</span></td><td>IPS profil ayarlarini hafiflletin veya IPS'i bypass edin (test icin)</td></tr>
          <tr><td class="val">wad</td><td><span class="status-warn">Proxy-based inspection (explicit/transparent proxy)</span></td><td>Flow-based'e gecis dusunun, proxy session sayisini kontrol edin</td></tr>
          <tr><td class="val">miglogd</td><td><span class="status-warn">Log daemon &mdash; disk I/O veya FAZ baglanti sorunu</span></td><td>Log seviyesini azaltin, FAZ baglantisini kontrol edin</td></tr>
          <tr><td class="val">sslvpnd</td><td><span class="status-warn">SSL VPN kullanici sayisi yuksek</span></td><td>Bagli kullanici sayisini ve IP pool'u kontrol edin</td></tr>
          <tr><td class="val">httpsd</td><td><span class="status-info">Web UI (admin GUI) kullanimlari</span></td><td>Cok admin ayni anda GUI'ye giriyorsa normal</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Tum System/Hardware Komutlari (${sysCmds.length})</h3>
      <div class="filter-list">
        ${sysCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span><span class="muted" style="font-size:10px;margin-left:auto;">${c.cat}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── SESSION ───
function renderSession() {
  const sessCmds = COMMANDS.filter(c => c.cat === "Session");
  const el = document.getElementById("session");
  el.innerHTML = `
    ${renderConfigGuides("session")}
    <div class="section-header">
      <h2>Session Yonetimi</h2>
      <div class="description">Session tablosu, filtreleme ve temizleme. Baglanti sorunlarini anlamak icin kritik.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: get system session status</summary>
      <div class="output-body">
        <pre><code>The total number of sessions for the current VDOM: <span style="color:var(--info)">125432</span></code></pre>
        <table class="interpret-table">
          <tr><th>Session Sayisi</th><th>Durum</th><th>Aksiyon</th></tr>
          <tr><td class="val">< model limiti'nin %50'si</td><td><span class="status-ok">NORMAL</span></td><td>Sorun yok</td></tr>
          <tr><td class="val">%50-80 arasi</td><td><span class="status-warn">UYARI</span></td><td>Izleyin, artis hizi kontrol edin</td></tr>
          <tr><td class="val">> %80</td><td><span class="status-err">KRITIK</span></td><td><strong>Conserve mode riski!</strong> Session temizleme veya TTL dusurme gerekebilir</td></tr>
        </table>
        <div class="hint-box" style="margin:12px 16px">
          <span class="note-label">Conserve Mode nedir?</span> Memory %85+ doldiginda FortiGate yeni session kabul etmeyi durdurur. Bu durumda yeni baglanti kurulamaz! <code>get system performance status</code> ile memory kontrolu yapin.
        </div>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: diagnose sys session list (session detayi)</summary>
      <div class="output-body">
        <pre><code>session info: proto=6 proto_state=<span style="color:var(--ok)">01</span> duration=45 expire=3600
    <span style="color:var(--info)">policy id=5</span> id_policy=5 auth_info=0 chk_client_info=0 vd=0
    serial=01ab2cd3 tos=ff/ff app_list=0 app=0 url_cat=0
    <span style="color:var(--ok)">state=may_dirty os rs</span>
    statistic(bytes/packets/allow_err): org=13624/89/1 reply=52347/102/1
    src=10.200.1.50 sport=44821 <span style="color:var(--info)">dst=93.184.216.34 dport=443</span>
    src=93.184.216.34 sport=443 <span style="color:var(--info)">dst=203.0.113.50 dport=44821</span> (NAT)
    duration=45 expire=3600 timeout=3600</code></pre>
        <table class="interpret-table">
          <tr><th>Alan</th><th>Anlami</th></tr>
          <tr><td class="val">proto=6</td><td>TCP (6=TCP, 17=UDP, 1=ICMP)</td></tr>
          <tr><td class="val">proto_state=01</td><td><span class="status-ok">Established</span> (00=yeni, 01=established, 02=closing)</td></tr>
          <tr><td class="val">policy id=5</td><td>Bu session policy 5 tarafindan eslesti</td></tr>
          <tr><td class="val">state=may_dirty</td><td>Session guncellenebilir (normal)</td></tr>
          <tr><td class="val">duration / expire</td><td>Session ne kadar suredir acik / ne zaman kapanacak</td></tr>
          <tr><td class="val">org= / reply=</td><td>Kaynak &rarr; hedef / hedef &rarr; kaynak byte/paket sayisi</td></tr>
          <tr><td class="val">reply satiri farkli IP</td><td>NAT uygulanmis (src IP = NAT sonrasi WAN IP)</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Session Filtreleme Ornekleri</h3>
      <div class="filter-list">
        <div class="filter-item">${makeCodeCell("diagnose sys session filter dst 10.20.9.84")}<span class="filter-desc">Hedef IP'ye gore filtrele</span></div>
        <div class="filter-item">${makeCodeCell("diagnose sys session filter src 10.200.1.50")}<span class="filter-desc">Kaynak IP'ye gore filtrele</span></div>
        <div class="filter-item">${makeCodeCell("diagnose sys session filter sport 443")}<span class="filter-desc">Kaynak port filtresi</span></div>
        <div class="filter-item">${makeCodeCell("diagnose sys session filter dport 22")}<span class="filter-desc">Hedef port filtresi</span></div>
        <div class="filter-item">${makeCodeCell("diagnose sys session filter policy 5")}<span class="filter-desc">Belirli policy'ye eslesen session'lar</span></div>
        <div class="filter-item">${makeCodeCell("diagnose sys session filter proto 17")}<span class="filter-desc">Sadece UDP session'lari (17=UDP)</span></div>
        <div class="filter-item">${makeCodeCell("diagnose sys session list")}<span class="filter-desc">Filtrelenmis session'lari goster</span></div>
        <div class="filter-item">${makeCodeCell("diagnose sys session clear")}<span class="filter-desc">Filtrelenmis session'lari sil (dikkatli kullanin!)</span></div>
      </div>
      <div class="warn-box">
        <span class="note-label">Dikkat:</span> <code>diagnose sys session clear</code> filtresiz calistirilirsa <strong>TUM SESSION'LARI SILER!</strong> Once mutlaka filtre koyun.
      </div>
    </div>

    <div class="content-block">
      <h3>Tum Session Komutlari (${sessCmds.length})</h3>
      <div class="filter-list">
        ${sessCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── POLICY ───
function renderPolicy() {
  const polCmds = COMMANDS.filter(c => c.cat === "Policy");
  const el = document.getElementById("policy");
  el.innerHTML = `
    ${renderConfigGuides("policy")}
    <div class="section-header">
      <h2>Firewall Policy / PBR</h2>
      <div class="description">Firewall kurallari ve Policy Based Routing.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: show firewall policy 1</summary>
      <div class="output-body">
        <pre><code>config firewall policy
    edit 1
        set name "LAN_to_WAN"
        set srcintf "<span style="color:var(--info)">port5</span>"
        set dstintf "<span style="color:var(--info)">wan1</span>"
        set action <span style="color:var(--ok)">accept</span>
        set srcaddr "<span style="color:var(--info)">LAN_SUBNET</span>"
        set dstaddr "<span style="color:var(--info)">all</span>"
        set schedule "always"
        set service "ALL"
        set <span style="color:var(--warn)">utm-status enable</span>
        set ssl-ssh-profile "certificate-inspection"
        set av-profile "default"
        set ips-sensor "default"
        set nat <span style="color:var(--ok)">enable</span>
        set logtraffic all
    next
end</code></pre>
        <table class="interpret-table">
          <tr><th>Alan</th><th>Anlami</th></tr>
          <tr><td class="val">action accept</td><td><span class="status-ok">IZIN VER</span> — Trafik gecebilir</td></tr>
          <tr><td class="val">action deny</td><td><span class="status-err">ENGELLE</span> — Trafik drop edilir</td></tr>
          <tr><td class="val">srcintf / dstintf</td><td>Giris ve cikis interface'leri</td></tr>
          <tr><td class="val">nat enable</td><td>SNAT aktif — kaynak IP WAN IP'ye cevirilecek</td></tr>
          <tr><td class="val">utm-status enable</td><td>UTM (AV/IPS/WebFilter) taramasi aktif</td></tr>
          <tr><td class="val">logtraffic all</td><td>Tum trafik loglanacak</td></tr>
          <tr><td class="val">logtraffic utm</td><td>Sadece UTM event'leri loglanacak</td></tr>
          <tr><td class="val">schedule "always"</td><td>7/24 gecerli</td></tr>
        </table>
      </div>
    </details>

    <div class="hint-box">
      <span class="note-label">Onemli:</span> Policy'ler <strong>yukaridan asagiya</strong> sirayla kontrol edilir. Ilk eslesen policy uygulanir! Debug flow'da <code>Allowed by Policy-X</code> veya <code>Denied by forward policy check</code> mesajiyla hangi policy'nin eslestigini gorursunuz.
    </div>

    <div class="content-block">
      <h3>Policy Komutlari (${polCmds.length})</h3>
      <div class="filter-list">
        ${polCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── OBJECTS ───
function renderObjects() {
  const objCmds = COMMANDS.filter(c => c.cat === "Objects");
  const el = document.getElementById("objects");
  el.innerHTML = `
    ${renderConfigGuides("objects")}
    <div class="section-header">
      <h2>Objects / VIP (Virtual IP)</h2>
      <div class="description">Firewall address, VIP (DNAT) ve FQDN nesneleri.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: show firewall address (IP address nesnesi)</summary>
      <div class="output-body">
        <pre><code>config firewall address
    edit "IP_10.20.8.120/32"
        set subnet <span style="color:var(--info)">10.20.8.120 255.255.255.255</span>
    next
    edit "intranet.example.com"
        set type <span style="color:var(--info)">fqdn</span>
        set fqdn "intranet.example.com"
    next
end</code></pre>
        <table class="interpret-table">
          <tr><th>Tip</th><th>Ornek</th><th>Aciklama</th></tr>
          <tr><td class="val">subnet</td><td>10.20.8.120/32</td><td>Tekil IP veya subnet. /32 = tek host</td></tr>
          <tr><td class="val">fqdn</td><td>intranet.example.com</td><td>DNS ile cozumlenen adres. DNS degisirse otomatik guncellenir</td></tr>
          <tr><td class="val">iprange</td><td>10.0.0.1 - 10.0.0.50</td><td>IP araligi</td></tr>
          <tr><td class="val">geography</td><td>TR (Turkey)</td><td>Ulke bazli adres (GeoIP)</td></tr>
        </table>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: show firewall vip (Virtual IP / DNAT)</summary>
      <div class="output-body">
        <pre><code>config firewall vip
    edit "203.0.113.50_10.20.1.153_5060_UDP"
        set extip <span style="color:var(--info)">203.0.113.50</span>
        set mappedip <span style="color:var(--ok)">"10.20.1.153"</span>
        set extintf "wan1"
        set portforward <span style="color:var(--warn)">enable</span>
        set extport <span style="color:var(--info)">5060</span>
        set mappedport <span style="color:var(--info)">5060</span>
        set protocol <span style="color:var(--info)">udp</span>
    next
end</code></pre>
        <table class="interpret-table">
          <tr><th>Alan</th><th>Anlami</th></tr>
          <tr><td class="val">extip</td><td>Dis IP (WAN tarafinda gorunen IP)</td></tr>
          <tr><td class="val">mappedip</td><td>Ic IP (LAN tarafindaki gercek sunucu IP'si)</td></tr>
          <tr><td class="val">portforward enable</td><td>Port bazli DNAT — sadece belirli port yonlendirilir</td></tr>
          <tr><td class="val">portforward disable</td><td>Tum portlar yonlendirilir (1:1 NAT)</td></tr>
          <tr><td class="val">extport / mappedport</td><td>Dis port ve ic port (farkli olabilir)</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Object Komutlari (${objCmds.length})</h3>
      <div class="filter-list">
        ${objCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── USERS ───
function renderUsers() {
  const usrCmds = COMMANDS.filter(c => c.cat === "Users" || c.cat === "Auth" || c.cat === "LDAP");
  const el = document.getElementById("users");
  el.innerHTML = `
    ${renderConfigGuides("users")}
    <div class="section-header">
      <h2>Users / Authentication</h2>
      <div class="description">Kullanici yonetimi, LDAP, RADIUS, FSSO ve SAML.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: diagnose test authserver ldap (LDAP testi)</summary>
      <div class="output-body">
        <pre><code># diagnose test authserver ldap CORP_LDAP testuser P@ssw0rd123
<span style="color:var(--ok)">authenticate 'testuser' against 'CORP_LDAP' succeeded!</span>
Group membership(s):
  CN=VPN_Users,OU=Groups,DC=domain,DC=local</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th><th>Aksiyon</th></tr>
          <tr><td class="val"><span style="color:var(--ok)">succeeded!</span></td><td><span class="status-ok">BASARILI</span> — LDAP baglanti ve auth calisiyor</td><td>Sorun yok</td></tr>
          <tr><td class="val"><span style="color:var(--err)">failed!</span></td><td><span class="status-err">BASARISIZ</span> — Sifre yanlis veya kullanici bulunamadi</td><td>Sifre ve username kontrol et</td></tr>
          <tr><td class="val">connect error</td><td><span class="status-err">BAGLANTI HATASI</span> — LDAP sunucusuna ulasilamiyor</td><td>IP, port (389/636), source-ip ayarini kontrol et</td></tr>
          <tr><td class="val">Group membership</td><td>Kullanicinin uye oldugu AD gruplari</td><td>Policy'de dogru grubun secili oldugunu dogrulayin</td></tr>
        </table>
        <div class="warn-box" style="margin:12px 16px">
          <span class="note-label">Not:</span> LDAP test icin <strong>sifre musteriden istenir</strong>. Test komutu: <code>diagnose test authserver ldap &lt;server_name&gt; &lt;username&gt; &lt;password&gt;</code>
        </div>
      </div>
    </details>

    <details class="output-example">
      <summary>Ornek: diagnose debug authd fsso list (FSSO kullanicilari)</summary>
      <div class="output-body">
        <pre><code>----fsso logons----
IP: 10.200.1.50   User: DOMAIN\\ahmet   Groups: DOMAIN\\VPN_Users
    Workstation: PC-AHMET   MemberOf: CN=VPN_Users,OU=Groups
IP: 10.200.1.51   User: DOMAIN\\mehmet   Groups: DOMAIN\\IT_Admins
    Workstation: PC-MEHMET   MemberOf: CN=IT_Admins,OU=Groups
Total fsso logons: 2</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">Kullanicilar listeleniyor</td><td><span class="status-ok">NORMAL</span> — FSSO calisiyor, AD'den kullanicilar aliniyor</td></tr>
          <tr><td class="val">Total fsso logons: 0</td><td><span class="status-err">SORUN</span> — FSSO calismiyor veya DC'ye ulasilamiyor</td></tr>
          <tr><td class="val">Kullanici var ama policy calismiyor</td><td><span class="status-warn">Grup eslesmesi kontrol edin</span> — Policy'deki grup ile FSSO grubu ayni mi?</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>User & Auth Komutlari (${usrCmds.length})</h3>
      <div class="filter-list">
        ${usrCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span><span class="muted" style="font-size:10px;margin-left:auto;">${c.cat}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── UTM ───
function renderUTM() {
  const utmCmds = COMMANDS.filter(c => c.cat === "UTM" || c.cat === "IPS" || c.cat === "WAD");
  const el = document.getElementById("utm");
  el.innerHTML = `
    ${renderConfigGuides("utm")}
    <div class="section-header">
      <h2>UTM / IPS / WAD</h2>
      <div class="description">Web filter, IPS engine, WAD proxy, DLP ve uygulama kontrolu.</div>
    </div>

    <div class="content-block">
      <h3>UTM Nedir? — Hizli Rehber</h3>
      <table class="interpret-table">
        <tr><th>Modul</th><th>Ne Yapar?</th><th>CPU Etkisi</th><th>Ilgili Process</th></tr>
        <tr><td class="val">Web Filter</td><td>URL/kategori bazli web filtreleme (FortiGuard)</td><td><span class="status-info">Dusuk-Orta</span></td><td>urlfilter, wad</td></tr>
        <tr><td class="val">AntiVirus (AV)</td><td>Dosya taramasi (indirme/yukleme)</td><td><span class="status-warn">Orta-Yuksek</span></td><td>scanunit, ipsengine</td></tr>
        <tr><td class="val">IPS</td><td>Saldiri tespiti ve onleme (imza bazli)</td><td><span class="status-warn">Orta-Yuksek</span></td><td>ipsengine</td></tr>
        <tr><td class="val">Application Control</td><td>Uygulama tespiti ve engelleme (WhatsApp, Torrent vs.)</td><td><span class="status-info">Dusuk-Orta</span></td><td>ipsengine</td></tr>
        <tr><td class="val">DLP</td><td>Veri sizintisi onleme (kredi karti no, TC kimlik vs.)</td><td><span class="status-info">Dusuk</span></td><td>ipsengine</td></tr>
        <tr><td class="val">SSL Inspection</td><td>HTTPS trafikinin icerigini inceleme</td><td><span class="status-err">Yuksek</span></td><td>wad</td></tr>
        <tr><td class="val">WAD (Proxy)</td><td>Explicit/Transparent proxy engine</td><td><span class="status-warn">Orta-Yuksek</span></td><td>wad</td></tr>
      </table>
      <div class="hint-box">
        <span class="note-label">Flow vs Proxy:</span> <strong>Flow-based</strong> inspection daha hizlidir ama daha az detayli. <strong>Proxy-based</strong> tum icerigi buffer'a alir, daha detayli ama daha agir (wad process). CPU sorunu varsa flow-based'e gecis dusunun.
      </div>
    </div>

    <details class="output-example">
      <summary>Ornek: diagnose test application ipsmonitor 1 (IPS engine durumu)</summary>
      <div class="output-body">
        <pre><code>IPS: application running
IPS instances(roles): total 4
  0: running (IPS)
  1: running (IPS)
  2: running (IPS)
  3: running (AV+IPS)</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">application running</td><td><span class="status-ok">NORMAL</span> — IPS engine calisiyor</td></tr>
          <tr><td class="val">application not running</td><td><span class="status-err">SORUN</span> — IPS calismiyorsa <code>diagnose test application ipsmonitor 99</code> ile restart deneyin</td></tr>
          <tr><td class="val">total N instances</td><td>CPU core sayisina gore N adet IPS instance calisiyor</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>UTM/IPS/WAD Komutlari (${utmCmds.length})</h3>
      <div class="filter-list">
        ${utmCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span><span class="muted" style="font-size:10px;margin-left:auto;">${c.cat}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── SD-WAN ───
function renderSDWAN() {
  const sdCmds = COMMANDS.filter(c => c.cat === "SD-WAN");
  const el = document.getElementById("sdwan");
  el.innerHTML = `
    ${renderConfigGuides("sdwan")}
    <div class="section-header">
      <h2>SD-WAN</h2>
      <div class="description">SD-WAN health check, member ve kural yonetimi.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: diagnose sys sdwan health-check status</summary>
      <div class="output-body">
        <pre><code>Health Check(PING_Google):
  Seq(1): state(<span style="color:var(--ok)">alive</span>), packet-loss(0.000%) latency(12.345) jitter(1.234)
    sla_map=0x1
    Member: wan1(1)
  Seq(2): state(<span style="color:var(--err)">dead</span>), packet-loss(100.000%) latency(0.000) jitter(0.000)
    sla_map=0x0
    Member: wan2(2)</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th><th>Aksiyon</th></tr>
          <tr><td class="val">state(<span style="color:var(--ok)">alive</span>)</td><td><span class="status-ok">NORMAL</span> — Health check gecti, link saglikli</td><td>Sorun yok</td></tr>
          <tr><td class="val">state(<span style="color:var(--err)">dead</span>)</td><td><span class="status-err">SORUN</span> — Link down veya SLA karsilamiyor</td><td>Interface durumu ve ISP'yi kontrol et</td></tr>
          <tr><td class="val">packet-loss > %5</td><td><span class="status-warn">Link kalitesi kotu</span></td><td>ISP veya fiziksel baglanti sorunu olabilir</td></tr>
          <tr><td class="val">latency > 100ms</td><td><span class="status-warn">Yuksek gecikme</span></td><td>WAN link congest olmus olabilir</td></tr>
          <tr><td class="val">sla_map=0x0</td><td>Hicbir SLA hedefi karsilamiyor</td><td>Bu member trafik almayacak (failover tetiklenir)</td></tr>
          <tr><td class="val">sla_map=0x1</td><td>SLA 1 hedefini karsialiyor</td><td>Normal, trafik alabilir</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>SD-WAN Komutlari (${sdCmds.length})</h3>
      <div class="filter-list">
        ${sdCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── FEXT ───
function renderFEXT() {
  const fextCmds = COMMANDS.filter(c => c.cat === "FEXT");
  const el = document.getElementById("fext");
  el.innerHTML = `
    ${renderConfigGuides("fext")}
    <div class="section-header">
      <h2>FEXT — FortiExtender</h2>
      <div class="description">FortiExtender (LTE/DSL) yonetim komutlari. FortiGate uzerinden yonetilir.</div>
    </div>

    <div class="content-block">
      <h3>FEXT Nedir?</h3>
      <p>FortiExtender, FortiGate'e WAN baglantisi saglayan harici bir cihazidir. Genellikle LTE/4G/5G veya DSL baglantisi icin kullanilir. FortiGate CLI'dan yonetilir.</p>
      <table class="interpret-table">
        <tr><th>Senaryo</th><th>Kullanim</th></tr>
        <tr><td class="val">Birincil WAN</td><td>ISP baglantisi olmayan lokasyonlarda LTE uzerinden internet</td></tr>
        <tr><td class="val">Yedek WAN (failover)</td><td>Ana hat kesildiginde otomatik LTE'ye gecis</td></tr>
        <tr><td class="val">SD-WAN member</td><td>LTE hattini SD-WAN member olarak kullanma</td></tr>
      </table>
    </div>

    <details class="output-example">
      <summary>Ornek: get extender status</summary>
      <div class="output-body">
        <pre><code>Extender: FX201E0000000001
  Status: <span style="color:var(--ok)">connected</span>
  Model: FX201E
  Firmware: v4.2.3
  Signal: <span style="color:var(--ok)">-67 dBm (Good)</span>
  Carrier: Turkcell
  Technology: LTE
  IP: 10.10.0.29</code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th></tr>
          <tr><td class="val">Status: <span style="color:var(--ok)">connected</span></td><td><span class="status-ok">NORMAL</span> — FEXT bagli ve calisiyor</td></tr>
          <tr><td class="val">Status: <span style="color:var(--err)">disconnected</span></td><td><span class="status-err">SORUN</span> — FEXT bagli degil. Kablo/power kontrol</td></tr>
          <tr><td class="val">Signal: -50 ile -75 dBm</td><td><span class="status-ok">Iyi sinyal</span></td></tr>
          <tr><td class="val">Signal: -75 ile -90 dBm</td><td><span class="status-warn">Zayif sinyal — konum/anten kontrol</span></td></tr>
          <tr><td class="val">Signal: -90 dBm'den kotu</td><td><span class="status-err">Cok zayif — baglanti kopabilir</span></td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>FEXT Komutlari (${fextCmds.length})</h3>
      <div class="filter-list">
        ${fextCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── LOGGING ───
function renderLogging() {
  const logCmds = COMMANDS.filter(c => c.cat === "Logging");
  const el = document.getElementById("logging");
  el.innerHTML = `
    ${renderConfigGuides("logging")}
    <div class="section-header">
      <h2>Logging / Syslog / FortiAnalyzer</h2>
      <div class="description">Log yonetimi, syslog konfigurasyonu ve FortiAnalyzer baglantisi.</div>
    </div>

    <details class="output-example" open>
      <summary>Ornek: execute log fortianalyzer test-connectivity</summary>
      <div class="output-body">
        <pre><code>Response:
<span style="color:var(--ok)">Registration: registered</span>
Connection: <span style="color:var(--ok)">allow</span>
OFTP session: <span style="color:var(--ok)">connected</span>
SSL Connection: <span style="color:var(--ok)">yes</span></code></pre>
        <table class="interpret-table">
          <tr><th>Gordugun</th><th>Anlami</th><th>Aksiyon</th></tr>
          <tr><td class="val">Registration: <span style="color:var(--ok)">registered</span></td><td><span class="status-ok">NORMAL</span> — FAZ'a kayitli</td><td>Sorun yok</td></tr>
          <tr><td class="val">Registration: <span style="color:var(--err)">unregistered</span></td><td><span class="status-err">SORUN</span> — FAZ'a kayit olmamis</td><td>FAZ'dan cihazi ekleyin ve yetkilendirin</td></tr>
          <tr><td class="val">Connection: <span style="color:var(--err)">deny</span></td><td><span class="status-err">SORUN</span> — FAZ baglanti reddetti</td><td>FAZ uzerinden cihazi authorize edin</td></tr>
          <tr><td class="val">OFTP session: <span style="color:var(--err)">disconnected</span></td><td><span class="status-err">SORUN</span> — OFTP tunnel kurulamamis</td><td>Port 514 (syslog) veya 443 (OFTP) ACL kontrol edin</td></tr>
        </table>
      </div>
    </details>

    <div class="content-block">
      <h3>Log Goruntulemesi</h3>
      <div class="filter-list">
        <div class="filter-item">${makeCodeCell("execute log filter category traffic")}<span class="filter-desc">Trafik loglarina filtrele</span></div>
        <div class="filter-item">${makeCodeCell("execute log filter category event")}<span class="filter-desc">Event loglarina filtrele</span></div>
        <div class="filter-item">${makeCodeCell("execute log filter field srcip 10.200.1.50")}<span class="filter-desc">Kaynak IP'ye gore filtrele</span></div>
        <div class="filter-item">${makeCodeCell("execute log filter field dstip 93.184.216.34")}<span class="filter-desc">Hedef IP'ye gore filtrele</span></div>
        <div class="filter-item">${makeCodeCell("execute log filter view-lines 50")}<span class="filter-desc">Son 50 satir goster</span></div>
        <div class="filter-item">${makeCodeCell("exec log display")}<span class="filter-desc">Filtrelenmis loglari goruntule</span></div>
      </div>
    </div>

    <div class="content-block">
      <h3>Logging Komutlari (${logCmds.length})</h3>
      <div class="filter-list">
        ${logCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── MANAGED DEVICES ───
function renderManaged() {
  const swCmds = COMMANDS.filter(c => c.cat === "FortiSwitch");
  const el = document.getElementById("managed");
  el.innerHTML = `
    ${renderConfigGuides("managed")}
    <div class="section-header">
      <h2>FortiSwitch / FortiAP</h2>
      <div class="description">Managed switch ve access point yonetimi. FortiGate uzerinden CLI ile kontrol edilir.</div>
    </div>

    <div class="content-block">
      <h3>FortiSwitch Teshis Rehberi</h3>
      <table class="interpret-table">
        <tr><th>Sorun</th><th>Kontrol Komutu</th><th>Ne Aramaliyiz?</th></tr>
        <tr><td>Port'a bagli cihaz gorulmuyor</td><td class="val">diagnose switch-controller switch-info mac-table</td><td>MAC adresi listede var mi?</td></tr>
        <tr><td>Trunk calismiyor</td><td class="val">diagnose switch-controller switch-info trunk status</td><td>Trunk status: up/down?</td></tr>
        <tr><td>PoE cihaz beslenmiyorsa</td><td class="val">diagnose switch-controller switch-info poe</td><td>PoE budget asildimi, port PoE enabled mi?</td></tr>
        <tr><td>STP loop suptesi</td><td class="val">diagnose switch-controller switch-info stp</td><td>Port state: blocking/forwarding?</td></tr>
        <tr><td>802.1X auth sorunu</td><td class="val">diagnose switch-controller switch-info 802.1X</td><td>Port auth status: authorized/unauthorized?</td></tr>
        <tr><td>FortiSwitch baglanti sorunu</td><td class="val">execute switch-controller get-conn-status &lt;SN&gt;</td><td>Connection status: up/down?</td></tr>
      </table>
    </div>

    <div class="content-block">
      <h3>FortiSwitch Komutlari (${swCmds.length})</h3>
      <div class="filter-list">
        ${swCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── FORTIAP ───
function renderFortiAP() {
  const apCmds = COMMANDS.filter(c => c.cat === "FortiAP");
  const el = document.getElementById("fortiap");
  el.innerHTML = `
    ${renderConfigGuides("fortiap")}
    <div class="section-header">
      <h2>FortiAP — Wireless Access Point</h2>
      <div class="description">FortiAP yonetimi, SSID (VAP) yapilandirma, client/AP troubleshoot, CAPWAP.</div>
    </div>
    <div class="content-block">
      <h3>FortiAP Komutlari (${apCmds.length})</h3>
      <div class="filter-list">
        ${apCmds.map(c => `<div class="filter-item">${sevDot(c.sev)} ${makeCodeCell(c.code)}<span class="filter-desc">${escHtml(c.desc)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── SCENARIOS ───
function renderScenarios() {
  const el = document.getElementById("scenarios");
  el.innerHTML = `
    <div class="section-header">
      <h2>Sorun Senaryolari</h2>
      <div class="description">${SCENARIOS.length} hazir troubleshooting senaryosu. Adim adim komutlarla.</div>
    </div>
    ${SCENARIOS.map(s => `
      <div class="scenario">
        <div class="scenario-header">
          <span class="badge badge-${s.severity}">${s.severity === "err" ? "Kritik" : s.severity === "warn" ? "Orta" : "Bilgi"}</span>
          <h3>${escHtml(s.title)}</h3>
        </div>
        <div class="scenario-symptom">${escHtml(s.symptom)}</div>
        <div class="filter-list">
          ${s.steps.map(st => `<div class="filter-item">${makeCodeCell(st.code)}<span class="filter-desc">${escHtml(st.desc)}</span></div>`).join("")}
        </div>
        ${s.hint ? `<div class="hint-box"><span class="note-label">Ipucu:</span> ${escHtml(s.hint)}</div>` : ""}
      </div>
    `).join("")}
  `;
}

// ─── GITHUB ───
function renderGithub() {
  const el = document.getElementById("github");
  el.innerHTML = `
    <div class="section-header">
      <h2>GitHub Projeleri &amp; Kaynaklar</h2>
      <div class="description">FortiGate CLI referans projeleri, cheat sheet'ler ve web kaynaklari.</div>
    </div>
    <div class="content-block">
      <h3>GitHub Projeleri</h3>
      <div class="card-grid">
        ${GITHUB_RESOURCES.map(r => `
          <div class="card">
            <h3>${escHtml(r.name)}</h3>
            <p>${escHtml(r.desc)}</p>
            <a href="${r.url}" target="_blank" rel="noopener">${r.url}</a>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="content-block">
      <h3>Web Kaynaklari &amp; Resmi Dokumanlar</h3>
      <div class="card-grid">
        ${WEB_RESOURCES.map(r => `
          <div class="card">
            <h3>${escHtml(r.name)}</h3>
            <p>${escHtml(r.desc)}</p>
            <a href="${r.url}" target="_blank" rel="noopener">${r.url}</a>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════════════════ */

function handleSearch(query) {
  if (!query || query.length < 2) {
    // Restore last section
    const last = localStorage.getItem("fg-section") || "dashboard";
    showSection(last);
    return;
  }
  const q = query.toLowerCase();
  const results = COMMANDS.filter(c =>
    c.code.toLowerCase().includes(q) ||
    c.desc.toLowerCase().includes(q) ||
    c.cat.toLowerCase().includes(q)
  );

  // Show results in dashboard area
  showSection("dashboard");
  const el = document.getElementById("dashboard");
  if (results.length === 0) {
    el.innerHTML = `<div class="section-header"><h2>Arama: "${escHtml(query)}"</h2><div class="description">Sonuc bulunamadi.</div></div>`;
    return;
  }
  el.innerHTML = `
    <div class="section-header">
      <h2>Arama: "${escHtml(query)}"</h2>
      <div class="description">${results.length} sonuc bulundu.</div>
    </div>
    <table class="filter-table"><thead><tr><th style="width:30px"></th><th>Komut</th><th>Aciklama</th><th>Kategori</th></tr></thead><tbody>
      ${results.map(c => `<tr><td>${sevDot(c.sev)}</td><td>${makeCodeCell(c.code)}</td><td class="filter-desc">${escHtml(c.desc)}</td><td class="muted" style="font-size:11px;">${escHtml(c.cat)}</td></tr>`).join("")}
    </tbody></table>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */

function init() {
  renderDashboard();
  renderCommands();
  renderSniffer();
  renderDebugFlow();
  renderVPN();
  renderHA();
  renderRouting();
  renderInterfaces();
  renderArpPing();
  renderSystem();
  renderSession();
  renderPolicy();
  renderObjects();
  renderUsers();
  renderUTM();
  renderSDWAN();
  renderFEXT();
  renderLogging();
  renderManaged();
  renderFortiAP();
  renderScenarios();
  renderGithub();

  // Nav click handlers
  document.querySelectorAll(".nav-list a").forEach(a => {
    a.onclick = () => showSection(a.dataset.section);
  });

  // Search
  let searchTimer;
  document.getElementById("search").addEventListener("input", e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => handleSearch(e.target.value), 150);
  });

  // Restore last section
  const last = localStorage.getItem("fg-section");
  if (last && SECTIONS.includes(last)) showSection(last);

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    const tag = document.activeElement.tagName;
    const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

    if (e.key === "Escape") {
      if (inInput) document.activeElement.blur();
      const help = document.getElementById("shortcut-help");
      if (help) help.remove();
      return;
    }

    if (inInput) return;

    if (e.key === "/") {
      e.preventDefault();
      document.getElementById("search").focus();
      return;
    }
    if (e.key === "?") {
      e.preventDefault();
      showShortcutHelp();
      return;
    }

    const shortcutMap = {
      "1": "dashboard",
      "2": "commands",
      "3": "sniffer",
      "4": "debugflow",
      "5": "vpn",
      "6": "ha",
      "7": "routing",
      "8": "scenarios",
      "9": "github"
    };
    if (shortcutMap[e.key]) {
      e.preventDefault();
      showSection(shortcutMap[e.key]);
    }
  });
}

function showShortcutHelp() {
  const existing = document.getElementById("shortcut-help");
  if (existing) { existing.remove(); return; }

  const help = document.createElement("div");
  help.id = "shortcut-help";
  help.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg-1);border:2px solid var(--accent);border-radius:12px;padding:24px;z-index:2000;max-width:500px;box-shadow:0 8px 32px rgba(0,0,0,0.6);";
  help.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h3 style="color:var(--text-0);font-size:16px;">Klavye Kisayollari</h3>
      <span style="cursor:pointer;color:var(--text-2);font-size:20px;line-height:1;" onclick="document.getElementById('shortcut-help').remove()">x</span>
    </div>
    <table style="width:100%;font-size:13px;">
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">/</kbd></td><td style="color:var(--text-1);">Arama kutusuna odaklan</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">Esc</kbd></td><td style="color:var(--text-1);">Input'tan cik / popup kapat</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">?</kbd></td><td style="color:var(--text-1);">Bu yardim penceresi</td></tr>
      <tr><td colspan="2" style="padding:10px 0 6px;color:var(--text-2);font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Hizli Navigasyon</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">1</kbd></td><td style="color:var(--text-1);">Dashboard</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">2</kbd></td><td style="color:var(--text-1);">Komut Kutuphanesi</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">3</kbd></td><td style="color:var(--text-1);">Sniffer</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">4</kbd></td><td style="color:var(--text-1);">Debug Flow</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">5</kbd></td><td style="color:var(--text-1);">VPN</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">6</kbd></td><td style="color:var(--text-1);">HA / Cluster</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">7</kbd></td><td style="color:var(--text-1);">Routing</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">8</kbd></td><td style="color:var(--text-1);">Sorun Senaryolari</td></tr>
      <tr><td style="padding:4px 12px 4px 0;"><kbd style="background:var(--bg-3);padding:2px 8px;border-radius:4px;font-family:var(--mono);border:1px solid var(--border);">9</kbd></td><td style="color:var(--text-1);">GitHub / Kaynaklar</td></tr>
    </table>
  `;
  document.body.appendChild(help);
}

// Boot
document.addEventListener("DOMContentLoaded", init);
