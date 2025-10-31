"use client";

import { useEffect, useState } from "react";

interface Athlete {
  athlete_name: string;
  athlete_id: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  rank: number;
  profile_medium?: string;
  profile?: string;
  speed_kmh?: string;
}

interface LeaderboardData {
  entries: Athlete[];
  entry_count: number;
  segmentId: string;
  segmentName: string;
  generatedAt: string;
}

interface SegmentLeaderboardProps {
  segmentId: string;
  segmentName?: string;
}

export default function SegmentLeaderboard({
  segmentId,
  segmentName = "Segmento",
}: SegmentLeaderboardProps) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const jsonUrl = `/leaderboards/segment-${segmentId}.json`;

        const response = await fetch(jsonUrl);

        if (!response.ok) {
          throw new Error(
            "Segmento não encontrado. Verifique o ID e tente novamente."
          );
        }

        const data: LeaderboardData = await response.json();
        setAthletes(data.entries || []);
        setGeneratedAt(data.generatedAt);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar leaderboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [segmentId]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatGeneratedDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data desconhecida";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">❌ {error}</p>
        <p className="text-red-700 text-sm mt-2">
          💡 Dica: Execute{" "}
          <code className="bg-white px-2 py-1 rounded">
            npm run generate-leaderboards
          </code>{" "}
          para gerar os dados.
        </p>
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">Nenhum atleta encontrado</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Segmento: {segmentName}
        </h2>
        {generatedAt && (
          <p className="text-xs text-gray-500">
            Dados atualizados em: {formatGeneratedDate(generatedAt)}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Posição
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Nome
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                Velocidade
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                Tempo
              </th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete, index) => (
              <tr
                key={`${athlete.athlete_id}-${index}`}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {athlete.rank}
                </td>
                <td className="px-4 py-3 text-left text-sm text-gray-900">
                  {athlete.athlete_name}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">
                  {athlete.speed_kmh || "N/A"} km/h
                </td>
                <td className="px-4 py-3 text-right text-sm text-blue-600 font-medium">
                  {formatTime(athlete.moving_time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
