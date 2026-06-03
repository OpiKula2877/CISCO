const STORAGE_KEY = 'ccnaQuizState';
const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const storage = isStandaloneMode ? window.localStorage : window.sessionStorage;

const categories = [
    { id: 1, label: 'Síťové modely a základy komunikace (OSI a TCP/IP)' },
    { id: 2, label: 'Aplikační vrstva a síťové služby (Protokoly)' },
    { id: 3, label: 'Transportní vrstva (TCP a UDP)' },
    { id: 4, label: 'Fyzická vrstva a síťová média (Hardware)' },
    { id: 5, label: 'Ethernet a linková vrstva (Layer 2)' },
    { id: 6, label: 'Protokol ARP (Řešení úkolů v LAN)' },
    { id: 7, label: 'IPv4 Adresování a Subnetting (Matematické úkoly)' },
    { id: 8, label: 'IPv6 Adresování a konfigurace' },
    { id: 9, label: 'Konfigurace a správa Cisco zařízení (IOS)' },
    { id: 10, label: 'Bezpečnost sítě, diagnostika a provoz' },
    { id: 11, label: 'Všechny' }
];

const sampleQuestions = [
    {
        id: 1,
        otazka: 'Server přijme paket s cílovým portem 143. Jakou službu klient požaduje?',
        moznosti: ['Telnet', 'SSH', 'IMAP', 'FTP'],
        spravna_odpoved: 2,
        kategorie: 2,
        vysvetleni: 'Port 143 je přiřazen službě IMAP, která se používá pro stahování e-mailů ze serveru. Telnet používá port 23, SSH port 22 a FTP porty 20/21 [1].'
    },
    {
        id: 2,
        otazka: 'Které dvě funkce se provádějí v podvrstvě MAC linkové vrstvy OSI pro usnadnění komunikace přes Ethernet? (Vyberte dvě)',
        moznosti: ['Synchronizace komunikace pomocí vymezení polí rámce', 'Přidání zdrojové a cílové MAC adresy do rámce', 'Identifikace protokolu síťové vrstvy v rámci', 'Komunikace mezi síťovým softwarem a hardwarem NIC', 'Přidání řídicích informací Ethernetu k datům'],
        spravna_odpoved: [1],
        kategorie: 5,
        vysvetleni: 'Podvrstva MAC zajišťuje vymezení polí (delimiting) pro synchronizaci a přidává fyzické (MAC) adresy do rámce [2].'
    },
    {
        id: 3,
        otazka: 'Které dvě funkce se provádějí v podvrstvě MAC linkové vrstvy OSI? (Případ B - Vyberte dvě)',
        moznosti: ['Implementace procesu vymezení polí v rámci Ethernet 2', 'Implementace traileru s kontrolním součtem (FCS) pro detekci chyb', 'Komunikace mezi horními vrstvami a hardwarem NIC', 'Přidání řídicích informací k síťovým datům', 'Identifikace protokolu síťové vrstvy'],
        spravna_odpoved: [1],
        kategorie: 5,
        vysvetleni: 'MAC sublayer odpovídá za strukturu rámce, včetně vymezení polí a detekce chyb pomocí pole FCS [3].'
    },
    {
        id: 4,
        otazka: 'Které dvě funkce se provádějí v podvrstvě MAC linkové vrstvy OSI? (Případ C - Vyberte dvě)',
        moznosti: ['Implementace CSMA/CD přes starší poloduplexní média', 'Integrace Layer 2 toků mezi optikou a mědí', 'Komunikace s horními vrstvami softwaru', 'Přidání řídicích informací k datům', 'Umožnění IPv4 a IPv6 sdílet stejné fyzické médium'],
        spravna_odpoved: [1],
        kategorie: 5,
        vysvetleni: 'MAC vrstva implementuje mechanismy řízení přístupu k médiu jako CSMA/CD a integruje toky dat mezi různými fyzickými standardy Ethernetu [4].'
    },
    {
        id: 5,
        otazka: 'Administrátor nastavil banner na Cisco zařízení. Jaký je nejrychlejší způsob, jak ověřit, zda je banner správně nakonfigurován?',
        moznosti: ['Stisknout CTRL-Z v privilegovaném režimu', 'Vypnout a zapnout zařízení', 'Ukončit privilegovaný režim EXEC a stisknout Enter', 'Ukončit režim globální konfigurace', 'Restartovat zařízení'],
        spravna_odpoved: 2,
        kategorie: 9,
        vysvetleni: 'Stačí napsat "exit" v privilegovaném režimu (Router#) a po stisknutí Enteru se banner okamžitě zobrazí. Power cycle nebo reboot by trvaly příliš dlouho [5].'
    },
    {
        id: 6,
        otazka: 'Co se stane, když je na vty linkách přepínače zadán příkaz "transport input ssh"?',
        moznosti: ['Přepínač vyžaduje kombinaci jméno/heslo', 'Je povolen SSH klient na přepínači', 'Komunikace mezi přepínačem a vzdálenými uživateli je šifrována', 'Přepínač vyžaduje proprietární klientský software'],
        spravna_odpoved: 2,
        kategorie: 9,
        vysvetleni: 'Příkaz "transport input ssh" zajistí, že všechna příchozí spojení na virtuální linky budou šifrována pomocí protokolu SSH, čímž se zablokuje nezabezpečený Telnet [6].'
    },
    {
        id: 7,
        otazka: 'Jaké je ID podsítě (subnet ID) spojené s IPv6 adresou 2001:DA48:FC5:A4:3D1B::1/64?',
        moznosti: ['2001:DA48::/64', '2001::/64', '2001:DA48:FC5:A4::/64', '2001:DA48:FC5::A4:/64'],
        spravna_odpoved: 2,
        kategorie: 8,
        vysvetleni: 'U IPv6 adresy s prefixem /64 tvoří čtvrté pole (hextet) ID podsítě. V tomto případě je to "A4" [7].'
    },
    {
        id: 8,
        otazka: 'Klient používá SLAAC k získání IPv6 adresy. Co musí klient udělat poté, co adresa byla vygenerována, ale předtím, než ji začne používat?',
        moznosti: ['Odeslat zprávu Router Solicitation pro zjištění brány', 'Požádat o adresu DNS serveru pomocí DHCPv6', 'Požádat DHCPv6 server o povolení použít tuto adresu', 'Odeslat zprávu ICMPv6 Neighbor Solicitation pro ověření unikátnosti adresy'],
        spravna_odpoved: 3,
        kategorie: 8,
        vysvetleni: 'Klient musí provést Duplicate Address Detection (DAD) pomocí zprávy Neighbor Solicitation, aby se ujistil, že vygenerovanou adresu již nepoužívá jiný uzel v síti [8].'
    },
    {
        id: 9,
        otazka: 'Který rozsah link-local adres může být přiřazen IPv6 rozhraní?',
        moznosti: ['FE80::/10', 'FDEE::/7', 'cc00::/8', 'FEC0::/10'],
        spravna_odpoved: 0,
        kategorie: 8,
        vysvetleni: 'Link-local adresy jsou definovány v rozsahu FE80::/10 až FEBF::/10. Rozsah FC00::/7 jsou Unique Local adresy a FF00::/8 jsou Multicasty [9].'
    },
    {
        id: 10,
        otazka: 'Jaký mechanismus používá router k tomu, aby zabránil nekonečnému kroužení IPv4 paketu v síti?',
        moznosti: ['Kontroluje pole TTL a při hodnotě 100 paket zahodí', 'Zvýší TTL o 1 a při hodnotě 100 paket zahodí', 'Kontroluje TTL a při hodnotě 0 paket zahodí se zprávou Destination Unreachable', 'Sníží hodnotu pole TTL o 1 a pokud je výsledek 0, paket zahodí se zprávou Time Exceeded'],
        spravna_odpoved: 3,
        kategorie: 1,
        vysvetleni: 'Router při každém průchodu sníží TTL o 1. Pokud hodnota dosáhne 0, paket je zahozen a odesílateli je zaslána zpráva ICMP Time Exceeded [10].'
    },
    {
        id: 11,
        otazka: 'Administrátor navrhuje bezdrátovou síť. Které tři oblasti by měly být zohledněny? (Vyberte tři)',
        moznosti: ['Možnosti mobility', 'Bezpečnost', 'Rušení (Interference)', 'Oblast pokrytí', 'Kolize paketů', 'Rozsáhlá kabeláž'],
        spravna_odpoved: [1, 2, 3],
        kategorie: 4,
        vysvetleni: 'Při návrhu Wi-Fi jsou hlavními faktory oblast pokrytí, možné zdroje rušení a zabezpečení sítě [11].'
    },
    {
        id: 12,
        otazka: 'Co je špatně na zobrazeném zakončení kabelu (UTP)?',
        moznosti: ['Rozpletená délka vodičů je příliš dlouhá', 'Nemělo být odstraněno měděné stínění', 'Je použit špatný typ konektoru', 'Vodiče jsou pro konektor příliš tlusté'],
        spravna_odpoved: 0,
        kategorie: 4,
        vysvetleni: 'Při krimpování RJ-45 nesmí být rozpletená část vodičů příliš dlouhá a plášť kabelu musí být sevřen uvnitř konektoru [12].'
    },
    {
        id: 13,
        otazka: 'Které dva faktory mohou rušit měděnou kabeláž a způsobit zkreslení signálu a poškození dat? (Vyberte dva)',
        moznosti: ['EMI', 'Útlum signálu (Attenuation)', 'Přeslech (Crosstalk)', 'RFI', 'Prodloužená délka kabeláže'],
        spravna_odpoved: [3],
        kategorie: 4,
        vysvetleni: 'EMI (elektromagnetické rušení) a RFI (rádiové rušení) ze zdrojů jako jsou motory nebo zářivky mohou poškodit signál v měděných kabelech [13].'
    },
    {
        id: 14,
        otazka: 'Která tři tvrzení správně popisují funkci TCP nebo UDP? (Vyberte tři)',
        moznosti: ['TCP je preferován, když je vyžadována nízká režie', 'Zdrojový port identifikuje běžící aplikaci pro vracející se data', 'TCP zdrojový port identifikuje odesílajícího hostitele', 'UDP segmenty jsou zapouzdřeny v IP paketech', 'Cílový port UDP identifikuje aplikaci nebo službu na serveru', 'TCP proces náhodně vybírá cílový port při navazování relace'],
        spravna_odpoved: [1, 3, 4],
        kategorie: 3,
        vysvetleni: 'Zdrojový port slouží k sledování relace pro návrat dat, L4 segmenty se zapouzdřují do IP paketů a cílový port určuje službu na serveru [14].'
    },
    {
        id: 15,
        otazka: 'Přiřaďte aplikační protokoly ke správným transportním protokolům.',
        moznosti: ['DHCP, FTP, HTTP, SMTP -> všechny TCP', 'DHCP (UDP), FTP (TCP), HTTP (TCP), SMTP (TCP)', 'DHCP (TCP), FTP (UDP), HTTP (TCP), SMTP (UDP)', 'Všechny používají UDP'],
        spravna_odpoved: 1,
        kategorie: 2,
        vysvetleni: 'HTTP, FTP a SMTP vyžadují spolehlivost (TCP), zatímco DHCP používá jednoduchý model dotaz-odpověď přes UDP [15].'
    },
    {
        id: 16,
        otazka: 'Technik chce ověřit IP adresu a DNS konfiguraci na PC a konektivitu k routeru. Které tři příkazy Windows použije? (Vyberte tři)',
        moznosti: ['netsh interface ipv6 show neighbor', 'arp -a', 'tracert', 'ping', 'ipconfig', 'nslookup'],
        spravna_odpoved: [3, 4, 5],
        kategorie: 10,
        vysvetleni: 'Ipconfig zobrazí nastavení IP, nslookup ověří DNS a ping otestuje konektivitu k bráně [16].'
    },
    {
        id: 17,
        otazka: 'Které dvě informace se zobrazují ve výstupu příkazu "show ip interface brief"? (Vyberte dvě)',
        moznosti: ['Nastavení rychlosti a duplexu', 'MAC adresy', 'Adresy příštího skoku (Next-hop)', 'Popisy rozhraní (Description)', 'IP adresy', 'Stavy Layer 1'],
        spravna_odpoved: [4, 5],
        kategorie: 9,
        vysvetleni: 'Příkaz zobrazí přehled IP adres rozhraní a jejich provozní stav na první a druhé vrstvě [17].'
    },
    {
        id: 18,
        otazka: 'Nová LAN musí podporovat 25 připojených zařízení. Jaká je nejmenší maska sítě, kterou může administrátor použít?',
        moznosti: ['255.255.255.224', '255.255.255.192', '255.255.255.240', '255.255.255.128'],
        spravna_odpoved: 0,
        kategorie: 7,
        vysvetleni: 'Pro 25 zařízení potřebujete 5 bitů pro hosty (2^5 = 32 adres, 30 použitelných), což odpovídá masce /27 neboli 255.255.255.224 [18].'
    },
    {
        id: 19,
        otazka: 'Které pole rámce se používá k ověření, zda nebyl signál poškozen rušením nebo ztrátou?',
        moznosti: ['Pole pro kontrolu chyb transportní vrstvy', 'Pole procesu opravy chyb', 'Pole řízení toku', 'Pole UDP', 'Pole frame check sequence (FCS)'],
        spravna_odpoved: 4,
        kategorie: 5,
        vysvetleni: 'Pole FCS obsahuje výsledek výpočtu CRC, který příjemce porovná se svým výpočtem, aby zjistil, zda rámec dorazil nepoškozený [19].'
    },
    {
        id: 20,
        otazka: 'Co je funkcí linkové vrstvy (Data Link Layer)?',
        moznosti: ['Zajišťuje doručení dat mezi dvěma aplikacemi', 'Zajišťuje výměnu rámců přes společné lokální médium', 'Zajišťuje end-to-end doručení mezi hostiteli', 'Zajišťuje formátování dat'],
        spravna_odpoved: 1,
        kategorie: 5,
        vysvetleni: 'Linková vrstva je zodpovědná za přenos dat mezi uzly v rámci stejného síťového segmentu a řídí přístup k fyzickému médiu [20].'
    },
    {
        id: 21,
        otazka: 'Nová LAN v pobočce musí podporovat 25 připojených zařízení. Jaká je nejmenší maska sítě, kterou může administrátor použít?',
        moznosti: ['255.255.255.224', '255.255.255.192', '255.255.255.240', '255.255.255.128'],
        spravna_odpoved: 0,
        kategorie: 7,
        vysvetleni: 'Pro 25 zařízení potřebujete masku /27 (255.255.255.224). Ta poskytuje 5 bitů pro hosty, což je 32 adres celkem (30 použitelných), což stačí pro 25 zařízení plus síťovou a broadcast adresu.'
    },
    {
        id: 22,
        otazka: 'Které pole rámce vytváří zdrojový uzel a cílový uzel jej používá k ověření, zda signál nebyl poškozen rušením nebo ztrátou?',
        moznosti: ['transport layer error check field', 'error correction process field', 'flow control field', 'User Datagram Protocol field', 'frame check sequence field'],
        spravna_odpoved: 4,
        kategorie: 5,
        vysvetleni: 'Pole FCS (Frame Check Sequence) obsahuje hodnotu vypočítanou pomocí cyklického redundantního součtu (CRC). Cíl provede stejný výpočet; pokud se výsledky shodují, rámec je v pořádku.'
    },
    {
        id: 23,
        otazka: 'Co je funkcí linkové vrstvy (Data Link Layer)?',
        moznosti: ['Zajišťuje doručení dat mezi dvěma aplikacemi', 'Zajišťuje výměnu rámců přes společné lokální médium', 'Zajišťuje end-to-end doručení dat mezi hostiteli', 'Zajišťuje formátování dat'],
        spravna_odpoved: 1,
        kategorie: 5,
        vysvetleni: 'Linková vrstva (Layer 2) odpovídá za doručování dat mezi uzly v rámci stejného segmentu a spravuje, jak jsou rámce umisťovány na fyzické médium.'
    },
    {
        id: 24,
        otazka: 'Které tři charakteristiky popisují proces CSMA/CD? (Vyberte tři)',
        moznosti: ['Po detekci kolize se zařízení pokusí o vysílání po náhodné prodlevě', 'Jam signál indikuje, že médium je volné', 'Všechna zařízení na segmentu vidí data procházející médiem', 'Zařízení s elektronickým tokenem může vysílat', 'Zařízení naslouchá a čeká, dokud není médium volné'],
        spravna_odpoved: [1, 2],
        kategorie: 5,
        vysvetleni: 'V CSMA/CD zařízení před vysíláním naslouchá (carrier sense). Pokud dojde ke kolizi, použije se náhodný algoritmus prodlevy (backoff) před dalším pokusem. Všechna zařízení na sdíleném médiu vidí provoz.'
    },
    {
        id: 25,
        otazka: 'Jaká charakteristika popisuje trojského koně (Trojan horse)?',
        moznosti: ['Útok, který zpomalí nebo shodí síťovou službu', 'Škodlivý software nebo kód běžící na koncovém zařízení', 'Síťové zařízení filtrující přístup a provoz', 'Použití ukradených přihlašovacích údajů'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Trojský kůň se maskuje jako legitimní software. Vyžaduje, aby ho uživatel nevědomky nainstaloval (např. stažením programu), a následně může škodit nebo umožnit neoprávněný přístup.'
    },
    {
        id: 26,
        otazka: 'Které tři požadavky definují protokoly používané v síťové komunikaci pro umožnění přenosu zpráv? (Vyberte tři)',
        moznosti: ['Instalace koncového zařízení', 'Výběr média', 'Kódování zpráv (encoding)', 'Možnosti doručení (delivery options)', 'Specifikace konektorů', 'Velikost zprávy (message size)'],
        spravna_odpoved: [1, 3, 4],
        kategorie: 1,
        vysvetleni: 'Protokoly definují, jak je zpráva kódována pro přenos, jakou má mít velikost (např. MTU) a jakým způsobem se doručuje (Unicast, Multicast, Broadcast).'
    },
    {
        id: 27,
        otazka: 'Které dvě vlastnosti patří protokolu ARP? (Vyberte dvě)',
        moznosti: ['Pokud má zařízení cílovou IPv4 adresu, odpoví pomocí ARP reply', 'Hostitel se při zapouzdření dívá do tabulky MAC adres', 'Pokud nikdo neodpoví, uzel pošle broadcast datový paket všem', 'ARP request je poslán jako multicast na MAC adresu cíle', 'Pokud hostitel nezná MAC adresu cíle v lokální síti, generuje ARP broadcast'],
        spravna_odpoved: [2],
        kategorie: 6,
        vysvetleni: 'ARP slouží k rozlišení MAC adresy z IP adresy. Pokud MAC není v tabulce, pošle se broadcast (FFFF.FFFF.FFFF). Cílové zařízení pak odpoví unicastem (ARP reply).'
    },
    {
        id: 28,
        otazka: 'Administrátor se pokouší konfigurovat přepínač, ale obdrží chybu (např. "Invalid input detected"). Co je typickým problémem?',
        moznosti: ['Musí být použit celý příkaz configure terminal', 'Musí se připojit přes konzoli', 'Administrátor už je v globální konfiguraci', 'Administrátor musí nejprve vstoupit do privilegovaného režimu EXEC'],
        spravna_odpoved: 3,
        kategorie: 9,
        vysvetleni: 'V Cisco IOS musí uživatel nejprve zadat příkaz "enable" pro vstup do privilegovaného režimu (#), než může zadat "configure terminal" pro změnu nastavení.'
    },
    {
        id: 29,
        otazka: 'Na základě úspěšného výstupu pingu, které dvě tvrzení jsou správná? (Vyberte dvě)',
        moznosti: ['Hostitel nemá nastavenou výchozí bránu', 'Mezi těmito zařízeními jsou 4 skoky (hops)', 'Průměrná doba přenosu je 2 milisekundy', 'Existuje konektivita mezi tímto zařízením a cílem', 'Konektivita umožňuje videokonference'],
        spravna_odpoved: [3, 4],
        kategorie: 10,
        vysvetleni: 'Ping potvrzuje konektivitu na 3. vrstvě. Výstup také ukazuje počet skoků a průměrný čas odezvy (RTT). Úspěšný ping však nezaručuje, že aplikace (např. video) poběží bez problémů.'
    },
    {
        id: 30,
        otazka: 'Které dvě charakteristiky patří protokolu IP? (Vyberte dvě)',
        moznosti: ['Znovu posílá pakety při chybě', 'Garantuje doručení paketů', 'Nevyžaduje vyhrazené end-to-end spojení', 'Operuje nezávisle na síťovém médiu', 'Skládá pakety do správného pořadí u příjemce'],
        spravna_odpoved: [1, 3],
        kategorie: 1,
        vysvetleni: 'IP je bezestavový (connectionless) a nezávislý na médiu. Negarantuje doručení ani správné pořadí; tyto funkce zajišťují protokoly vyšších vrstev (např. TCP).'
    },
    {
        id: 31,
        otazka: 'Co se stane, pokud je na hostiteli nesprávně nakonfigurována adresa výchozí brány (default gateway)?',
        moznosti: ['Hostitel nemůže komunikovat s hostiteli v jiných sítích', 'Hostitel nemůže komunikovat v lokální síti', 'Ping na 127.0.0.1 selže', 'Přepínač nebude přeposílat pakety z hostitele'],
        spravna_odpoved: 0,
        kategorie: 10,
        vysvetleni: 'Výchozí brána je nutná pro odesílání dat mimo lokální subnet. Bez správné brány může hostitel stále komunikovat se sousedy ve stejné síti, ale nedostane se dál.'
    },
    {
        id: 32,
        otazka: 'Zaměstnanec stáhl program pro skenování třetí strany. Síť se poté zpomalila. O jaký typ malwaru se pravděpodobně jedná?',
        moznosti: ['spam', 'virus', 'worm (červ)', 'phishing'],
        spravna_odpoved: 2,
        kategorie: 10,
        vysvetleni: 'Červi (worms) se šíří sami sítí a zneužívají zranitelnosti, což často vede k masivnímu zahlcení provozu a zpomalení výkonu sítě.'
    },
    {
        id: 33,
        otazka: 'Firemní politika určuje, že složka Public má práva "pouze pro čtení" pro všechny, ale "Edit" práva pouze pro administrátory. Která složka AAA modelu je zde řešena?',
        moznosti: ['automation', 'authorization (autorizace)', 'accounting (účtování)', 'authentication (autentizace)'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Autorizace určuje, co přesně může uživatel v síti dělat poté, co byla jeho identita ověřena (autentizována).'
    },
    {
        id: 34,
        otazka: 'Které dvě příčiny jsou běžné pro degradaci signálu (útlum) u UTP kabeláže? (Vyberte dvě)',
        moznosti: ['Ztráta světla na velké vzdálenosti', 'Nízká kvalita kabelů nebo konektorů', 'Nízká kvalita stínění v kabelu', 'Instalace kabelů do trubek', 'Nesprávné zakončení (termination)'],
        spravna_odpoved: [1, 4],
        kategorie: 4,
        vysvetleni: 'Útlum (attenuation) v mědi je způsoben kvalitou materiálu a délkou. Špatné zakončení vodičů v konektoru RJ-45 způsobuje odrazy a přeslechy.'
    },
    {
        id: 35,
        otazka: 'Který scénář popisuje funkci transportní vrstvy?',
        moznosti: ['Zajišťuje, že webová stránka je doručena do správného okna prohlížeče ze dvou otevřených', 'Používá unikátní identifikátor vypálený v telefonu k hovoru', 'Formátuje obrazovku tak, aby se web zobrazil správně na jakémkoliv zařízení', 'Kóduje zvuk a obraz uvnitř hlavičky'],
        spravna_odpoved: 0,
        kategorie: 3,
        vysvetleni: 'Transportní vrstva využívá čísla portů ke sledování a oddělení různých komunikačních toků (relací) běžících na stejném zařízení.'
    },
    {
        id: 36,
        otazka: 'Které dva protokoly operují na nejvyšší vrstvě sady TCP/IP? (Vyberte dvě)',
        moznosti: ['POP', 'DNS', 'IP', 'TCP', 'Ethernet', 'UDP'],
        spravna_odpoved: [5],
        kategorie: 2,
        vysvetleni: 'POP (pro poštu) a DNS (překlad jmen) jsou aplikační protokoly. TCP/UDP jsou transportní, IP je internetová a Ethernet je vrstva síťového přístupu.'
    },
    {
        id: 37,
        otazka: 'Spojení k ISP selhalo, ale záložní linka se aktivovala během sekund bez přerušení videokonference. Které tři charakteristiky sítě to popisuje? (Vyberte tři)',
        moznosti: ['integrita', 'škálovatelnost', 'quality of service (QoS)', 'fault tolerance (odolnost vůči chybám)', 'powerline networking', 'zabezpečení'],
        spravna_odpoved: [1, 3, 4],
        kategorie: 1,
        vysvetleni: 'Rychlá aktivace záložní linky je odolnost vůči chybám (fault tolerance). Požadavek na kvalitu videa řeší QoS a přihlášení uživatele je součástí zabezpečení.'
    },
    {
        id: 38,
        otazka: 'Pokud PC1 posílá paket hostiteli PC2 přes směrovač R1 (sériový spoj), co udělá R1 s hlavičkou Ethernet rámce, kterou přidal PC1?',
        moznosti: ['Nahradí cílovou MAC adresu novou', 'Nic, protože má cestu do cílové sítě', 'Odstraní Ethernet hlavičku a vytvoří novou hlavičku 2. vrstvy před odesláním'],
        spravna_odpoved: 2,
        kategorie: 5,
        vysvetleni: 'Směrovač (L3) při přeposílání mezi různými technologiemi (např. Ethernet a Sériový spoj) musí odstranit starou L2 hlavičku a vytvořit novou odpovídající odchozímu médiu.'
    },
    {
        id: 39,
        otazka: 'Které tři vrstvy OSI modelu se mapují na aplikační vrstvu TCP/IP modelu? (Vyberte tři)',
        moznosti: ['transportní', 'aplikační', 'síťová', 'relační', 'linková', 'prezentační'],
        spravna_odpoved: [3, 5],
        kategorie: 1,
        vysvetleni: 'Model TCP/IP slučuje horní tři vrstvy OSI modelu (aplikační, prezentační a relační) do jedné jediné aplikační vrstvy.'
    },
    {
        id: 40,
        otazka: 'Která adresa patří do bloku experimentálních adres (původně třída E)?',
        moznosti: ['127.0.0.1', '169.254.1.5', '192.0.2.1', '240.2.6.255', '172.18.45.9'],
        spravna_odpoved: 3,
        kategorie: 7,
        vysvetleni: 'Blok adres od 240.0.0.0 do 255.255.255.254 je vyhrazen pro experimentální účely a budoucí použití.'
    },
    {
        id: 41,
        otazka: 'Zaměstnanec se přihlásil heslem k videokonferenci. Během hovoru vypadl hlavní ISP, ale záložní linka se aktivovala během sekund bez přerušení videa. Jaké tři charakteristiky sítě to popisuje? (Vyberte tři)',
        moznosti: ['integrita, škálovatelnost, QoS', 'QoS, fault tolerance (odolnost vůči chybám), zabezpečení', 'zabezpečení, škálovatelnost, integrita', 'powerline networking, QoS, fault tolerance'],
        spravna_odpoved: 1,
        kategorie: 1,
        vysvetleni: 'Prioritizace videa je Quality of Service (QoS). Aktivace záložní linky je Fault Tolerance. Přihlášení heslem je součástí zabezpečení [1, 2].'
    },
    {
        id: 42,
        otazka: 'Pokud PC1 posílá paket hostiteli PC2 přes směrovač R1 (sériový spoj), co udělá R1 s hlavičkou Ethernet rámce, kterou přidal PC1?',
        moznosti: ['Otevře hlavičku a nahradí cílovou MAC adresu novou', 'Nic, protože má cestu do cílové sítě', 'Odstraní Ethernet hlavičku a vytvoří novou hlavičku 2. vrstvy před odesláním'],
        spravna_odpoved: 2,
        kategorie: 5,
        vysvetleni: 'Směrovač odstraní starou L2 hlavičku (Ethernet) a vytvoří novou odpovídající odchozímu médiu (např. sériová linka) [3, 4].'
    },
    {
        id: 43,
        otazka: 'Které tři vrstvy OSI modelu se mapují na aplikační vrstvu TCP/IP modelu? (Vyberte tři)',
        moznosti: ['transportní, aplikační, síťová', 'relační, linková, prezentační', 'aplikační, prezentační, relační', 'fyzická, síťová, transportní'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'Model TCP/IP slučuje horní tři vrstvy OSI (aplikační, prezentační a relační) do jedné aplikační vrstvy [5].'
    },
    {
        id: 44,
        otazka: 'Který rozsah IP adres je vyhrazen jako experimentální adresy (původně třída E)?',
        moznosti: ['169.254.0.0/16', '127.0.0.0/8', '240.0.0.0 až 255.255.255.254', '192.0.2.0/24'],
        spravna_odpoved: 2,
        kategorie: 7,
        vysvetleni: 'Blok 240.0.0.0 až 255.255.255.254 je vyhrazen pro experimentální účely [6].'
    },
    {
        id: 45,
        otazka: 'Co v datové komunikaci znamená termín "útlum" (attenuation)?',
        moznosti: ['Zesílení signálu síťovým zařízením', 'Průnik signálů z jednoho páru kabelu do druhého', 'Ztráta síly signálu s rostoucí vzdáleností', 'Doba, za kterou signál dorazí do cíle'],
        spravna_odpoved: 2,
        kategorie: 4,
        vysvetleni: 'Čím dále signál cestuje, tím více slábne (deterioruje), což se nazývá útlum [7].'
    },
    {
        id: 46,
        otazka: 'Jaké dva postupy jsou doporučeny pro analýzu toku provozu pomocí protokolového analyzátoru? (Vyberte dvě)',
        moznosti: ['Zachycuje provoz pouze o víkendech', 'Zachycuje provoz v době špičky a na různých segmentech sítě', 'Zachycuje pouze WAN provoz', 'Zachycuje provoz pouze v datovém centru'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Pro získání věrného obrazu je nutné zachytit provoz v době nejvyšší zátěže a na různých místech sítě [8, 9].'
    },
    {
        id: 47,
        otazka: 'Hostitel B (v síti Teachers) posílá paket hostiteli D (v síti Students). Jaké adresy budou v PDU při přenosu od hostitele B k routeru?',
        moznosti: ['L2 cílová: MAC routeru, L3 cílová: IP hostitele D', 'L2 cílová: MAC hostitele D, L3 cílová: IP routeru', 'L2 i L3 adresy budou patřit hostiteli D', 'L2 i L3 adresy budou patřit routeru'],
        spravna_odpoved: 0,
        kategorie: 5,
        vysvetleni: 'Protože je cíl v jiné síti, na L2 musí být cílem MAC adresa rozhraní routeru (výchozí brány), zatímco na L3 zůstává cílem IP adresa koncového zařízení [10, 11].'
    },
    {
        id: 48,
        otazka: 'Která podsíť zahrnuje adresu 192.168.1.96 jako použitelnou adresu hostitele?',
        moznosti: ['192.168.1.32/27', '192.168.1.32/28', '192.168.1.64/26', '192.168.1.64/29'],
        spravna_odpoved: 2,
        kategorie: 7,
        vysvetleni: 'V síti 192.168.1.64/26 je rozsah hostitelů 192.168.1.65 až 192.168.1.126, kam adresa .96 spadá [12].'
    },
    {
        id: 49,
        otazka: 'Jaké dva problémy může způsobit velké množství ARP requestů a reply zpráv? (Vyberte dvě)',
        moznosti: ['Změny v MAC tabulce přepínače', 'Záplava celého subnetu broadcasty a nutnost zpracování zprávy každým uzlem', 'Zpomalení internetového připojení', 'Zvýšení velikosti payloadu paketů'],
        spravna_odpoved: 1,
        kategorie: 6,
        vysvetleni: 'ARP requesty jsou broadcasty, které musí zpracovat všechna zařízení v síti, což může zahltit šířku pásma i CPU zařízení [13, 14].'
    },
    {
        id: 50,
        otazka: 'Proč by přepínač na 2. vrstvě (Layer 2 switch) potřeboval IP adresu?',
        moznosti: ['Aby mohl přijímat rámce z PC', 'Aby mohl být spravován vzdáleně', 'Aby mohl fungovat jako výchozí brána', 'Aby mohl posílat broadcastové rámce'],
        spravna_odpoved: 1,
        kategorie: 9,
        vysvetleni: 'Přepínač nepotřebuje IP pro doručování rámců, ale potřebuje ji pro vzdálený přístup přes síť (např. SSH/Telnet) [15].'
    },
    {
        id: 51,
        otazka: 'Jak příkaz "service password-encryption" zvyšuje bezpečnost na Cisco routeru?',
        moznosti: ['Šifruje hesla posílaná po síti přes Telnet', 'Šifruje hesla uložená v konfiguračních souborech v zařízení', 'Vyžaduje šifrovaná hesla pro konzoli', 'Šifruje data uživatelů'],
        spravna_odpoved: 1,
        kategorie: 9,
        vysvetleni: 'Tento příkaz zašifruje hesla v textové konfiguraci, takže je nelze přečíst pouhým nahlédnutím do souboru [16].'
    },
    {
        id: 52,
        otazka: 'Která dvě tvrzení jsou správná při porovnání hlaviček paketů IPv4 a IPv6? (Vyberte dvě)',
        moznosti: ['IPv6 má nové pole Destination Address', 'Název pole Source Address zůstal stejný a TTL bylo nahrazeno polem Hop Limit', 'IPv4 nemá pole Version', 'IPv6 si ponechalo pole Header Checksum'],
        spravna_odpoved: 1,
        kategorie: 1,
        vysvetleni: 'Zdrojová adresa se jmenuje stejně, ale TTL (IPv4) bylo v IPv6 přejmenováno na Hop Limit se stejným účelem [17].'
    },
    {
        id: 53,
        otazka: 'Jaké jsou výhody nebo nevýhody nasazení NAT pro IPv4? (Vyberte dvě)',
        moznosti: ['NAT zpomaluje vyčerpání IPv4 adres a může narušit end-to-end konektivitu', 'NAT zlepšuje výkon přepínačů', 'NAT přidává autentizaci do IPv4', 'NAT zrychluje směrování'],
        spravna_odpoved: 0,
        kategorie: 7,
        vysvetleni: 'NAT šetří veřejné adresy, ale modifikuje hlavičky, což působí problémy aplikacím vyžadujícím přímé spojení [18].'
    },
    {
        id: 54,
        otazka: 'Jaký je rozdíl mezi logickým a fyzickým diagramem topologie?',
        moznosti: ['Logický ukazuje IP adresování a porty, fyzický ukazuje umístění zařízení a kabeláž', 'Logický ukazuje kabely, fyzický ukazuje protokoly', 'Fyzický ukazuje IP schéma, logický ukazuje porty', 'Není v nich žádný rozdíl'],
        spravna_odpoved: 0,
        kategorie: 1,
        vysvetleni: 'Logický diagram se zaměřuje na adresování a skupiny portů, fyzický na reálné propojení a umístění hardwaru [19].'
    },
    {
        id: 55,
        otazka: 'Jakou službu poskytuje protokol HTTP?',
        moznosti: ['Zabezpečené chatování v reálném čase', 'Šifrování zvuku a obrazu', 'Základní sadu pravidel pro výměnu textu, obrázků a multimédií na webu', 'Přenos souborů mezi klientem a serverem'],
        spravna_odpoved: 2,
        kategorie: 2,
        vysvetleni: 'HTTP je základní protokol pro přenos obsahu webových stránek [20].'
    },
    {
        id: 56,
        otazka: 'Server přijme paket s cílovým portem 67. Jakou službu klient požaduje?',
        moznosti: ['Telnet', 'FTP', 'SSH', 'DHCP'],
        spravna_odpoved: 3,
        kategorie: 2,
        vysvetleni: 'Port 67 je vyhrazen pro serverovou stranu služby DHCP. Port 68 používá klient [21].'
    },
    {
        id: 57,
        otazka: 'Které dva způsoby jsou nejúčinnější obranou proti malwaru? (Vyberte dvě)',
        moznosti: ['Silná hesla a VPN', 'Aktualizace operačního systému a instalace/aktualizace antiviru', 'Implementace RAID', 'Používání firewallu'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Klíčem k ochraně je záplatování děr v softwaru a aktivní detekce virů [22].'
    },
    {
        id: 58,
        otazka: 'Které tři kroky jsou vyžadovány pro konfiguraci SSH na routeru Cisco? (Vyberte tři)',
        moznosti: ['Nastavit doménové jméno, vygenerovat SSH klíče a povolit SSH na vty linkách', 'Nastavit DNS, povolit Telnet a vygenerovat hesla', 'Vytvořit lokálního uživatele, nastavit IP bránu a zapnout firewall', 'Není potřeba nic konfigurovat'],
        spravna_odpoved: 0,
        kategorie: 9,
        vysvetleni: 'Konfigurace SSH vyžaduje unikátní název domény pro generování klíčů a povolení protokolu na virtuálních linkách [23].'
    },
    {
        id: 59,
        otazka: 'Hostitel posílá paket do vzdálené sítě, ale nemá v ARP cache žádné záznamy. Jak získá cílovou MAC adresu?',
        moznosti: ['Pošle ARP request na MAC adresu cílového zařízení', 'Pošle ARP request pro získání MAC adresy výchozí brány (default gateway)', 'Pošle dotaz na DNS server', 'Použije broadcastovou MAC adresu'],
        spravna_odpoved: 1,
        kategorie: 6,
        vysvetleni: 'Pokud je cíl v jiné síti, hostitel ví, že musí paket poslat routeru. Proto zjišťuje MAC adresu své brány [24].'
    },
    {
        id: 60,
        otazka: 'Ke které vrstvě OSI modelu patří pole TTL (Time-to-Live)?',
        moznosti: ['Vrstva 2 (Linková)', 'Vrstva 3 (Síťová)', 'Vrstva 4 (Transportní)', 'Vrstva 7 (Aplikační)'],
        spravna_odpoved: 1,
        kategorie: 1,
        vysvetleni: 'TTL je součástí IP hlavičky, která patří do 3. vrstvy (síťové). Slouží k zabránění nekonečného kroužení paketů [25].'
    },
    {
        id: 61,
        otazka: 'Které dva způsoby jsou nejúčinnější obranou proti malwaru? (Vyberte dvě)',
        moznosti: ['Implementace silných hesel', 'Aktualizace operačního systému a aplikací', 'Instalace a aktualizace antivirového softwaru', 'Implementace RAID pole', 'Používání VPN'],
        spravna_odpoved: [1, 2],
        kategorie: 10,
        vysvetleni: 'Pravidelné aktualizace softwaru opravují bezpečnostní díry a antivirus aktivně detekuje a odstraňuje škodlivý kód. RAID je pro dostupnost dat, nikoliv ochranu před malwarem.'
    },
    {
        id: 62,
        otazka: 'Které tři kroky jsou vyžadovány pro konfiguraci routeru Cisco tak, aby přijímal pouze šifrovaná SSH spojení? (Vyberte tři)',
        moznosti: ['Nakonfigurovat IP doménové jméno', 'Povolit příchozí telnet na vty linkách', 'Vygenerovat SSH klíče', 'Povolit příchozí SSH na vty linkách', 'Vytvořit statické trasy'],
        spravna_odpoved: [2, 3],
        kategorie: 9,
        vysvetleni: 'SSH vyžaduje doménové jméno pro generování klíčů. Následně se musí klíče vygenerovat (crypto key generate rsa) a na vty linkách nastavit "transport input ssh".'
    },
    {
        id: 63,
        otazka: 'Hostitel se pokouší poslat paket zařízení ve vzdáleném LAN segmentu, ale v ARP cache nemá žádný záznam. Jak získá cílovou MAC adresu?',
        moznosti: ['Pošle rámec s broadcastovou MAC adresou', 'Pošle ARP request na MAC adresu cílového zařízení', 'Pošle ARP request pro získání MAC adresy výchozí brány', 'Pošle dotaz na DNS server'],
        spravna_odpoved: 2,
        kategorie: 6,
        vysvetleni: 'Protože je cíl v jiné síti, hostitel ví, že musí data poslat routeru. Proto zjišťuje MAC adresu své výchozí brány (default gateway).'
    },
    {
        id: 64,
        otazka: 'Které pole v hlavičce protokolu patří do 3. vrstvy (Network Layer) OSI modelu?',
        moznosti: ['Destination MAC Address', 'Acknowledgment Number', 'TTL (Time-to-Live)', 'FCS (Frame Check Sequence)'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'TTL je pole v IP hlavičce (L3). MAC adresy a FCS patří do linkové vrstvy (L2), potvrzovací čísla (ACK) do transportní vrstvy (L4).'
    },
    {
        id: 65,
        otazka: 'Na jakou metodu přepínání se přepínač vrátí, pokud je na portu dosažen uživatelem definovaný práh chyb?',
        moznosti: ['fast-forward', 'cut-through', 'store-and-forward', 'fragment-free'],
        spravna_odpoved: 2,
        kategorie: 5,
        vysvetleni: 'Store-and-forward kontroluje FCS (chyby) u celého rámce před odesláním, což je nejbezpečnější metoda při výskytu chyb v síti.'
    },
    {
        id: 66,
        otazka: 'Co jsou to proprietární protokoly?',
        moznosti: ['Protokoly, které může volně používat jakákoliv organizace', 'Soubor protokolů známý jako TCP/IP suite', 'Protokoly vyvinuté organizacemi, které mají kontrolu nad jejich definicí a provozem', 'Protokoly určené výhradně pro open-source hardware'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'Proprietární protokoly (např. starší protokoly Cisco) vlastní jedna společnost a omezuje jejich implementaci na svá zařízení.'
    },
    {
        id: 67,
        otazka: 'Jaká je výhoda používání protokolů definovaných otevřenými standardy?',
        moznosti: ['Společnost může monopolizovat trh', 'Podporují konkurenci a umožňují výběr mezi různými výrobci', 'Protokoly běží pouze na vybavení od konkrétního prodejce', 'Nejsou regulovány standardizačními organizacemi'],
        spravna_odpoved: 1,
        kategorie: 1,
        vysvetleni: 'Otevřené standardy (např. Ethernet, IP) umožňují zařízením od různých výrobců spolupracovat, což snižuje náklady a zvyšuje inovace.'
    },
    {
        id: 68,
        otazka: 'Který typ serveru spoléhá na záznamy typu A, NS, AAAA a MX pro poskytování služeb?',
        moznosti: ['e-mailový server', 'souborový server', 'webový server', 'DNS server'],
        spravna_odpoved: 3,
        kategorie: 2,
        vysvetleni: 'DNS server uchovává tyto záznamy pro překlad domén na IP (A, AAAA), identifikaci jmenných serverů (NS) a e-mailových serverů (MX).'
    },
    {
        id: 69,
        otazka: 'Administrátor chce použít stejnou masku pro sítě s 22, 20, 2 a 2 zařízeními. Která maska je nejefektivnější?',
        moznosti: ['255.255.255.240', '255.255.255.192', '255.255.255.224', '255.255.255.252'],
        spravna_odpoved: 2,
        kategorie: 7,
        vysvetleni: 'Největší síť má 22 zařízení, což vyžaduje 5 hostitelských bitů (2^5 - 2 = 30 adres). To odpovídá masce /27, tedy 255.255.255.224.'
    },
    {
        id: 70,
        otazka: 'Síť 192.168.10.0 byla rozdělena s prefixem /29. Jaká je adresa páté podsítě (pokud první podsíť je .0)?',
        moznosti: ['192.168.10.8', '192.168.10.24', '192.168.10.32', '192.168.10.40'],
        spravna_odpoved: 2,
        kategorie: 7,
        vysvetleni: 'Prefix /29 znamená přírůstek po 8 (256-248). Podsítě: 1. (.0), 2. (.8), 3. (.16), 4. (.24), 5. (.32).'
    },
    {
        id: 71,
        otazka: 'Síť 192.168.99.0/26 je rozdělena na 4 podsítě. Kolik celkem hostitelských adres zůstane nevyužito, pokud se v podsítích použije 30, 2, 2 a 14 adres?',
        moznosti: ['158', '200', '224', '72'],
        spravna_odpoved: 1,
        kategorie: 7,
        vysvetleni: 'Čtyři podsítě s maskou /26 mají celkem 248 použitelných adres (62*4). Využito je 48 (30+2+2+14). Zůstává 248 - 48 = 200.'
    },
    {
        id: 72,
        otazka: 'Jaké bude Interface ID u IPv6 adresy generované pomocí EUI-64 z MAC adresy 1C-6F-65-C2-BD-F8?',
        moznosti: ['1E6F:65FF:FEC2:BDF8', '106F:65FF:FEC2:BDF8', 'C16F:65FF:FEC2:BDF8', '0C6F:65FF:FEC2:BDF8'],
        spravna_odpoved: 0,
        kategorie: 8,
        vysvetleni: 'Vloží se FFFE doprostřed a invertuje se 7. bit prvního bajtu (1C v binární formě má 7. bit 0, po změně na 1 vznikne 1E).'
    },
    {
        id: 73,
        otazka: 'Jaké informace zobrazuje příkaz "show startup-config"?',
        moznosti: ['IOS obraz v RAM', 'Bootstrap program v ROM', 'Obsah uloženého konfiguračního souboru v NVRAM', 'Obsah aktuální běžící konfigurace v RAM'],
        spravna_odpoved: 2,
        kategorie: 9,
        vysvetleni: 'Startup-config je konfigurace uložená v NVRAM, která se načítá při startu zařízení.'
    },
    {
        id: 74,
        otazka: 'Které pole rámce se používá k identifikaci protokolu 3. vrstvy (např. IP), který je v rámci zapouzdřen?',
        moznosti: ['Addressing', 'Error detection', 'Type', 'Frame start'],
        spravna_odpoved: 2,
        kategorie: 5,
        vysvetleni: 'Pole Type (nebo EtherType) informuje příjemce, zda má data uvnitř předat protokolu IPv4, IPv6 nebo jinému.'
    },
    {
        id: 75,
        otazka: 'Které dvě jsou primární odpovědnosti subvrstvy Ethernet MAC? (Vyberte dvě)',
        moznosti: ['Přístup k médiu', 'Zapouzdření dat (Data encapsulation)', 'Logické adresování', 'Určování cesty paketů'],
        spravna_odpoved: [1],
        kategorie: 5,
        vysvetleni: 'MAC subvrstva řeší, jak se rámec fyzicky umístí na kabel (přístup k médiu) a přidává k datům L2 hlavičku a patičku (zapouzdření).'
    },
    {
        id: 76,
        otazka: 'Která charakteristika patří metodě Cut-Through Switching?',
        moznosti: ['Vždy ukládá celý rámec', 'Kontroluje CRC před odesláním', 'Začne odesílat hned po přečtení cílové adresy', 'Má nejvyšší latenci'],
        spravna_odpoved: 2,
        kategorie: 5,
        vysvetleni: 'Cut-Through je nejrychlejší metoda, protože nečeká na konec rámce a odesílá ho hned po zjištění cílové MAC adresy.'
    },
    {
        id: 77,
        otazka: 'Která metoda přepínání zahazuje rámce, které neprojdou kontrolou FCS?',
        moznosti: ['store-and-forward switching', 'ingress port buffering', 'cut-through switching', 'borderless switching'],
        spravna_odpoved: 0,
        kategorie: 5,
        vysvetleni: 'Store-and-forward jako jediná načte celý rámec a vypočítá FCS. Pokud nesouhlasí, rámec zahodí, aby nešířil chyby v síti.'
    },
    {
        id: 78,
        otazka: 'Jaká je výhoda protokolu IMAP oproti POP pro malé organizace?',
        moznosti: ['Zprávy jsou stahovány a mazány ze serveru', 'Zprávy jsou uchovávány na serveru, dokud nejsou ručně smazány', 'IMAP je méně bezpečný než POP', 'POP umožňuje synchronizaci více zařízení'],
        spravna_odpoved: 1,
        kategorie: 2,
        vysvetleni: 'IMAP ponechává zprávy na serveru, což umožňuje uživatelům přistupovat ke stejným e-mailům z mobilu i počítače současně.'
    },
    {
        id: 79,
        otazka: 'Sdílená tiskárna připojená k domácímu počítači umožňuje ostatním v síti tisknout. O jaký síťový model se jedná?',
        moznosti: ['point-to-point', 'client-based', 'peer-to-peer (P2P)', 'master-slave'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'V P2P modelu zařízení sdílejí své prostředky (soubory, tiskárny) přímo mezi sebou bez potřeby centrálního serveru.'
    },
    {
        id: 80,
        otazka: 'Nová LAN musí podporovat 200 zařízení. Jaká je nejmenší vhodná maska?',
        moznosti: ['255.255.255.224', '255.255.255.240', '255.255.255.192', '255.255.255.0'],
        spravna_odpoved: 3,
        kategorie: 7,
        vysvetleni: 'Pro 200 zařízení potřebujeme 8 bitů pro hosty (2^8 - 2 = 254 adres). Maska /24 (255.255.255.0) je nejmenší, která to zvládne.'
    },
    {
        id: 81,
        otazka: 'Jaká je nejmenší maska sítě, kterou může síťový administrátor použít pro novou LAN podporující 200 připojených zařízení?',
        moznosti: ['255.255.255.224', '255.255.255.240', '255.255.255.192', '255.255.255.0'],
        spravna_odpoved: 3,
        kategorie: 7,
        vysvetleni: 'Pro podporu 200 zařízení je nutné mít podsíť, která pojme alespoň 202 adres (200 pro hosty plus síťovou a broadcast adresu) [1]. Maska /24 (255.255.255.0) poskytuje 254 použitelných adres, což je nejmenší standardní maska splňující tento požadavek [1].'
    },
    {
        id: 82,
        otazka: 'Která bezdrátová technologie má nízké nároky na napájení a datovou rychlost, díky čemuž je populární v aplikacích pro domácí automatizaci?',
        moznosti: ['ZigBee', '5G', 'Wi-Fi', 'LoRaWAN'],
        spravna_odpoved: 0,
        kategorie: 4,
        vysvetleni: 'ZigBee je navržena pro aplikace s nízkou datovou rychlostí a nízkou spotřebou energie, typicky pro senzory a chytrou domácnost [2]. Sítě ZigBee mohou fungovat roky na levné baterie [2].'
    },
    {
        id: 83,
        otazka: 'Které dvě charakteristiky sdílejí protokoly TCP a UDP? (Vyberte dvě)',
        moznosti: ['3-cestné navazování spojení (handshake)', 'Číslování portů', 'Výchozí velikost okénka (window size)', 'Použití kontrolního součtu (checksum)', 'Spojově orientovaná komunikace'],
        spravna_odpoved: [3, 4],
        kategorie: 3,
        vysvetleni: 'Oba protokoly používají čísla portů pro rozlišení datových toků a kontrolní součet pro ověření integrity přijatých dat [5]. TCP je na rozdíl od UDP spojově orientovaný a používá handshake [5].'
    },
    {
        id: 84,
        otazka: 'Server přijme paket s cílovým portem 69. Jakou službu klient požaduje?',
        moznosti: ['DHCP', 'SMTP', 'TFTP', 'DNS'],
        spravna_odpoved: 2,
        kategorie: 2,
        vysvetleni: 'Port 69 je vyhrazen pro službu TFTP (Trivial File Transfer Protocol) [6]. Používá se pro jednoduchý přenos souborů, jako jsou bootovací soubory nebo konfigurace [6].'
    },
    {
        id: 85,
        otazka: 'Jakou službu poskytuje Internet Messenger?',
        moznosti: ['Aplikaci umožňující chatování v reálném čase mezi vzdálenými uživateli', 'Překlad doménových jmen na IP adresy', 'Šifrovaný vzdálený přístup k serverům', 'Vzdálený přístup k síťovým zařízením'],
        spravna_odpoved: 0,
        kategorie: 2,
        vysvetleni: 'Internet Messenger poskytuje aplikaci pro instant messaging, která umožňuje uživatelům komunikovat v reálném čase přes text, hlas nebo video [7].'
    },
    {
        id: 86,
        otazka: 'Která charakteristika popisuje antispyware?',
        moznosti: ['Tunelovací protokol pro zabezpečený přístup', 'Síťové zařízení filtrující příchozí provoz', 'Aplikace chránící koncová zařízení před infekcí škodlivým softwarem', 'Software na routeru filtrující provoz podle IP adres'],
        spravna_odpoved: 2,
        kategorie: 10,
        vysvetleni: 'Antispyware programy jsou navrženy k detekci a odstranění nevyžádaného spyware a chrání koncová zařízení před nákazou [8].'
    },
    {
        id: 87,
        otazka: 'Administrátor chce použít stejnou masku pro tři podsítě (IP telefony - 10 adres, PC - 8 adres, tiskárny - 2 adresy). Jaká maska je nejvhodnější?',
        moznosti: ['255.255.255.240', '255.255.255.0', '255.255.255.248', '255.255.255.252'],
        spravna_odpoved: 0,
        kategorie: 7,
        vysvetleni: 'Největší podsíť vyžaduje 10 adres, což spolu se síťovou a broadcast adresou vyžaduje masku s alespoň 4 bity pro hosty (2^4 = 16 adres) [9, 10]. Maska /28 (255.255.255.240) poskytuje 14 použitelných adres, což stačí [10].'
    },
    {
        id: 88,
        otazka: 'Společnost používá blok 128.107.0.0/16. Jaká maska poskytne maximální počet stejně velkých podsítí při zachování podpory 100 hostů v každé podsíti?',
        moznosti: ['255.255.255.128', '255.255.255.224', '255.255.255.192', '255.255.255.0'],
        spravna_odpoved: 0,
        kategorie: 7,
        vysvetleni: 'Pro podporu 100 hostů je nutná maska /25 (255.255.255.128), která nabízí 126 použitelných adres [11]. Menší masky jako /26 nabízí pouze 62 hostů, což je pro tento požadavek nedostatečné [11].'
    },
    {
        id: 89,
        otazka: 'Který protokol je zodpovědný za vytvoření tabulky mapující IP adresy na fyzické MAC adresy?',
        moznosti: ['ARP', 'DNS', 'DHCP', 'ICMP'],
        spravna_odpoved: 0,
        kategorie: 6,
        vysvetleni: 'Protokol ARP (Address Resolution Protocol) mapuje IP adresy na odpovídající MAC adresy v rámci lokální sítě [12].'
    },
    {
        id: 90,
        otazka: 'Které dva typy provozu využívají protokol RTP (Real-Time Transport Protocol)? (Vyberte dvě)',
        moznosti: ['Web', 'Peer-to-peer', 'Přenos souborů', 'Video', 'Hlas (Voice)'],
        spravna_odpoved: [3, 4],
        kategorie: 3,
        vysvetleni: 'RTP je navržen pro doručování audia a videa v reálném čase, což je klíčové pro VoIP a streamování médií [14].'
    },
    {
        id: 91,
        otazka: 'Který typ hrozby je spojen s extrémními teplotami nebo vlhkostí v serverovně?',
        moznosti: ['Hardwarové hrozby', 'Environmentální hrozby', 'Elektrické hrozby', 'Údržbové hrozby'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Environmentální hrozby zahrnují extrémní teploty a vlhkost, které mohou způsobit selhání zařízení [15].'
    },
    {
        id: 92,
        otazka: 'Hostitel A nemá v ARP tabulce MAC adresu své výchozí brány a posílá ARP request. Která zařízení tento požadavek obdrží?',
        moznosti: ['Pouze hostitelé A, B, C a D', 'Pouze router R1', 'Pouze hostitelé A, B a C', 'Hostitelé B, C a router R1'],
        spravna_odpoved: 3,
        kategorie: 6,
        vysvetleni: 'ARP request je odesílán jako broadcast na celou lokální síť, takže ho obdrží všechna zařízení ve stejném segmentu, včetně routeru (výchozí brány) [16].'
    },
    {
        id: 93,
        otazka: 'Která hodnota v IPv4 hlavičce je snížena (decrement) každým routerem, který paket přijme?',
        moznosti: ['Differentiated Services', 'Fragment Offset', 'Header Length', 'Time-to-Live (TTL)'],
        spravna_odpoved: 3,
        kategorie: 1,
        vysvetleni: 'Každý router sníží hodnotu TTL o 1, aby zabránil nekonečnému kroužení paketu v případě směrovací smyčky [17].'
    },
    {
        id: 94,
        otazka: 'Které rozhraní routeru by mělo být nastaveno jako výchozí brána pro hostitele H1 připojeného k routeru R1?',
        moznosti: ['R2: S0/0/1', 'R1: G0/0', 'R2: S0/0/0', 'R1: S0/0/0'],
        spravna_odpoved: 1,
        kategorie: 9,
        vysvetleni: 'Výchozí brána pro hostitele musí být IP adresa rozhraní routeru, které je přímo připojeno ke stejné síti (subnetu) jako hostitel [18].'
    },
    {
        id: 95,
        otazka: 'Který kód označuje v IPv4 směrovací tabulce statickou cestu, včetně výchozí statické cesty?',
        moznosti: ['C', 'S', 'L', 'D'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Statické cesty zadané správcem jsou v tabulce označeny kódem "S" (Static) [19, 20].'
    },
    {
        id: 96,
        otazka: 'Co je primární funkcí směrovací tabulky v routeru?',
        moznosti: ['Ukládá MAC adresy rozhraní', 'Ukládá informace o cestách odvozené z aktivních rozhraní a protokolů', 'Ukládá IP adresy DNS serverů', 'Ukládá hesla uživatelů'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Směrovací tabulka uchovává informace o sítích, ke kterým má router přístup přes svá aktivní rozhraní nebo naučené trasy [20].'
    },
    {
        id: 97,
        otazka: 'Pokud je v síti implementováno QoS, jaké je pořadí priorit od nejvyšší po nejnižší pro audio konferenci, finanční transakci a webovou stránku?',
        moznosti: ['Finanční transakce, web, audio', 'Finanční transakce, audio, web', 'Audio konference, finanční transakce, web', 'Audio konference, web, finanční transakce'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'Mechanismy QoS prioritizují hlasová data (audio) před transakčními daty, která mají přednost před běžným webovým provozem [21, 22].'
    },
    {
        id: 98,
        otazka: 'V QoS modelu má nejnižší toleranci ke zpoždění (latenci) a nejvyšší prioritu jaký typ provozu?',
        moznosti: ['E-mail', 'Přenos souborů (FTP)', 'Finanční transakce', 'Hlasová a video komunikace (Audio)'],
        spravna_odpoved: 3,
        kategorie: 1,
        vysvetleni: 'Hlasová data jsou nejcitlivější na zpoždění, a proto v prioritizaci QoS stojí nejvýše [22].'
    },
    {
        id: 99,
        otazka: 'Jaký je důsledek konfigurace routeru globálním příkazem "ipv6 unicast-routing"?',
        moznosti: ['Všechna rozhraní se aktivují', 'Rozhraní vygenerují link-local adresu', 'IPv6 rozhraní začnou odesílat zprávy ICMPv6 Router Advertisement', 'Staticky vytvoří globální adresu'],
        spravna_odpoved: 2,
        kategorie: 8,
        vysvetleni: 'Tento příkaz povolí směrování IPv6 paketů a umožní rozhraním odesílat zprávy RA pro automatickou konfiguraci adres (SLAAC) [23].'
    },
    {
        id: 100,
        otazka: 'Které vrstvy modelu TCP/IP by byly využity, pokud by Host1 přenášel soubor na server?',
        moznosti: ['Jen aplikační a internetová', 'Jen internetová a síťový přístup', 'Aplikační, transportní, internetová a síťový přístup', 'Všechny vrstvy OSI modelu'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'Při přenosu souboru (např. přes FTP) procházejí data všemi čtyřmi vrstvami modelu TCP/IP [24].'
    },
    {
        id: 101,
        otazka: 'Na přepínač byl aplikován příkaz globální konfigurace "ip default-gateway 172.16.100.1". Jaký je účinek tohoto příkazu?',
        moznosti: [
            'Přepínač může komunikovat s ostatními hostiteli v síti 172.16.100.0.',
            'Přepínač lze vzdáleně spravovat z hostitele v jiné síti.',
            'Přepínač bude mít rozhraní pro správu s adresou 172.16.100.1.',
            'Přepínač je omezen na odesílání a přijímání rámců pouze z brány 172.16.100.1.'
        ],
        spravna_odpoved: 1,
        kategorie: 9,
        vysvetleni: 'Adresa výchozí brány se na přepínači konfiguruje proto, aby k němu bylo možné přistupovat a spravovat jej ze sítě, která není přímo připojená (přes router) [1].'
    },
    {
        id: 102,
        otazka: 'Která charakteristika popisuje adware?',
        moznosti: [
            'Síťové zařízení, které filtruje přístup a provoz přicházející do sítě.',
            'Útok, který zpomaluje nebo shodí zařízení nebo síťovou službu.',
            'Použití ukradených přihlašovacích údajů k přístupu k soukromým datům.',
            'Software, který je nainstalován na zařízení uživatele a shromažďuje o něm informace.'
        ],
        spravna_odpoved: 3,
        kategorie: 10,
        vysvetleni: 'Adware je typ softwaru, který bez plného vědomí uživatele zobrazuje reklamy a shromažďuje informace o jeho zvycích při prohlížení internetu [2].'
    },
    {
        id: 103,
        otazka: 'Který mechanismus TCP určuje počet bajtů, které může cílové zařízení přijmout a zpracovat najednou?',
        moznosti: [
            'Sequence numbers (Sekvenční čísla)',
            'Acknowledgment (Potvrzení)',
            'Window size (Velikost okna)',
            'Retransmission (Opětovné odeslání)'
        ],
        spravna_odpoved: 2,
        kategorie: 3,
        vysvetleni: 'Velikost okna (window size) určuje objem dat, které lze odeslat dříve, než je vyžadováno potvrzení od příjemce [3].'
    },
    {
        id: 104,
        otazka: 'Jaký je účel posuvného okna (sliding window) v protokolu TCP?',
        moznosti: [
            'Zajistit, aby segmenty dorazily do cíle ve správném pořadí.',
            'Požádat zdroj o snížení rychlosti, jakou přenáší data.',
            'Informovat zdroj, aby znovu odeslal data od určitého bodu dále.',
            'Ukončit komunikaci po dokončení přenosu dat.'
        ],
        spravna_odpoved: 1,
        kategorie: 3,
        vysvetleni: 'Mechanismus posuvného okna slouží k řízení toku dat; pokud je síť přetížená nebo příjemce nestíhá, může se velikost okna zmenšit, čímž se sníží rychlost odesílání [4].'
    },
    {
        id: 105,
        otazka: 'Jaká technika se používá u UTP kabelů k ochraně před rušením signálu způsobeným přeslechem (crosstalk)?',
        moznosti: [
            'Ukončení kabelu speciálními uzemněnými konektory.',
            'Splétání vodičů dohromady do párů.',
            'Obalení párů vodičů fóliovým stíněním.',
            'Zapouzdření kabelů do pružného plastového pláště.'
        ],
        spravna_odpoved: 1,
        kategorie: 4,
        vysvetleni: 'Kroucení vodičů v párech způsobuje, že se jejich magnetická pole vzájemně vyruší, což pomáhá předcházet přeslechům [5].'
    },
    {
        id: 106,
        otazka: 'Které dva problémy by měly být zváženy před implementací optických médií? (Vyberte dvě)',
        moznosti: [
            'Optická kabeláž vyžaduje jiné odborné znalosti pro ukončení a spojování než měděná kabeláž.',
            'Optická kabeláž vyžaduje specifické uzemnění, aby byla imunní vůči EMI.',
            'Optický kabel je náchylný ke ztrátě signálu kvůli RFI.',
            'Optika poskytuje vyšší datovou kapacitu, ale je dražší než měděná kabeláž.',
            'Optický kabel je schopen odolat hrubému zacházení.'
        ],
        spravna_odpoved: [0, 3],
        kategorie: 4,
        vysvetleni: 'Optická média jsou dražší než měděná a jejich instalace vyžaduje speciální dovednosti, ačkoliv jsou imunní vůči elektromagnetickému rušení (EMI) [7].'
    },
    {
        id: 107,
        otazka: 'Uživatelé hlásí delší prodlevy při autentizaci v určitých obdobích týdne. Co by měli inženýři zkontrolovat, aby zjistili, zda je to normální chování sítě?',
        moznosti: [
            'Záznamy a zprávy syslogu.',
            'Výstupy debug a zachycené pakety.',
            'Konfigurační soubory sítě.',
            'Výkonnostní základnu sítě (network performance baseline).'
        ],
        spravna_odpoved: 3,
        kategorie: 10,
        vysvetleni: 'Výkonnostní základna (baseline) obsahuje data o typickém provozu, proti kterým lze porovnat aktuální stav a zjistit anomálie [8].'
    },
    {
        id: 108,
        otazka: 'Externí webová stránka se načítá déle než obvykle. Který nástroj by měl technik s administrátorskými právy použít k lokalizaci místa problému v síti?',
        moznosti: [
            'ipconfig /displaydns',
            'nslookup',
            'tracert',
            'ping'
        ],
        spravna_odpoved: 2,
        kategorie: 10,
        vysvetleni: 'Nástroj tracert sleduje cestu paketu k cíli a zobrazuje časovou odezvu na každém skoku (routeru), čímž pomůže najít úzké hrdlo [9].'
    },
    {
        id: 109,
        otazka: 'Server přijme paket s cílovým portem 53. Jakou službu klient požaduje?',
        moznosti: [
            'SSH',
            'FTP',
            'Telnet',
            'DNS'
        ],
        spravna_odpoved: 3,
        kategorie: 2,
        vysvetleni: 'Port 53 je standardní port používaný pro dotazy DNS (Domain Name System) [10].'
    },
    {
        id: 110,
        otazka: 'PC1 vydá ARP request, protože potřebuje poslat paket na PC2 (ve stejné síti). Co se stane jako další krok?',
        moznosti: [
            'Router RT1 pošle ARP reply se svou MAC adresou.',
            'Switch SW1 pošle ARP reply s MAC adresou PC2.',
            'Router RT1 pošle ARP reply s MAC adresou PC2.',
            'Switch SW1 pošle ARP reply se svou MAC adresou.',
            'PC2 pošle ARP reply se svou MAC adresou.'
        ],
        spravna_odpoved: 4,
        kategorie: 6,
        vysvetleni: 'Cílové zařízení (v tomto případě PC2) odpoví na broadcastový ARP request odesláním ARP reply se svou MAC adresou [11].'
    },
    {
        id: 111,
        otazka: 'Která část IPv6 adresy je přiřazena poskytovatelem (ISP)?',
        moznosti: [
            'Subnet ID',
            'Global routing prefix',
            'Interface ID',
            'Prefix length'
        ],
        spravna_odpoved: 1,
        kategorie: 8,
        vysvetleni: 'Globální směrovací prefix je část IPv6 adresy přidělená poskytovatelem nebo regionálním registrem [12].'
    },
    {
        id: 112,
        otazka: 'Zařízení s podporou IPv6 odešle datový paket na cílovou adresu ff02::2. Co je cílem tohoto paketu?',
        moznosti: [
            'Všechna zařízení s podporou IPv6 v lokální síti.',
            'Všechny servery DHCP IPv6.',
            'Všechna zařízení s podporou IPv6 v celé síti.',
            'Všechny routery nakonfigurované pro IPv6 v lokální síti.'
        ],
        spravna_odpoved: 3,
        kategorie: 8,
        vysvetleni: 'Cílová adresa ff02::2 je IPv6 multicast adresa zaměřená na všechny nakonfigurované routery na lokální lince [13].'
    },
    {
        id: 113,
        otazka: 'Jaké jsou tři části globální unicast adresy IPv6? (Vyberte tři)',
        moznosti: [
            'Subnet ID',
            'Global routing prefix',
            'Interface ID',
            'Subnet mask',
            'Broadcast address'
        ],
        spravna_odpoved: [0, 1, 2],
        kategorie: 8,
        vysvetleni: 'Globální unicast adresa IPv6 se skládá ze směrovacího prefixu, ID podsítě a ID rozhraní [16].'
    },
    {
        id: 114,
        otazka: 'Jaká je jedna z hlavních charakteristik linkové vrstvy?',
        moznosti: [
            'Generuje elektrické nebo optické signály reprezentující bity na médiu.',
            'Převádí proud datových bitů do předdefinovaného kódu.',
            'Chrání protokol vyšší vrstvy před tím, aby věděl o fyzickém médiu použitém ke komunikaci.',
            'Přijímá pakety 3. vrstvy a rozhoduje o cestě k jejich předání do vzdálené sítě.'
        ],
        spravna_odpoved: 2,
        kategorie: 5,
        vysvetleni: 'Linková vrstva (Layer 2) izoluje vyšší vrstvy od podrobností o fyzickém médiu, které se k přenosu používá [17].'
    },
    {
        id: 115,
        otazka: 'Který typ bezpečnostní hrozby by byl zodpovědný za to, že doplněk tabulkového procesoru deaktivuje místní softwarový firewall?',
        moznosti: [
            'Trojský kůň (Trojan horse)',
            'Útok hrubou silou (Brute-force attack)',
            'DoS útok',
            'Přetečení vyrovnávací paměti (Buffer overflow)'
        ],
        spravna_odpoved: 0,
        kategorie: 10,
        vysvetleni: 'Trojský kůň je škodlivý kód skrytý v legitimním softwaru, který po spuštění provádí škodlivou činnost [18].'
    },
    {
        id: 116,
        otazka: 'Jakou službu poskytuje protokol HTTPS?',
        moznosti: [
            'Umožňuje vzdálený přístup k síťovým zařízením a serverům.',
            'Překládá názvy domén na IP adresy.',
            'Používá šifrování k zajištění bezpečného vzdáleného přístupu k zařízením.',
            'Používá šifrování k zabezpečení výměny textu, obrázků, zvuku a videa na webu.'
        ],
        spravna_odpoved: 3,
        kategorie: 2,
        vysvetleni: 'HTTPS je zabezpečená verze HTTP využívající SSL/TLS šifrování pro ochranu dat mezi prohlížečem a serverem [19].'
    },
    {
        id: 117,
        otazka: 'Která z následujících charakteristik patří MAC adrese?',
        moznosti: [
            'Má délku 32 nebo 128 bitů.',
            'Je obsažena v hlavičce 3. vrstvy.',
            'Má délku 48 bitů a je rozdělena na OUI a unikátní identifikátor.',
            'Mění se na každém skoku (hopu) podle IP adresy cíle.'
        ],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'MAC adresa je fyzická adresa o délce 48 bitů, která je unikátní pro každou síťovou kartu [20].'
    },
    {
        id: 118,
        otazka: 'Pokud hostitel A (v síti s routerem R1) posílá IP paket hostiteli B ve vzdálené síti, jaká bude cílová MAC adresa v rámci při opuštění hostitele A?',
        moznosti: [
            'IP adresa hostitele B.',
            'MAC adresa hostitele B.',
            'MAC adresa routeru R1 (výchozí brány).',
            'Broadcastová MAC adresa (FF:FF:FF:FF:FF:FF).'
        ],
        spravna_odpoved: 2,
        kategorie: 6,
        vysvetleni: 'Při odesílání do vzdálené sítě musí hostitel poslat rámec na MAC adresu své výchozí brány, aby mohl být směrován dál [21].'
    },
    {
        id: 119,
        otazka: 'Které tvrzení o MAC a IP adresách během přenosu dat (bez NAT) je správné?',
        moznosti: [
            'Cílové MAC adresy se v rámci, který prochází přes sedm routerů, nikdy nezmění.',
            'Paket, který překročil čtyři routery, změnil čtyřikrát cílovou IP adresu.',
            'Pokaždé, když je rámec zapouzdřen s novou cílovou MAC adresou, je potřeba nová cílová IP adresa.',
            'Cílové a zdrojové MAC adresy mají lokální význam a mění se pokaždé, když rámec přejde z jedné LAN do druhé.'
        ],
        spravna_odpoved: 3,
        kategorie: 5,
        vysvetleni: 'Zatímco IP adresy zůstávají konstantní po celou cestu, MAC adresy se mění na každém routeru, protože mají význam pouze pro lokální segment sítě [22, 23].'
    },
    {
        id: 120,
        otazka: 'Který fakt lze určit z výstupu příkazu "show ip interface brief"?',
        moznosti: [
            'Dvě zařízení jsou připojena k přepínači.',
            'Hesla byla nakonfigurována na přepínači.',
            'Přepínač lze spravovat vzdáleně přes SVI (VLAN1).',
            'Dvě fyzická rozhraní byla nakonfigurována s IP adresami.'
        ],
        spravna_odpoved: 2,
        kategorie: 9,
        vysvetleni: 'Pokud má rozhraní VLAN1 přiřazenou IP adresu a stav je "up", přepínač lze vzdáleně spravovat přes toto rozhraní SVI [24].'
    },
    {
        id: 121,
        otazka: 'Které tři skutečnosti lze určit z výstupu příkazu "show ip interface brief"? (Vyberte tři)',
        moznosti: ['Dvě zařízení jsou připojena k přepínači', 'Výchozí SVI bylo nakonfigurováno', 'Přepínač lze spravovat vzdáleně', 'Byla nakonfigurována dvě fyzická rozhraní', 'Na přepínači byla nakonfigurována hesla', 'K fyzickému rozhraní je připojeno jedno zařízení'],
        spravna_odpoved: [1, 2, 3],
        kategorie: 9,
        vysvetleni: 'Výstup ukazuje, že rozhraní VLAN1 (SVI) má IP adresu a je "up", což umožňuje vzdálenou správu. Stav "up" u FastEthernet0/1 indikuje připojené a funkční zařízení [4, 5].'
    },
    {
        id: 122,
        otazka: 'V jakém bodě přestane směrovač, který je na cestě k cílovému zařízení, přeposílat paket při provádění příkazu tracert?',
        moznosti: ['Když hodnoty zpráv Echo Request i Echo Reply dosáhnou nuly', 'Když hodnota v poli TTL dosáhne nuly', 'Když směrovač obdrží zprávu ICMP Time Exceeded', 'Když hostitel odpoví zprávou ICMP Echo Reply', 'Když hodnota RTT dosáhne nuly'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Když hodnota v poli TTL (Time to Live) dosáhne nuly, směrovač paket zahodí a pošle zpět odesílateli zprávu ICMP Time Exceeded [6, 7].'
    },
    {
        id: 123,
        otazka: 'Které dvě funkce poskytuje síťová vrstva? (Vyberte dvě)',
        moznosti: ['Přenos dat mezi procesy běžícími na zdrojovém a cílovém hostiteli', 'Směrování datových paketů k cílovým hostitelům v jiných sítích', 'Poskytování vyhrazených end-to-end spojení', 'Umístění dat na síťové médium', 'Poskytování unikátního síťového identifikátoru koncovým zařízením'],
        spravna_odpoved: [1, 4],
        kategorie: 1,
        vysvetleni: 'Síťová vrstva odpovídá za směrování paketů mezi sítěmi a přidělování unikátních IP adres koncovým zařízením [9].'
    },
    {
        id: 124,
        otazka: 'Nová LAN musí podporovat 61 připojených zařízení. Jaká je nejmenší maska sítě, kterou může administrátor použít?',
        moznosti: ['255.255.255.224', '255.255.255.240', '255.255.255.192', '255.255.255.128'],
        spravna_odpoved: 2,
        kategorie: 7,
        vysvetleni: 'Pro 61 zařízení potřebujete masku /26 (255.255.255.192), která poskytuje 62 použitelných adres. Maska /27 by nabízela pouze 30 adres, což nestačí [10, 11].'
    },
    {
        id: 125,
        otazka: 'Která charakteristika popisuje spyware?',
        moznosti: ['Síťové zařízení, které filtruje přístup a provoz přicházející do sítě', 'Software, který je nainstalován na zařízení uživatele a shromažďuje o něm informace', 'Útok, který zpomaluje nebo shodí zařízení nebo síťovou službu', 'Použití ukradených přihlašovacích údajů k přístupu k soukromým datům'],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Spyware je software instalovaný bez vědomí uživatele, který sbírá data o jeho internetové aktivitě a osobní údaje [12].'
    },
    {
        id: 126,
        otazka: 'Které tři normy se běžně dodržují při konstrukci a instalaci kabeláže? (Vyberte tři)',
        moznosti: ['Zapojení pinů (pinouts)', 'Pevnost plastového izolátoru v tahu', 'Délky kabelů', 'Typy konektorů', 'Cena za metr', 'Barva konektoru'],
        spravna_odpoved: [0, 2, 3],
        kategorie: 4,
        vysvetleni: 'Standardy pro kabeláž určují fyzické parametry jako jsou typy konektorů (např. RJ-45), maximální délky kabelů pro zachování signálu a správné zapojení pinů [14, 15].'
    },
    {
        id: 127,
        otazka: 'Který atribut síťové karty (NIC) by ji zařadil do linkové vrstvy OSI modelu?',
        moznosti: ['Připojený ethernetový kabel', 'Sada protokolů TCP/IP', 'IP adresa', 'Port RJ-45', 'MAC adresa'],
        spravna_odpoved: 4,
        kategorie: 5,
        vysvetleni: 'MAC adresa je fyzická adresa napevno přiřazená síťové kartě a slouží pro identifikaci zařízení na 2. vrstvě (linkové) [16].'
    },
    {
        id: 128,
        otazka: 'Administrátor potřebuje při vzdálené správě přepínače zajistit soukromí uživatelského ID, hesla i obsahu relace. Kterou metodu přístupu by měl zvolit?',
        moznosti: ['AUX', 'Telnet', 'SSH', 'Console'],
        spravna_odpoved: 2,
        kategorie: 9,
        vysvetleni: 'SSH (Secure Shell) na rozdíl od Telnetu šifruje veškerou komunikaci, čímž chrání přihlašovací údaje i přenášená data před odposlechem [17].'
    },
    {
        id: 129,
        otazka: 'Uživatel posílá požadavek HTTP na webový server ve vzdálené síti. Jaká informace je přidána do pole adresy rámce pro indikaci cíle během zapouzdření?',
        moznosti: ['Síťová doména cílového hostitele', 'MAC adresa výchozí brány', 'IP adresa výchozí brány', 'MAC adresa cílového hostitele'],
        spravna_odpoved: 1,
        kategorie: 6,
        vysvetleni: 'Protože je server v jiné síti, hostitel nemůže znát jeho MAC adresu. Rámec proto směřuje na MAC adresu své výchozí brány (routeru) [18].'
    },
    {
        id: 130,
        otazka: 'Které dva příkazy lze použít na hostiteli se systémem Windows k zobrazení směrovací tabulky? (Vyberte dvě)',
        moznosti: ['route print', 'show ip route', 'netstat -r', 'netstat -s', 'tracert'],
        spravna_odpoved: [2],
        kategorie: 10,
        vysvetleni: 'Příkazy "route print" i "netstat -r" vygenerují v systému Windows identický výstup zobrazující směrovací tabulku hostitele [19].'
    },
    {
        id: 131,
        otazka: 'Která z následujících IP adres je považována za link-local adresu v protokolu IPv4?',
        moznosti: ['127.0.0.1', '198.133.219.2', '169.254.1.5', '172.18.45.9'],
        spravna_odpoved: 2,
        kategorie: 7,
        vysvetleni: 'Adresy v rozsahu 169.254.0.0/16 jsou link-local adresy (APIPA), které se používají, když není dostupný DHCP server [20, 21].'
    },
    {
        id: 132,
        otazka: 'Která síťová maska a prefix by vyhovovaly požadavku na 64 hostitelských adres (např. Network B v příkladu)?',
        moznosti: ['192.168.0.0 /25', '192.168.0.128 /26', '192.168.0.192 /27', '192.168.0.224 /30'],
        spravna_odpoved: 1,
        kategorie: 7,
        vysvetleni: 'Prefix /26 poskytuje 64 adres (62 použitelných pro hosty), což je ideální pro sítě vyžadující kolem 60 hostů [22].'
    },
    {
        id: 133,
        otazka: 'Jak je počítač schopen sledovat datový tok mezi více relacemi aplikací tak, aby každá aplikace obdržela správná data?',
        moznosti: ['Tok dat je sledován na základě zdrojového čísla portu', 'Tok dat je sledován na základě cílové IP adresy počítače', 'Tok dat je sledován na základě zdrojové IP adresy počítače', 'Tok dat je sledován na základě cílové MAC adresy počítače'],
        spravna_odpoved: 0,
        kategorie: 3,
        vysvetleni: 'Zdrojové číslo portu je náhodně generováno pro každou relaci, což umožňuje transportní vrstvě rozlišit mezi různými toky dat na stejném zařízení [23].'
    },
    {
        id: 134,
        otazka: 'Server přijme paket s cílovým portem 80. Jakou službu klient požaduje?',
        moznosti: ['DNS', 'HTTP', 'DHCP', 'SMTP'],
        spravna_odpoved: 1,
        kategorie: 2,
        vysvetleni: 'Port 80 je standardní port pro protokol HTTP, který se používá k přenosu nešifrovaných webových stránek [24].'
    },
    {
        id: 135,
        otazka: 'Uživatel se pokouší o přístup na web bez úspěchu. Které dvě hodnoty konfigurace musí být nastaveny na hostiteli, aby byl tento přístup možný? (Vyberte dvě)',
        moznosti: ['Zdrojové číslo portu', 'HTTP server', 'Zdrojová MAC adresa', 'DNS server', 'Výchozí brána (default gateway)'],
        spravna_odpoved: [3, 4],
        kategorie: 2,
        vysvetleni: 'DNS server je nutný pro překlad URL na IP adresu a výchozí brána umožňuje odesílání paketů mimo lokální síť [25].'
    },
    {
        id: 136,
        otazka: 'Jaká metoda se používá k řízení kolizního přístupu (contention-based) v bezdrátové síti?',
        moznosti: ['CSMA/CD', 'Prioritní řazení', 'CSMA/CA', 'Předávání tokenu'],
        spravna_odpoved: 2,
        kategorie: 5,
        vysvetleni: 'Bezdrátové sítě používají CSMA/CA (Collision Avoidance), aby kolizím předcházely, protože je v tomto prostředí nelze spolehlivě detekovat [26].'
    },
    {
        id: 137,
        otazka: 'Které dvě zprávy ICMPv6 nejsou přítomny v protokolu ICMP pro IPv4? (Vyberte dvě)',
        moznosti: ['Router Advertisement', 'Destination Unreachable', 'Neighbor Solicitation', 'Route Redirection', 'Host Confirmation', 'Time Exceeded'],
        spravna_odpoved: [2],
        kategorie: 8,
        vysvetleni: 'Zprávy Router Advertisement a Neighbor Solicitation jsou součástí protokolu NDP, který je specifický pro IPv6 [27].'
    },
    {
        id: 138,
        otazka: 'Organizace má přidělen blok IPv6 adres 2001:db8:0:ca00::/56. Kolik podsítí lze vytvořit bez použití bitů z prostoru pro Interface ID (posledních 64 bitů)?',
        moznosti: ['4096', '256', '512', '1024'],
        spravna_odpoved: 1,
        kategorie: 8,
        vysvetleni: 'Mezi prefixem /56 a standardním rozhraním /64 zbývá 8 bitů pro podsítě, což umožňuje vytvořit 2^8 = 256 podsítí [28].'
    },
    {
        id: 139,
        otazka: 'Jaká maska podsítě je zapotřebí, pokud má síť IPv4 40 zařízení a nesmí docházet k plýtvání adresami?',
        moznosti: ['255.255.255.224', '255.255.255.128', '255.255.255.240', '255.255.255.192', '255.255.255.0'],
        spravna_odpoved: 3,
        kategorie: 7,
        vysvetleni: 'Pro 40 zařízení (plus 2 adresy pro síť a broadcast) potřebujeme 6 bitů pro hosty (2^6 = 64 adres). To odpovídá masce /26 (255.255.255.192) [29].'
    },
    {
        id: 140,
        otazka: 'Hostitel se pokouší poslat paket zařízení ve vzdáleném LAN segmentu, ale v mezipaměti ARP nejsou žádná mapování. Jak získá cílovou MAC adresu?',
        moznosti: ['Pošle dotaz ARP na MAC adresu cílového zařízení', 'Pošle rámec s broadcastovou MAC adresou', 'Pošle rámec a jako cíl použije MAC adresu zařízení', 'Pošle dotaz ARP na MAC adresu výchozí brány', 'Pošle dotaz ARP serveru DNS'],
        spravna_odpoved: 3,
        kategorie: 6,
        vysvetleni: 'Při komunikaci se vzdálenou sítí musí hostitel zjistit MAC adresu svého routeru (výchozí brány), aby mu mohl paket předat k dalšímu směrování [30, 31].'
    },
    {
        id: 141,
        otazka: 'Hostitel se pokouší poslat paket zařízení ve vzdáleném LAN segmentu, ale v ARP cache nejsou žádná mapování. Jak získá cílovou MAC adresu?',
        moznosti: [
            'Pošle ARP request pro MAC adresu cílového zařízení',
            'Pošle rámec s broadcastovou MAC adresou',
            'Pošle rámec a jako cíl použije svou vlastní MAC adresu',
            'Pošle ARP request pro MAC adresu výchozí brány (default gateway)'
        ],
        spravna_odpoved: 3,
        kategorie: 6,
        vysvetleni: 'Pro komunikaci se vzdálenou sítí musí hostitel zjistit MAC adresu svého routeru (výchozí brány), aby mu mohl paket předat k dalšímu směrování.'
    },
    {
        id: 142,
        otazka: 'Která charakteristika nejlépe popisuje virus?',
        moznosti: [
            'Použití ukradených přihlašovacích údajů k přístupu k datům',
            'Síťové zařízení, které filtruje příchozí provoz',
            'Škodlivý software nebo kód běžící na koncovém zařízení',
            'Útok, který zahlcuje nebo shazuje síťovou službu'
        ],
        spravna_odpoved: 2,
        kategorie: 10,
        vysvetleni: 'Virus je typ malwaru, který se po spuštění replikuje a modifikuje jiné programy. Obvykle vyžaduje akci uživatele (např. otevření přílohy) k aktivaci.'
    },
    {
        id: 143,
        otazka: 'Zaměstnanec používá volně dostupné nástroje ke zjišťování informací o firemních bezdrátových sítích s úmyslem je později hacknout. O jaký typ útoku se jedná?',
        moznosti: ['access', 'DoS', 'Trojan horse', 'reconnaissance'],
        spravna_odpoved: 3,
        kategorie: 10,
        vysvetleni: 'Reconnaissance (průzkum) je fáze, kdy útočník mapuje systémy a hledá zranitelnosti před samotným útokem.'
    },
    {
        id: 144,
        otazka: 'Jakou službu poskytuje protokol POP3?',
        moznosti: [
            'Zabezpečený vzdálený přístup k zařízením',
            'Vyzvedávání e-mailů ze serveru stažením do lokální aplikace klienta',
            'Vzdálený přístup k souborům na serveru',
            'Real-time chatování mezi vzdálenými uživateli'
        ],
        spravna_odpoved: 1,
        kategorie: 2,
        vysvetleni: 'POP3 slouží ke stažení e-mailů ze serveru do zařízení, přičemž po stažení jsou zprávy ze serveru typicky odstraněny.'
    },
    {
        id: 145,
        otazka: 'Který příkaz lze použít na Windows PC k zobrazení IP konfigurace (adresa, maska, brána)?',
        moznosti: ['ipconfig', 'show interfaces', 'ping', 'show ip interface brief'],
        spravna_odpoved: 0,
        kategorie: 10,
        vysvetleni: 'Příkaz ipconfig v systému Windows zobrazí základní nastavení síťových adaptérů.'
    },
    {
        id: 146,
        otazka: 'Síť 10.18.10.0/24 potřebuje podsíť pro 10 hostů. Které dvě adresy lze použít, aby se neplýtvalo místem a nedošlo ke kolizi s již přidělenými rozsahy (0-63 a 192-199)? (Vyberte dvě)',
        moznosti: ['10.18.10.224/27', '10.18.10.208/28', '10.18.10.200/27', '10.18.10.200/28', '10.18.10.224/28'],
        spravna_odpoved: [2, 3],
        kategorie: 7,
        vysvetleni: 'Pro 10 hostů je potřeba maska /28 (14 použitelných adres). Adresy .208/28 a .224/28 jsou platné sítě v daném rozsahu, zatímco .200/28 není platným začátkem sítě.'
    },
    {
        id: 147,
        otazka: 'Server přijme paket s cílovým portem 110. Jakou službu klient požaduje?',
        moznosti: ['DNS', 'DHCP', 'POP3', 'SMTP'],
        spravna_odpoved: 2,
        kategorie: 2,
        vysvetleni: 'Port 110 je standardním portem pro protokol POP3 (stahování pošty).'
    },
    {
        id: 148,
        otazka: 'Která vrstva modelu TCP/IP je zodpovědná za určení cesty k předání zpráv skrze internetwork?',
        moznosti: ['transport', 'application', 'network access', 'internet'],
        spravna_odpoved: 3,
        kategorie: 1,
        vysvetleni: 'Internetová vrstva (ekvivalent síťové vrstvy OSI) řeší adresování a směrování paketů mezi sítěmi.'
    },
    {
        id: 149,
        otazka: 'Co nejlépe popisuje "krádež identity" (identity theft)?',
        moznosti: [
            'Tunelovací protokol pro vzdálený přístup',
            'Použití ukradených přihlašovacích údajů k přístupu k soukromým datům',
            'Software identifikující rychle se šířící hrozby',
            'Filtrování provozu na routeru'
        ],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'Krádež identity spočívá v neoprávněném získání a zneužití osobních nebo přihlašovacích údajů jiné osoby.'
    },
    {
        id: 150,
        otazka: 'Která dvě bezpečnostní řešení jsou typická především pro firemní (corporate) prostředí? (Vyberte dvě)',
        moznosti: ['Intrusion Prevention Systems (IPS)', 'Antivirový software', 'Antispyware', 'Silná hesla', 'Virtual Private Networks (VPN)'],
        spravna_odpoved: [3],
        kategorie: 10,
        vysvetleni: 'IPS a firemní VPN pro vzdálený přístup jsou komplexní systémy typické pro organizace. Antiviry a hesla jsou běžné i v domácnostech.'
    },
    {
        id: 151,
        otazka: 'Jakou službu poskytuje DNS?',
        moznosti: [
            'Přenos souborů mezi klientem a serverem',
            'Šifrování webové komunikace',
            'Pravidla pro výměnu multimédií na webu',
            'Překlad doménových jmen (např. cisco.com) na IP adresy'
        ],
        spravna_odpoved: 3,
        kategorie: 2,
        vysvetleni: 'DNS funguje jako "telefonní seznam" internetu, který překládá názvy na číselné IP adresy.'
    },
    {
        id: 152,
        otazka: 'Která bezdrátová technologie je díky nízké spotřebě a nízké datové rychlosti populární v IoT prostředích?',
        moznosti: ['Bluetooth', 'Zigbee', 'WiMAX', 'Wi-Fi'],
        spravna_odpoved: 1,
        kategorie: 4,
        vysvetleni: 'Zigbee je ideální pro senzory a chytrou domácnost, protože vydrží dlouho na baterie a přenáší malé objemy dat.'
    },
    {
        id: 153,
        otazka: 'Co nejlépe popisuje Virtual Private Network (VPN)?',
        moznosti: [
            'Filtrování provozu na routeru',
            'Tunelovací protokol poskytující zabezpečený přístup do vnitřní sítě organizace',
            'Zařízení filtrující příchozí provoz do sítě',
            'Software identifikující šířící se hrozby'
        ],
        spravna_odpoved: 1,
        kategorie: 10,
        vysvetleni: 'VPN vytváří šifrovaný tunel přes veřejnou síť (internet), čímž bezpečně propojuje vzdáleného uživatele s firemní sítí.'
    },
    {
        id: 154,
        otazka: 'Nová LAN musí podporovat 4 připojená zařízení. Jaká je nejmenší vhodná maska sítě?',
        moznosti: ['255.255.255.192', '255.255.255.248', '255.255.255.240', '255.255.255.224'],
        spravna_odpoved: 1,
        kategorie: 7,
        vysvetleni: 'Pro 4 hosty potřebujete 3 bity (2^3 = 8 adres celkem, 6 použitelných). To odpovídá masce /29 neboli 255.255.255.248.'
    },
    {
        id: 155,
        otazka: 'Co udělá router ihned poté, co najde shodu cílové IP adresy s přímo připojenou sítí ve své tabulce?',
        moznosti: [
            'Přepne paket na přímo připojené rozhraní',
            'Zahodí paket po konzultaci tabulky',
            'Hledá adresu příštího skoku (next-hop)',
            'Analyzuje cílovou IP adresu znovu'
        ],
        spravna_odpoved: 0,
        kategorie: 10,
        vysvetleni: 'Pokud je cílová síť přímo připojená k rozhraní routeru, router paket zapouzdří pro dané médium a okamžitě jej odešle tímto rozhraním.'
    },
    {
        id: 156,
        otazka: 'Jakou službu poskytuje protokol BOOTP?',
        moznosti: [
            'Přenos souborů mezi klientem a serverem',
            'Umožňuje bezdiskovým stanicím zjistit vlastní IP adresu a najít server pro start systému',
            'Šifrování webového obsahu',
            'Základní pravidla pro výměnu textu a grafiky na webu'
        ],
        spravna_odpoved: 1,
        kategorie: 2,
        vysvetleni: 'BOOTP je předchůdce DHCP a sloužil k automatickému zavádění systému u stanic bez vlastního disku.'
    },
    {
        id: 157,
        otazka: 'Server přijme paket s cílovým portem 21. Jakou službu klient požaduje?',
        moznosti: ['DHCP', 'FTP', 'TFTP', 'DNS'],
        spravna_odpoved: 1,
        kategorie: 2,
        vysvetleni: 'Port 21 se používá pro řídicí spojení protokolu FTP (File Transfer Protocol).'
    },
    {
        id: 158,
        otazka: 'Jak se nazývá proces převodu informací z jednoho formátu do jiného vhodného pro přenos?',
        moznosti: ['Message encapsulation', 'Message sizing', 'Message encoding', 'Message flow control'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'Encoding (kódování) je převod dat do formy signálů, které mohou cestovat po médiu.'
    },
    {
        id: 159,
        otazka: 'Technik může pingnout IP adresu webového serveru, ale nemůže pingnout jeho URL adresu. Který nástroj by měl použít k diagnóze?',
        moznosti: ['tracert', 'netstat', 'nslookup', 'ipconfig'],
        spravna_odpoved: 2,
        kategorie: 10,
        vysvetleni: 'Protože IP funguje, ale jméno ne, problém je v DNS. Nslookup umožňuje testovat dotazy na jmenné servery.'
    },
    {
        id: 160,
        otazka: 'Které dvě zprávy ICMPv6 musí být povoleny, aby bylo možné v IPv6 rozlišit L3 adresu na L2 MAC adresu? (Vyberte dvě)',
        moznosti: ['echo requests', 'router solicitations', 'router advertisements', 'neighbor advertisements', 'echo replies', 'neighbor solicitations'],
        spravna_odpoved: [4, 5],
        kategorie: 8,
        vysvetleni: 'V IPv6 se k zjištění MAC adresy používá Neighbor Discovery Protocol (NDP), který využívá zprávy Neighbor Solicitation a Neighbor Advertisement.'
    },
    {
        id: 161,
        otazka: 'Hostitel A v lokální síti potřebuje poslat data hostiteli D do jiné sítě, ale nezná MAC adresu brány. Která zařízení obdrží jeho ARP request?',
        moznosti: [
            'Všichni hostitelé v obou sítích',
            'Pouze hostitelé A, B a C',
            'Pouze hostitel D',
            'Pouze hostitelé v lokální síti a router (výchozí brána)',
            'Pouze router R1'
        ],
        spravna_odpoved: 3,
        kategorie: 6,
        vysvetleni: 'ARP request je broadcast a šíří se pouze v rámci jedné lokální sítě (segmentu). Obdrží ho tedy všichni sousedé a router.'
    },
    {
        id: 162,
        otazka: 'Které dvě funkce plní podvrstva LLC (Logical Link Control)? (Vyberte dvě)',
        moznosti: [
            'Integrace toků mezi optikou a mědí',
            'Identifikace protokolu síťové vrstvy v rámci',
            'Výpočet kontrolního součtu FCS',
            'Přidání MAC adres do rámce',
            'Umožňuje IPv4 a IPv6 sdílet stejné fyzické médium'
        ],
        spravna_odpoved: [2, 3],
        kategorie: 5,
        vysvetleni: 'LLC identifikuje, pro který protokol (IPv4/v6) jsou data v rámci určena, a umožňuje tak koexistenci různých protokolů na stejném spoji.'
    },
    {
        id: 163,
        otazka: 'Ping na výchozí bránu selže, ale ping na hostitele mimo lokální síť je úspěšný. Co je možnou příčinou?',
        moznosti: [
            'Výchozí brána není funkční',
            'Výchozí brána má špatnou IP adresu',
            'TCP/IP stack na bráně nefunguje',
            'Bezpečnostní pravidla (ACL/Firewall) na bráně blokují ICMP dotazy na její vlastní adresu'
        ],
        spravna_odpoved: 3,
        kategorie: 10,
        vysvetleni: 'Pokud piny do internetu fungují, brána musí být v pořádku a směrovat. Chyba pingu na bránu samotnou je pravděpodobně způsobena pravidlem, které zakazuje bráně odpovídat na ICMP.'
    },
    {
        id: 164,
        otazka: 'Jaký je hlavní přínos cloud computingu v networkingu?',
        moznosti: [
            'Integrace technologií do domácích spotřebičů',
            'Rozšíření síťových kapacit bez nutnosti investic do nové vlastní infrastruktury a personálu',
            'Využití elektrických rozvodů pro přenos dat',
            'Možnost používat osobní zařízení v práci (BYOD)'
        ],
        spravna_odpoved: 1,
        kategorie: 1,
        vysvetleni: 'Cloud umožňuje škálovat služby a výkon nákupem u poskytovatele místo stavby vlastních datových center.'
    },
    {
        id: 165,
        otazka: 'Která funkce firewallu brání nevyžádaným příchozím relacím (unsolicited sessions)?',
        moznosti: ['Application filters', 'Packet filters', 'URL filters', 'Stateful packet inspection (SPI)'],
        spravna_odpoved: 3,
        kategorie: 10,
        vysvetleni: 'SPI sleduje stav relací a povolí příchozí provoz pouze tehdy, pokud byl iniciován uživatelem z vnitřní sítě.'
    },
    {
        id: 166,
        otazka: 'Jakou službu poskytuje protokol SMTP?',
        moznosti: [
            'Vzdálený přístup k serverům',
            'Šifrovaný přístup k CLI',
            'Umožňuje klientům posílat e-maily na server a serverům mezi sebou',
            'Real-time chatování'
        ],
        spravna_odpoved: 2,
        kategorie: 2,
        vysvetleni: 'SMTP je určen pro odesílání a přeposílání e-mailových zpráv.'
    },
    {
        id: 167,
        otazka: 'Server přijme paket s cílovým portem 22. Jakou službu klient požaduje?',
        moznosti: ['SSH', 'DNS', 'DHCP', 'TFTP'],
        spravna_odpoved: 0,
        kategorie: 2,
        vysvetleni: 'Port 22 je standardní port pro SSH (zabezpečená vzdálená správa).'
    },
    {
        id: 168,
        otazka: 'Nová LAN musí podporovat 10 připojených zařízení. Jaká je nejmenší maska sítě, kterou může administrátor použít?',
        moznosti: ['255.255.255.240', '255.255.255.224', '255.255.255.192', '255.255.255.248'],
        spravna_odpoved: 0,
        kategorie: 7,
        vysvetleni: 'Pro 10 zařízení potřebujete 4 bity (2^4 = 16 adres celkem, 14 použitelných). To odpovídá masce /28 neboli 255.255.255.240.'
    },
    {
        id: 169,
        otazka: 'Které dva postupy jsou správné pro analýzu provozu pomocí protokolového analyzátoru? (Vyberte dvě)',
        moznosti: [
            'Zachycovat provoz pouze o víkendech',
            'Zachycovat provoz pouze v datovém centru',
            'Zachycovat provoz v době špičky (peak utilization) pro reprezentativní vzorek',
            'Provádět zachycování na různých segmentech sítě',
            'Zachycovat pouze WAN provoz'
        ],
        spravna_odpoved: [2, 3],
        kategorie: 10,
        vysvetleni: 'Správná analýza vyžaduje data ze špičky a z různých míst sítě, aby byl zachycen lokální i vzdálený provoz.'
    },
    {
        id: 170,
        otazka: 'Co nejlépe popisuje DoS (Denial of Service) útok?',
        moznosti: [
            'Útok, který zpomalí nebo shodí zařízení či síťovou službu',
            'Použití ukradených credentials',
            'Filtrování provozu na firewallu',
            'Sběr informací o uživateli pomocí spyware'
        ],
        spravna_odpoved: 0,
        kategorie: 10,
        vysvetleni: 'DoS útok má za cíl znepřístupnit službu legitimním uživatelům zahlcením nebo vyřazením z provozu.'
    },
    {
        id: 171,
        otazka: 'Jakou službu poskytuje protokol DHCP?',
        moznosti: [
            'Dynamicky přiděluje IP adresy koncovým i mezilehlým zařízením',
            'Vzdálený přístup k serverům',
            'Šifrování komunikace',
            'Real-time chat'
        ],
        spravna_odpoved: 0,
        kategorie: 2,
        vysvetleni: 'DHCP automatizuje proces konfigurace IP adres v síti.'
    },
    {
        id: 172,
        otazka: 'Jakou službu poskytuje protokol FTP?',
        moznosti: [
            'Umožňuje přenos souborů mezi klientem a souborovým serverem',
            'Pravidla pro výměnu multimédií na webu',
            'Šifrování textu a grafiky',
            'Real-time chat'
        ],
        spravna_odpoved: 0,
        kategorie: 2,
        vysvetleni: 'FTP je dedikovaný protokol pro spolehlivý přenos datových souborů.'
    },
    {
        id: 173,
        otazka: 'Pokud je v bance implementováno QoS, jaké je pořadí priorit od nejvyšší? (Audio konference, finanční transakce, web)',
        moznosti: [
            'Audio konference, finanční transakce, web',
            'Finanční transakce, web, audio konference',
            'Audio konference, web, finanční transakce',
            'Finanční transakce, audio konference, web'
        ],
        spravna_odpoved: 0,
        kategorie: 1,
        vysvetleni: 'Hlas (audio) má nejvyšší prioritu kvůli citlivosti na zpoždění, následují důležitá transakční data a nakonec běžný web.'
    },
    {
        id: 174,
        otazka: 'Nová LAN musí podporovat 61 zařízení. Jaká je nejmenší maska?',
        moznosti: ['255.255.255.192', '255.255.255.224', '255.255.255.240', '255.255.255.128'],
        spravna_odpoved: 0,
        kategorie: 7,
        vysvetleni: 'Pro 61 zařízení (celkem 63) potřebujete 6 bitů (2^6 = 64 adres). To odpovídá masce /26 (255.255.255.192).'
    },
    {
        id: 175,
        otazka: 'Co nejlépe popisuje Intrusion Prevention System (IPS)?',
        moznosti: [
            'Software identifikující rychle se šířící hrozby a blokující je',
            'Software na routeru filtrující provoz podle IP adres',
            'Síťové zařízení pouze monitorující provoz bez zásahu',
            'Tunelovací protokol pro vzdálený přístup'
        ],
        spravna_odpoved: 0,
        kategorie: 10,
        vysvetleni: 'IPS aktivně analyzuje provoz a v případě detekce útoku nebo malwaru (např. červů) dokáže škodlivou aktivitu zablokovat.'
    }
];

function createPlaceholderQuestions(startId, totalCount) {
    const placeholders = [];

    for (let id = startId; id <= totalCount; id += 1) {
        placeholders.push({
            id,
            otazka: `DOPLNIT OTÁZKU ${id}`,
            moznosti: ['Možnost A', 'Možnost B', 'Možnost C', 'Možnost D'],
            spravna_odpoved: 0,
            kategorie: null,
            vysvetleni: 'Sem doplň vlastní vysvětlení správné odpovědi.',
            jeSablona: true
        });
    }

    return placeholders;
}

const allQuestions = [...sampleQuestions];

const dom = {
    goWebButton: document.getElementById('goWebButton'),
    webWarning: document.getElementById('webWarning'),
    startScreen: document.getElementById('startScreen'),
    quizScreen: document.getElementById('quizScreen'),
    resultScreen: document.getElementById('resultScreen'),
    categorySelect: document.getElementById('categorySelect'),
    questionCount: document.getElementById('questionCount'),
    availableCountInfo: document.getElementById('availableCountInfo'),
    shuffleToggle: document.getElementById('shuffleToggle'),
    startQuizButton: document.getElementById('startQuizButton'),
    resetSavedButton: document.getElementById('resetSavedButton'),
    quizCategoryLabel: document.getElementById('quizCategoryLabel'),
    quizTitle: document.getElementById('quizTitle'),
    progressChip: document.getElementById('progressChip'),
    progressFill: document.getElementById('progressFill'),
    questionCounter: document.getElementById('questionCounter'),
    questionNavPrev: document.getElementById('questionNavPrev'),
    questionNavNext: document.getElementById('questionNavNext'),
    questionNavViewport: document.getElementById('questionNavViewport'),
    questionNavTrack: document.getElementById('questionNavTrack'),
    questionText: document.getElementById('questionText'),
    explanationBox: document.getElementById('explanationBox'),
    explanationText: document.getElementById('explanationText'),
    answersGrid: document.getElementById('answersGrid'),
    prevQuestionButton: document.getElementById('prevQuestionButton'),
    nextQuestionButton: document.getElementById('nextQuestionButton'),
    finishQuizButton: document.getElementById('finishQuizButton'),
    backToSettingsButton: document.getElementById('backToSettingsButton'),
    reviewWrongOnlyButton: document.getElementById('reviewWrongOnlyButton'),
    reviewAllButton: document.getElementById('reviewAllButton'),
    reviewList: document.getElementById('reviewList'),
    resultSummary: document.getElementById('resultSummary'),
    correctCount: document.getElementById('correctCount'),
    wrongCount: document.getElementById('wrongCount'),
    resultPercent: document.getElementById('resultPercent'),
    restartQuizButton: document.getElementById('restartQuizButton'),
    backToStartButton: document.getElementById('backToStartButton')
};

const state = {
    category: '11',
    count: 5,
    shuffle: false,
    questionIds: [],
    currentIndex: 0,
    answers: {},
    completed: false,
    reviewFilter: 'wrong',
    screen: 'start'
};

function isQuestionReady(question) {
    return Boolean(question.otazka && question.otazka.trim())
        && Array.isArray(question.moznosti)
        && question.moznosti.length >= 2
        && question.moznosti.every((option) => Boolean(option && option.trim()));
}

function getActiveQuestions() {
    return allQuestions.filter((q) => isQuestionReady(q) && !q.jeSablona);
}

function getCategoryLabel(categoryId) {
    return categories.find((item) => String(item.id) === String(categoryId))?.label ?? 'Neznámá kategorie';
}

function getQuestionsForCategory(categoryId) {
    const activeQuestions = getActiveQuestions();

    if (String(categoryId) === '11') {
        return activeQuestions;
    }

    return activeQuestions.filter((question) => String(question.kategorie) === String(categoryId));
}

function getCategoryAvailability(categoryId) {
    const activeQuestions = getActiveQuestions();

    if (String(categoryId) === '11') {
        return {
            categoryCount: activeQuestions.length,
            totalCount: activeQuestions.length
        };
    }

    const categoryCount = activeQuestions.filter((question) => String(question.kategorie) === String(categoryId)).length;

    return {
        categoryCount,
        totalCount: categoryCount
    };
}

function getSelectedQuestions() {
    return state.questionIds
        .map((questionId) => getActiveQuestions().find((question) => question.id === questionId))
        .filter(Boolean);
}

function isMultiSelect(question) {
    return Array.isArray(question.spravna_odpoved);
}

function getCorrectIndexes(question) {
    if (Array.isArray(question.spravna_odpoved)) {
        return question.spravna_odpoved;
    }
    if (typeof question.spravna_odpoved === 'number') {
        return [question.spravna_odpoved];
    }
    const idx = question.moznosti.findIndex((o) => o === question.spravna_odpoved);
    return idx >= 0 ? [idx] : [0];
}

function getCorrectIndex(question) {
    return getCorrectIndexes(question)[0];
}

function isCorrectAnswer(question, answerValue) {
    if (isMultiSelect(question)) {
        if (!Array.isArray(answerValue)) return false;
        const correct = getCorrectIndexes(question);
        return correct.length === answerValue.length &&
            correct.every((i) => answerValue.includes(i));
    }
    return getCorrectIndex(question) === answerValue;
}

function getAnswerLabel(question, answerValue) {
    if (answerValue === null || answerValue === undefined) return 'Bez odpovědi';
    if (Array.isArray(answerValue)) {
        if (answerValue.length === 0) return 'Bez odpovědi';
        return answerValue.map((i) => question.moznosti[i] ?? '?').join(', ');
    }
    if (answerValue < 0) return 'Bez odpovědi';
    return question.moznosti[answerValue] ?? 'Bez odpovědi';
}

function shuffleArray(items) {
    const clone = [...items];

    for (let index = clone.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
    }

    return clone;
}

function updateQuickNavButtons() {
    const buttons = Array.from(dom.questionNavTrack.querySelectorAll('.question-nav-btn'));

    buttons.forEach((button) => {
        const index = Number(button.dataset.index);
        const question = getSelectedQuestions()[index];

        if (!question) {
            return;
        }

        const answerIndex = state.answers[question.id];
        const answered = Object.prototype.hasOwnProperty.call(state.answers, question.id);
        const correct = answered && isCorrectAnswer(question, answerIndex);

        button.classList.toggle('is-current', index === state.currentIndex);
        button.classList.toggle('is-answered', answered);
        button.classList.toggle('is-skipped', !answered);
        button.classList.toggle('is-correct', state.completed && correct);
        button.classList.toggle('is-wrong', state.completed && answered && !correct);
    });

    const viewport = dom.questionNavViewport;
    const track = dom.questionNavTrack;

    window.requestAnimationFrame(() => {
        const hasOverflow = track.scrollWidth > viewport.offsetWidth + 1;

        dom.questionNavPrev.hidden = false;
        dom.questionNavNext.hidden = false;
        dom.questionNavPrev.style.visibility = hasOverflow ? 'visible' : 'hidden';
        dom.questionNavNext.style.visibility = hasOverflow ? 'visible' : 'hidden';
        dom.questionNavPrev.disabled = track.scrollLeft <= 2;
        dom.questionNavNext.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    });
}

function renderQuestionNavigation() {
    dom.questionNavTrack.innerHTML = getSelectedQuestions().map((question, index) => {
        const answered = Object.prototype.hasOwnProperty.call(state.answers, question.id);
        const answerIndex = state.answers[question.id];
        const correct = answered && isCorrectAnswer(question, answerIndex);
        const classes = ['question-nav-btn'];

        if (answered) {
            classes.push('is-answered');
        }

        if (!answered) {
            classes.push('is-skipped');
        }

        if (index === state.currentIndex) {
            classes.push('is-current');
        }

        if (state.completed && answered && correct) {
            classes.push('is-correct');
        }

        if (state.completed && answered && !correct) {
            classes.push('is-wrong');
        }

        return `<button type="button" class="${classes.join(' ')}" data-index="${index}" title="Otázka ${index + 1}">${index + 1}</button>`;
    }).join('');

    window.requestAnimationFrame(updateQuickNavButtons);
}

function clearSavedState() {
    storage.removeItem(STORAGE_KEY);
}

function getReviewQuestions() {
    const questions = getSelectedQuestions();

    if (state.reviewFilter === 'wrong') {
        return questions.filter((question) => !isCorrectAnswer(question, state.answers[question.id]));
    }

    return questions;
}

function setReviewFilter(filter) {
    state.reviewFilter = filter;
    dom.reviewWrongOnlyButton.classList.toggle('is-active-filter', filter === 'wrong');
    dom.reviewAllButton.classList.toggle('is-active-filter', filter === 'all');
    renderReviewList();
    saveState();
}

function renderReviewList() {
    const questions = getReviewQuestions();

    if (!questions.length) {
        dom.reviewList.innerHTML = '<div class="review-card is-correct"><strong>Bez chyb.</strong><p>V tomto filtru nejsou žádné otázky.</p></div>';
        return;
    }

    dom.reviewList.innerHTML = questions.map((question) => {
        const selectedAnswer = state.answers[question.id];
        const correctIndex = getCorrectIndex(question);
        const correct = isCorrectAnswer(question, selectedAnswer);
        const questionNumber = getSelectedQuestions().findIndex((item) => item.id === question.id) + 1;

const correctIndexes = getCorrectIndexes(question);
const selectedArray = Array.isArray(selectedAnswer)
    ? selectedAnswer
    : (typeof selectedAnswer === 'number' ? [selectedAnswer] : []);

const optionsHtml = question.moznosti.map((optionText, optionIndex) => {
    const optionClasses = ['answer-pill'];
    const isSelectedByUser = selectedArray.includes(optionIndex);
    const isCorrectOption = correctIndexes.includes(optionIndex);

    if (isSelectedByUser && !isCorrectOption) {
        optionClasses.push('is-wrong');
    }
    if (isCorrectOption) {
        optionClasses.push('is-correct');
    }

    return `
        <div class="${optionClasses.join(' ')}">
            ${String.fromCharCode(65 + optionIndex)}. ${optionText}
        </div>
    `;
}).join('');

        return `
            <article class="review-card ${correct ? 'is-correct' : 'is-wrong'}">
                <div class="review-card-head">
                    <div>
                        <p class="eyebrow">Otázka ${questionNumber}</p>
                        <div class="review-question">${question.otazka}</div>
                    </div>
                    <span class="answer-pill ${correct ? 'is-correct' : 'is-wrong'}">${correct ? 'Správně' : 'Špatně'}</span>
                </div>

                <div class="review-meta">
                    <div class="answer-line"><strong>Tvoje odpověď:</strong> <span class="answer-pill ${correct ? 'is-correct' : 'is-wrong'}">${getAnswerLabel(question, selectedAnswer)}</span></div>
                    <div class="answer-line"><strong>Správná odpověď:</strong> <span class="answer-pill is-correct">${getAnswerLabel(question, getCorrectIndexes(question))}</span></div>
                </div>

                <div class="review-explanation">
                    <strong>Vysvětlení:</strong> <p>${question.vysvetleni || 'K této otázce zatím nebylo doplněno vysvětlení.'}</p>
                </div>

            </article>
        `;
    }).join('');
}

function saveState() {
    const answeredCount = Object.keys(state.answers).length;
    const progressPercent = state.questionIds.length
        ? Math.round(((state.currentIndex + 1) / state.questionIds.length) * 100)
        : 0;

    const payload = {
        ...state,
        answeredCount,
        progressPercent,
        standalone: isStandaloneMode
    };

    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
    const rawState = storage.getItem(STORAGE_KEY);

    if (!rawState) {
        return false;
    }

    try {
        const parsed = JSON.parse(rawState);
        Object.assign(state, {
            category: parsed.category ?? '11',
            count: parsed.count ?? 5,
            shuffle: Boolean(parsed.shuffle),
            questionIds: Array.isArray(parsed.questionIds) ? parsed.questionIds : [],
            currentIndex: Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0,
            answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
            completed: Boolean(parsed.completed),
            reviewFilter: parsed.reviewFilter ?? 'wrong',
            screen: parsed.screen ?? 'start'
        });
        return true;
    } catch {
        clearSavedState();
        return false;
    }
}

function setScreen(screenName) {
    state.screen = screenName;
    dom.startScreen.hidden = screenName !== 'start';
    dom.quizScreen.hidden = screenName !== 'quiz';
    dom.resultScreen.hidden = screenName !== 'result';

    dom.startScreen.classList.toggle('is-active', screenName === 'start');
    dom.quizScreen.classList.toggle('is-active', screenName === 'quiz');
    dom.resultScreen.classList.toggle('is-active', screenName === 'result');
}

function updateAvailableCount() {
    const availability = getCategoryAvailability(dom.categorySelect.value);
    const maxQuestions = availability.totalCount;

    dom.questionCount.min = maxQuestions === 0 ? '0' : '1';
    dom.questionCount.max = String(Math.max(maxQuestions, 0));
    dom.availableCountInfo.textContent = `K dispozici: ${maxQuestions} otázek`;

    const currentValue = Number(dom.questionCount.value) || 0;
    if (currentValue > maxQuestions) {
        dom.questionCount.value = String(maxQuestions);
    }

    dom.startQuizButton.disabled = maxQuestions === 0;
}

function buildCategoryOptions() {
    dom.categorySelect.innerHTML = categories.map((category) => {
        return `<option value="${category.id}">${category.id}. ${category.label}</option>`;
    }).join('');
}

function renderQuestion() {
    const selectedQuestions = getSelectedQuestions();
    const currentQuestion = selectedQuestions[state.currentIndex];

    if (!currentQuestion) {
        finishQuiz();
        return;
    }

    const categoryLabel = currentQuestion.kategorie === null
        ? 'Kategorie: vždy dostupná otázka'
        : `Kategorie: ${currentQuestion.kategorie}. ${getCategoryLabel(currentQuestion.kategorie)}`;

    dom.quizCategoryLabel.textContent = categoryLabel;
    dom.quizTitle.textContent = 'Otázka';
    dom.questionCounter.textContent = `Otázka ${state.currentIndex + 1} z ${selectedQuestions.length}`;
    dom.questionText.textContent = currentQuestion.otazka;

    dom.explanationBox.hidden = !state.completed;
    dom.explanationText.textContent = currentQuestion.vysvetleni || 'K této otázce zatím nebylo doplněno vysvětlení.';

    const progressPercent = selectedQuestions.length
        ? Math.round(((state.currentIndex + 1) / selectedQuestions.length) * 100)
        : 0;
    dom.progressChip.textContent = `${progressPercent}%`;
    dom.progressFill.style.width = `${progressPercent}%`;

    renderQuestionNavigation();

    const multiSelect = isMultiSelect(currentQuestion);
    const correctIndexes = getCorrectIndexes(currentQuestion);
    const selectedAnswer = state.answers[currentQuestion.id];
    const selectedArray = Array.isArray(selectedAnswer) ? selectedAnswer : (typeof selectedAnswer === 'number' ? [selectedAnswer] : []);

    if (multiSelect) {
        dom.answersGrid.dataset.multiSelect = 'true';
    } else {
        delete dom.answersGrid.dataset.multiSelect;
    }

    dom.answersGrid.innerHTML = currentQuestion.moznosti.map((optionText, optionIndex) => {
        const isSelected = selectedArray.includes(optionIndex);
        const classes = ['answer-button'];

        if (isSelected) classes.push('is-selected');
        if (state.completed && correctIndexes.includes(optionIndex)) classes.push('is-correct');
        if (state.completed && isSelected && !correctIndexes.includes(optionIndex)) classes.push('is-wrong');

        return `
            <button class="${classes.join(' ')}" type="button" data-question-id="${currentQuestion.id}" data-option-index="${optionIndex}" ${state.completed ? 'disabled' : ''}>
                <strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${optionText}
            </button>
        `;
    }).join('');

    dom.prevQuestionButton.disabled = state.currentIndex === 0;
    const isLastQuestion = state.currentIndex >= selectedQuestions.length - 1;
    dom.nextQuestionButton.hidden = isLastQuestion;
    dom.finishQuizButton.hidden = !isLastQuestion;
    const ans = state.answers[currentQuestion.id];
    dom.nextQuestionButton.disabled = isMultiSelect(currentQuestion)
        ? !Array.isArray(ans) || ans.length === 0
        : typeof ans !== 'number';
    dom.finishQuizButton.disabled = selectedQuestions.length === 0;
    saveState();
}

function startQuizFromSettings() {
    const category = dom.categorySelect.value;
    const requestedCount = Math.max(1, Number(dom.questionCount.value) || 1);
    const shuffle = dom.shuffleToggle.checked;
    const availableQuestions = getQuestionsForCategory(category);
    const count = Math.min(requestedCount, availableQuestions.length);

    const selectedQuestions = shuffle ? shuffleArray(availableQuestions) : [...availableQuestions].sort((a, b) => a.id - b.id);

    Object.assign(state, {
        category,
        count,
        shuffle,
        questionIds: selectedQuestions.slice(0, count).map((question) => question.id),
        currentIndex: 0,
        answers: {},
        completed: false,
        reviewFilter: 'wrong',
        screen: 'quiz'
    });

    setScreen('quiz');
    renderQuestion();
}

function goToQuestion(index) {
    const selectedQuestions = getSelectedQuestions();

    if (!selectedQuestions.length) {
        return;
    }

    state.currentIndex = Math.max(0, Math.min(index, selectedQuestions.length - 1));
    setScreen('quiz');
    renderQuestion();
}

function goToNextQuestion() {
    if (state.currentIndex < state.questionIds.length - 1) {
        state.currentIndex += 1;
        renderQuestion();
        return;
    }

    finishQuiz();
}

function goToPreviousQuestion() {
    if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        renderQuestion();
    }
}

function finishQuiz() {
    const questions = getSelectedQuestions();

    const correctAnswers = questions.filter((question) => isCorrectAnswer(question, state.answers[question.id])).length;
    const wrongAnswers = questions.length - correctAnswers;
    const percent = questions.length ? Math.round((correctAnswers / questions.length) * 100) : 0;

    state.completed = true;
    state.screen = 'result';

    dom.correctCount.textContent = String(correctAnswers);
    dom.wrongCount.textContent = String(wrongAnswers);
    dom.resultPercent.textContent = `${percent} %`;
    dom.resultSummary.textContent = `Vybral(a) jsi kategorii „${getCategoryLabel(state.category)}“ a odpověděl(a) na ${questions.length} otázek.`;
    dom.reviewWrongOnlyButton.classList.add('is-active-filter');
    dom.reviewAllButton.classList.remove('is-active-filter');

    saveState();
    renderQuestionNavigation();
    renderReviewList();

    setScreen('result');
}

function restoreQuizIfNeeded() {
    if (!loadState()) {
        setScreen('start');
        return;
    }

    dom.categorySelect.value = state.category;
    dom.questionCount.value = String(state.count);
    dom.shuffleToggle.checked = state.shuffle;
    dom.reviewWrongOnlyButton.classList.toggle('is-active-filter', state.reviewFilter !== 'all');
    dom.reviewAllButton.classList.toggle('is-active-filter', state.reviewFilter === 'all');
    updateAvailableCount();

    if (!state.questionIds.length) {
        setScreen('start');
        return;
    }

    if (state.screen === 'quiz') {
        setScreen('quiz');
        renderQuestion();
        return;
    }

    if (state.screen === 'result') {
        setScreen('result');
        renderQuestionNavigation();
        renderReviewList();
        const questions = getSelectedQuestions();
        const correctAnswers = questions.filter((question) => isCorrectAnswer(question, state.answers[question.id])).length;
        const wrongAnswers = questions.length - correctAnswers;
        const percent = questions.length ? Math.round((correctAnswers / questions.length) * 100) : 0;
        dom.correctCount.textContent = String(correctAnswers);
        dom.wrongCount.textContent = String(wrongAnswers);
        dom.resultPercent.textContent = `${percent} %`;
        dom.resultSummary.textContent = `Vybral(a) jsi kategorii „${getCategoryLabel(state.category)}“ a odpověděl(a) na ${questions.length} otázek.`;
        dom.reviewWrongOnlyButton.classList.toggle('is-active-filter', state.reviewFilter !== 'all');
        dom.reviewAllButton.classList.toggle('is-active-filter', state.reviewFilter === 'all');
        dom.reviewList.innerHTML = '';
        renderReviewList();
        return;
    }

    setScreen('start');
}

function wireEvents() {
    dom.goWebButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    dom.categorySelect.addEventListener('change', () => {
        updateAvailableCount();
        saveState();
    });

    dom.questionCount.addEventListener('input', saveState);
    dom.shuffleToggle.addEventListener('change', saveState);

    dom.startQuizButton.addEventListener('click', startQuizFromSettings);
    dom.resetSavedButton.addEventListener('click', () => {
        clearSavedState();
        setScreen('start');
    });

    if (dom.backToSettingsButton) {
        dom.backToSettingsButton.addEventListener('click', () => {
            setScreen('start');
        });
    }

    dom.prevQuestionButton.addEventListener('click', goToPreviousQuestion);
    dom.nextQuestionButton.addEventListener('click', goToNextQuestion);
    dom.finishQuizButton.addEventListener('click', finishQuiz);
    dom.restartQuizButton.addEventListener('click', startQuizFromSettings);
    dom.backToStartButton.addEventListener('click', () => {
        clearSavedState();
        setScreen('start');
    });

    dom.reviewWrongOnlyButton.addEventListener('click', () => setReviewFilter('wrong'));
    dom.reviewAllButton.addEventListener('click', () => setReviewFilter('all'));

    dom.questionNavPrev.addEventListener('click', () => {
        const amount = Math.max(280, Math.floor(dom.questionNavViewport.offsetWidth * 0.75));
        dom.questionNavTrack.scrollBy({ left: -amount, behavior: 'smooth' });
        window.setTimeout(updateQuickNavButtons, 300);
    });

    dom.questionNavNext.addEventListener('click', () => {
        const amount = Math.max(280, Math.floor(dom.questionNavViewport.offsetWidth * 0.75));
        dom.questionNavTrack.scrollBy({ left: amount, behavior: 'smooth' });
        window.setTimeout(updateQuickNavButtons, 300);
    });

    dom.questionNavTrack.addEventListener('scroll', updateQuickNavButtons, { passive: true });

    window.addEventListener('resize', () => {
        updateQuickNavButtons();
    });

dom.answersGrid.addEventListener('click', (event) => {
    const answerButton = event.target.closest('.answer-button');
    if (!answerButton || state.completed) return;

    const questionId = Number(answerButton.dataset.questionId);
    const optionIndex = Number(answerButton.dataset.optionIndex);
    const question = getActiveQuestions().find((q) => q.id === questionId);
    if (!question) return;

    if (isMultiSelect(question)) {
        const current = Array.isArray(state.answers[questionId]) ? [...state.answers[questionId]] : [];
        const pos = current.indexOf(optionIndex);
        if (pos >= 0) {
            current.splice(pos, 1);
        } else {
            current.push(optionIndex);
        }
        state.answers[questionId] = current;
    } else {
        state.answers[questionId] = optionIndex;
    }
    renderQuestion();
});

    dom.questionNavTrack.addEventListener('click', (event) => {
        const button = event.target.closest('.question-nav-btn');
        if (!button) {
            return;
        }

        goToQuestion(Number(button.dataset.index));
    });

    window.addEventListener('beforeunload', () => {
        if (!isStandaloneMode) {
            saveState();
        }
    });
}

function configureModeBanner() {
    dom.webWarning.hidden = isStandaloneMode;

    if (!isStandaloneMode) {
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry && navEntry.type === 'reload') {
            clearSavedState();
        }
    }
}

function initialize() {
    buildCategoryOptions();
    configureModeBanner();
    wireEvents();

    dom.categorySelect.value = state.category;
    dom.questionCount.value = String(state.count);
    dom.shuffleToggle.checked = state.shuffle;
    updateAvailableCount();
    restoreQuizIfNeeded();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
        });
    }
}

initialize();
