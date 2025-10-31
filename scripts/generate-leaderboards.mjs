#!/usr/bin/env node
/**
 * Script para gerar dados de leaderboard por WEB SCRAPING
 *
 * Este script faz scraping da página do Strava para coletar
 * dados reais dos leaderboards.
 *
 * Como usar:
 * 1. Execute: npm run generate-leaderboards
 * 2. Os dados serão salvos em: public/leaderboards/
 *
 * Configuração:
 * Edite a array `segmentsToScrape` com os IDs dos segmentos
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

// Usar require para pacotes CJS
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public/leaderboards");

// Criar diretório se não existir
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Segmentos a fazer scraping
const segmentsToScrape = [
  { id: "40229658", name: "XCO OFICIAL 100% NA MATA" },
  // Adicione mais segmentos aqui:
  // { id: "123456", name: "Outro Segmento" },
];

async function scrapeLeaderboard(segmentId, segmentName) {
  try {
    console.log(
      `📊 Fazendo scraping do segmento ${segmentId} (${segmentName})...`
    );

    const url = `https://www.strava.com/segments/${segmentId}?filter=overall`;

    // Fazer requisição com headers para simular navegador
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extrair dados da tabela
    const entries = [];
    let rank = 1;

    // Encontrar todas as linhas da tabela de leaderboard
    $("table tbody tr").each((index, element) => {
      if (index >= 10) return; // Limitar a 10 atletas

      const cells = $(element).find("td");

      if (cells.length >= 5) {
        // Estrutura: rank | name | speed | power | time
        const rankCell = cells.eq(0).text().trim();
        const nameCell = cells.eq(1).text().trim();
        const speedCell = cells.eq(2).text().trim();
        const timeCell = cells.eq(4).text().trim(); // Coluna 4 é o tempo

        if (nameCell && timeCell) {
          // Converter tempo (MM:SS) em segundos
          const timeParts = timeCell.split(":");
          let totalSeconds = 0;
          if (timeParts.length === 3) {
            // HH:MM:SS
            totalSeconds =
              parseInt(timeParts[0]) * 3600 +
              parseInt(timeParts[1]) * 60 +
              parseInt(timeParts[2]);
          } else if (timeParts.length === 2) {
            // MM:SS
            totalSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
          }

          // Extrair velocidade numérica (remover "km/h" e vírgula)
          const speedMatch = speedCell.match(/(\d+[.,]\d+)/);
          const speedValue = speedMatch ? speedMatch[1].replace(",", ".") : "0";

          entries.push({
            rank: parseInt(rankCell) || rank,
            athlete_name: nameCell,
            athlete_id: index + 1000, // ID fictício
            distance: 7430, // 7.43 km em metros (do segmento específico)
            moving_time: totalSeconds,
            elapsed_time: totalSeconds + 30, // Aproximado
            start_date: new Date().toISOString(),
            profile_medium: "",
            speed_kmh: speedValue,
          });

          rank++;
        }
      }
    });

    if (entries.length === 0) {
      throw new Error(
        "Nenhum dado encontrado. A estrutura HTML pode ter mudado."
      );
    }

    // Preparar dados para salvar
    const data = {
      segmentId,
      segmentName,
      generatedAt: new Date().toISOString(),
      lastUpdateAt: new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      entries,
      entryCount: entries.length,
      sourceUrl: `https://www.strava.com/segments/${segmentId}`,
      note: "✅ Dados coletados por web scraping - Strava",
    };

    // Salvar JSON
    const fileName = `segment-${segmentId}.json`;
    const filePath = path.join(publicDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    console.log(`✅ Salvo: public/leaderboards/${fileName}`);
    console.log(`   Segmento: ${segmentName}`);
    console.log(`   Atletas: ${entries.length}`);
    console.log(`   Atualizado em: ${data.lastUpdateAt}`);

    return { success: true, fileName, entries: entries.length };
  } catch (error) {
    console.error(`❌ Erro ao fazer scraping ${segmentId}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function generateAllLeaderboards() {
  console.log("🚀 Iniciando coleta de dados por WEB SCRAPING...\n");

  if (segmentsToScrape.length === 0) {
    console.log("❌ Nenhum segmento configurado para scraping.");
    console.log(
      "Edite o arquivo scripts/generate-leaderboards.mjs e adicione IDs de segmentos.\n"
    );
    console.log("Exemplo:");
    console.log("const segmentsToScrape = [");
    console.log("  { id: '40229658', name: 'XCO OFICIAL 100% NA MATA' },");
    console.log("];\n");
    return;
  }

  const results = [];

  for (const segment of segmentsToScrape) {
    const result = await scrapeLeaderboard(segment.id, segment.name);
    results.push(result);

    // Aguardar um pouco entre requisições para não sobrecarregar
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log("\n" + "=".repeat(60));
  console.log("📈 Resumo da Coleta");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const totalAthletes = results
    .filter((r) => r.success)
    .reduce((sum, r) => sum + r.entries, 0);

  console.log(`✅ Sucessos: ${successful}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log(`👥 Total de atletas: ${totalAthletes}`);
  console.log("\n📁 Arquivos gerados em: public/leaderboards/");
  console.log("🌐 Dados coletados de: www.strava.com");
  console.log("📅 Cada arquivo contém timestamp da última atualização\n");
}

// Executar
generateAllLeaderboards().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
