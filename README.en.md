# FortiGate CLI Hub

*[Türkçe](README.md)*

FortiOS command reference — troubleshooting, IPsec, SD-WAN, UTM and policy work.

**→ [Live: altanmelihhh-web.github.io/fortios-cli-hub/](https://altanmelihhh-web.github.io/fortios-cli-hub/)**

A searchable single-page reference for the FortiGate commands that come up
repeatedly in the field. Each entry carries the command, what it does and when to
reach for it, with emphasis on the ones that are hard to recall under pressure —
`diagnose debug flow`, IPsec phase diagnosis, sniffer filters, SD-WAN rule checks.

| | |
|---|---|
| Commands | 320 |
| Categories | 36 |
| Scenarios | 10 |
| Dependencies | none — single page, entirely client-side |
| Network calls | none |

## Coverage

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

## Usage

Open the page and search. Filtering is instant, and the category headings work as
navigation. Commands copy with one click.

```bash
git clone https://github.com/altanmelihhh-web/fortios-cli-hub.git
cd fortios-cli-hub
python3 -m http.server 8000    # or just open index.html
```

No build step, no package manager, no backend — `index.html`, `app.js`,
`style.css`.

## About the sample data

Every address in the configuration examples and output blocks is from a
documentation range (RFC 5737 · RFC 1918) and is fictional, as are the interface,
tunnel, VIP and object names. The topology is kept internally consistent — two WAN
uplinks, IPsec tunnels to a head office, DNAT for SIP — so the examples still
teach, but none of it corresponds to a real deployment.

Consider the effect before running any of these against your own environment;
some change configuration or affect traffic.

## License

MIT — see [LICENSE](LICENSE).
