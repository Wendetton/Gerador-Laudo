import { useState, useCallback, useEffect, useRef } from "react";

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ===================== MAPEAMENTO DE RETINA =====================
const RETINA_CATEGORIES = {
  meios: {
    label: "Meios",
    options: [
      { id: "claros", label: "Meios claros", text: () => pick(["Meios claros", "Meios ópticos transparentes", "Meios claros e transparentes"]) },
      { id: "dvp", label: "Meios claros c/ DVP", text: () => pick(["Meios claros com DVP", "Meios transparentes, evidenciando descolamento do vítreo posterior", "Meios claros com presença de DVP"]) },
    ],
    default: "claros",
  },
  papila: {
    label: "Papila",
    options: [
      { id: "fisiologica", label: "Escavação fisiológica", text: () => pick(["papila com escavação fisiológica", "disco óptico com escavação dentro dos limites fisiológicos", "papila de aspecto normal, com escavação fisiológica"]) },
      { id: "atrofia", label: "Atrofia", text: () => pick(["papila com atrofia", "disco óptico com sinais de atrofia", "papila com alteração atrófica"]) },
    ],
    default: "fisiologica",
  },
  vasos: {
    label: "Vasos",
    options: [
      { id: "normal", label: "Sem alterações", text: () => pick(["vasos sem alterações", "vasos retinianos de calibre e trajeto normais", "vasos com aspecto preservado"]) },
      { id: "tortuosos", label: "Tortuosos", text: () => pick(["vasos tortuosos", "vasos retinianos com aumento da tortuosidade", "vasos com trajeto tortuoso"]) },
    ],
    default: "normal",
  },
  macula: {
    label: "Mácula",
    options: [
      { id: "livre", label: "Livre", text: () => pick(["mácula livre", "mácula de aspecto normal", "mácula sem alterações"]) },
      { id: "brilho", label: "↓ Brilho foveal", text: () => pick(["mácula com diminuição do brilho foveal", "mácula com redução do reflexo foveal", "mácula apresentando diminuição do brilho foveal"]) },
      { id: "atrofia", label: "Atrofia", text: () => pick(["mácula com atrofia", "mácula com alterações atróficas", "mácula apresentando sinais de atrofia"]) },
      { id: "drusas", label: "Drusas", text: () => pick(["mácula com drusas", "mácula com presença de drusas", "mácula evidenciando drusas"]) },
    ],
    default: "livre",
  },
  retina: {
    label: "Retina",
    options: [
      { id: "aplicada", label: "Aplicada", text: () => pick(["retina aplicada", "retina aplicada em 360°", "retina aplicada em todos os quadrantes"]) },
      { id: "repr", label: "REPR difusa", text: () => pick(["retina com REPR difusa", "retina apresentando REPR difusa", "retina com remaniamento pigmentar difuso"]) },
    ],
    default: "aplicada",
  },
};
const DEFAULT_RETINA = Object.fromEntries(Object.entries(RETINA_CATEGORIES).map(([k, v]) => [k, v.default]));

// ===================== MICROSCOPIA ESPECULAR =====================
function classifyHex(v) { return v >= 35 ? "normal" : v >= 25 ? "limítrofe" : "reduzida"; }
function classifyDensity(v) { return v >= 2400 ? "normal" : v >= 1800 ? "discreta" : v >= 1200 ? "baixa" : "muito_baixa"; }

function hexText(val) {
  const c = classifyHex(val);
  if (c === "normal") return pick([`Formato de células endoteliais em córnea central dentro dos parâmetros da normalidade, sendo cerca de ${val}% hexagonais.`, `Células endoteliais em córnea central com formato preservado, com aproximadamente ${val}% de hexagonalidade.`, `Morfologia das células endoteliais em córnea central dentro da normalidade, cerca de ${val}% hexagonais.`]);
  if (c === "limítrofe") return pick([`Formato de células endoteliais em córnea central em limite de fronteira, sendo cerca de ${val}% hexagonais.`, `Hexagonalidade das células endoteliais em córnea central em faixa limítrofe, em torno de ${val}%.`, `Morfologia celular endotelial em córnea central em limite da normalidade, com cerca de ${val}% de hexagonalidade.`]);
  return pick([`Observa-se redução do percentual de células hexagonais em córnea central, em torno de ${val}%.`, `Redução da hexagonalidade das células endoteliais em córnea central, com aproximadamente ${val}%.`, `Percentual de células hexagonais em córnea central reduzido, cerca de ${val}%.`]);
}
function densityText(val) {
  const c = classifyDensity(val);
  if (c === "normal") return pick([`Contagem normal de células endoteliais (${val} cels/mm²), compatível com a faixa etária do paciente.`, `Densidade endotelial preservada (${val} cels/mm²), dentro dos parâmetros esperados para a idade.`, `Contagem de células endoteliais dentro da normalidade (${val} cels/mm²), adequada à faixa etária.`]);
  if (c === "discreta") return pick([`Contagem de células endoteliais discretamente reduzida (${val} cels/mm²).`, `Discreta redução da densidade de células endoteliais (${val} cels/mm²).`, `Densidade endotelial com leve redução (${val} cels/mm²).`]);
  if (c === "baixa") return pick([`Contagem baixa de células endoteliais (${val} cels/mm²).`, `Densidade endotelial reduzida (${val} cels/mm²).`, `Contagem de células endoteliais abaixo do esperado (${val} cels/mm²).`]);
  return pick([`Importante redução da contagem de células endoteliais (${val} cels/mm²).`, `Significativa redução da densidade endotelial (${val} cels/mm²).`, `Contagem de células endoteliais acentuadamente reduzida (${val} cels/mm²).`]);
}
function areaText(val) {
  if (val === "normal") return pick(["Tamanho (área) das células dentro da normalidade em todos os setores da córnea.", "Área celular dentro dos parâmetros normais em todos os setores corneanos.", "Tamanho das células endoteliais preservado em todos os setores da córnea."]);
  if (val === "discreta") return pick(["Observa-se discreto aumento da área celular.", "Nota-se leve aumento do tamanho das células endoteliais.", "Discreto aumento da área das células endoteliais."]);
  return pick(["Observa-se aumento da área das células endoteliais.", "Aumento significativo da área celular endotelial.", "Nota-se aumento da área das células endoteliais."]);
}
const DEFAULT_MICRO = { hex: 40, density: 3000, area: "normal" };

// ===================== TOPOGRAFIA =====================
const TOPO_OPTIONS = [
  { id: "normal", label: "Normal" },
  { id: "favor", label: "Astig. a favor da regra" },
  { id: "contra", label: "Astig. contra a regra" },
  { id: "irregular", label: "Astig. irregular" },
  { id: "obliquo", label: "Astig. oblíquo" },
  { id: "ectasia", label: "Ectasia" },
];
const TOPO_TECNICA = () => pick([
  "Topografia corneana computadorizada realizada através do sistema de discos de Plácido, com análise de ambos os olhos em condições adequadas de fixação e iluminação.",
  "Exame de topografia corneana computadorizada realizado pelo método de discos de Plácido, em condições adequadas de fixação e iluminação, com análise bilateral.",
  "Topografia corneana por discos de Plácido, com análise de ambos os olhos em condições satisfatórias de fixação e iluminação.",
]);
function topoText(id) {
  switch (id) {
    case "normal": return pick(["Exame topográfico evidenciando córnea com padrão regular, apresentando distribuição simétrica do poder dióptrico. Curvaturas corneanas anteriores centrais dentro dos limites da normalidade, sem assimetrias inferiores/superiores relevantes, encurvamento localizado ou irregularidades compatíveis com ectasia. Índices topográficos analisados sem alterações significativas.", "Topografia corneana com padrão regular e distribuição simétrica das curvaturas. Não se observam assimetrias relevantes, encurvamentos localizados ou sinais sugestivos de ectasia. Índices topográficos dentro dos parâmetros normais.", "Exame topográfico demonstrando córnea de padrão regular, com curvaturas anteriores centrais dentro da normalidade e distribuição simétrica do poder dióptrico. Sem irregularidades ou achados sugestivos de ectasia. Índices topográficos sem alterações dignas de nota."]);
    case "favor": return pick(["Exame topográfico evidenciando padrão regular, com astigmatismo corneano regular a favor da regra, caracterizado por maior curvatura no meridiano vertical e distribuição simétrica do poder dióptrico. Não se observam sinais de irregularidade corneana ou achados sugestivos de ectasia.", "Topografia corneana com padrão de astigmatismo regular a favor da regra, com meridiano mais curvo no eixo vertical. Distribuição simétrica do poder dióptrico, sem sinais de ectasia ou irregularidades topográficas.", "Exame topográfico demonstrando astigmatismo corneano regular a favor da regra, com curvatura predominante no meridiano vertical e padrão dióptrico simétrico. Ausência de achados sugestivos de ectasia."]);
    case "contra": return pick(["Exame topográfico evidenciando padrão regular, com astigmatismo corneano regular contra a regra, caracterizado por maior curvatura no meridiano horizontal e distribuição simétrica do poder dióptrico. Ausência de irregularidades topográficas sugestivas de ectasia.", "Topografia corneana com padrão de astigmatismo regular contra a regra, com meridiano mais curvo no eixo horizontal. Distribuição simétrica do poder dióptrico, sem achados de irregularidade ou ectasia.", "Exame topográfico demonstrando astigmatismo corneano regular contra a regra, com curvatura predominante no meridiano horizontal e simetria dióptrica preservada. Sem sinais sugestivos de ectasia."]);
    case "irregular": return pick(["Exame topográfico evidenciando córnea com padrão assimétrico e distribuição irregular do poder dióptrico, compatível com astigmatismo corneano irregular. Observam-se irregularidades de curvatura que tornam o padrão topográfico não uniforme.", "Topografia corneana com padrão irregular, apresentando distribuição assimétrica do poder dióptrico e irregularidades de curvatura compatíveis com astigmatismo corneano irregular.", "Exame topográfico demonstrando padrão assimétrico de curvatura corneana, com distribuição irregular do poder dióptrico, compatível com astigmatismo irregular."]);
    case "obliquo": return pick(["Exame topográfico evidenciando astigmatismo corneano regular oblíquo, com principais meridianos deslocados dos eixos vertical e horizontal usuais, mantendo padrão topográfico regular. Não há sinais evidentes de ectasia corneana.", "Topografia corneana com astigmatismo regular oblíquo, apresentando meridianos principais fora dos eixos habituais, porém com padrão topográfico regular preservado. Sem achados de ectasia.", "Exame topográfico demonstrando astigmatismo corneano oblíquo, com meridianos deslocados dos eixos convencionais, mantendo regularidade do padrão topográfico. Ausência de sinais de ectasia."]);
    case "ectasia": return pick(["Exame topográfico evidenciando assimetria corneana significativa, com encurvamento localizado e irregularidades compatíveis com ectasia corneana. Observam-se alterações topográficas sugestivas de afinamento/encurvamento anômalo, devendo os achados ser correlacionados com a avaliação clínica e demais exames complementares.", "Topografia corneana evidenciando encurvamento localizado e assimetria significativa, com achados compatíveis com ectasia corneana. Recomenda-se correlação com dados clínicos e exames complementares.", "Exame topográfico demonstrando irregularidades e encurvamento localizado sugestivos de ectasia corneana, com assimetria significativa do padrão topográfico. Achados devem ser correlacionados com avaliação clínica."]);
    default: return "";
  }
}

// ===================== CAMPIMETRIA =====================
const CAMPO_OPTIONS = [
  { id: "normal", label: "Normal" },
  { id: "suspeita", label: "Suspeita de glaucoma" },
  { id: "inicial", label: "Glaucoma inicial" },
  { id: "avancado", label: "Glaucoma avançado" },
];
function campoText(id) {
  switch (id) {
    case "normal": return pick(["Campimetria computadorizada sem alterações significativas, dentro dos limites da normalidade. Índices de confiabilidade e parâmetros globais sem alterações relevantes.", "Campimetria computadorizada dentro dos limites da normalidade, sem defeitos campimétricos significativos. Índices de confiabilidade adequados e parâmetros globais preservados.", "Exame campimétrico computadorizado sem achados dignos de nota, com campo visual dentro dos parâmetros normais. Índices globais e de confiabilidade sem alterações."]);
    case "suspeita": return pick(["Campimetria computadorizada evidenciando alterações discretas, com defeitos localizados/sutis que levantam suspeita de comprometimento glaucomatoso, devendo os achados ser correlacionados com exame clínico e avaliação estrutural do nervo óptico. Índices com alterações leves.", "Campimetria computadorizada com defeitos sutis e localizados, sugestivos de possível comprometimento glaucomatoso. Recomenda-se correlação com avaliação clínica e estrutural do nervo óptico. Índices discretamente alterados.", "Exame campimétrico evidenciando alterações discretas e localizadas, com achados que levantam suspeita de dano glaucomatoso inicial. Correlação clínica e estrutural recomendada. Índices com leves alterações."]);
    case "inicial": return pick(["Campimetria computadorizada evidenciando defeitos compatíveis com dano glaucomatoso inicial, com alterações localizadas do campo visual e comprometimento leve dos índices analisados.", "Campimetria computadorizada com defeitos localizados do campo visual compatíveis com glaucoma inicial. Índices analisados com comprometimento leve.", "Exame campimétrico demonstrando alterações localizadas do campo visual, compatíveis com dano glaucomatoso em estágio inicial. Comprometimento discreto dos índices globais."]);
    case "avancado": return pick(["Campimetria computadorizada evidenciando defeitos extensos e significativos do campo visual, compatíveis com dano glaucomatoso avançado, com importante comprometimento dos índices globais.", "Campimetria computadorizada com defeitos extensos e marcantes do campo visual, indicativos de dano glaucomatoso avançado. Índices globais significativamente comprometidos.", "Exame campimétrico demonstrando comprometimento extenso do campo visual, com defeitos significativos compatíveis com glaucoma avançado. Importante alteração dos índices globais."]);
    default: return "";
  }
}

// ===================== ESTEREOFOTO =====================
const STEREO_OPTIONS = [
  { id: "normal", label: "Normal" },
  { id: "atrofia", label: "Atrofia" },
  { id: "aumentada", label: "Escavação aumentada" },
];
function stereoText(id, excH, excV) {
  const exc = `${excH} x ${excV}`;
  switch (id) {
    case "normal": return pick([`Disco óptico com contornos nítidos, regulares e fisiológicos, coloração preservada, apresentando escavação medindo ${exc}, sem notchings ou afilamentos de rima.`, `Disco óptico de aspecto fisiológico, contornos nítidos e regulares, coloração normal, com escavação de ${exc}. Sem notchings ou afilamentos da rima neural.`, `Disco óptico com contornos regulares e nítidos, coloração preservada, escavação de ${exc}, sem sinais de afilamento de rima ou notchings.`]);
    case "atrofia": return pick(["Disco óptico apresentando sinais de atrofia, com alteração de coloração e aspecto compatível com perda tecidual/neurorretiniana, devendo o achado ser correlacionado com contexto clínico e funcional.", "Disco óptico com sinais de atrofia e alteração da coloração, compatível com perda neurorretiniana. Correlação clínica e funcional recomendada.", "Disco óptico evidenciando aspecto atrófico, com palidez e alteração de coloração sugestivas de perda tecidual. Recomenda-se correlação com dados clínicos e funcionais."]);
    case "aumentada": return pick([`Disco óptico com aumento da escavação papilar (${exc}), observando-se relação escavação/disco ampliada em comparação ao padrão fisiológico, sem prejuízo de correlação com demais dados clínicos e estruturais.`, `Disco óptico com escavação ampliada (${exc}), relação escavação/disco acima do padrão fisiológico. Recomenda-se correlação com dados clínicos e exames estruturais.`, `Disco óptico apresentando escavação aumentada (${exc}), com relação escavação/disco ampliada. Achado deve ser correlacionado com avaliação clínica e estrutural.`]);
    default: return "";
  }
}
const DEFAULT_STEREO = { tipo: "normal", excH: "0.3", excV: "0.3" };

// ===================== FILME LACRIMAL =====================
const LISAMINA_OPTIONS = [
  { id: "ausencia", label: "Sem desepitelização" },
  { id: "discreta", label: "Discreta" },
  { id: "moderada", label: "Moderada" },
  { id: "acentuada", label: "Acentuada" },
];
function lisaminaText(id) {
  switch (id) {
    case "ausencia": return pick(["Ausência de áreas de desepitelização.", "Sem áreas de desepitelização identificáveis.", "Superfície ocular íntegra, sem desepitelização."]);
    case "discreta": return pick(["Presença de discretas áreas de desepitelização.", "Observam-se discretas áreas de desepitelização da superfície ocular.", "Áreas leves de desepitelização identificadas."]);
    case "moderada": return pick(["Presença de áreas moderadas de desepitelização.", "Observam-se áreas moderadas de desepitelização.", "Áreas de desepitelização de intensidade moderada."]);
    case "acentuada": return pick(["Presença de extensas/acentuadas áreas de desepitelização.", "Observam-se áreas acentuadas de desepitelização da superfície ocular.", "Extensas áreas de desepitelização identificadas."]);
    default: return "";
  }
}
function classifySchirmer(v) { return v >= 10 ? "normal" : v >= 5 ? "reduzido" : "muito_reduzido"; }
const DEFAULT_LACRIMAL = { schirmer: 18, lisamina: "ausencia" };

// ===================== OCT MÁCULA =====================
const OCTMAC_OPTIONS = [
  { id: "normal", label: "Normal" },
  { id: "edema", label: "Edema macular / cistos" },
  { id: "fluido_sub", label: "Fluido sub-retiniano" },
  { id: "membrana", label: "Membrana epirretiniana" },
  { id: "tracao", label: "Tração vítreo-macular" },
  { id: "buraco", label: "Buraco macular" },
  { id: "atrofia", label: "Afinamento / atrofia" },
  { id: "inespecifica", label: "Alteração inespecífica" },
];
const OCTMAC_GRAU = [
  { id: "none", label: "—" },
  { id: "discreto", label: "Discreto" },
  { id: "moderado", label: "Moderado" },
  { id: "acentuado", label: "Acentuado" },
];
function octMacText(id, grau) {
  const g = grau !== "none" ? grau : "";
  const gi = g ? (g === "discreto" ? pick(["discreto", "leve"]) : g === "moderado" ? "moderado" : pick(["acentuado", "importante"])) : "";
  switch (id) {
    case "normal": return pick([
      "Exame de tomografia de coerência óptica da mácula evidenciando depressão foveal preservada, arquitetura retiniana mantida, camadas retinianas bem definidas, sem sinais de fluido intra ou sub-retiniano, sem membrana epirretiniana e sem alterações estruturais significativas.",
      "OCT de mácula com depressão foveal preservada, arquitetura retiniana íntegra e camadas bem diferenciadas. Sem fluido intra ou sub-retiniano, sem membrana epirretiniana e sem alterações estruturais relevantes.",
      "Tomografia de coerência óptica da mácula demonstrando perfil foveal preservado, camadas retinianas bem definidas, sem evidência de fluido, membrana epirretiniana ou alterações estruturais significativas.",
    ]);
    case "edema": return pick([
      `Exame de tomografia de coerência óptica da mácula evidenciando ${gi ? gi + " " : ""}espessamento retiniano com presença de espaços cistoides intrarretinianos, compatível com edema macular.`,
      `OCT de mácula com ${gi ? gi + " " : ""}espessamento retiniano e cistos intrarretinianos, compatível com edema macular.`,
      `Tomografia de coerência óptica da mácula demonstrando edema macular ${gi ? gi + " " : ""}com espaços cistoides intrarretinianos.`,
    ]);
    case "fluido_sub": return pick([
      "Exame de tomografia de coerência óptica da mácula evidenciando descolamento neurossensorial com presença de fluido sub-retiniano na região macular.",
      "OCT de mácula com descolamento neurossensorial e fluido sub-retiniano na região macular.",
      "Tomografia de coerência óptica da mácula demonstrando presença de fluido sub-retiniano com descolamento neurossensorial.",
    ]);
    case "membrana": {
      const grauMembr = gi || pick(["discreta", "moderada"]);
      return pick([
        `Exame de tomografia de coerência óptica da mácula evidenciando membrana epirretiniana, com ${grauMembr} irregularidade da superfície retiniana interna e distorção do contorno foveal.`,
        `OCT de mácula com membrana epirretiniana e ${grauMembr} distorção da superfície retiniana interna e do perfil foveal.`,
        `Tomografia de coerência óptica da mácula demonstrando membrana epirretiniana com ${grauMembr} repercussão sobre a superfície retiniana e contorno foveal.`,
      ]);
    }
    case "tracao": return pick([
      "Exame de tomografia de coerência óptica da mácula evidenciando adesão/tração vítreo-macular, com deformação do contorno foveal e alteração da arquitetura macular.",
      "OCT de mácula com tração vítreo-macular e deformação do perfil foveal, com alteração da arquitetura macular.",
      "Tomografia de coerência óptica da mácula demonstrando tração vítreo-macular com repercussão sobre o contorno foveal e a arquitetura retiniana.",
    ]);
    case "buraco": return pick([
      "Exame de tomografia de coerência óptica da mácula evidenciando defeito foveal compatível com buraco macular.",
      "OCT de mácula com defeito de espessura total/lamelar na região foveal, compatível com buraco macular.",
      "Tomografia de coerência óptica da mácula demonstrando solução de continuidade foveal compatível com buraco macular.",
    ]);
    case "atrofia": return pick([
      "Exame de tomografia de coerência óptica da mácula evidenciando afinamento das camadas retinianas na região macular, compatível com alteração atrófica.",
      "OCT de mácula com rarefação tecidual e afinamento das camadas retinianas na região macular, de aspecto atrófico.",
      "Tomografia de coerência óptica da mácula demonstrando afinamento macular com rarefação das camadas retinianas, compatível com atrofia.",
    ]);
    case "inespecifica": return pick([
      "Exame de tomografia de coerência óptica da mácula evidenciando discreta alteração da arquitetura foveal, sem sinais evidentes de fluido intra ou sub-retiniano.",
      "OCT de mácula com irregularidade estrutural macular discreta, sem fluido intra ou sub-retiniano identificável.",
      "Tomografia de coerência óptica da mácula demonstrando sutil alteração do perfil foveal, sem sinais de fluido ou achados estruturais maiores.",
    ]);
    default: return "";
  }
}
const DEFAULT_OCTMAC = { tipo: "normal", grau: "none" };

// ===================== OCT NERVO ÓPTICO =====================
const OCTNO_OPTIONS = [
  { id: "normal", label: "Normal" },
  { id: "suspeita", label: "Suspeita glaucomatosa" },
  { id: "focal", label: "Afinamento focal RNFL" },
  { id: "difuso", label: "Afinamento difuso RNFL" },
  { id: "escavacao", label: "Escavação ↑ + correlação" },
  { id: "avancado", label: "Perda estrutural avançada" },
];
const OCTNO_SETORES = [
  { id: "superior", label: "Superior" },
  { id: "inferior", label: "Inferior" },
  { id: "temporal", label: "Temporal" },
  { id: "nasal", label: "Nasal" },
  { id: "difuso", label: "Difuso" },
];
function octNoText(id, setores) {
  const setorStr = setores.length > 0 ? (" em setor" + (setores.length > 1 ? "es " : " ") + setores.join(" e ")) : "";
  switch (id) {
    case "normal": return pick([
      "Exame de tomografia de coerência óptica do nervo óptico evidenciando espessura da camada de fibras nervosas da retina dentro dos limites da normalidade, sem afinamentos focais ou difusos significativos. Parâmetros estruturais analisados sem alterações relevantes.",
      "OCT do nervo óptico com espessura da RNFL dentro dos limites normais, sem afinamentos focais ou difusos. Parâmetros estruturais sem alterações significativas.",
      "Tomografia de coerência óptica do nervo óptico demonstrando camada de fibras nervosas da retina preservada, sem afinamentos relevantes. Parâmetros estruturais dentro da normalidade.",
    ]);
    case "suspeita": return pick([
      "Exame de tomografia de coerência óptica do nervo óptico evidenciando discreto afinamento/setores limítrofes da camada de fibras nervosas da retina" + setorStr + ", achado suspeito para dano glaucomatoso inicial, devendo ser correlacionado com campimetria, disco óptico e contexto clínico.",
      "OCT do nervo óptico com setores limítrofes/discretamente afinados da RNFL" + setorStr + ", sugestivo de possível dano glaucomatoso inicial. Correlação com campimetria e avaliação clínica recomendada.",
      "Tomografia de coerência óptica do nervo óptico demonstrando discretas alterações da RNFL" + setorStr + ", levantando suspeita de comprometimento glaucomatoso. Recomenda-se correlação clínica e funcional.",
    ]);
    case "focal": return pick([
      "Exame de tomografia de coerência óptica do nervo óptico evidenciando afinamento focal da camada de fibras nervosas da retina" + setorStr + ", compatível com perda estrutural localizada.",
      "OCT do nervo óptico com afinamento focal da RNFL" + setorStr + ", indicativo de perda estrutural localizada.",
      "Tomografia de coerência óptica do nervo óptico demonstrando redução focal da espessura da RNFL" + setorStr + ", compatível com perda estrutural localizada.",
    ]);
    case "difuso": return pick([
      "Exame de tomografia de coerência óptica do nervo óptico evidenciando afinamento difuso da camada de fibras nervosas da retina, sem preservação setorial significativa, compatível com perda estrutural difusa.",
      "OCT do nervo óptico com afinamento difuso da RNFL, sem setores significativamente preservados, compatível com perda estrutural generalizada.",
      "Tomografia de coerência óptica do nervo óptico demonstrando redução difusa da espessura da RNFL, compatível com perda estrutural difusa.",
    ]);
    case "escavacao": return pick([
      "Exame de tomografia de coerência óptica do nervo óptico evidenciando aumento da escavação papilar associado a redução estrutural da camada de fibras nervosas da retina.",
      "OCT do nervo óptico com escavação papilar aumentada e redução correspondente da RNFL, indicando correlação estrutural.",
      "Tomografia de coerência óptica do nervo óptico demonstrando escavação papilar ampliada com redução associada da espessura da RNFL.",
    ]);
    case "avancado": return pick([
      "Exame de tomografia de coerência óptica do nervo óptico evidenciando importante redução da espessura da camada de fibras nervosas da retina, compatível com dano estrutural avançado.",
      "OCT do nervo óptico com acentuada redução da RNFL, compatível com perda estrutural avançada.",
      "Tomografia de coerência óptica do nervo óptico demonstrando significativa redução da espessura da RNFL, indicativa de dano estrutural avançado.",
    ]);
    default: return "";
  }
}
const DEFAULT_OCTNO = { tipo: "normal", setores: [] };

// ===================== PAQUIMETRIA =====================
function classifyPaqui(v) { return v < 500 ? "muito_fina" : v < 520 ? "fina" : v <= 560 ? "habitual" : "espessa"; }
function paquiText(val, interp) {
  const base = pick([
    `Paquimetria ultrassônica evidenciando espessura corneana central de ${val} µm`,
    `Paquimetria ultrassônica com espessura corneana central de ${val} µm`,
    `Espessura corneana central aferida por paquimetria ultrassônica: ${val} µm`,
  ]);
  if (!interp) return base + ".";
  const c = classifyPaqui(val);
  const interpText = c === "muito_fina" ? pick([", valor abaixo da faixa habitual.", ", córnea mais fina que o habitual."]) :
    c === "fina" ? pick([", valor na faixa inferior da normalidade.", ", córnea no limite inferior da faixa habitual."]) :
    c === "habitual" ? pick([", dentro da faixa habitual.", ", valor dentro dos parâmetros habituais."]) :
    pick([", valor acima da faixa habitual.", ", córnea mais espessa que o habitual."]);
  return base + interpText;
}
const DEFAULT_PAQUI = { valor: 540, interp: false };

// ===================== RETINOGRAFIA =====================
const RETINO_CATEGORIES = {
  papila: {
    label: "Papila",
    options: [
      { id: "fisiologica", label: "Fisiológica", text: () => pick(["papila com escavação fisiológica", "disco óptico com escavação fisiológica", "papila de aspecto normal"]) },
      { id: "atrofia", label: "Atrofia", text: () => pick(["papila com sinais de atrofia", "disco óptico com atrofia", "papila com alteração atrófica"]) },
      { id: "aumentada", label: "Escav. aumentada", text: () => pick(["papila com escavação aumentada", "disco óptico com aumento da escavação", "papila com escavação ampliada"]) },
    ],
    default: "fisiologica",
  },
  macula: {
    label: "Mácula",
    options: [
      { id: "livre", label: "Livre", text: () => pick(["mácula livre", "mácula de aspecto normal", "mácula sem alterações"]) },
      { id: "brilho", label: "↓ Brilho foveal", text: () => pick(["mácula com diminuição do brilho foveal", "mácula com redução do reflexo foveal", "mácula apresentando diminuição do brilho foveal"]) },
      { id: "atrofia", label: "Atrofia", text: () => pick(["mácula com atrofia", "mácula com alterações atróficas", "mácula apresentando sinais de atrofia"]) },
      { id: "drusas", label: "Drusas", text: () => pick(["mácula com drusas", "mácula com presença de drusas", "mácula evidenciando drusas"]) },
    ],
    default: "livre",
  },
  retina: {
    label: "Retina",
    options: [
      { id: "sem_alteracoes", label: "Sem alterações", text: () => pick(["retina sem alterações", "retina de aspecto normal", "retina sem achados significativos"]) },
      { id: "repr", label: "REPR", text: () => pick(["retina com REPR difusa", "retina apresentando REPR difusa", "retina com remaniamento pigmentar difuso"]) },
      { id: "cicatrizes", label: "Cicatrizes", text: () => pick(["retina com cicatrizes", "retina apresentando cicatrizes coriorretinianas", "retina com áreas cicatriciais"]) },
    ],
    default: "sem_alteracoes",
  },
};
const DEFAULT_RETINO = Object.fromEntries(Object.entries(RETINO_CATEGORIES).map(([k, v]) => [k, v.default]));

// ===================== TONOMETRIA =====================
const DEFAULT_TONO = { valor: 14 };

// ===================== BIOMETRIA =====================
const DIOPTRIAS = [];
for (let d = 10; d <= 35; d += 0.5) DIOPTRIAS.push(d.toFixed(2).replace(".", ","));
function bioText(axial, dioptria) {
  return pick([
    `Biometria ultrassônica evidenciando comprimento axial de ${axial} mm, com indicação de lente intraocular de +${dioptria} dioptrias.`,
    `Biometria ultrassônica com comprimento axial de ${axial} mm, indicando lente intraocular de +${dioptria} dioptrias.`,
    `Comprimento axial aferido por biometria ultrassônica: ${axial} mm. Indicação de lente intraocular de +${dioptria} dioptrias.`,
  ]);
}
const DEFAULT_BIO = { axial: 23.5, dioptria: "21,00" };

// ===================== EXAM COLORS =====================
const EC = {
  retina: { main: "#0369a1", border: "#bae6fd" },
  micro: { main: "#7c3aed", border: "#ddd6fe" },
  topo: { main: "#0d9488", border: "#99f6e4" },
  campo: { main: "#b45309", border: "#fde68a" },
  stereo: { main: "#be185d", border: "#fbcfe8" },
  lacrimal: { main: "#4338ca", border: "#c7d2fe" },
  octmac: { main: "#059669", border: "#a7f3d0" },
  octno: { main: "#d97706", border: "#fde68a" },
  paqui: { main: "#6366f1", border: "#c7d2fe" },
  retino: { main: "#dc2626", border: "#fecaca" },
  tono: { main: "#e11d48", border: "#fda4af" },
  bio: { main: "#2563eb", border: "#bfdbfe" },
};

// ===================== MAIN COMPONENT =====================
export default function LaudoOftalmologico() {
  const [exams, setExams] = useState({ retina: false, micro: false, topo: false, campo: false, stereo: false, lacrimal: false, octmac: false, octno: false, paqui: false, retino: false, tono: false, bio: false });
  const toggle = (k) => setExams((p) => ({ ...p, [k]: !p[k] }));

  const [retinaOD, setRetinaOD] = useState({ ...DEFAULT_RETINA });
  const [retinaOE, setRetinaOE] = useState({ ...DEFAULT_RETINA });
  const [microOD, setMicroOD] = useState({ ...DEFAULT_MICRO });
  const [microOE, setMicroOE] = useState({ ...DEFAULT_MICRO });
  const [topoOD, setTopoOD] = useState("normal");
  const [topoOE, setTopoOE] = useState("normal");
  const [campoOD, setCampoOD] = useState("normal");
  const [campoOE, setCampoOE] = useState("normal");
  const [stereoOD, setStereoOD] = useState({ ...DEFAULT_STEREO });
  const [stereoOE, setStereoOE] = useState({ ...DEFAULT_STEREO });
  const [lacOD, setLacOD] = useState({ ...DEFAULT_LACRIMAL });
  const [lacOE, setLacOE] = useState({ ...DEFAULT_LACRIMAL });
  const [octmacOD, setOctmacOD] = useState({ ...DEFAULT_OCTMAC });
  const [octmacOE, setOctmacOE] = useState({ ...DEFAULT_OCTMAC });
  const [octnoOD, setOctnoOD] = useState({ ...DEFAULT_OCTNO });
  const [octnoOE, setOctnoOE] = useState({ ...DEFAULT_OCTNO });
  const [paquiOD, setPaquiOD] = useState({ ...DEFAULT_PAQUI });
  const [paquiOE, setPaquiOE] = useState({ ...DEFAULT_PAQUI });
  const [retinoOD, setRetinoOD] = useState({ ...DEFAULT_RETINO });
  const [retinoOE, setRetinoOE] = useState({ ...DEFAULT_RETINO });
  const [tonoOD, setTonoOD] = useState({ ...DEFAULT_TONO });
  const [tonoOE, setTonoOE] = useState({ ...DEFAULT_TONO });
  const [bioOD, setBioOD] = useState({ ...DEFAULT_BIO });
  const [bioOE, setBioOE] = useState({ ...DEFAULT_BIO });

  const [laudoText, setLaudoText] = useState("");
  const [laudoHtml, setLaudoHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  const generateReport = useCallback(() => {
    const lines = []; // {type: 'title'|'text'|'blank', content}
    const T = (s) => lines.push({ type: "title", content: s });
    const L = (s) => lines.push({ type: "text", content: s });
    const B = () => lines.push({ type: "blank" });

    if (exams.retina) {
      T("MAPEAMENTO DE RETINA");
      const build = (data, label) => {
        const items = Object.entries(RETINA_CATEGORIES).map(([key, cat]) => {
          const opt = cat.options.find((o) => o.id === data[key]);
          return opt ? opt.text() : "";
        });
        const first = items[0].charAt(0).toUpperCase() + items[0].slice(1);
        return `${label}: ${first}, ${items.slice(1).join(", ")}.`;
      };
      L(build(retinaOD, "Olho Direito"));
      L(build(retinaOE, "Olho Esquerdo"));
    }

    if (exams.micro) {
      if (lines.length) B();
      T("MICROSCOPIA ESPECULAR");
      const build = (d, l) => `${l}: ${hexText(d.hex)} ${densityText(d.density)} ${areaText(d.area)}`;
      L(build(microOD, "Olho Direito"));
      L(build(microOE, "Olho Esquerdo"));
    }

    if (exams.topo) {
      if (lines.length) B();
      T("TOPOGRAFIA DE CÓRNEA");
      L(`Técnica: ${TOPO_TECNICA()}`);
      L(`Olho Direito: ${topoText(topoOD)}`);
      L(`Olho Esquerdo: ${topoText(topoOE)}`);
    }

    if (exams.campo) {
      if (lines.length) B();
      T("CAMPIMETRIA COMPUTADORIZADA");
      L(`Olho Direito: ${campoText(campoOD)}`);
      L(`Olho Esquerdo: ${campoText(campoOE)}`);
    }

    if (exams.stereo) {
      if (lines.length) B();
      T("ESTEREOFOTO DE PAPILA");
      L(`Olho Direito: ${stereoText(stereoOD.tipo, stereoOD.excH, stereoOD.excV)}`);
      L(`Olho Esquerdo: ${stereoText(stereoOE.tipo, stereoOE.excH, stereoOE.excV)}`);
    }

    if (exams.lacrimal) {
      if (lines.length) B();
      T("AVALIAÇÃO DO FILME LACRIMAL");
      const sOD = lacOD.schirmer, sOE = lacOE.schirmer;
      const cOD = classifySchirmer(sOD), cOE = classifySchirmer(sOE);
      L("Teste de Schirmer:");
      if (cOD === "normal" && cOE === "normal") {
        L(pick([`Olho Direito: ${sOD} mm; Olho Esquerdo: ${sOE} mm — valores dentro de faixa preservada para produção lacrimal.`, `Olho Direito: ${sOD} mm; Olho Esquerdo: ${sOE} mm — produção lacrimal dentro dos parâmetros normais.`, `Olho Direito: ${sOD} mm; Olho Esquerdo: ${sOE} mm — valores compatíveis com produção lacrimal adequada.`]));
      } else if (cOD === "muito_reduzido" || cOE === "muito_reduzido") {
        L(pick([`Teste de Schirmer evidenciando acentuada redução da produção lacrimal, com medida de ${sOD} mm no olho direito e ${sOE} mm no olho esquerdo.`, `Acentuada redução da produção lacrimal ao teste de Schirmer: ${sOD} mm (OD) e ${sOE} mm (OE).`]));
      } else {
        L(pick([`Teste de Schirmer evidenciando redução da produção lacrimal, com medida de ${sOD} mm no olho direito e ${sOE} mm no olho esquerdo.`, `Redução da produção lacrimal ao teste de Schirmer: ${sOD} mm (OD) e ${sOE} mm (OE).`]));
      }
      L("Teste da Lisamina Verde:");
      L(`Olho Direito: ${lisaminaText(lacOD.lisamina)}`);
      L(`Olho Esquerdo: ${lisaminaText(lacOE.lisamina)}`);
    }

    if (exams.octmac) {
      if (lines.length) B();
      T("TOMOGRAFIA DE COERÊNCIA ÓPTICA DE MÁCULA");
      L(`Olho Direito: ${octMacText(octmacOD.tipo, octmacOD.grau)}`);
      L(`Olho Esquerdo: ${octMacText(octmacOE.tipo, octmacOE.grau)}`);
    }

    if (exams.octno) {
      if (lines.length) B();
      T("TOMOGRAFIA DE COERÊNCIA ÓPTICA DE NERVO ÓPTICO");
      L(`Olho Direito: ${octNoText(octnoOD.tipo, octnoOD.setores)}`);
      L(`Olho Esquerdo: ${octNoText(octnoOE.tipo, octnoOE.setores)}`);
    }

    if (exams.paqui) {
      if (lines.length) B();
      T("PAQUIMETRIA ULTRASSÔNICA");
      L(`Olho Direito: ${paquiText(paquiOD.valor, paquiOD.interp)}`);
      L(`Olho Esquerdo: ${paquiText(paquiOE.valor, paquiOE.interp)}`);
    }

    if (exams.retino) {
      if (lines.length) B();
      T("RETINOGRAFIA");
      const build = (data, label) => {
        const items = Object.entries(RETINO_CATEGORIES).map(([key, cat]) => {
          const opt = cat.options.find((o) => o.id === data[key]);
          return opt ? opt.text() : "";
        });
        const first = items[0].charAt(0).toUpperCase() + items[0].slice(1);
        return `${label}: ${first}, ${items.slice(1).join(", ")}.`;
      };
      L(build(retinoOD, "Olho Direito"));
      L(build(retinoOE, "Olho Esquerdo"));
    }

    if (exams.tono) {
      if (lines.length) B();
      T("TONOMETRIA");
      L(`Olho Direito: ${tonoOD.valor} mmHg`);
      L(`Olho Esquerdo: ${tonoOE.valor} mmHg`);
    }

    if (exams.bio) {
      if (lines.length) B();
      T("BIOMETRIA ULTRASSÔNICA");
      L(`Olho Direito: ${bioText(bioOD.axial.toFixed(2).replace(".", ","), bioOD.dioptria)}`);
      L(`Olho Esquerdo: ${bioText(bioOE.axial.toFixed(2).replace(".", ","), bioOE.dioptria)}`);
    }

    // Build plain text
    const plain = lines.map((l) => l.type === "blank" ? "" : l.content).join("\n");
    // Build HTML
    const html = lines.map((l) => {
      if (l.type === "blank") return "";
      if (l.type === "title") return `<b><u>${l.content}</u></b>`;
      if (!l.content) return "<br>";
      return l.content;
    }).join("<br>");

    setLaudoText(plain);
    setLaudoHtml(html);
  }, [exams, retinaOD, retinaOE, microOD, microOE, topoOD, topoOE, campoOD, campoOE, stereoOD, stereoOE, lacOD, lacOE, octmacOD, octmacOE, octnoOD, octnoOE, paquiOD, paquiOE, retinoOD, retinoOE, tonoOD, tonoOE, bioOD, bioOE]);

  useEffect(() => {
    if (Object.values(exams).some(Boolean)) generateReport();
    else { setLaudoText(""); setLaudoHtml(""); }
  }, [exams, retinaOD, retinaOE, microOD, microOE, topoOD, topoOE, campoOD, campoOE, stereoOD, stereoOE, lacOD, lacOE, octmacOD, octmacOE, octnoOD, octnoOE, paquiOD, paquiOE, retinoOD, retinoOE, tonoOD, tonoOE, bioOD, bioOE, generateReport]);

  const clearAll = () => {
    setExams({ retina: false, micro: false, topo: false, campo: false, stereo: false, lacrimal: false, octmac: false, octno: false, paqui: false, retino: false, tono: false, bio: false });
    setRetinaOD({ ...DEFAULT_RETINA }); setRetinaOE({ ...DEFAULT_RETINA });
    setMicroOD({ ...DEFAULT_MICRO }); setMicroOE({ ...DEFAULT_MICRO });
    setTopoOD("normal"); setTopoOE("normal");
    setCampoOD("normal"); setCampoOE("normal");
    setStereoOD({ ...DEFAULT_STEREO }); setStereoOE({ ...DEFAULT_STEREO });
    setLacOD({ ...DEFAULT_LACRIMAL }); setLacOE({ ...DEFAULT_LACRIMAL });
    setOctmacOD({ ...DEFAULT_OCTMAC }); setOctmacOE({ ...DEFAULT_OCTMAC });
    setOctnoOD({ ...DEFAULT_OCTNO }); setOctnoOE({ ...DEFAULT_OCTNO });
    setPaquiOD({ ...DEFAULT_PAQUI }); setPaquiOE({ ...DEFAULT_PAQUI });
    setRetinoOD({ ...DEFAULT_RETINO }); setRetinoOE({ ...DEFAULT_RETINO });
    setTonoOD({ ...DEFAULT_TONO }); setTonoOE({ ...DEFAULT_TONO });
    setBioOD({ ...DEFAULT_BIO }); setBioOE({ ...DEFAULT_BIO });
    setLaudoText(""); setLaudoHtml(""); setCopied(false);
  };

  const copyText = async () => {
    try {
      const htmlContent = editorRef.current ? editorRef.current.innerHTML : laudoHtml;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const blobPlain = new Blob([laudoText], { type: "text/plain" });
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": blob, "text/plain": blobPlain })
      ]);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {
      try { await navigator.clipboard.writeText(laudoText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
    }
  };

  const anyActive = Object.values(exams).some(Boolean);

  return (
    <div style={S.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{opacity:1;height:24px}
        ::selection{background:#2563eb22}
        input[type="range"]{-webkit-appearance:auto;height:5px;accent-color:#0f172a;cursor:pointer;flex:1}
        select:focus,input:focus{outline:2px solid #93c5fd;outline-offset:1px}
      `}</style>

      {/* HEADER */}
      <div style={S.header}>
        <div style={S.hLeft}>
          <div style={S.logo}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg></div>
          <div><h1 style={S.title}>Gerador de Laudos</h1><p style={S.sub}>Oftalmocenter</p></div>
        </div>
        <button style={S.clearBtn} onClick={clearAll}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          Limpar tudo
        </button>
      </div>

      {/* TOGGLES */}
      <div style={S.toggleRow}>
        {[
          { k: "retina", label: "Map. Retina", c: EC.retina.main },
          { k: "micro", label: "Microsc. Especular", c: EC.micro.main },
          { k: "topo", label: "Topografia", c: EC.topo.main },
          { k: "campo", label: "Campimetria", c: EC.campo.main },
          { k: "stereo", label: "Estereofoto", c: EC.stereo.main },
          { k: "lacrimal", label: "Filme Lacrimal", c: EC.lacrimal.main },
          { k: "octmac", label: "OCT Mácula", c: EC.octmac.main },
          { k: "octno", label: "OCT Nervo Óptico", c: EC.octno.main },
          { k: "paqui", label: "Paquimetria", c: EC.paqui.main },
          { k: "retino", label: "Retinografia", c: EC.retino.main },
          { k: "tono", label: "Tonometria", c: EC.tono.main },
          { k: "bio", label: "Biometria", c: EC.bio.main },
        ].map(({ k, label, c }) => (
          <button key={k} onClick={() => toggle(k)} style={{
            ...S.tog, background: exams[k] ? c : "#f1f5f9", color: exams[k] ? "#fff" : "#475569",
            borderColor: exams[k] ? c : "#e2e8f0", fontWeight: exams[k] ? 600 : 500,
          }}>
            <span style={{ ...S.chk, border: `2px solid ${exams[k] ? "rgba(255,255,255,.5)" : "#cbd5e1"}`, background: exams[k] ? "rgba(255,255,255,.2)" : "#fff" }}>
              {exams[k] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
            </span>{label}
          </button>
        ))}
      </div>

      {/* RETINA */}
      {exams.retina && <EBlock t="Mapeamento de Retina" c={EC.retina} acts={[
        { l: "Exame normal", fn: () => { setRetinaOD({ ...DEFAULT_RETINA }); setRetinaOE({ ...DEFAULT_RETINA }); } },
        { l: "OD → OE", fn: () => setRetinaOE({ ...retinaOD }) },
        { l: "OE → OD", fn: () => setRetinaOD({ ...retinaOE }) },
      ]}><div style={S.eyeRow}><RetinaEye label="OD" data={retinaOD} set={setRetinaOD} /><div style={S.divider} /><RetinaEye label="OE" data={retinaOE} set={setRetinaOE} /></div></EBlock>}

      {/* MICRO */}
      {exams.micro && <EBlock t="Microscopia Especular" c={EC.micro} acts={[
        { l: "Exame normal", fn: () => { setMicroOD({ hex: 39, density: 3010, area: "normal" }); setMicroOE({ hex: 41, density: 2909, area: "normal" }); } },
        { l: "OD → OE", fn: () => setMicroOE({ ...microOD }) },
        { l: "OE → OD", fn: () => setMicroOD({ ...microOE }) },
      ]}><div style={S.eyeRow}><MicroEye label="OD" data={microOD} set={setMicroOD} /><div style={S.divider} /><MicroEye label="OE" data={microOE} set={setMicroOE} /></div></EBlock>}

      {/* TOPOGRAFIA */}
      {exams.topo && <EBlock t="Topografia de Córnea" c={EC.topo} acts={[
        { l: "Exame normal", fn: () => { setTopoOD("normal"); setTopoOE("normal"); } },
        { l: "OD → OE", fn: () => setTopoOE(topoOD) },
        { l: "OE → OD", fn: () => setTopoOD(topoOE) },
      ]}><div style={S.eyeRow}><SelEye label="OD" opts={TOPO_OPTIONS} val={topoOD} set={setTopoOD} /><div style={S.divider} /><SelEye label="OE" opts={TOPO_OPTIONS} val={topoOE} set={setTopoOE} /></div></EBlock>}

      {/* CAMPIMETRIA */}
      {exams.campo && <EBlock t="Campimetria Computadorizada" c={EC.campo} acts={[
        { l: "Exame normal", fn: () => { setCampoOD("normal"); setCampoOE("normal"); } },
        { l: "OD → OE", fn: () => setCampoOE(campoOD) },
        { l: "OE → OD", fn: () => setCampoOD(campoOE) },
      ]}><div style={S.eyeRow}><SelEye label="OD" opts={CAMPO_OPTIONS} val={campoOD} set={setCampoOD} /><div style={S.divider} /><SelEye label="OE" opts={CAMPO_OPTIONS} val={campoOE} set={setCampoOE} /></div></EBlock>}

      {/* ESTEREOFOTO */}
      {exams.stereo && <EBlock t="Estereofoto de Papila" c={EC.stereo} acts={[
        { l: "Exame normal", fn: () => { setStereoOD({ ...DEFAULT_STEREO }); setStereoOE({ ...DEFAULT_STEREO }); } },
        { l: "OD → OE", fn: () => setStereoOE({ ...stereoOD }) },
        { l: "OE → OD", fn: () => setStereoOD({ ...stereoOE }) },
      ]}><div style={S.eyeRow}><StereoEye label="OD" data={stereoOD} set={setStereoOD} /><div style={S.divider} /><StereoEye label="OE" data={stereoOE} set={setStereoOE} /></div></EBlock>}

      {/* FILME LACRIMAL */}
      {exams.lacrimal && <EBlock t="Avaliação do Filme Lacrimal" c={EC.lacrimal} acts={[
        { l: "Exame normal", fn: () => { setLacOD({ ...DEFAULT_LACRIMAL }); setLacOE({ ...DEFAULT_LACRIMAL }); } },
        { l: "OD → OE", fn: () => setLacOE({ ...lacOD }) },
        { l: "OE → OD", fn: () => setLacOD({ ...lacOE }) },
      ]}><div style={S.eyeRow}><LacEye label="OD" data={lacOD} set={setLacOD} /><div style={S.divider} /><LacEye label="OE" data={lacOE} set={setLacOE} /></div></EBlock>}

      {/* OCT MÁCULA */}
      {exams.octmac && <EBlock t="OCT de Mácula" c={EC.octmac} acts={[
        { l: "Exame normal", fn: () => { setOctmacOD({ ...DEFAULT_OCTMAC }); setOctmacOE({ ...DEFAULT_OCTMAC }); } },
        { l: "OD → OE", fn: () => setOctmacOE({ ...octmacOD }) },
        { l: "OE → OD", fn: () => setOctmacOD({ ...octmacOE }) },
      ]}><div style={S.eyeRow}><OctMacEye label="OD" data={octmacOD} set={setOctmacOD} /><div style={S.divider} /><OctMacEye label="OE" data={octmacOE} set={setOctmacOE} /></div></EBlock>}

      {/* OCT NERVO ÓPTICO */}
      {exams.octno && <EBlock t="OCT de Nervo Óptico" c={EC.octno} acts={[
        { l: "Exame normal", fn: () => { setOctnoOD({ ...DEFAULT_OCTNO }); setOctnoOE({ ...DEFAULT_OCTNO }); } },
        { l: "OD → OE", fn: () => setOctnoOE({ ...octnoOD }) },
        { l: "OE → OD", fn: () => setOctnoOD({ ...octnoOE }) },
      ]}><div style={S.eyeRow}><OctNoEye label="OD" data={octnoOD} set={setOctnoOD} /><div style={S.divider} /><OctNoEye label="OE" data={octnoOE} set={setOctnoOE} /></div></EBlock>}

      {/* PAQUIMETRIA */}
      {exams.paqui && <EBlock t="Paquimetria Ultrassônica" c={EC.paqui} acts={[
        { l: "Valores iguais", fn: () => setPaquiOE({ ...paquiOD }) },
        { l: "OD → OE", fn: () => setPaquiOE({ ...paquiOD }) },
        { l: "OE → OD", fn: () => setPaquiOD({ ...paquiOE }) },
      ]}><div style={S.eyeRow}><PaquiEye label="OD" data={paquiOD} set={setPaquiOD} /><div style={S.divider} /><PaquiEye label="OE" data={paquiOE} set={setPaquiOE} /></div></EBlock>}

      {/* RETINOGRAFIA */}
      {exams.retino && <EBlock t="Retinografia" c={EC.retino} acts={[
        { l: "Exame normal", fn: () => { setRetinoOD({ ...DEFAULT_RETINO }); setRetinoOE({ ...DEFAULT_RETINO }); } },
        { l: "OD → OE", fn: () => setRetinoOE({ ...retinoOD }) },
        { l: "OE → OD", fn: () => setRetinoOD({ ...retinoOE }) },
      ]}><div style={S.eyeRow}><RetinografiaEye label="OD" data={retinoOD} set={setRetinoOD} /><div style={S.divider} /><RetinografiaEye label="OE" data={retinoOE} set={setRetinoOE} /></div></EBlock>}

      {/* TONOMETRIA */}
      {exams.tono && <EBlock t="Tonometria" c={EC.tono} acts={[
        { l: "Valores iguais", fn: () => setTonoOE({ ...tonoOD }) },
        { l: "OD → OE", fn: () => setTonoOE({ ...tonoOD }) },
        { l: "OE → OD", fn: () => setTonoOD({ ...tonoOE }) },
      ]}><div style={S.eyeRow}><TonoEye label="OD" data={tonoOD} set={setTonoOD} /><div style={S.divider} /><TonoEye label="OE" data={tonoOE} set={setTonoOE} /></div></EBlock>}

      {/* BIOMETRIA */}
      {exams.bio && <EBlock t="Biometria Ultrassônica" c={EC.bio} acts={[
        { l: "Valores iguais", fn: () => setBioOE({ ...bioOD }) },
        { l: "OD → OE", fn: () => setBioOE({ ...bioOD }) },
        { l: "OE → OD", fn: () => setBioOD({ ...bioOE }) },
      ]}><div style={S.eyeRow}><BioEye label="OD" data={bioOD} set={setBioOD} /><div style={S.divider} /><BioEye label="OE" data={bioOE} set={setBioOE} /></div></EBlock>}

      {/* OUTPUT */}
      {laudoHtml && (
        <div style={S.outBlock}>
          <div style={S.outHead}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Laudo Gerado</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.varBtn} onClick={generateReport}>↻ Variação</button>
              <button style={{ ...S.cpBtn, ...(copied ? { background: "#16a34a" } : {}) }} onClick={copyText}>
                {copied ? "✓ Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: laudoHtml }}
            style={S.ta}
          />
        </div>
      )}

      {!anyActive && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px", textAlign: "center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 12 }}>Selecione os exames acima para iniciar o laudo</p>
        </div>
      )}
    </div>
  );
}

// ===================== SHARED COMPONENTS =====================

function EBlock({ t, c, acts, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: `2px solid ${c.border}`, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: c.main }}>{t}</h2>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {acts.map((a, i) => <button key={i} onClick={a.fn} style={S.qBtn}>{a.l}</button>)}
        </div>
      </div>
      {children}
    </div>
  );
}

function RetinaEye({ label, data, set }) {
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      {Object.entries(RETINA_CATEGORIES).map(([key, cat]) => (
        <div key={key} style={{ marginBottom: 7 }}>
          <div style={S.cLbl}>{cat.label}</div>
          <div style={S.oRow}>
            {cat.options.map((o) => (
              <button key={o.id} onClick={() => set((p) => ({ ...p, [key]: o.id }))}
                style={{ ...S.oBtn, ...(data[key] === o.id ? S.oBtnA : {}) }}>{o.label}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MicroEye({ label, data, set }) {
  const hc = classifyHex(data.hex), dc = classifyDensity(data.density);
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Hexagonalidade <Bdg c={hc === "normal" ? "g" : hc === "limítrofe" ? "y" : "r"} t={hc === "normal" ? "Normal" : hc === "limítrofe" ? "Limítrofe" : "Reduzida"} /></div>
        <div style={S.sRow}><input type="range" min={10} max={70} value={data.hex} onChange={(e) => set((p) => ({ ...p, hex: +e.target.value }))} /><NI v={data.hex} set={(v) => set((p) => ({ ...p, hex: v }))} u="%" mx={100} /></div>
      </div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Densidade endotelial <Bdg c={dc === "normal" ? "g" : dc === "discreta" ? "y" : dc === "baixa" ? "o" : "r"} t={dc === "normal" ? "Normal" : dc === "discreta" ? "Discr. reduzida" : dc === "baixa" ? "Baixa" : "Muito baixa"} /></div>
        <div style={S.sRow}><input type="range" min={500} max={4000} step={10} value={data.density} onChange={(e) => set((p) => ({ ...p, density: +e.target.value }))} /><NI v={data.density} set={(v) => set((p) => ({ ...p, density: v }))} u="cel/mm²" mx={5000} s={10} /></div>
      </div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Área celular</div>
        <div style={S.oRow}>
          {[{ id: "normal", l: "Normal" }, { id: "discreta", l: "Discr. aumentada" }, { id: "aumentada", l: "Aumentada" }].map((o) => (
            <button key={o.id} onClick={() => set((p) => ({ ...p, area: o.id }))} style={{ ...S.oBtn, ...(data.area === o.id ? S.oBtnA : {}) }}>{o.l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelEye({ label, opts, val, set }) {
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {opts.map((o) => (
          <button key={o.id} onClick={() => set(o.id)} style={{ ...S.oBtn, textAlign: "left", width: "100%", ...(val === o.id ? S.oBtnA : {}) }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function StereoEye({ label, data, set }) {
  const EXC = ["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1.0"];
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Padrão</div>
        <div style={S.oRow}>
          {STEREO_OPTIONS.map((o) => (<button key={o.id} onClick={() => set((p) => ({ ...p, tipo: o.id }))} style={{ ...S.oBtn, ...(data.tipo === o.id ? S.oBtnA : {}) }}>{o.label}</button>))}
        </div>
      </div>
      {(data.tipo === "normal" || data.tipo === "aumentada") && (
        <div style={{ marginBottom: 7 }}>
          <div style={S.cLbl}>Escavação (H × V)</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <select value={data.excH} onChange={(e) => set((p) => ({ ...p, excH: e.target.value }))} style={S.sel}>{EXC.map((v) => <option key={v}>{v}</option>)}</select>
            <span style={{ color: "#94a3b8", fontWeight: 700, fontSize: 13 }}>×</span>
            <select value={data.excV} onChange={(e) => set((p) => ({ ...p, excV: e.target.value }))} style={S.sel}>{EXC.map((v) => <option key={v}>{v}</option>)}</select>
          </div>
        </div>
      )}
    </div>
  );
}

function LacEye({ label, data, set }) {
  const sc = classifySchirmer(data.schirmer);
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Schirmer <Bdg c={sc === "normal" ? "g" : sc === "reduzido" ? "y" : "r"} t={sc === "normal" ? "Normal" : sc === "reduzido" ? "Reduzido" : "Muito reduzido"} /></div>
        <div style={S.sRow}><input type="range" min={0} max={35} value={data.schirmer} onChange={(e) => set((p) => ({ ...p, schirmer: +e.target.value }))} /><NI v={data.schirmer} set={(v) => set((p) => ({ ...p, schirmer: v }))} u="mm" mx={50} /></div>
      </div>
      <div>
        <div style={S.cLbl}>Lisamina Verde</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {LISAMINA_OPTIONS.map((o) => (<button key={o.id} onClick={() => set((p) => ({ ...p, lisamina: o.id }))} style={{ ...S.oBtn, textAlign: "left", width: "100%", ...(data.lisamina === o.id ? S.oBtnA : {}) }}>{o.label}</button>))}
        </div>
      </div>
    </div>
  );
}

function OctMacEye({ label, data, set }) {
  const showGrau = ["edema", "membrana"].includes(data.tipo);
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Padrão</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {OCTMAC_OPTIONS.map((o) => (<button key={o.id} onClick={() => set((p) => ({ ...p, tipo: o.id }))} style={{ ...S.oBtn, textAlign: "left", width: "100%", ...(data.tipo === o.id ? S.oBtnA : {}) }}>{o.label}</button>))}
        </div>
      </div>
      {showGrau && (
        <div style={{ marginBottom: 7 }}>
          <div style={S.cLbl}>Intensidade</div>
          <div style={S.oRow}>
            {OCTMAC_GRAU.map((o) => (<button key={o.id} onClick={() => set((p) => ({ ...p, grau: o.id }))} style={{ ...S.oBtn, ...(data.grau === o.id ? S.oBtnA : {}) }}>{o.label}</button>))}
          </div>
        </div>
      )}
    </div>
  );
}

function OctNoEye({ label, data, set }) {
  const showSetores = ["suspeita", "focal"].includes(data.tipo);
  const toggleSetor = (sid) => {
    set((p) => {
      const s = p.setores.includes(sid) ? p.setores.filter((x) => x !== sid) : [...p.setores, sid];
      return { ...p, setores: s };
    });
  };
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Padrão</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {OCTNO_OPTIONS.map((o) => (<button key={o.id} onClick={() => set((p) => ({ ...p, tipo: o.id, setores: [] }))} style={{ ...S.oBtn, textAlign: "left", width: "100%", ...(data.tipo === o.id ? S.oBtnA : {}) }}>{o.label}</button>))}
        </div>
      </div>
      {showSetores && (
        <div style={{ marginBottom: 7 }}>
          <div style={S.cLbl}>Setores (opcional)</div>
          <div style={S.oRow}>
            {OCTNO_SETORES.map((o) => (<button key={o.id} onClick={() => toggleSetor(o.id)} style={{ ...S.oBtn, ...(data.setores.includes(o.id) ? S.oBtnA : {}) }}>{o.label}</button>))}
          </div>
        </div>
      )}
    </div>
  );
}

function PaquiEye({ label, data, set }) {
  const pc = classifyPaqui(data.valor);
  const QUICK = [480, 500, 520, 540, 560, 580, 600];
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Espessura (µm) {data.interp && <Bdg c={pc === "muito_fina" ? "r" : pc === "fina" ? "y" : pc === "habitual" ? "g" : "o"} t={pc === "muito_fina" ? "Muito fina" : pc === "fina" ? "Fina" : pc === "habitual" ? "Habitual" : "Espessa"} />}</div>
        <div style={S.sRow}>
          <input type="range" min={400} max={650} value={data.valor} onChange={(e) => set((p) => ({ ...p, valor: +e.target.value }))} />
          <NI v={data.valor} set={(v) => set((p) => ({ ...p, valor: v }))} u="µm" mx={800} />
        </div>
        <div style={{ ...S.oRow, marginTop: 5 }}>
          {QUICK.map((v) => (<button key={v} onClick={() => set((p) => ({ ...p, valor: v }))} style={{ ...S.oBtn, fontSize: 10, padding: "2px 7px", ...(data.valor === v ? S.oBtnA : {}) }}>{v}</button>))}
        </div>
      </div>
      <div style={{ marginBottom: 4 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11, color: "#475569", fontWeight: 500 }}>
          <input type="checkbox" checked={data.interp} onChange={(e) => set((p) => ({ ...p, interp: e.target.checked }))} style={{ accentColor: "#0f172a" }} />
          Interpretação automática
        </label>
      </div>
    </div>
  );
}

function RetinografiaEye({ label, data, set }) {
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      {Object.entries(RETINO_CATEGORIES).map(([key, cat]) => (
        <div key={key} style={{ marginBottom: 7 }}>
          <div style={S.cLbl}>{cat.label}</div>
          <div style={S.oRow}>
            {cat.options.map((o) => (
              <button key={o.id} onClick={() => set((p) => ({ ...p, [key]: o.id }))}
                style={{ ...S.oBtn, ...(data[key] === o.id ? S.oBtnA : {}) }}>{o.label}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TonoEye({ label, data, set }) {
  const QUICK = [10, 12, 14, 16, 18, 20, 22];
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Pressão (mmHg)</div>
        <div style={S.sRow}>
          <input type="range" min={5} max={50} value={data.valor} onChange={(e) => set((p) => ({ ...p, valor: +e.target.value }))} />
          <NI v={data.valor} set={(v) => set((p) => ({ ...p, valor: v }))} u="mmHg" mx={80} />
        </div>
        <div style={{ ...S.oRow, marginTop: 5 }}>
          {QUICK.map((v) => (<button key={v} onClick={() => set((p) => ({ ...p, valor: v }))} style={{ ...S.oBtn, fontSize: 10, padding: "2px 7px", ...(data.valor === v ? S.oBtnA : {}) }}>{v}</button>))}
        </div>
      </div>
    </div>
  );
}

function BioEye({ label, data, set }) {
  const QUICK_AX = [22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0];
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Comprimento axial (mm)</div>
        <div style={S.sRow}>
          <input type="range" min={20} max={30} step={0.01} value={data.axial} onChange={(e) => set((p) => ({ ...p, axial: +e.target.value }))} />
          <div style={S.niWrap}>
            <input type="number" min={15} max={40} step={0.01} value={data.axial} onChange={(e) => set((p) => ({ ...p, axial: Math.max(15, Math.min(40, parseFloat(e.target.value) || 0)) }))} style={S.ni} />
            <span style={S.niU}>mm</span>
          </div>
        </div>
        <div style={{ ...S.oRow, marginTop: 5 }}>
          {QUICK_AX.map((v) => (<button key={v} onClick={() => set((p) => ({ ...p, axial: v }))} style={{ ...S.oBtn, fontSize: 10, padding: "2px 7px", ...(data.axial === v ? S.oBtnA : {}) }}>{v.toFixed(1)}</button>))}
        </div>
      </div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Dioptria da LIO</div>
        <select value={data.dioptria} onChange={(e) => set((p) => ({ ...p, dioptria: e.target.value }))} style={{ ...S.sel, width: "100%" }}>
          {DIOPTRIAS.map((d) => <option key={d} value={d}>+{d}</option>)}
        </select>
      </div>
    </div>
  );
}

function Bdg({ c, t }) {
  const m = { g: { bg: "#dcfce7", c: "#166534" }, y: { bg: "#fef9c3", c: "#854d0e" }, o: { bg: "#fed7aa", c: "#9a3412" }, r: { bg: "#fee2e2", c: "#991b1b" } };
  const x = m[c] || m.g;
  return <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: x.bg, color: x.c, letterSpacing: 0, textTransform: "none" }}>{t}</span>;
}

function NI({ v, set, u, mx = 9999, s = 1 }) {
  return (
    <div style={S.niWrap}>
      <input type="number" min={0} max={mx} step={s} value={v} onChange={(e) => set(Math.max(0, Math.min(mx, parseInt(e.target.value) || 0)))} style={S.ni} />
      <span style={S.niU}>{u}</span>
    </div>
  );
}

// ===================== STYLES =====================
const S = {
  container: { fontFamily: "'DM Sans',-apple-system,sans-serif", maxWidth: 920, margin: "0 auto", padding: "16px 14px 40px", background: "#f8fafc", minHeight: "100vh" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 },
  hLeft: { display: "flex", alignItems: "center", gap: 10 },
  logo: { width: 38, height: 38, borderRadius: 9, background: "linear-gradient(135deg,#0369a1,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 19, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 },
  sub: { fontSize: 12, color: "#64748b" },
  clearBtn: { display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 7, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  toggleRow: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" },
  tog: { display: "flex", alignItems: "center", padding: "7px 11px", borderRadius: 8, border: "2px solid", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", whiteSpace: "nowrap" },
  chk: { display: "inline-flex", width: 16, height: 16, borderRadius: 4, alignItems: "center", justifyContent: "center", marginRight: 6, flexShrink: 0 },
  eyeRow: { display: "flex", gap: 0, flexWrap: "wrap" },
  eyeP: { flex: 1, minWidth: 240, padding: "0 6px" },
  divider: { width: 1, background: "#e2e8f0", margin: "0 2px", alignSelf: "stretch", flexShrink: 0 },
  eyeL: { fontSize: 11, fontWeight: 700, color: "#334155", background: "#f1f5f9", padding: "3px 9px", borderRadius: 5, marginBottom: 7, display: "inline-block" },
  cLbl: { fontSize: 10, fontWeight: 600, color: "#64748b", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".4px", display: "flex", alignItems: "center", gap: 6 },
  oRow: { display: "flex", gap: 3, flexWrap: "wrap" },
  oBtn: { padding: "4px 9px", borderRadius: 5, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all .12s" },
  oBtnA: { background: "#0f172a", color: "#fff", borderColor: "#0f172a" },
  sRow: { display: "flex", alignItems: "center", gap: 8 },
  niWrap: { display: "flex", alignItems: "center", gap: 2, background: "#f1f5f9", borderRadius: 5, padding: "2px 7px", border: "1px solid #e2e8f0" },
  ni: { width: 46, border: "none", background: "transparent", fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", color: "#0f172a", textAlign: "right", outline: "none" },
  niU: { fontSize: 9, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" },
  sel: { padding: "4px 7px", borderRadius: 5, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", color: "#0f172a", cursor: "pointer" },
  qBtn: { padding: "3px 9px", borderRadius: 5, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#334155", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  outBlock: { background: "#fff", borderRadius: 12, border: "2px solid #0f172a", padding: 14, marginTop: 4 },
  outHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 },
  varBtn: { padding: "5px 11px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  cpBtn: { padding: "5px 13px", borderRadius: 6, border: "none", background: "#0f172a", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" },
  ta: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 7, padding: 10, fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: "#1e293b", lineHeight: 1.6, outline: "none", background: "#fafafa", minHeight: 120, whiteSpace: "pre-wrap", wordWrap: "break-word", overflowY: "auto" },
};
