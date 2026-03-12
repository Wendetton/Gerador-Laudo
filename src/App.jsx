import { useState, useCallback, useEffect } from "react";

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
    case "normal": return pick([
      "Exame topográfico evidenciando córnea com padrão regular, apresentando distribuição simétrica do poder dióptrico. Curvaturas corneanas anteriores centrais dentro dos limites da normalidade, sem assimetrias inferiores/superiores relevantes, encurvamento localizado ou irregularidades compatíveis com ectasia. Índices topográficos analisados sem alterações significativas.",
      "Topografia corneana com padrão regular e distribuição simétrica das curvaturas. Não se observam assimetrias relevantes, encurvamentos localizados ou sinais sugestivos de ectasia. Índices topográficos dentro dos parâmetros normais.",
      "Exame topográfico demonstrando córnea de padrão regular, com curvaturas anteriores centrais dentro da normalidade e distribuição simétrica do poder dióptrico. Sem irregularidades ou achados sugestivos de ectasia. Índices topográficos sem alterações dignas de nota.",
    ]);
    case "favor": return pick([
      "Exame topográfico evidenciando padrão regular, com astigmatismo corneano regular a favor da regra, caracterizado por maior curvatura no meridiano vertical e distribuição simétrica do poder dióptrico. Não se observam sinais de irregularidade corneana ou achados sugestivos de ectasia.",
      "Topografia corneana com padrão de astigmatismo regular a favor da regra, com meridiano mais curvo no eixo vertical. Distribuição simétrica do poder dióptrico, sem sinais de ectasia ou irregularidades topográficas.",
      "Exame topográfico demonstrando astigmatismo corneano regular a favor da regra, com curvatura predominante no meridiano vertical e padrão dióptrico simétrico. Ausência de achados sugestivos de ectasia.",
    ]);
    case "contra": return pick([
      "Exame topográfico evidenciando padrão regular, com astigmatismo corneano regular contra a regra, caracterizado por maior curvatura no meridiano horizontal e distribuição simétrica do poder dióptrico. Ausência de irregularidades topográficas sugestivas de ectasia.",
      "Topografia corneana com padrão de astigmatismo regular contra a regra, com meridiano mais curvo no eixo horizontal. Distribuição simétrica do poder dióptrico, sem achados de irregularidade ou ectasia.",
      "Exame topográfico demonstrando astigmatismo corneano regular contra a regra, com curvatura predominante no meridiano horizontal e simetria dióptrica preservada. Sem sinais sugestivos de ectasia.",
    ]);
    case "irregular": return pick([
      "Exame topográfico evidenciando córnea com padrão assimétrico e distribuição irregular do poder dióptrico, compatível com astigmatismo corneano irregular. Observam-se irregularidades de curvatura que tornam o padrão topográfico não uniforme.",
      "Topografia corneana com padrão irregular, apresentando distribuição assimétrica do poder dióptrico e irregularidades de curvatura compatíveis com astigmatismo corneano irregular.",
      "Exame topográfico demonstrando padrão assimétrico de curvatura corneana, com distribuição irregular do poder dióptrico, compatível com astigmatismo irregular.",
    ]);
    case "obliquo": return pick([
      "Exame topográfico evidenciando astigmatismo corneano regular oblíquo, com principais meridianos deslocados dos eixos vertical e horizontal usuais, mantendo padrão topográfico regular. Não há sinais evidentes de ectasia corneana.",
      "Topografia corneana com astigmatismo regular oblíquo, apresentando meridianos principais fora dos eixos habituais, porém com padrão topográfico regular preservado. Sem achados de ectasia.",
      "Exame topográfico demonstrando astigmatismo corneano oblíquo, com meridianos deslocados dos eixos convencionais, mantendo regularidade do padrão topográfico. Ausência de sinais de ectasia.",
    ]);
    case "ectasia": return pick([
      "Exame topográfico evidenciando assimetria corneana significativa, com encurvamento localizado e irregularidades compatíveis com ectasia corneana. Observam-se alterações topográficas sugestivas de afinamento/encurvamento anômalo, devendo os achados ser correlacionados com a avaliação clínica e demais exames complementares.",
      "Topografia corneana evidenciando encurvamento localizado e assimetria significativa, com achados compatíveis com ectasia corneana. Recomenda-se correlação com dados clínicos e exames complementares.",
      "Exame topográfico demonstrando irregularidades e encurvamento localizado sugestivos de ectasia corneana, com assimetria significativa do padrão topográfico. Achados devem ser correlacionados com avaliação clínica.",
    ]);
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
    case "normal": return pick([
      "Campimetria computadorizada sem alterações significativas, dentro dos limites da normalidade. Índices de confiabilidade e parâmetros globais sem alterações relevantes.",
      "Campimetria computadorizada dentro dos limites da normalidade, sem defeitos campimétricos significativos. Índices de confiabilidade adequados e parâmetros globais preservados.",
      "Exame campimétrico computadorizado sem achados dignos de nota, com campo visual dentro dos parâmetros normais. Índices globais e de confiabilidade sem alterações.",
    ]);
    case "suspeita": return pick([
      "Campimetria computadorizada evidenciando alterações discretas, com defeitos localizados/sutis que levantam suspeita de comprometimento glaucomatoso, devendo os achados ser correlacionados com exame clínico e avaliação estrutural do nervo óptico. Índices com alterações leves.",
      "Campimetria computadorizada com defeitos sutis e localizados, sugestivos de possível comprometimento glaucomatoso. Recomenda-se correlação com avaliação clínica e estrutural do nervo óptico. Índices discretamente alterados.",
      "Exame campimétrico evidenciando alterações discretas e localizadas, com achados que levantam suspeita de dano glaucomatoso inicial. Correlação clínica e estrutural recomendada. Índices com leves alterações.",
    ]);
    case "inicial": return pick([
      "Campimetria computadorizada evidenciando defeitos compatíveis com dano glaucomatoso inicial, com alterações localizadas do campo visual e comprometimento leve dos índices analisados.",
      "Campimetria computadorizada com defeitos localizados do campo visual compatíveis com glaucoma inicial. Índices analisados com comprometimento leve.",
      "Exame campimétrico demonstrando alterações localizadas do campo visual, compatíveis com dano glaucomatoso em estágio inicial. Comprometimento discreto dos índices globais.",
    ]);
    case "avancado": return pick([
      "Campimetria computadorizada evidenciando defeitos extensos e significativos do campo visual, compatíveis com dano glaucomatoso avançado, com importante comprometimento dos índices globais.",
      "Campimetria computadorizada com defeitos extensos e marcantes do campo visual, indicativos de dano glaucomatoso avançado. Índices globais significativamente comprometidos.",
      "Exame campimétrico demonstrando comprometimento extenso do campo visual, com defeitos significativos compatíveis com glaucoma avançado. Importante alteração dos índices globais.",
    ]);
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
    case "normal": return pick([
      `Disco óptico com contornos nítidos, regulares e fisiológicos, coloração preservada, apresentando escavação medindo ${exc}, sem notchings ou afilamentos de rima.`,
      `Disco óptico de aspecto fisiológico, contornos nítidos e regulares, coloração normal, com escavação de ${exc}. Sem notchings ou afilamentos da rima neural.`,
      `Disco óptico com contornos regulares e nítidos, coloração preservada, escavação de ${exc}, sem sinais de afilamento de rima ou notchings.`,
    ]);
    case "atrofia": return pick([
      "Disco óptico apresentando sinais de atrofia, com alteração de coloração e aspecto compatível com perda tecidual/neurorretiniana, devendo o achado ser correlacionado com contexto clínico e funcional.",
      "Disco óptico com sinais de atrofia e alteração da coloração, compatível com perda neurorretiniana. Correlação clínica e funcional recomendada.",
      "Disco óptico evidenciando aspecto atrófico, com palidez e alteração de coloração sugestivas de perda tecidual. Recomenda-se correlação com dados clínicos e funcionais.",
    ]);
    case "aumentada": return pick([
      `Disco óptico com aumento da escavação papilar (${exc}), observando-se relação escavação/disco ampliada em comparação ao padrão fisiológico, sem prejuízo de correlação com demais dados clínicos e estruturais.`,
      `Disco óptico com escavação ampliada (${exc}), relação escavação/disco acima do padrão fisiológico. Recomenda-se correlação com dados clínicos e exames estruturais.`,
      `Disco óptico apresentando escavação aumentada (${exc}), com relação escavação/disco ampliada. Achado deve ser correlacionado com avaliação clínica e estrutural.`,
    ]);
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

// ===================== EXAM COLORS =====================
const EC = {
  retina: { main: "#0369a1", border: "#bae6fd" },
  micro: { main: "#7c3aed", border: "#ddd6fe" },
  topo: { main: "#0d9488", border: "#99f6e4" },
  campo: { main: "#b45309", border: "#fde68a" },
  stereo: { main: "#be185d", border: "#fbcfe8" },
  lacrimal: { main: "#4338ca", border: "#c7d2fe" },
};

// ===================== MAIN COMPONENT =====================
export default function LaudoOftalmologico() {
  const [exams, setExams] = useState({ retina: false, micro: false, topo: false, campo: false, stereo: false, lacrimal: false });
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

  const [laudoText, setLaudoText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateReport = useCallback(() => {
    const parts = [];

    if (exams.retina) {
      parts.push("MAPEAMENTO DE RETINA\n");
      const build = (data, label) => {
        const items = Object.entries(RETINA_CATEGORIES).map(([key, cat]) => {
          const opt = cat.options.find((o) => o.id === data[key]);
          return opt ? opt.text() : "";
        });
        const first = items[0].charAt(0).toUpperCase() + items[0].slice(1);
        return `${label}: ${first}, ${items.slice(1).join(", ")}.`;
      };
      parts.push(build(retinaOD, "Olho Direito"));
      parts.push(build(retinaOE, "Olho Esquerdo"));
    }

    if (exams.micro) {
      if (parts.length) parts.push("");
      parts.push("MICROSCOPIA ESPECULAR\n");
      const build = (d, l) => `${l}: ${hexText(d.hex)} ${densityText(d.density)} ${areaText(d.area)}`;
      parts.push(build(microOD, "Olho Direito"));
      parts.push(build(microOE, "Olho Esquerdo"));
    }

    if (exams.topo) {
      if (parts.length) parts.push("");
      parts.push("TOPOGRAFIA DE CÓRNEA\n");
      parts.push(`Técnica: ${TOPO_TECNICA()}\n`);
      parts.push(`Olho Direito: ${topoText(topoOD)}`);
      parts.push(`Olho Esquerdo: ${topoText(topoOE)}`);
    }

    if (exams.campo) {
      if (parts.length) parts.push("");
      parts.push("CAMPIMETRIA COMPUTADORIZADA\n");
      parts.push(`Olho Direito: ${campoText(campoOD)}`);
      parts.push(`Olho Esquerdo: ${campoText(campoOE)}`);
    }

    if (exams.stereo) {
      if (parts.length) parts.push("");
      parts.push("ESTEREOFOTO DE PAPILA\n");
      parts.push(`Olho Direito: ${stereoText(stereoOD.tipo, stereoOD.excH, stereoOD.excV)}`);
      parts.push(`Olho Esquerdo: ${stereoText(stereoOE.tipo, stereoOE.excH, stereoOE.excV)}`);
    }

    if (exams.lacrimal) {
      if (parts.length) parts.push("");
      parts.push("AVALIAÇÃO DO FILME LACRIMAL\n");
      const sOD = lacOD.schirmer, sOE = lacOE.schirmer;
      const cOD = classifySchirmer(sOD), cOE = classifySchirmer(sOE);
      let schTxt = "Teste de Schirmer:\n";
      if (cOD === "normal" && cOE === "normal") {
        schTxt += pick([
          `Olho Direito: ${sOD} mm; Olho Esquerdo: ${sOE} mm — valores dentro de faixa preservada para produção lacrimal.`,
          `Olho Direito: ${sOD} mm; Olho Esquerdo: ${sOE} mm — produção lacrimal dentro dos parâmetros normais.`,
          `Olho Direito: ${sOD} mm; Olho Esquerdo: ${sOE} mm — valores compatíveis com produção lacrimal adequada.`,
        ]);
      } else if (cOD === "muito_reduzido" || cOE === "muito_reduzido") {
        schTxt += pick([
          `Teste de Schirmer evidenciando acentuada redução da produção lacrimal, com medida de ${sOD} mm no olho direito e ${sOE} mm no olho esquerdo.`,
          `Acentuada redução da produção lacrimal ao teste de Schirmer: ${sOD} mm (OD) e ${sOE} mm (OE).`,
        ]);
      } else {
        schTxt += pick([
          `Teste de Schirmer evidenciando redução da produção lacrimal, com medida de ${sOD} mm no olho direito e ${sOE} mm no olho esquerdo.`,
          `Redução da produção lacrimal ao teste de Schirmer: ${sOD} mm (OD) e ${sOE} mm (OE).`,
        ]);
      }
      parts.push(schTxt);
      parts.push("\nTeste da Lisamina Verde:");
      parts.push(`Olho Direito: ${lisaminaText(lacOD.lisamina)}`);
      parts.push(`Olho Esquerdo: ${lisaminaText(lacOE.lisamina)}`);
    }

    setLaudoText(parts.join("\n"));
  }, [exams, retinaOD, retinaOE, microOD, microOE, topoOD, topoOE, campoOD, campoOE, stereoOD, stereoOE, lacOD, lacOE]);

  useEffect(() => {
    if (Object.values(exams).some(Boolean)) generateReport();
    else setLaudoText("");
  }, [exams, retinaOD, retinaOE, microOD, microOE, topoOD, topoOE, campoOD, campoOE, stereoOD, stereoOE, lacOD, lacOE, generateReport]);

  const clearAll = () => {
    setExams({ retina: false, micro: false, topo: false, campo: false, stereo: false, lacrimal: false });
    setRetinaOD({ ...DEFAULT_RETINA }); setRetinaOE({ ...DEFAULT_RETINA });
    setMicroOD({ ...DEFAULT_MICRO }); setMicroOE({ ...DEFAULT_MICRO });
    setTopoOD("normal"); setTopoOE("normal");
    setCampoOD("normal"); setCampoOE("normal");
    setStereoOD({ ...DEFAULT_STEREO }); setStereoOE({ ...DEFAULT_STEREO });
    setLacOD({ ...DEFAULT_LACRIMAL }); setLacOE({ ...DEFAULT_LACRIMAL });
    setLaudoText(""); setCopied(false);
  };

  const copyText = async () => {
    try { await navigator.clipboard.writeText(laudoText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
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
      ]}>
        <div style={S.eyeRow}>
          <RetinaEye label="OD" data={retinaOD} set={setRetinaOD} />
          <div style={S.divider} />
          <RetinaEye label="OE" data={retinaOE} set={setRetinaOE} />
        </div>
      </EBlock>}

      {/* MICRO */}
      {exams.micro && <EBlock t="Microscopia Especular" c={EC.micro} acts={[
        { l: "Exame normal", fn: () => { setMicroOD({ hex: 39, density: 3010, area: "normal" }); setMicroOE({ hex: 41, density: 2909, area: "normal" }); } },
        { l: "OD → OE", fn: () => setMicroOE({ ...microOD }) },
        { l: "OE → OD", fn: () => setMicroOD({ ...microOE }) },
      ]}>
        <div style={S.eyeRow}>
          <MicroEye label="OD" data={microOD} set={setMicroOD} />
          <div style={S.divider} />
          <MicroEye label="OE" data={microOE} set={setMicroOE} />
        </div>
      </EBlock>}

      {/* TOPOGRAFIA */}
      {exams.topo && <EBlock t="Topografia de Córnea" c={EC.topo} acts={[
        { l: "Exame normal", fn: () => { setTopoOD("normal"); setTopoOE("normal"); } },
        { l: "OD → OE", fn: () => setTopoOE(topoOD) },
        { l: "OE → OD", fn: () => setTopoOD(topoOE) },
      ]}>
        <div style={S.eyeRow}>
          <SelEye label="OD" opts={TOPO_OPTIONS} val={topoOD} set={setTopoOD} />
          <div style={S.divider} />
          <SelEye label="OE" opts={TOPO_OPTIONS} val={topoOE} set={setTopoOE} />
        </div>
      </EBlock>}

      {/* CAMPIMETRIA */}
      {exams.campo && <EBlock t="Campimetria Computadorizada" c={EC.campo} acts={[
        { l: "Exame normal", fn: () => { setCampoOD("normal"); setCampoOE("normal"); } },
        { l: "OD → OE", fn: () => setCampoOE(campoOD) },
        { l: "OE → OD", fn: () => setCampoOD(campoOE) },
      ]}>
        <div style={S.eyeRow}>
          <SelEye label="OD" opts={CAMPO_OPTIONS} val={campoOD} set={setCampoOD} />
          <div style={S.divider} />
          <SelEye label="OE" opts={CAMPO_OPTIONS} val={campoOE} set={setCampoOE} />
        </div>
      </EBlock>}

      {/* ESTEREOFOTO */}
      {exams.stereo && <EBlock t="Estereofoto de Papila" c={EC.stereo} acts={[
        { l: "Exame normal", fn: () => { setStereoOD({ ...DEFAULT_STEREO }); setStereoOE({ ...DEFAULT_STEREO }); } },
        { l: "OD → OE", fn: () => setStereoOE({ ...stereoOD }) },
        { l: "OE → OD", fn: () => setStereoOD({ ...stereoOE }) },
      ]}>
        <div style={S.eyeRow}>
          <StereoEye label="OD" data={stereoOD} set={setStereoOD} />
          <div style={S.divider} />
          <StereoEye label="OE" data={stereoOE} set={setStereoOE} />
        </div>
      </EBlock>}

      {/* FILME LACRIMAL */}
      {exams.lacrimal && <EBlock t="Avaliação do Filme Lacrimal" c={EC.lacrimal} acts={[
        { l: "Exame normal", fn: () => { setLacOD({ ...DEFAULT_LACRIMAL }); setLacOE({ ...DEFAULT_LACRIMAL }); } },
        { l: "OD → OE", fn: () => setLacOE({ ...lacOD }) },
        { l: "OE → OD", fn: () => setLacOD({ ...lacOE }) },
      ]}>
        <div style={S.eyeRow}>
          <LacEye label="OD" data={lacOD} set={setLacOD} />
          <div style={S.divider} />
          <LacEye label="OE" data={lacOE} set={setLacOE} />
        </div>
      </EBlock>}

      {/* OUTPUT */}
      {laudoText && (
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
          <textarea style={S.ta} value={laudoText} onChange={(e) => setLaudoText(e.target.value)}
            rows={Math.max(8, laudoText.split("\n").length + 2)} />
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
        <div style={S.sRow}>
          <input type="range" min={10} max={70} value={data.hex} onChange={(e) => set((p) => ({ ...p, hex: +e.target.value }))} />
          <NI v={data.hex} set={(v) => set((p) => ({ ...p, hex: v }))} u="%" mx={100} />
        </div>
      </div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Densidade endotelial <Bdg c={dc === "normal" ? "g" : dc === "discreta" ? "y" : dc === "baixa" ? "o" : "r"} t={dc === "normal" ? "Normal" : dc === "discreta" ? "Discr. reduzida" : dc === "baixa" ? "Baixa" : "Muito baixa"} /></div>
        <div style={S.sRow}>
          <input type="range" min={500} max={4000} step={10} value={data.density} onChange={(e) => set((p) => ({ ...p, density: +e.target.value }))} />
          <NI v={data.density} set={(v) => set((p) => ({ ...p, density: v }))} u="cel/mm²" mx={5000} s={10} />
        </div>
      </div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Área celular</div>
        <div style={S.oRow}>
          {[{ id: "normal", l: "Normal" }, { id: "discreta", l: "Discr. aumentada" }, { id: "aumentada", l: "Aumentada" }].map((o) => (
            <button key={o.id} onClick={() => set((p) => ({ ...p, area: o.id }))}
              style={{ ...S.oBtn, ...(data.area === o.id ? S.oBtnA : {}) }}>{o.l}</button>
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
          <button key={o.id} onClick={() => set(o.id)}
            style={{ ...S.oBtn, textAlign: "left", width: "100%", ...(val === o.id ? S.oBtnA : {}) }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function StereoEye({ label, data, set }) {
  const EXC_VALS = ["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1.0"];
  return (
    <div style={S.eyeP}>
      <div style={S.eyeL}>{label}</div>
      <div style={{ marginBottom: 7 }}>
        <div style={S.cLbl}>Padrão</div>
        <div style={S.oRow}>
          {STEREO_OPTIONS.map((o) => (
            <button key={o.id} onClick={() => set((p) => ({ ...p, tipo: o.id }))}
              style={{ ...S.oBtn, ...(data.tipo === o.id ? S.oBtnA : {}) }}>{o.label}</button>
          ))}
        </div>
      </div>
      {(data.tipo === "normal" || data.tipo === "aumentada") && (
        <div style={{ marginBottom: 7 }}>
          <div style={S.cLbl}>Escavação (H × V)</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <select value={data.excH} onChange={(e) => set((p) => ({ ...p, excH: e.target.value }))} style={S.sel}>
              {EXC_VALS.map((v) => <option key={v}>{v}</option>)}
            </select>
            <span style={{ color: "#94a3b8", fontWeight: 700, fontSize: 13 }}>×</span>
            <select value={data.excV} onChange={(e) => set((p) => ({ ...p, excV: e.target.value }))} style={S.sel}>
              {EXC_VALS.map((v) => <option key={v}>{v}</option>)}
            </select>
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
        <div style={S.sRow}>
          <input type="range" min={0} max={35} value={data.schirmer} onChange={(e) => set((p) => ({ ...p, schirmer: +e.target.value }))} />
          <NI v={data.schirmer} set={(v) => set((p) => ({ ...p, schirmer: v }))} u="mm" mx={50} />
        </div>
      </div>
      <div>
        <div style={S.cLbl}>Lisamina Verde</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {LISAMINA_OPTIONS.map((o) => (
            <button key={o.id} onClick={() => set((p) => ({ ...p, lisamina: o.id }))}
              style={{ ...S.oBtn, textAlign: "left", width: "100%", ...(data.lisamina === o.id ? S.oBtnA : {}) }}>{o.label}</button>
          ))}
        </div>
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
      <input type="number" min={0} max={mx} step={s} value={v}
        onChange={(e) => set(Math.max(0, Math.min(mx, parseInt(e.target.value) || 0)))} style={S.ni} />
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
  ta: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 7, padding: 10, fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: "#1e293b", lineHeight: 1.6, resize: "vertical", outline: "none", background: "#fafafa" },
};
