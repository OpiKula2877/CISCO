# CCNA1 - Přehledný Tahák

## Obsah
- [Kapitola 1: Základy sítí a síťové modely](#kapitola-1-základy-sítí-a-síťové-modely)
- [Kapitola 2: Fyzická vrstva a síťová média](#kapitola-2-fyzická-vrstva-a-síťová-média)
- [Kapitola 3: Ethernet a linková vrstva (L2)](#kapitola-3-ethernet-a-linková-vrstva-l2)
- [Kapitola 4: Síťová vrstva (L3) a IP protokoly](#kapitola-4-síťová-vrstva-l3-a-ip-protokoly)
- [Kapitola 5: IPv4 a IPv6 adresování](#kapitola-5-ipv4-a-ipv6-adresování)
- [Kapitola 6: Subnetting (Dělení sítí)](#kapitola-6-subnetting-dělení-sítí)
- [Kapitola 7: Transportní vrstva (TCP vs UDP)](#kapitola-7-transportní-vrstva-tcp-vs-udp)
- [Kapitola 8: Aplikační vrstva a síťové služby](#kapitola-8-aplikační-vrstva-a-síťové-služby)
- [Kapitola 9: Základy Cisco IOS a konfigurace zařízení](#kapitola-9-základy-cisco-ios-a-konfigurace-zařízení)
- [Kapitola 10: Bezpečnost, správa a diagnostika](#kapitola-10-bezpečnost-správa-a-diagnostika)
- [Závěr: Shrnutí, doplnění + na co si dávat pozor](#závěr-shrnutí-doplnění--na-co-si-dávat-pozor)

---

# Kapitola 1: Základy sítí a síťové modely

Pro pochopení fungování sítí musíme data rozdělit do vrstev. Každá vrstva má svou specifickou funkci a komunikuje s vrstvami nad a pod sebou.

## 1.1 Porovnání modelů OSI a TCP/IP

V síťovém světě používáme dva hlavní modely. OSI model má 7 vrstev a je teoretickým standardem, zatímco TCP/IP model má 4 vrstvy a je základem dnešního internetu.

| OSI Vrstva | TCP/IP Vrstva | Funkce a příklady |
| :--- | :--- | :--- |
| **7. Aplikační** | Aplikační | Rozhraní pro aplikace (HTTP, DNS, FTP). |
| **6. Prezentační** | Aplikační | Formátování dat, šifrování, komprese. |
| **5. Relační** | Aplikační | Správa relací a dialogů mezi aplikacemi. |
| **4. Transportní** | Transportní | End-to-end komunikace, segmentace (TCP, UDP). |
| **3. Síťová** | Internetová | Logické adresování, směrování (IPv4, IPv6, ICMP). |
| **2. Linková** | Přístup k síti | Fyzické adresování (MAC), formátování rámců. |
| **1. Fyzická** | Přístup k síti | Přenos bitů po médiu (kabely, signály). |

**Poznámka k zapouzdření (Encapsulation):** Proces, kdy se k datům z vyšší vrstvy přidávají řídicí informace (hlavičky), se nazývá zapouzdření. Naopak proces odebírání hlaviček v cíli je odpouzdření. Pokud uživatel odesílá soubor přes FTP, data projdou všemi vrstvami TCP/IP modelu od aplikační až po síťový přístup.

## 1.2 Klíčové vlastnosti moderních sítí

Aby byla síť spolehlivá a výkonná, musí splňovat určité charakteristiky:

- **Odolnost vůči chybám (Fault Tolerance):** Síť je navržena tak, aby při výpadku jedné cesty okamžitě aktivovala cestu záložní (např. sekundární připojení k ISP), aniž by to uživatel postřehl.
- **Kvalita služeb (QoS - Quality of Service):** Mechanismus pro prioritizaci provozu. Kritické aplikace (jako video a hlas) mají přednost před méně citlivými daty.
- **Škálovatelnost (Scalability):** Schopnost sítě růst a přidávat nové uživatele bez nutnosti kompletního přepracování infrastruktury.
- **Bezpečnost (Security):** Ochrana dat pomocí hesel, firewallů a autorizace uživatelů.

## 1.3 Prioritizace provozu (QoS)

V rámci QoS se provoz dělí do kategorií podle důležitosti. Pokud máte v síti přetížené linky, zařízení se řídí následujícími prioritami (od nejvyšší po nejnižší):

1. **Hlasová a video komunikace (Audio/Video Conference):** Nejméně tolerantní ke zpoždění.
2. **Transakční data (např. finanční operace):** Vyžadují spolehlivost a rychlou odezvu.
3. **Běžný webový provoz:** Nejméně prioritní, uživateli nevadí mírné zpoždění při načítání stránky.

## 1.4 Protokoly a jejich standardy

Protokoly definují pravidla komunikace, jako je kódování zpráv (převod na signály), velikost zpráv (segmentace) a možnosti doručení (Unicast, Multicast, Broadcast).

- **Otevřené standardy:** Jsou protokoly, které může kdokoli volně používat a implementovat (např. TCP/IP). Podporují konkurenci a umožňují komunikaci zařízení od různých výrobců.
- **Proprietární protokoly:** Jsou vlastněny a kontrolovány jednou společností (např. některé starší protokoly Cisco nebo AppleTalk). Jejich definici a provoz řídí výhradně majitel.

---

**Praktické ověření v CLI (Cisco Command Line Interface):** I když jsme v první kapitole, je dobré vědět, jak ověřit stav vrstvy 1 a 2 na zařízení Cisco.

| Příkaz | Režim (Mód) | Popis |
| :--- | :--- | :--- |
| `show ip interface brief` | Privilegovaný EXEC (#) | Zobrazí rychlý přehled rozhraní, jejich IP adresy a hlavně stav Layer 1 (Status) a Layer 2 (Protocol). |

**Vysvětlení stavů z příkazu:**
- **Status: up / Protocol: up** – Rozhraní je fyzicky zapojené a linková vrstva funguje (ideální stav).
- **Status: administratively down** – Rozhraní bylo vypnuto administrátorem příkazem `shutdown`.

---

# Kapitola 2: Fyzická vrstva a síťová média

Fyzická vrstva (Layer 1) je zodpovědná za přenos bitů (0 a 1) přes komunikační médium. Transformuje digitální data na signály – elektrické impulzy, světelné záblesky nebo rádiové vlny.

## 2.1 Metalická média (Měděná kabeláž)

Měděné kabely jsou nejčastějším médiem v lokálních sítích. Data se zde přenáší jako elektrické impulzy.

- **Útlum (Attenuation):** S rostoucí vzdáleností dochází ke ztrátě síly signálu. Pokud signál urazí příliš velkou vzdálenost, cílové zařízení ho nedokáže správně dekódovat.
- **Rušení signálu:** Měděné kabely jsou náchylné na vnější vlivy:
  - **EMI a RFI:** Elektromagnetické a rádiové rušení (motory, fluorescenční světla). Způsobují zkreslení a chyby v datech.
  - **Přeslech (Crosstalk):** Rušení způsobené magnetickým polem sousedních párů vodičů v jednom kabelu.
- **Ochrana proti rušení:** Hlavní metodou u UTP (Unshielded Twisted Pair) kabelů je kroucení párů vodičů. Magnetická pole se díky tomu vzájemně vyruší.
- **Standardy a instalace:** Při výrobě kabelů se sledují standardy pro rozložení pinů (pinouts), maximální délku kabelu (pro Ethernet typicky 100 m) a typy konektorů (nejčastěji RJ-45).

**Pozor na chyby při terminaci:** Při zapojování konektoru RJ-45 nesmí být rozpletená část drátů příliš dlouhá a plastový plášť kabelu musí být pevně sevřen v konektoru. Pokud jsou vidět holé barevné dráty mimo konektor, je to špatně.

## 2.2 Optická média (Fiber Optics)

Optické kabely přenášejí data jako světelné pulzy. Jsou ideální pro páteřní spoje a propojení budov.

| Vlastnost | Optika (Fiber) | Metalika (Copper/UTP) |
| :--- | :--- | :--- |
| **Odolnost vůči EMI/RFI** | Úplná (nepoužívá elektřinu) | Nízká (náchylná k rušení) |
| **Kapacita dat** | Velmi vysoká | Nižší |
| **Cena** | Vyšší | Nižší |
| **Náročnost instalace** | Vyžaduje speciální školení na spojování a ukončování | Snadná (stačí krimpovací kleště) |

## 2.3 Bezdrátová média (Wireless)

Bezdrátové sítě přenášejí data pomocí rádiových vln. Při návrhu je nutné řešit tři hlavní oblasti: oblast pokrytí, rušení (od jiných zařízení) a bezpečnost (signál se šíří všude kolem).

- **CSMA/CA (Collision Avoidance):** Metoda řízení přístupu k médiu. Na rozdíl od drátového Ethernetu (CSMA/CD), kde se kolize detekují, se ve Wi-Fi kolizím předchází (Avoidance).
- **ZigBee:** Specifická technologie pro IoT a domácí automatizaci. Je oblíbená pro svou nízkou spotřebu energie a nízké nároky na přenosovou rychlost.

## 2.4 Porovnání metod řízení přístupu (Contention-based)

Zatímco v moderních přepínaných (switched) sítích kolize téměř nenastávají, v dřívějších dobách nebo v bezdrátovém světě jsou tyto mechanismy klíčové:

- **CSMA/CD (Collision Detection):** Používá se v Ethernetu (historicky na hubech). Zařízení naslouchá, zda je médium volné. Pokud dojde ke kolizi, pošle se jam signál, zařízení počkají náhodnou dobu (backoff algorithm) a zkusí to znovu.
- **CSMA/CA (Collision Avoidance):** Používá se ve Wi-Fi. Zařízení se snaží kolizím vyhnout, protože v bezdrátovém prostředí je těžké kolizi přímo detekovat.

---

**Praktické ověření stavu rozhraní (CLI):** Když kontroluješ fyzickou vrstvu na přepínači nebo směrovači, zaměř se na výstup příkazu `show ip interface brief`.

| Stav v CLI | Co to znamená? |
| :--- | :--- |
| `Status: up / Protocol: up` | Fyzická vrstva (L1) i linková vrstva (L2) fungují. |
| `Status: down / Protocol: down` | Kabel není připojen, zařízení na druhé straně je vypnuté nebo je kabel vadný. |
| `Status: administratively down` | Port byl ručně vypnut administrátorem (příkazem `shutdown`). |

**Užitečný příkaz pro zobrazení fyzických parametrů:**
`show interfaces [název rozhraní]` – Zde uvidíš podrobnosti jako je MAC adresa (L2 identifikátor NIC karty), rychlost (speed) a duplex.

---

# Kapitola 3: Ethernet a linková vrstva (L2)

Linková vrstva (Layer 2) je zodpovědná za výměnu rámců (frames) přes společné lokální médium. Jejím hlavním úkolem je izolovat protokoly vyšších vrstev (jako IP) od informací o fyzickém médiu, které se k přenosu používá.

## 3.1 Podvrstvy linkové vrstvy

Linková vrstva se v technologii Ethernet dělí na dvě specifické podvrstvy, z nichž každá má svou unikátní roli:

- **LLC (Logical Link Control):** Zajišťuje komunikaci mezi síťovým softwarem (horní vrstvy) a hardwarem rozhraní (dolní vrstvy). Jejím klíčovým úkolem je vložit do rámce informaci, která identifikuje, který protokol síťové vrstvy (např. IPv4 nebo IPv6) je v rámci zapouzdřen.
- **MAC (Media Access Control):** Odpovídá za zapouzdření dat a řízení přístupu k médiu. Provádí fyzické adresování (přidává zdrojovou a cílovou MAC adresu) a zajišťuje detekci chyb pomocí pole FCS (Frame Check Sequence).

## 3.2 Struktura Ethernetového rámce a MAC adresování

Každé síťové rozhraní (NIC) má unikátní fyzickou adresu zvanou MAC adresa. Tato adresa má délku 48 bitů a dělí se na OUI (identifikátor výrobce) a unikátní identifikátor zařízení.

Klíčová pole v rámci:
- **Preamble:** Identifikuje začátek rámce a synchronizuje komunikaci mezi uzly.
- **Addressing:** Obsahuje zdrojovou a cílovou MAC adresu pro doručení v rámci LAN.
- **Type:** Určuje, který protokol (např. IPv4) je uvnitř.
- **FCS (Frame Check Sequence):** Kontrolní součet (CRC), který cílové zařízení vypočítá znovu, aby ověřilo, zda nebyl rámec poškozen rušením nebo útlumem.

**Důležité pravidlo:** Zatímco IP adresa zůstává po celou cestu k cíli stejná, MAC adresy se mění na každém směrovači (hopu). Směrovač odstraní staré Layer 2 záhlaví a vytvoří nové pro další segment sítě.

## 3.3 Protokol ARP (Address Resolution Protocol)

Pokud zařízení zná cílovou IP adresu, ale nezná odpovídající MAC adresu, použije protokol ARP.

- **ARP Request:** Odesílá se jako broadcast (na adresu `FF:FF:FF:FF:FF:FF`) všem zařízením v podsíti. Obsahuje dotaz: "Kdo má tuto IP adresu?".
- **ARP Reply:** Zařízení s danou IP adresou odpoví (unicastem) svou MAC adresou.
- **Vzdálené sítě:** Pokud je cíl v jiné síti, odesílatel pošle ARP dotaz na MAC adresu své výchozí brány (default gateway).

**Nevýhody ARP:** Příliš mnoho ARP zpráv může zahltit síť (flood), protože každé broadcastové volání musí zpracovat všechny uzly v segmentu.

## 3.4 Metody přepínání v LAN (Switching)

Přepínače (switche) používají různé metody pro předávání rámců z jednoho portu na druhý:

| Metoda | Charakteristika | Výhody / Nevýhody |
| :--- | :--- | :--- |
| **Store-and-Forward** | Přijme celý rámec, zkontroluje chyby (FCS) a až pak ho odešle. | Nejspolehlivější, ale má nejvyšší latenci. |
| **Cut-Through** | Začne odesílat hned po přečtení cílové MAC adresy. | Velmi nízká latence, ale může přeposílat i poškozené rámce (runty). |
| **Fragment-Free** | Počká na prvních 64 bajtů (okno kolize) a pak odesílá. | Kompromis mezi rychlostí a kontrolou chyb. |

---

**Praktické CLI příkazy a utility:**

| Příkaz | Režim / Platforma | Popis |
| :--- | :--- | :--- |
| `show interfaces` | Privilegovaný EXEC (#) | Zobrazí MAC adresu rozhraní a statistiky chyb. |
| `arp -a` | Windows Command Line | Zobrazí aktuální tabulku ARP (mapování IP na MAC) v počítači. |
| `show mac address-table` | Privilegovaný EXEC (#) | Zobrazí tabulku přepínače, kde vidíte, na kterém portu je jaká MAC adresa. |

**Řešení problémů:** Pokud můžete pingnout IP adresu, ale ne URL adresu (např. `www.cisco.com`), problém není v linkové vrstvě, ale v rozlišení jmen (DNS). K diagnostice pak slouží příkaz `nslookup`.

---

# Kapitola 4: Síťová vrstva (L3) a IP protokoly

Síťová vrstva (Layer 3) zajišťuje služby, které umožňují koncovým zařízením vyměňovat si data přes síť. Hlavním úkolem této vrstvy je směrování (routing), tedy hledání nejlepší cesty pro doručení paketů z jednoho internetworku do druhého.

## 4.1 Klíčové funkce síťové vrstvy

Síťová vrstva plní dvě základní role pro zajištění komunikace:
- **Adresování koncových zařízení:** Poskytuje zařízením unikátní síťový identifikátor (IP adresu).
- **Směrování paketů:** Směruje datové pakety k cílovým hostitelům v jiných sítích.

## 4.2 Charakteristika protokolu IP

Protokol IP (Internet Protocol) je základním protokolem této vrstvy. Mezi jeho hlavní vlastnosti patří:
- **Bezestavovost (Connectionless):** IP nevyžaduje navázání vyhrazeného spojení před odesláním dat.
- **Nezávislost na médiu:** Funguje bez ohledu na to, zda se data přenáší po metalice, optice nebo bezdrátově.
- **Best-effort doručení:** IP negarantuje, že paket dorazí do cíle, ani nezajišťuje retransmisi v případě chyb (to je úkol vyšších vrstev).

## 4.3 Porovnání hlaviček IPv4 a IPv6

Hlavičky obou protokolů obsahují pole Version, Source IP Address a Destination IP Address. Existují však klíčové rozdíly v tom, jak se řeší životnost paketu v síti.

| Pole IPv4 | Pole IPv6 | Význam pole |
| :--- | :--- | :--- |
| **TTL (Time-to-Live)** | Hop Limit | Omezuje počet skoků (routerů), kterými může paket projít. |
| **Header Checksum** | Odstraněno | IPv6 již v hlavičce nepoužívá kontrolní součet pro zrychlení zpracování routery. |
| **Protocol** | Next Header | Identifikuje protokol transportní vrstvy (např. TCP/UDP). |

**Mechanismus TTL (Time-to-Live):** Aby paket v síti nekroužil nekonečně dlouho (např. při směrovací smyčce), každý router, který paket přijme, sníží hodnotu v poli TTL (v IPv4) nebo Hop Limit (v IPv6) o 1. Pokud hodnota dosáhne nuly, router paket zahodí a pošle odesílateli zprávu ICMP Time Exceeded.

## 4.4 Směrování a Výchozí brána (Default Gateway)

Pokud hostitel potřebuje poslat zprávu do jiné (vzdálené) sítě, musí ji odeslat na svou výchozí bránu (Default Gateway).

- **Co je Default Gateway?** Je to IP adresa rozhraní routeru, který je připojen ke stejné lokální síti jako hostitel.
- **Důsledek špatné konfigurace:** Pokud je brána nastavena chybně, hostitel může komunikovat v rámci své lokální sítě, ale nedostane se do cizích sítí ani na internet.

## 4.5 NAT (Network Address Translation)

NAT se používá k řešení vyčerpání IPv4 adres. Umožňuje zařízením v privátní síti sdílet jednu nebo několik veřejných IP adres pro přístup k internetu.

- **Výhody:** Zpomaluje vyčerpání IPv4 adres.
- **Nevýhody:** Způsobuje problémy některým aplikacím, které vyžadují přímou end-to-end konektivitu (např. IPsec nebo některé P2P aplikace).

## 4.6 Směrovací tabulka (Routing Table)

Router používá směrovací tabulku k rozhodování o dalším postupu paketu. Bezprostředně po nalezení shody cílové adresy s přímo připojenou sítí router přepne paket na odpovídající rozhraní.

V tabulce najdeme různé zdroje cest (Source Codes):
- **C (Connected):** Přímo připojená rozhraní routeru.
- **S (Static):** Cesty zadané správcem ručně, včetně výchozí statické cesty.
- **L (Local):** IP adresa přiřazená konkrétnímu rozhraní (používá se v moderních IOS).

---

**Praktické CLI příkazy pro diagnostiku síťové vrstvy:**

| Příkaz | Režim / OS | Popis |
| :--- | :--- | :--- |
| `show ip route` | Cisco (Privilegovaný EXEC) | Zobrazí směrovací tabulku routeru se všemi cestami a metrikami. |
| `route print` | Windows | Zobrazí směrovací tabulku počítače (stejný výsledek jako `netstat -r`). |
| `ipconfig` | Windows | Zobrazí konfiguraci IP, masky a výchozí brány počítače. |
| `tracert [cíl]` | Windows | Trasuje cestu paketu k cíli a zobrazuje čas odezvy na každém skoku (hopu). |

**Doplňující kontext (ICMP):** K diagnostice na L3 vrstvě neodmyslitelně patří protokol ICMP. V IPv4 se používá například pro ARP (Address Resolution Protocol), ale v IPv6 byla tato role nahrazena protokolem Neighbor Discovery Protocol (NDP) využívajícím zprávy Neighbor Solicitation a Neighbor Advertisement k zjištění MAC adresy souseda.

---

# Kapitola 5: IPv4 a IPv6 adresování

Adresování na síťové vrstvě umožňuje identifikaci zařízení v rámci sítě. Zatímco IPv4 používá 32bitové adresy, modernější IPv6 přechází na 128bitové adresy, aby vyřešil problém s jejich nedostatkem.

## 5.1 Adresování IPv4

Adresa IPv4 se skládá ze dvou částí: síťové části (Network) a hostitelské části (Host). Pro efektivní správu sítě rozlišujeme několik typů adres:

- **Veřejné adresy:** Jsou celosvětově unikátní a směrovatelné v internetu (např. `198.133.219.2`).
- **Privátní adresy:** Používají se v rámci interních sítí a nejsou směrovatelné v internetu. Patří sem rozsahy:
  - `10.0.0.0/8`
  - `172.16.0.0/12` (např. `172.18.45.9`)
  - `192.168.0.0/16`
- **Speciální rozsahy adres:**
  - **Loopback (127.0.0.0/8):** Slouží k testování TCP/IP stacku na lokálním zařízení (nejčastěji `127.0.0.1`).
  - **Link-Local / APIPA (169.254.0.0/16):** Automaticky přiděleny operačním systémem, pokud není dostupný DHCP server.
  - **TEST-NET (192.0.2.0/24):** Vyhrazeny pro dokumentaci a výukové příklady.
  - **Experimentální adresy (240.0.0.0 až 255.255.255.254):** Původně třída E, vyhrazeny pro budoucí použití.

## 5.2 Struktura a typy IPv6 adres

IPv6 adresa se zapisuje v hexadecimální soustavě a dělí se na tři hlavní části:

- **Global Routing Prefix:** Část přidělená poskytovatelem (ISP).
- **Subnet ID:** Část využívaná organizací k identifikaci podsítí v rámci lokality. Například u adresy se zápisem `/64` tvoří čtvrtý hexadecimální blok právě Subnet ID.
- **Interface ID:** Ekvivalent hostitelské části u IPv4, identifikuje konkrétní rozhraní.

Klíčové typy IPv6 adres:
- **Global Unicast (GUA):** Veřejně směrovatelná adresa.
- **Link-Local (LLA):** Adresy v rozsahu `FE80::/10` až `FEBF::/10`. Slouží pro komunikaci pouze v rámci jednoho segmentu (linku).
- **Multicast:** Adresy začínající `FF00::/8`. Slouží k doručení paketu skupině zařízení. Příkladem je adresa `ff02::2`, která cílí na všechny nakonfigurované IPv6 směrovače na lokální lince.
- **Unique Local:** Rozsah `FC00::/7`, podobné privátním adresám IPv4.

**Poznámka:** Starší specifikace definovaly i tzv. Site-local adresy (`FEC0::/10`), které jsou však dnes považovány za zastaralé (deprecated).

## 5.3 Mechanismy IPv6 (SLAAC, EUI-64 a DAD)

IPv6 zavádí nové způsoby, jak mohou zařízení získat adresu bez nutnosti DHCP serveru:

- **SLAAC (Stateless Address Autoconfiguration):** Zařízení si vygeneruje vlastní adresu na základě informací ze zpráv Router Advertisement (RA) od směrovače.
- **EUI-64:** Proces generování Interface ID z MAC adresy zařízení. MAC adresa (48 bitů) se rozdělí a doprostřed se vloží hodnota `FFFE`.
- **DAD (Duplicate Address Detection):** Než začne zařízení vygenerovanou adresu používat, musí ověřit, zda už ji nemá někdo jiný. K tomu odesílá zprávu ICMPv6 Neighbor Solicitation a čeká, zda se někdo ozve.

## 5.4 Praktická konfigurace a diagnostika

| Příkaz / Utility | Kontext / OS | Popis |
| :--- | :--- | :--- |
| `ipv6 unicast-routing` | Cisco (Global Config) | Nezbytný příkaz, který povolí směrovači přeposílat IPv6 pakety a odesílat zprávy RA. |
| `ipconfig` | Windows | Zobrazí aktuální IP konfiguraci (IPv4 i IPv6), masku a bránu. |
| `show ip interface brief` | Cisco (Privilegovaný EXEC) | Zobrazí přehled IPv4 adres na rozhraních a jejich stav. |

**Důležité pro zkoušku:**
- IPv6 nepoužívá masku podsítě (Subnet Mask) jako IPv4, ale používá délku prefixu (např. `/64`).
- IPv6 nemá žádnou broadcastovou adresu; veškerá komunikace "pro všechny" probíhá pomocí multicastu.
- U IPv6 adresy s prefixem `/56` má organizace k dispozici 8 bitů pro vytváření vlastních podsítí (72 bitů celkem mínus 64 bitů pro Interface ID), což umožňuje vytvořit 256 podsítí.

---

# Kapitola 6: Subnetting (Dělení sítí)

Dělení sítí (subnetting) je proces rozdělení jedné velké sítě na menší podsítě. Hlavním důvodem je snížení broadcastového provozu, zvýšení bezpečnosti a efektivnější využití adresního prostoru.

## 6.1 Základní principy a vzorec pro výpočet

Při vytváření podsítě musíme vždy počítat s tím, že v každém segmentu jsou dvě adresy nepoužitelné pro koncová zařízení:
- **Adresa sítě:** První adresa v rozsahu, identifikuje podsíť jako celek.
- **Broadcast adresa:** Poslední adresa v rozsahu, slouží k oslovení všech zařízení v podsíti.

Základní vzorec pro počet použitelných hostů: **$2^n - 2$** (kde $n$ je počet bitů zbývajících pro hostitelskou část).

## 6.2 Výběr nejmenší vhodné masky (IPv4)

Správce sítě musí umět vybrat masku, která pokryje počet zařízení a zároveň vyplýtvá co nejméně adres.

| Počet zařízení | Potřebná maska | CIDR | Celkem adres | Použitelných hostů | Proč ne jinou? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **4** | 255.255.255.248 | `/29` | 8 | 6 | Masky `/30` mají jen 2 hosty, což nestačí. |
| **10** | 255.255.255.240 | `/28` | 16 | 14 | Maska `/29` nabízí jen 6 hostů. |
| **25** | 255.255.255.224 | `/27` | 32 | 30 | Maska `/28` nabízí jen 14 hostů. |
| **40** | 255.255.255.192 | `/26` | 64 | 62 | Maska `/27` nabízí jen 30 hostů. |
| **61** | 255.255.255.192 | `/26` | 64 | 62 | Maska `/27` by byla příliš malá. |
| **100** | 255.255.255.128 | `/25` | 128 | 126 | Maska `/26` nabízí jen 62 hostů. |
| **200** | 255.255.255.0 | `/24` | 256 | 254 | Menší masky jako `/25` nestačí. |

**Příklad efektivního využití:** Pokud máte v síti hostitele s adresou `192.168.1.96` a používáte masku `/26` (síť `192.168.1.64`), rozsah použitelných adres je `192.168.1.65` až `192.168.1.126`. Adresa `.96` je v tomto případě platným hostitelem.

## 6.3 Plýtvání adresami (Wasted Addresses)

Při návrhu sítě musíte dávat pozor na zbytečné plýtvání.

- **Příklad:** Pokud použijete masku `/26` (62 hostů) pro sériový spoj mezi dvěma routery (který potřebuje jen 2 adresy), vyplýtváte 60 adres.
- **Řešení:** Pro point-to-point spoje se ideálně používá maska `/30` (`255.255.255.252`), která nabízí právě 2 použitelné adresy.

## 6.4 Subnetting u IPv6

U IPv6 je dělení sítí mnohem jednodušší, protože se obvykle pracuje s fixní délkou Interface ID (64 bitů).

- **Subnet ID:** V 128bitové IPv6 adrese je čtvrtý hexadecimální blok (hextet) vyhrazen pro identifikaci podsítě (Subnet ID).
- **Příklad:** Pokud má organizace přidělen blok `/56`, má k dispozici 8 bitů pro vytváření vlastních podsítí (rozdíl mezi `/56` a standardním `/64` pro koncový segment). To umožňuje vytvořit přesně 256 podsítí.
- **Globální směrovací prefix:** Část adresy přidělená poskytovatelem (ISP).

## 6.5 Praktické výpočty podsítí (Příklad /29)

Při rozdělení sítě `192.168.10.0` pomocí prefixu `/29` se sítě zvyšují po 8 adresách (protože $256 - 248 = 8$):
- 1. podsíť: `.0` až `.7`
- 2. podsíť: `.8` až `.15` ...
- 5. podsíť: `.32` až `.39` (Síť: `192.168.10.32`, První host: `192.168.10.33`, Poslední host: `192.168.10.38`, Broadcast: `192.168.10.39`).

---

**Praktické CLI příkazy pro ověření podsítí:**

| Příkaz | Režim | Popis |
| :--- | :--- | :--- |
| `show ip route` | Privilegovaný EXEC (#) | Zobrazí směrovací tabulku, kde uvidíte sítě i s jejich maskami. |
| `show running-config interface [id]` | Privilegovaný EXEC (#) | Zobrazí přesnou IP adresu a masku nakonfigurovanou na rozhraní. |
| `route print` | Windows CLI | Zobrazí směrovací tabulku Windows hostitele včetně masek sítí. |

---

# Kapitola 7: Transportní vrstva (TCP vs UDP)

Zatímco síťová vrstva (L3) doručuje pakety mezi hostiteli, transportní vrstva (L4) je zodpovědná za komunikaci mezi konkrétními procesy (aplikacemi) běžícími na těchto hostitelích.

## 7.1 Porty a sledování datových toků

Aby počítač věděl, kterému programu má příchozí data předat, používá čísla portů.

- **Zdrojový port (Source Port):** Je náhodně generován odesílajícím zařízením pro každou relaci. Slouží k tomu, aby počítač mohl sledovat více simultánních toků dat (např. dvě různá okna prohlížeče) a správně přiřadil vracející se data.
- **Cílový port (Destination Port):** Identifikuje konkrétní službu nebo aplikaci na serveru (např. port 80 pro webový server).

## 7.2 Porovnání protokolů TCP a UDP

Transportní vrstva využívá dva hlavní protokoly, které se liší svou spolehlivostí a režií. Oba však shodně využívají čísla portů a kontrolní součet (checksum) k ověření integrity dat.

| Vlastnost | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Typ spojení** | Spojově orientované (Connection-oriented) | Bezestavové (Connectionless) |
| **Spolehlivost** | Garantuje doručení a pořadí dat | Negarantuje doručení (Best-effort) |
| **Režie (Overhead)** | Vyšší (více řídicích informací) | Nízká (minimální zátěž sítě) |
| **Mechanismus** | Používá 3-cestné navazování spojení (handshake) | Žádné navazování spojení |
| **Příklady využití** | HTTP, FTP, SMTP, SSH | IP telefonie (VoIP), DHCP, TFTP, Video |

## 7.3 Klíčové mechanismy TCP

Protokol TCP obsahuje sofistikované nástroje pro řízení toku dat a zajištění jejich bezchybného doručení:

- **Sekvenční čísla (Sequence Numbers):** Slouží k identifikaci chybějících segmentů a k jejich seřazení do správného pořadí v cíli.
- **Potvrzování (Acknowledgment):** Příjemce musí odesílateli potvrdit přijetí dat, než odesílatel pošle další segmenty.
- **Okénko (Window Size):** Určuje množství dat (v bajtech), které může odesílatel poslat, aniž by musel čekat na potvrzení.
- **Sliding Window (Posuvné okénko):** Mechanismus řízení toku, který umožňuje dynamicky snižovat rychlost odesílání, pokud je síť přetížená nebo vyrovnávací paměť příjemce plná.
- **Retransmise:** Pokud se segment ztratí nebo není potvrzen, TCP zajistí jeho opětovné zaslání.

## 7.4 Aplikační protokoly a jejich porty

Zde je přehled důležitých protokolů, které se v otázkách CCNA často objevují, rozdělený podle transportního protokolu, který využívají:

**Využívají TCP (vyžadují spolehlivost):**
- **HTTP (80):** Prohlížení webu.
- **HTTPS (443):** Zabezpečený web s šifrováním.
- **FTP (20/21):** Přenos souborů (port 21 pro řízení, 20 pro data).
- **SSH (22):** Zabezpečený vzdálený přístup.
- **Telnet (23):** Nezabezpečený vzdálený přístup (data v čistém textu).
- **SMTP (25):** Odesílání e-mailů mezi servery.
- **POP3 (110):** Stahování e-mailů do klienta.
- **IMAP (143):** Čtení e-mailů přímo na serveru (umožňuje synchronizaci více zařízení).

**Využívají UDP (vyžadují rychlost):**
- **DNS (53):** Překlad doménových jmen na IP adresy (může využít i TCP).
- **DHCP (67/68):** Automatické přidělování IP adres (67 pro server, 68 pro klienta).
- **TFTP (69):** Jednoduchý přenos souborů (např. bootování zařízení).
- **RTP (Real-Time Transport Protocol):** Přenos hlasu (VoIP) a videa v reálném čase.

**Rozdíl mezi IMAP a POP:** IMAP je pro malé organizace často výhodnější, protože zprávy zůstávají uloženy na serveru, dokud nejsou ručně smazány, což umožňuje přístup k poště z různých míst. POP3 typicky e-maily po stažení ze serveru odstraní.

---

**Praktické ověření v CLI a diagnostika:**

| Příkaz | OS / Mód | Popis |
| :--- | :--- | :--- |
| `netstat` | Windows / Linux | Zobrazí aktivní TCP spojení běžící na hostiteli. |
| `nslookup` | Windows / Linux | Nástroj pro dotazování DNS serverů (ověření, zda funguje překlad jmen). |
| `transport input ssh` | Cisco (line vty) | Příkaz, který na virtuálních linkách povolí pouze šifrovaný přístup přes SSH a zablokuje ostatní (např. Telnet). |

---

# Kapitola 8: Aplikační vrstva a síťové služby

Aplikační vrstva představuje rozhraní mezi člověkem a sítí. V modelu TCP/IP tato vrstva zahrnuje funkce, které jsou v 7-vrstvém OSI modelu rozděleny do vrstev aplikační (7), prezentační (6) a relační (5).

## 8.1 Síťové modely: Client-Server vs. Peer-to-Peer

Aplikace mohou v síti komunikovat různými způsoby podle toho, jak jsou role rozděleny:

- **Model Klient-Server:** Klient (např. tvůj prohlížeč) žádá o data a dedikovaný server (např. webový server Cisco) na tyto žádosti odpovídá.
- **Model Peer-to-Peer (P2P):** Zařízení mohou fungovat jako klient i server zároveň.
  - **P2P sítě:** Jednoduché sítě bez dedikovaného serveru, kde se přímo sdílí zdroje (např. tiskárna připojená k domácímu PC a sdílená ostatním).
  - **P2P aplikace:** Vyžadují uživatelské rozhraní a službu běžící na pozadí, umožňují sdílení souborů mezi mnoha uzly najednou.

## 8.2 Webové služby a protokoly (HTTP a HTTPS)

Pro prohlížení webu se využívají protokoly, které definují pravidla pro výměnu textu, obrázků a multimédií.

- **HTTP (Port 80):** Základní protokol pro přenos webových stránek. Sám o sobě není šifrovaný.
- **HTTPS (Port 443):** Zabezpečená verze protokolu HTTP, která využívá šifrování (SSL/TLS) pro ochranu dat při přenosu mezi prohlížečem a serverem.

## 8.3 DNS – "Telefonní seznam" internetu

Protokol DNS (Port 53) překládá člověkem čitelná doménová jména (např. `www.cisco.com`) na IP adresy, které potřebují routery k doručení paketů. DNS server uchovává různé typy záznamů:
- **A:** IPv4 adresa koncového zařízení.
- **AAAA:** IPv6 adresa koncového zařízení.
- **NS:** Autoritativní jmenný server pro danou doménu.
- **MX:** Mail Exchange záznam (identifikuje e-mailový server).

## 8.4 E-mailové protokoly (SMTP, POP3, IMAP)

Pro práci s e-maily se používá kombinace protokolů pro odesílání a příjem zpráv:

- **SMTP (Port 25):** Slouží k odesílání e-mailů z klienta na server a také k přeposílání e-mailů mezi servery.
- **POP3 (Port 110):** Slouží k vyzvedávání pošty. E-maily se stáhnou ze serveru do lokální aplikace v počítači a na serveru se typicky smažou (nebo tam zůstanou jen krátce).
- **IMAP (Port 143):** Modernější protokol pro vyzvedávání pošty. Zprávy zůstávají na serveru, dokud je uživatel ručně nesmaže. To umožňuje synchronizaci mezi více zařízeními (mobil, PC, web).

## 8.5 Automatické přidělování adres (DHCP a BOOTP)

Aby se IP adresy nemusely nastavovat ručně, používají se služby pro jejich dynamické přidělování.

- **DHCP (Port 67 server / 68 klient):** Automaticky přiděluje IP adresy, masky, výchozí brány a adresy DNS serverů koncovým zařízením.
- **BOOTP:** Starší (legacy) protokol, který umožňoval bezdiskovým stanicím zjistit vlastní IP adresu a najít server pro zavedení systému (bootování).

## 8.6 Přenos souborů (FTP a TFTP)

- **FTP (Port 20 pro data / 21 pro řízení):** Vyžaduje navázání relace (přes TCP) a slouží k spolehlivému přenosu souborů mezi klientem a serverem.
- **TFTP (Port 69):** Jednodušší protokol (přes UDP) s nízkou režií, často používaný pro přenos konfiguračních souborů nebo obrazů operačních systémů síťových prvků.

### Souhrnná tabulka aplikačních portů

| Protokol | Port | Transportní protokol | Účel (Správná vs. Špatná volba) |
| :--- | :--- | :--- | :--- |
| **SSH** | 22 | TCP | Zabezpečený vzdálený přístup (šifrovaný). |
| **Telnet** | 23 | TCP | Nezabezpečený vzdálený přístup (čistý text). |
| **DNS** | 53 | UDP/TCP | Překlad doménových jmen na IP adresy. |
| **HTTP** | 80 | TCP | Přenos webových stránek (nešifrovaný). |
| **HTTPS** | 443 | TCP | Přenos webových stránek (šifrovaný). |
| **POP3** | 110 | TCP | Stahování e-mailů do lokálního zařízení. |
| **IMAP** | 143 | TCP | Synchronizace e-mailů se serverem. |

---

**Praktická diagnostika aplikační vrstvy:**

| Nástroj / Příkaz | Kontext / OS | Popis |
| :--- | :--- | :--- |
| `nslookup` | Windows/Linux | Umožňuje ručně dotazovat jmenné servery a ověřit překlad jména na adresu. |
| `ipconfig /all` | Windows | Zobrazí kompletní konfiguraci včetně nastaveného DNS serveru a DHCP serveru. |
| `tracert [URL]` | Windows | Pokud se nedaří načíst web, tracert ukáže, kde v cestě dochází k prodlevě. |

---

# Kapitola 9: Základy Cisco IOS a konfigurace zařízení

Cisco IOS (Internetwork Operating System) je rodina operačních systémů používaných na směrovačích a přepínačích Cisco. K jeho ovládání se využívá příkazová řádka (CLI), která je rozdělena do několika hierarchických režimů.

## 9.1 Konfigurační režimy (Access Modes)

Při práci v CLI je zásadní sledovat symbol na konci promptu (názvu zařízení), který určuje, co můžete v danou chvíli dělat.

| Režim | Prompt | Popis a omezení |
| :--- | :--- | :--- |
| **User EXEC** | `Router>` | Základní režim pro prohlížení, nelze v něm měnit konfiguraci. |
| **Privileged EXEC** | `Router#` | Plný přístup pro zobrazení stavu a statistik. Vstupuje se příkazem `enable`. |
| **Global Configuration** | `Router(config)#` | Zde se provádějí změny, které ovlivňují celé zařízení. Vstupuje se příkazem `configure terminal` (nebo `config t`). |

**Častá chyba v praxi:** Pokud se pokusíte zadat `configure terminal` přímo v režimu User EXEC (`>`), zařízení vypíše chybu. Musíte se nejprve "povýšit" do privilegovaného režimu pomocí příkazu `enable`.

## 9.2 Správa konfiguračních souborů

Zařízení Cisco využívají dva hlavní typy paměti pro ukládání nastavení:
- **Running Configuration (RAM):** Aktuálně běžící konfigurace. Jakákoliv změna se projeví okamžitě, ale při výpadku napájení se ztratí.
- **Startup Configuration (NVRAM):** Uložená konfigurace, která se načte při startu zařízení.

Klíčové příkazy pro správu:
- `show running-config`: Zobrazí aktuálně aktivní nastavení v RAM.
- `show startup-config`: Zobrazí obsah konfiguračního souboru uloženého v NVRAM.
- `copy running-config startup-config`: Uloží aktuální změny do trvalé paměti (zkráceně `copy run start`).

**Poznámka:** IOS obraz (samotný operační systém) je uložen ve flash paměti, zatímco bootstrap program (úvodní zavedení) je v ROM.

## 9.3 Základní zabezpečení a příkazy

Zabezpečení přístupu je prvním krokem každé konfigurace.

- **Šifrování hesel:** Příkaz `service password-encryption` v globálním konfiguračním režimu zajistí, že všechna hesla (pro konzoli či telnet) budou v konfiguračním souboru uložena v nečitelné (šifrované) podobě. Bez tohoto příkazu by mohl kdokoli s přístupem k souboru hesla snadno přečíst.
- **Banner (Zpráva dne):** Příkaz `banner motd # zpráva #` slouží k zobrazení varovného hlášení při přihlášení.

**Tip pro testování:** Nejrychlejší způsob, jak ověřit správnost banneru, je opustit privilegovaný režim příkazem `exit` a stisknout Enter. Restartování zařízení (reboot) nebo odpojení z napájení (power cycle) by sice banner také zobrazilo, ale je to zbytečně zdlouhavé a neefektivní.

## 9.4 Konfigurace vzdáleného přístupu (VTY)

Pro vzdálenou správu přepínačů a směrovačů používáme virtuální linky (VTY).

- **SSH (Secure Shell):** Je preferovanou metodou, protože veškerá komunikace (včetně ID uživatele a hesla) je šifrovaná. Pro zprovoznění SSH je nutné nastavit název domény (`ip domain-name`) a vygenerovat šifrovací klíče (`crypto key generate rsa`).
- **Telnet:** Starší protokol (port 23), který posílá data v čistém textu a je považován za nezabezpečený.
- **Příkaz transport input ssh:** Pokud tento příkaz zadáte v konfiguraci linek VTY, zařízení bude přijímat pouze šifrovaná SSH spojení a automaticky zablokuje nezabezpečený Telnet.

## 9.5 Konfigurace IP na přepínači (Switch)

I když je přepínač (Layer 2 switch) zařízení, které primárně pracuje s MAC adresami, potřebuje vlastní IP adresu pro účely vzdálené správy.

- **SVI (Switch Virtual Interface):** IP adresa se na přepínači nepřiřazuje fyzickému portu, ale virtuálnímu rozhraní, typicky `interface vlan 1`.
- **Výchozí brána:** Aby mohl být přepínač spravován z jiné (vzdálené) sítě, musí mít nastavenou výchozí bránu pomocí příkazu `ip default-gateway [IP adresa]`. Bez tohoto nastavení by přepínač mohl komunikovat pouze se zařízeními ve své lokální síti.

## 9.6 Diagnostické příkazy v CLI

| Příkaz | Význam |
| :--- | :--- |
| `show ip interface brief` | Zobrazí rychlý přehled rozhraní, jejich IP adresy a stav (Layer 1 i Layer 2 status). |
| `show interfaces` | Zobrazí detailní informace včetně MAC adresy konkrétního rozhraní. |
| `show ip route` | Zobrazí směrovací tabulku (routing table). |
| `ipv6 unicast-routing` | Globální příkaz, který povolí směrování IPv6 a odesílání zpráv Router Advertisement (RA). |

---

# Kapitola 10: Bezpečnost, správa a diagnostika

Zabezpečení sítě není jednorázový úkon, ale neustálý proces ochrany dat a zařízení. Tato kapitola pokrývá typy hrozeb, obranné mechanismy a nástroje, které síťoví inženýři používají k ověření funkčnosti sítě.

## 10.1 Typy hrozeb a malware

Malware je souhrnné označení pro škodlivý kód. Je důležité rozlišovat mezi jeho jednotlivými formami, abychom zvolili správnou obranu.

- **Virus:** Škodlivý kód, který se spouští na koncovém zařízení a ke svému šíření obvykle vyžaduje akci uživatele (např. otevření přílohy).
- **Trojský kůň (Trojan horse):** Škodlivý kód maskovaný jako legitimní software (např. doplněk pro tiskárnu). Může například na pozadí deaktivovat firewall.
- **Červ (Worm):** Samostatně se šířící kód, který zneužívá zranitelnosti a často způsobuje výrazné zpomalení sítě.
- **Spyware:** Software instalovaný bez vědomí uživatele, který sbírá informace o jeho aktivitě. Pokud se zaměřuje na zobrazování nevyžádané reklamy, mluvíme o Adware.

## 10.2 Metody síťových útoků

Útočníci používají různé strategie k narušení provozu nebo získání dat:

- **DoS (Denial of Service):** Útok zaměřený na zahlcení nebo pád zařízení či síťové služby, čímž se stane pro uživatele nedostupnou.
- **Průzkum (Reconnaissance):** Neoprávněné zjišťování informací o síti (mapování portů, služeb a zranitelností) před samotným útokem.
- **Krádež identity (Identity Theft):** Použití ukradených přihlašovacích údajů k přístupu k soukromým datům.

## 10.3 Mechanismy zabezpečení (AAA, Firewally, VPN)

Pro ochranu firemních sítí se používají komplexní řešení, která jdou nad rámec běžného antiviru.

**AAA Framework:**
- **Authentication (Autentizace):** Ověření identity uživatele (kdo to je).
- **Authorization (Autorizace):** Určení, k jakým zdrojům má uživatel přístup (např. právo "pouze pro čtení" ve složce Public).
- **Accounting (Účtování):** Záznam o tom, co uživatel v síti dělal.

**Firewall:** Filtruje provoz na základě pravidel.
- **Paketové filtry:** Blokují přístup na základě IP nebo MAC adres.
- **Aplikační filtry:** Blokují provoz podle čísel portů (např. port 80 pro HTTP).
- **URL filtry:** Blokují přístup ke konkrétním webovým stránkám.
- **Stateful Packet Inspection (SPI):** Zabraňuje nevyžádaným příchozím relacím.

**Další bezpečnostní prvky:**
- **VPN (Virtuální privátní síť):** Šifrovaný tunel, který umožňuje vzdáleným uživatelům bezpečný přístup do vnitřní sítě organizace.
- **IPS (Intrusion Prevention System):** Systém, který monitoruje síť a aktivně blokuje zjištěné škodlivé aktivity.

## 10.4 Fyzické hrozby

Kromě digitálních útoků musíme chránit hardware i před fyzickými vlivy:

- **Hardwarové hrozby:** Fyzické poškození zařízení či kabeláže.
- **Environmentální hrozby:** Extrémní teploty nebo vlhkost.
- **Elektrické hrozby:** Výpadky napájení, podpětí nebo napěťové špičky.
- **Údržbové hrozby:** Špatné značení kabelů nebo nedostatek náhradních dílů.

## 10.5 Diagnostika sítě a nástroje

Když uživatelé hlásí zpoždění nebo nedostupnost služeb, inženýři využívají sadu nástrojů k lokalizaci chyby.

| Nástroj | Účel diagnostiky | Co nám říká výsledek? |
| :--- | :--- | :--- |
| **Ping** | Ověření Layer 3 konektivity. | Pokud ping na bránu selže, ale na internet projde, může jít o bezpečnostní pravidla (firewall) na bráně. |
| **Tracert** | Sledování cesty k cíli. | Ukazuje zpoždění na jednotlivých skocích. Router v cestě paket zahodí, jakmile jeho TTL klesne na nulu. |
| **Nslookup** | Diagnostika DNS. | Pomůže, pokud ping na IP funguje, ale na URL adresu (např. `www.cisco.com`) nikoliv. |
| **Netstat** | Kontrola aktivních spojení. | Zobrazí všechny otevřené TCP relace na hostiteli. |
| **Analýza provozu** | Zachycování paketů. | Pro získání reálného obrazu sítě se provoz zachycuje v době špičky (peak utilization) a na různých segmentech. |

**Důležité:** Pro správnou diagnostiku je nezbytné mít vytvořený výkonnostní základ (baseline), což jsou data reprezentující normální stav sítě. Bez něj nelze určit, zda je aktuální zpoždění anomálií nebo běžným jevem.

---

**Praktické Cisco CLI příkazy pro zabezpečení:**

| Příkaz | Režim | Popis |
| :--- | :--- | :--- |
| `service password-encryption` | Globální konfigurační | Zašifruje všechna hesla v konfiguračním souboru, aby nebyla čitelná jako čistý text. |
| `transport input ssh` | Konfigurace line vty | Povolí pouze šifrovaný vzdálený přístup (SSH) a zablokuje nezabezpečený Telnet. |
| `banner motd # zpráva #` | Globální konfigurační | Nastaví varovnou zprávu při přihlášení. |

---

# Závěr: Shrnutí, doplnění + na co si dávat pozor

## 1. Na co si dát pozor: Nejčastější "chytáky"

- **ARP a vzdálené sítě:** Pamatuj, že pokud hostitel posílá data do vzdálené sítě, neposílá ARP dotaz na MAC adresu cílového zařízení, ale na MAC adresu své výchozí brány (routeru). Router pak paket přebere a pošle dál.
- **Proces TTL (Time-to-Live):** Každý router, který přijme IPv4 paket, sníží (decrement) hodnotu v poli TTL o 1. Pokud je výsledek 0, router paket zahodí a pošle odesílateli zprávu ICMP Time Exceeded.
- **Špatně nastavená výchozí brána:** Pokud má počítač špatnou IP adresu výchozí brány, stále může komunikovat se zařízeními ve své lokální síti, ale nedostane se vůbec do internetu ani do jiných vzdálených sítí.
- **LLC vs. MAC subvrstva:** Tyto dvě se často pletou:
  - **LLC (Logical Link Control):** Identifikuje protokol síťové vrstvy (IPv4/IPv6) a umožňuje jim sdílet médium.
  - **MAC (Media Access Control):** Řeší fyzické adresování, přístup k médiu (CSMA/CD) a detekci chyb (FCS).
- **Ping vs. DNS:** Pokud můžeš pingnout IP adresu (např. `8.8.8.8`), ale nemůžeš pingnout jméno (např. `www.google.com`), problém není v konektivitě, ale v DNS serveru.

## 2. Velký přehled portů a protokolů (Rychlá referenční tabulka)

Tato tabulka kombinuje všechna klíčová čísla portů, která se v otázkách objevují:

| Port | Protokol | Typ (L4) | Účel |
| :--- | :--- | :--- | :--- |
| **20/21** | FTP | TCP | Přenos souborů (21 pro řízení, 20 pro data). |
| **22** | SSH | TCP | Zabezpečený vzdálený přístup (šifrovaný). |
| **23** | Telnet | TCP | Nezabezpečený vzdálený přístup (čistý text). |
| **25** | SMTP | TCP | Odesílání e-mailů mezi servery. |
| **53** | DNS | UDP/TCP | Překlad doménových jmen na IP adresy. |
| **67/68** | DHCP | UDP | Automatické přidělování IP adres (67 server, 68 klient). |
| **69** | TFTP | UDP | Jednoduchý přenos souborů (např. konfigurace routeru). |
| **80** | HTTP | TCP | Webové stránky (nešifrované). |
| **110** | POP3 | TCP | Stahování e-mailů ze serveru do klienta. |
| **143** | IMAP | TCP | Synchronizace e-mailů (zůstávají na serveru). |
| **443** | HTTPS | TCP | Webové stránky (zabezpečené šifrováním). |

## 3. Klíčové parametry fyzické vrstvy a médií

Při instalaci a diagnostice kabeláže se drž těchto standardů:
- **UTP zakončení:** Nesmí být vidět rozpletené barevné dráty mimo konektor; plastový plášť musí být pevně zakrimpován uvnitř konektoru.
- **Rušení:** Měděné kabely (UTP) jsou rušeny EMI (motory, světla) a RFI (rádiové vlny). Crosstalk (přeslech) se řeší kroucením párů vodičů v kabelu.
- **Optika vs. Měď:** Optika je dražší a náročnější na instalaci (svařování), ale je zcela imunní vůči EMI/RFI a má mnohem vyšší kapacitu.
- **Bezdrát:** Hlavní obavy u Wi-Fi jsou dosah pokrytí, rušení a bezpečnost. Pro IoT (chytrá domácnost) se kvůli nízké spotřebě používá ZigBee.

## 4. Rychlé shrnutí konfigurace Cisco (CLI)

- **Zabezpečení konzole:** Hesla v konfiguraci jsou čitelná, dokud nezapneš globální příkaz `service password-encryption`.
- **Vzdálená správa:** Příkaz `transport input ssh` na linkách VTY zajistí, že se nikdo nepřipojí nezabezpečeným Telnetem.
- **Ukládání:** Rozdíl mezi Running-config (v RAM, smaže se po restartu) a Startup-config (v NVRAM, trvalý). Ukládá se příkazem `copy running-config startup-config` (nebo zkráceně `copy run start`).
- **IPv6 aktivace:** Aby router mohl směrovat IPv6 a posílat zprávy Router Advertisement (RA), musí mít zapnutý příkaz `ipv6 unicast-routing`.

## 5. Diagnostika a bezpečnost v kostce

**Malware:**
- **Virus:** Vyžaduje akci uživatele k šíření.
- **Worm (Červ):** Šíří se sám a zahlcuje síť.
- **Trojan:** Maskuje se jako užitečný program (např. ovladač tiskárny), ale škodí (např. vypne firewall).

**Další klíčové body:**
- **QoS priority:** Pokud je v síti QoS, nejvyšší prioritu má vždy Hlas (Voice/Audio), pak transakční data (finance) a nejnižší běžný web.
- **Baseline (Základna):** Pokud chceš zjistit, zda je síť pomalá "normálně" nebo je to chyba, musíš mít naměřenou výkonnostní základnu (baseline) z doby běžného provozu.
- **Cloud computing:** Jeho hlavní výhodou je, že organizace může rozšiřovat své kapacity (infrastrukturu, software) bez nutnosti investovat do vlastního hardwaru a personálu.
