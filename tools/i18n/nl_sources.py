"""Sources des fiches en néerlandais : traduites à partir de la version anglaise (phrases récurrentes).
Utilisé par build_content.py quand une fiche néerlandaise n'a pas de champ « source »."""
import re
SRC = {
 "Standard knotting methods, written for Bivaska": "Gangbare knoopmethoden, geschreven voor Bivaska",
 "Standard bivouac know-how and manuals FM 21-76 / FM 3-05.70 (public domain), written for Bivaska": "Gangbare bivakkennis en handleidingen FM 21-76 / FM 3-05.70 (publiek domein), geschreven voor Bivaska",
 "Inspired by Nessmuk (1884), Kephart (1906) and Beard (1920), public-domain works, rewritten and adapted for Bivaska": "Geïnspireerd door Nessmuk (1884), Kephart (1906) en Beard (1920), werken uit het publiek domein, herschreven en aangepast voor Bivaska",
 "US Army survival manual FM 21-76 / FM 3-05.70 (public domain)": "Overlevingshandleiding van het Amerikaanse leger FM 21-76 / FM 3-05.70 (publiek domein)",
 "US Army survival manual FM 3-05.70 (public domain), rewritten and adapted for Bivaska": "Overlevingshandleiding van het Amerikaanse leger FM 3-05.70 (publiek domein), herschreven en aangepast voor Bivaska",
 "US Army survival manual FM 3-05.70 (public domain), rewritten for Bivaska": "Overlevingshandleiding van het Amerikaanse leger FM 3-05.70 (publiek domein), herschreven voor Bivaska",
 "Standard knotting methods, written for Bivaska; US Army survival manual FM 21-76 / FM 3-05.70 (public domain)": "Gangbare knoopmethoden, geschreven voor Bivaska; overlevingshandleiding van het Amerikaanse leger FM 21-76 / FM 3-05.70 (publiek domein)",
 "Written for Bivaska based on the recommendations of the European Commission (72 h self-sufficiency, 2026), the Belgian Crisis Centre and civil protection services. In a crisis, the authorities' instructions take precedence over this sheet.": "Geschreven voor Bivaska op basis van de aanbevelingen van de Europese Commissie (72 u zelfredzaamheid, 2026), het Belgische Crisiscentrum en de civiele bescherming. In een crisis gaan de instructies van de overheid voor op deze fiche.",
 "Written for Bivaska based on the recommendations of civil protection and crisis services (EU, Belgium, France, FEMA). In a crisis, follow the authorities' instructions.": "Geschreven voor Bivaska op basis van de aanbevelingen van de civiele bescherming en de crisisdiensten (EU, België, Frankrijk, FEMA). Volg in een crisis de instructies van de overheid.",
 "Standard bivouac and survival know-how, written for Bivaska": "Gangbare bivak- en overlevingskennis, geschreven voor Bivaska",
 "Public first-aid guidance (Red Cross, ULB); Belgian Poison Centre; manual FM 4-25.11 (public domain)": "Eerstehulprichtlijnen voor het grote publiek (Rode Kruis, ULB); Belgisch Antigifcentrum; handleiding FM 4-25.11 (publiek domein)",
 "Written for Bivaska based on official recommendations (WHO, Red Cross, civil protection, USDA, CDC). If in doubt about someone's health, call 112.": "Geschreven voor Bivaska op basis van officiële aanbevelingen (WHO, Rode Kruis, civiele bescherming, USDA, CDC). Twijfel je over iemands gezondheid, bel dan 112.",
 "Wallonia's public fishing rules (SPW, Maison wallonne de la Pêche), INBO opinion on pollutants in freshwater fish, standard naturalist knowledge; written for Bivaska": "Openbare visreglementering van Wallonië (SPW, Maison wallonne de la Pêche), advies van het INBO over vervuiling in zoetwatervis, gangbare natuurkennis; geschreven voor Bivaska",
 "Written for Bivaska from traditional know-how, checked against current safety knowledge.": "Geschreven voor Bivaska op basis van traditionele kennis, getoetst aan de huidige veiligheidskennis.",
 "Public first-aid guidance (Red Cross, ERC) cross-checked with manual FM 4-25.11 (public domain)": "Eerstehulprichtlijnen voor het grote publiek (Rode Kruis, ERC), vergeleken met handleiding FM 4-25.11 (publiek domein)",
 "WHO; review “Improvised Water Procurement in Wilderness Medicine” (medRxiv, 2025)": "WHO; overzichtsartikel « Improvised Water Procurement in Wilderness Medicine » (medRxiv, 2025)",
 "Written for Bivaska: manuals FM 4-25.11 and FM 21-76 (public domain), cross-checked with remote-area first-aid recommendations (WMS, ERC)": "Geschreven voor Bivaska: handleidingen FM 4-25.11 en FM 21-76 (publiek domein), vergeleken met aanbevelingen voor eerste hulp in afgelegen gebieden (WMS, ERC)",
 "Written for Bivaska based on the recommendations of the USDA (food safety during power outages) and the CDC (generators and carbon monoxide).": "Geschreven voor Bivaska op basis van de aanbevelingen van de USDA (voedselveiligheid bij stroomonderbrekingen) en de CDC (generatoren en koolstofmonoxide).",
 "US Army survival manual FM 21-76 / FM 3-05.70 (public domain); WHO; review “Improvised Water Procurement in Wilderness Medicine” (medRxiv, 2025)": "Overlevingshandleiding van het Amerikaanse leger FM 21-76 / FM 3-05.70 (publiek domein); WHO; overzichtsartikel « Improvised Water Procurement in Wilderness Medicine » (medRxiv, 2025)",
 "“Leave No Trace” principles": "Principes van « Leave No Trace »",
 "ASTM F3340 standard (measuring the thermal resistance of mats) and EN/ISO 23537 standards (sleeping bags). Written for Bivaska.": "Norm ASTM F3340 (meting van de thermische weerstand van matrassen) en normen EN/ISO 23537 (slaapzakken). Geschreven voor Bivaska.",
 "Written for Bivaska based on the recommendations of the USDA (United States Department of Agriculture) and Utah State University Extension on long-term food storage.": "Geschreven voor Bivaska op basis van de aanbevelingen van de USDA (Amerikaans ministerie van Landbouw) en Utah State University Extension over het lang bewaren van voedsel.",
 "US Army map reading and land navigation manuals (public domain), rewritten for Bivaska": "Handleidingen kaartlezen en terreinnavigatie van het Amerikaanse leger (publiek domein), herschreven voor Bivaska",
}
GAME = re.compile(r"^Original Bivaska recipe, inspired by (.+)\. Unofficial: Bivaska is not affiliated with or endorsed by any publisher of the games mentioned$")
GAME_FIX = {"role-playing game healing potions": "genezingsdrankjes uit rollenspellen", "RPG healing potions": "genezingsdrankjes uit RPG's", "fantasy": "fantasy", " and ": " en "}
def source_nl(en):
    if en in SRC: return SRC[en]
    m = GAME.match(en)
    if m:
        g = m.group(1)
        for a, b in GAME_FIX.items(): g = g.replace(a, b)
        return "Origineel Bivaska-recept, geïnspireerd door " + g + ". Niet officieel: Bivaska is niet verbonden met en wordt niet gesteund door de uitgevers van de vermelde games"
    return None
