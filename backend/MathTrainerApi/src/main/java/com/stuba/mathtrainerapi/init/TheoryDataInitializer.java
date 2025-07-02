package com.stuba.mathtrainerapi.init;

import com.stuba.mathtrainerapi.entity.*;
import com.stuba.mathtrainerapi.repository.TheoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

//@Component
public class TheoryDataInitializer implements CommandLineRunner {

    //@Autowired
    private TheoryRepository theoryRepository;

    @Override
    public void run(String... args) throws Exception {
        // Theory 1
        Theory theory1 = new Theory();
        theory1.setTitle("Uvod do teorii grafov");

        TheoryContent content1 = new TheoryContent();
        content1.setContentType("Article");
        content1.setTitle("Historický úvod");
        content1.setData("Teória grafov je pomerne mladá matematická disciplína, má však veľmi vážne praktické uplatnenie. Prvopočiatky teórie grafov siahajú do začiatku 18. storočia a sú spojené s menom švajčiarskeho matematika a fyzika Leonharda Eulera, ktorý väčšinu svojho života pôsobil v Rusku, kde je aj pochovaný. V roku 1736 Euler publikoval prácu s názvom Solutio problematis ad geometriam situs pertinentis, v ktorej riešil problém prechádzky po mostoch mesta Königsberg (dnešný Kaliningrad). Bola to, z dnešného pohľadu, hlavolamová úloha. Až oveľa neskôr sa ukázalo, že problém, ktorý Euler vyriešil, má významné uplatnenia v doprave, elektrotechnike, informatike a v mnohých ďalších technických disciplínach. Euler pri svojom riešení abstrahoval podstatu problému. Mapu mesta previedol do jej topologickej podoby, tú ďalej reprezentoval pomocou grafu a pomocou grafu potom problém vyriešil.\n\nĎalších takmer 200 rokov sa teória grafov rozvíjala v „ilegalite“. To znamená, že matematici riešili problémy, ktoré dnes patria do teórie grafov, ale teória grafov ešte neexistovala ako samostatná matematická disciplína. Medzi slávne a veľmi známe problémy teórie grafov, ktorými sa matematici zaoberali už v 19. storočí, patria napríklad problém obchodného cestujúceho a problém štyroch farieb. Problém obchodného cestujúceho ako prvý matematicky sformuloval írsky matematik W.R. Hamilton v roku 1800 a odvtedy sa ním zaoberali a stále zaoberajú mnohí významní matematici. Tento problém sa radí medzi problémy kombinatorickej optimalizácie a je to NP-úplný problém súvisiaci s plánovaním, logistikou, mikroelektronikou, operačným výskumom a informatikou. Problém štyroch farieb ako prvý sformuloval F. Guthrie, žiak známeho matematika Augusta de Morgana, v roku 1852. Týmto problémom sa tiež zaoberali mnohí slávni matematici, okrem iného aj Arthur Cayley, ktorý sa považuje za jedného z otcov teórie grafov. Problém štyroch farieb veľmi dlho odolával pokusom o vyriešenie. Už v 19. storočí prišli matematici s jeho „dôkazmi“. S najúspešnejšími pokusmi prišli A. Kempe v roku 1879 a P. Tait v roku 1880. Oba tieto „dôkazy“ odolávali vyše 11 rokov, ale nakoniec sa ukázali ako chybné v rokoch 1890 a 1891. Okrem týchto dvoch nasledoval ešte celý rad viac či menej úspešných pokusov o vyriešenie problému štyroch farieb. Na jeho vyriešenie bola dokonca vypísaná aj veľká finančná odmena. Avšak až v roku 1976 sa dvom matematikom, K. Appelovi a W. Hakenovi, podarilo vyriešiť tento problém za pomoci počítačov. Ich dôkaz spočíval v overovaní 19363 možností pomocou počítača. Bol to prvý významný matematický problém dokázaný s podporou počítačov. Formálny matematický dôkaz problému štyroch farieb sa, síce bez overovania možností, ale taktiež s pomocou programu Coq, podaril až v roku 2005 matematikom B. Wernerovi a G. Gonthierovi.\n\nOba spomenuté problémy boli spočiatku sformulované ako hlavolamové úlohy. Až o desaťročia neskôr sa ukázalo, že majú obrovský význam pre mnohé nové odvetvia techniky aj prírodných vied, ktoré v čase formulácie týchto problémov ešte ani neexistovali. To isté platí aj o ďalších problémoch teórie grafov a matematických problémov všeobecne. To, čo dnes vyzerá ako od života odtrhnutá teória, sa o pár desaťročí môže ukázať ako pre ľudskú prax podstatná vec.\n\nPrvú monografiu o teórii grafov napísal až v roku 1936 maďarský matematik Dénes Kőnig. Odvtedy patrí teória grafov medzi najrýchlejšie sa rozvíjajúce matematické disciplíny s množstvom aplikácií a využití v informatike, technike, prírodných vedách, v ekonómii a dokonca aj v tzv. humanitných vedách.");
        content1.setMediaLink("");
        content1.setTheory(theory1);

        TheoryContent content2 = new TheoryContent();
        content2.setContentType("Picture");
        content2.setTitle("Obr. 3.1: Problém mostov mesta Königsberg");
        content2.setData("**MEDIA_LINK**");
        content2.setMediaLink("##LINK_TO_PHOTO##");
        content2.setTheory(theory1);

        theory1.setTheoryContents(Arrays.asList(content1, content2));

        // Theory 2
        Theory theory2 = new Theory();
        theory2.setTitle("Uvod do teorii grafov");

        TheoryContent content3 = new TheoryContent();
        content3.setContentType("Example");
        content3.setTitle("Definícia grafu, typy grafov, základné pojmy");
        content3.setData("V praxi sa často stretávame s rôznymi typmi diagramov. Môžu to byť napríklad mapy cestnej alebo železničnej siete, rozvody plynu, elektriny alebo vody, výrobné plány, plošné spoje alebo návrhy mikroprocesorov, chemické väzby, štruktúra DNA atď. Napríklad môžeme mať cestnú mapu medzi 8 slovenskými krajskými mestami, ktorá vyzerá tak, ako je to znázornené na obrázku vyššie. Červené kruhy predstavujú krajské mestá a žlté čiary predstavujú cesty, ktoré ich spájajú. Predpokladáme, že máme za úlohu naplánovať trasu zásobovacieho auta, ktoré má vyštartovať z Bratislavy, a po každej z ciest má prejsť práve raz a má skončiť opäť v Bratislave.");
        content3.setMediaLink("{link}https://en.wikipedia.org/wiki/Four_color_theorem{/link}");
        content3.setTheory(theory2);

        GraphData graphData1 = new GraphData();
        graphData1.setTitle("Map Visualization of Slovak Cities:");
        graphData1.setOriented(false);
        graphData1.setTheoryContent(content3);

        List<GraphNode> graphNodes1 = Arrays.asList(
                createGraphNode("BA", "1", graphData1),
                createGraphNode("TT", "1", graphData1),
                createGraphNode("NR", "1", graphData1),
                createGraphNode("BB", "1", graphData1),
                createGraphNode("ZA", "1", graphData1),
                createGraphNode("KE", "1", graphData1),
                createGraphNode("PO", "1", graphData1),
                createGraphNode("TN", "1", graphData1)
        );

        List<GraphLink> graphLinks1 = Arrays.asList(
                createGraphLink("BA", "TT", "1", graphData1),
                createGraphLink("TT", "NR", "2", graphData1),
                createGraphLink("NR", "BB", "3", graphData1),
                createGraphLink("BB", "ZA", "4", graphData1),
                createGraphLink("ZA", "KE", "5", graphData1),
                createGraphLink("KE", "PO", "6", graphData1),
                createGraphLink("PO", "TN", "7", graphData1),
                createGraphLink("TN", "BA", "8", graphData1)
        );

        graphData1.setNodes(graphNodes1);
        graphData1.setLinks(graphLinks1);

        content3.setGraphData(Arrays.asList(graphData1));

        TheoryContent content4 = new TheoryContent();
        content4.setContentType("Example");
        content4.setTitle("Non-oriented and Oriented Graphs");
        content4.setData("Okrem neorientovaných grafov existujú aj tie orientované grafy. Na predloženej úlohe by sme mohli predstaviť tak, že cesty medzi mestami sú jednosmerné, čiže autá po nich môžu jazdiť len jedným predpísaným smerom. Pojem orientovaného grafu si, pre väčšiu názornosť, ilustrujeme ešte aj na úplne odlišnom type úlohy. Na športovom turnaji hrajú tímy mužstvá a, b, c, d systémom „každý s každým“. Mužstvo a porazilo mužstvá b, c a d, mužstvo b porazilo mužstvo d, mužstvo c porazilo mužstvo b a napokon mužstvo d porazilo mužstvo c. Toto môžeme znázorniť pomocou orientovaného grafu, ktorý vidíme na obrázku vyššie. Vrcholy grafu predstavujú mužstvá a šípky, nazývané orientované hrany grafu, znázorňujú kto koho porazil.");
        content4.setMediaLink("");
        content4.setTheory(theory2);

        GraphData graphData2 = new GraphData();
        graphData2.setTitle("Tournament Directional Graph");
        graphData2.setOriented(true);
        graphData2.setTheoryContent(content4);

        List<GraphNode> graphNodes2 = Arrays.asList(
                createGraphNode("a", "1", graphData2),
                createGraphNode("b", "1", graphData2),
                createGraphNode("c", "1", graphData2),
                createGraphNode("d", "1", graphData2)
        );

        List<GraphLink> graphLinks2 = Arrays.asList(
                createGraphLink("a", "b", "1", graphData2),
                createGraphLink("a", "c", "2", graphData2),
                createGraphLink("a", "d", "3", graphData2),
                createGraphLink("b", "d", "4", graphData2),
                createGraphLink("c", "b", "5", graphData2),
                createGraphLink("d", "c", "6", graphData2)
        );

        graphData2.setNodes(graphNodes2);
        graphData2.setLinks(graphLinks2);

        content4.setGraphData(Arrays.asList(graphData2));

        TheoryContent content5 = new TheoryContent();
        content5.setContentType("Article");
        content5.setTitle("Definícia 3.2.1 — Neorientovaný graf");
        content5.setData("Neorientovaný graf, alebo stručne len graf, je usporiadaná dvojica {math}G = (V, E){/math}. Prvky množiny {math}V{/math} sa nazývajú vrcholy (vertices) grafu {math}G{/math}. Prvky množiny {math}E{/math} sa nazývajú hrany (edges) grafu {math}G{/math} a zodpovedajú jedno a dvojprvkovým podmnožinám množiny {math}V{/math}.\n\nTreba si uvedomiť, že na množinu {math}V{/math} sa v definícii 3.2.1 nekladú žiadne požiadavky. Uvedená definícia preto zahrňa aj prázdny graf, t.j. graf, ktorý nemá žiadne vrcholy ani hrany. Prázdny graf dostaneme, ak bude {math}V = \\emptyset{/math}. Ďalej uvedená definícia pripúšťa aj nekonečný graf, t.j. graf, ktorý má nekonečný počet vrcholov, napríklad ak bude {math}V = \\mathbb{Z}{/math}. My sa budeme zaoberať len konečnými grafmi, t.j. grafmi s konečným počtom vrcholov a hrán.\n\nVrchy grafu obvykle označujeme písmenami {math}u, v, v_1, v_2, \\ldots{/math} avšak môžeme ich označiť aj inak, ako sme to videli na príklade s krajskými mestami Slovenska. Hrany grafu budeme obvykle označovať písmenami {math}h, h_1, h_2, \\ldots{/math} a ak to bude potrebné, budeme ich zapisovať ako jednoprvkové alebo dvojprvkové množiny. Napríklad {math}h_1 = \\{u, v\\}{/math} bude označovať hranu spájajúcu vrcholy {math}u{/math} a {math}v{/math} a {math}h_2 = \\{u\\}{/math} bude označovať hranu spájajúcu vrchol {math}u{/math} sám so sebou.\n\nDefinícia 3.2.1 pripúšťa aj možnosť, že medzi dvoma vrcholmi grafu {math}G{/math} je viac než len jedna hrana. Majme napríklad graf s vrcholmi {math}V = \\{u, v, \\ldots\\}{/math} a s hranami {math}E = \\{h_1, h_2, \\ldots\\}{/math}, pričom {math}h_1 = \\{u, v\\}{/math} a {math}h_2 = \\{u, v\\}{/math}. Uvedený zápis znamená, že vrcholy {math}u{/math} a {math}v{/math} sú spojené aspoň dvoma hranami. V definícii 3.2.1 je v slove „zodpovedajú“ ukryté priradenie medzi hranami grafu a podmnožinami množiny {math}V{/math}. Takže správne by sme mali písať {math}h_1 \\to \\{u, v\\}{/math} a {math}h_2 \\to \\{u, v\\}{/math}. Pre jednoduchosť však aj naďalej budeme používať symbol „—“.");
        content5.setMediaLink("");
        content5.setTheory(theory2);

        theory2.setTheoryContents(Arrays.asList(content3, content4, content5));

        // Save all theories
        //theoryRepository.saveAll(Arrays.asList(theory1, theory2));
    }

    private GraphNode createGraphNode(String nodeId, String group, GraphData graphData) {
        GraphNode node = new GraphNode();
        node.setNodeId(nodeId);
        node.setGroup(group);
        node.setGraphData(graphData);
        return node;
    }

    private GraphLink createGraphLink(String source, String target, String linkId, GraphData graphData) {
        GraphLink link = new GraphLink();
        link.setSource(source);
        link.setTarget(target);
        link.setLinkId(linkId);
        link.setGraphData(graphData);
        return link;
    }
}
