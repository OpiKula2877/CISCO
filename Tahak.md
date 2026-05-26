# Cisco CCNA1

## Hierarchie režimů (od nejnižšího po nejvyšší)
1. **User EXEC Mode (Uživatelský režim)**
    
- Jak ho poznáš: Switch> (končí znakem větší než)

- Jak se do něj dostaneš: Automaticky po připojení k zařízení a přihlášení.

- Práva a příkazy: Má velmi omezená práva. Slouží pouze k základnímu prověření stavu sítě a základní diagnostice. Zařízení zde nelze nijak konfigurovat ani měnit jeho nastavení.

- Typické příkazy: 
  - \* ping (ověření konektivity)

  - traceroute (sledování trasy paketů)

  - show version (zobrazení základních informací o systému)

  - exit (odhlášení)

2. **Privileged EXEC Mode / Enable Mode (Privilegovaný režim)**
    
- Jak ho poznáš: Switch# (končí mřížkou)

- Jak se do něj dostaneš: Z uživatelského režimu zadáním příkazu enable.

- Práva a příkazy: Zde máš plný přístup ke všem monitorovacím a diagnostickým příkazům. Můžeš detailně prohlížet veškeré konfigurace, tabulky a statistiky. Stále zde ale nemůžeš měnit samotné nastavení prvků (např. IP adresy). Můžeš odsud ale konfiguraci ukládat nebo restartovat zařízení.

- Typické příkazy:

  - show running-config (zobrazení aktuální konfigurace v operační paměti)

  - show ip interface brief (rychlý přehled stavu rozhraní a IP adres)

  - copy running-config startup-config (uložení konfigurace)

  - reload (restartování switche/routeru)

  - disable (návrat do User EXEC módu)

3. **Global Configuration Mode (Globální konfigurační režim)**
    
- Jak ho poznáš: Switch(config)#

- Jak se do něj dostaneš: Z privilegovaného režimu zadáním příkazu configure terminal (nebo zkratky config t).

- Práva a příkazy: V tomto režimu se provádějí změny, které ovlivňují celé zařízení jako celek. Odsud se také vstupuje do specifických podrežimů.

- Typické příkazy:
  - hostname NazevSwitche (změna jména zařízení)

   - enable password heslo (nastavení hesla pro vstup do privilegovaného režimu)

  - exit nebo end (opuštění režimu)

4. **Podrežimy Globální Konfigurace (Sub-configuration Modes)**
    
- Z globální konfigurace se větvíš hlouběji podle toho, co přesně chceš nastavit:

  - A) Interface Configuration Mode (Konfigurace rozhraní/portu)

    - Jak ho poznáš: Switch(config-if)#

    - Jak se tam dostaneš: V globální konfiguraci napíšeš např. interface fastethernet 0/1.

    - Práva a příkazy: Měníš nastavení konkrétního fyzického nebo virtuálního portu (např. rychlost, IP adresu, zapnutí/vypnutí). Příkazy: ip address ..., shutdown (vypnutí portu), no shutdown (zapnutí portu).

   - B) Line Configuration Mode (Konfigurace linek/připojení)

    - Jak ho poznáš: Switch(config-line)#

    - Jak se tam dostaneš: V globální konfiguraci napíšeš např. line console 0 (pro konzolový port) nebo line vty 0 4 (pro vzdálený přístup přes SSH/Telnet).

    - Práva a příkazy: Nastavení zabezpečení a parametrů pro přihlašování k zařízení. Příkazy: password heslo, login.

  - C) Router Configuration Mode (Konfigurace routovacích protokolů)

    - Jak ho poznáš: Switch(config-router)#

    - Jak se tam dostaneš: V globální konfiguraci napíšeš např. router ospf 1 nebo router rip.

    - Práva a příkazy: Nastavení směrovacích (routovacích) protokolů a sítí, které má router propagovat. Příkaz: network ....

## Základní komponenty operačního systému
1. **Kernel (Jádro)**
  - Co to je: Srdce a nejnižší vrstva operačního systému.

  - Funkce: Komunikuje přímo s fyzickým hardwarem zařízení (procesor, paměť RAM, pevné disky, síťové karty).

  - Vlastnosti: Řídí přidělování systémových prostředků. Uživatel k němu nemá přímý přístup, aby nedošlo k poškození systému.

2. **Shell (Skořápka)**
  - Co to je: Vrstva, která obaluje jádro (kernel).

  - Funkce: Tvoří rozhraní mezi uživatelem (nebo aplikacemi) a samotným operačním systémem.

  - Vlastnosti: Přijímá příkazy, překládá je do formátu, kterému kernel rozumí, a předává mu je k vykonání. Shell může mít textovou nebo grafickou podobu.

  - Typy uživatelských rozhraní (Podoby Shellu)
Podle toho, jakým způsobem člověk se Shellem komunikuje, rozlišujeme dvě hlavní rozhraní:

3. **CLI (Command Line Interface – Příkazový řádek)**
  - Princip: Uživatel komunikuje s operačním systémem výhradně psaním textových příkazů pomocí klávesnice.

  - Prostředí: Textové okno (např. Příkazový řádek/PowerShell ve Windows, Terminál v Linuxu nebo Cisco IOS).

  - Výhody: Vysoká rychlost, efektivita, možnost automatizace (skriptování) a nízké nároky na výkon.

4. **GUI (Graphical User Interface – Grafické uživatelské rozhraní)**
Princip: Uživatel komunikuje s operačním systémem pomocí ukazování a klikání (myší, touchpadem, prstem na displeji).

  - Prostředí: Grafické prvky – okna, ikony, menu, tlačítka a plocha (např. klasické prostředí Windows, macOS, Android).

  - Výhody: Intuitivní na ovládání, uživatelsky přívětivé, nevyžaduje znalost přesných textových příkazů.

## Pojmy
- SVI (Switch Virtual Interface)
  - Klasický switch (přepínač) funguje na 2. vrstvě OSI modelu (Data Link Layer). To znamená, že pracuje s MAC adresami a standardně nemá žádnou IP adresu. Jeho fyzické porty slouží pouze k propojování počítačů a neumí samy o sobě komunikovat na úrovni IP protokolu.

  - SVI je virtuální rozhraní vytvořené uvnitř softwaru switche, kterému můžeš přiřadit IP adresu. Protože je virtuální, nemá žádný svůj vlastní fyzický port. Místo toho se v Cisco zařízeních váže na konkrétní VLAN (virtuální síť). Nejčastěji se setkáš s rozhraním VLAN 1 (interface vlan 1), což je výchozí management VLAN na Cisco switchích.
