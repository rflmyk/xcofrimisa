"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SegmentLeaderboard from "./components/SegmentLeaderboard";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const segmentId = searchParams.get("segmentId") || "40229658"; // Default segment
  const segmentName =
    searchParams.get("segmentName") || "XCO OFICIAL 100% NA MATA";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex flex-col">
      <div className="max-w-4xl mx-auto flex-1 w-full">
        <div className="mb-6 border-b-2 border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/imgs/favicons/apple-touch-icon.png"
                alt="XCO Frimisa Logo"
                width={64}
                height={64}
                className="rounded-lg cursor-pointer"
              />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                XCO Frimisa - Leaderboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Confira os 10 melhores atletas nos segmentos do Strava
              </p>
              <p className="text-sm text-gray-500 mt-2">
                🚴 Mountain Bike • 🏃 Corrida • 🚶 Caminhada — Conheça os
                melhores tempos nas trilhas do XCO Frimisa
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <div className="mb-8">
          <a
            href="https://chat.whatsapp.com/K7KaB6F6KxXJGqaGZPtF8M"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            💬 XCO Frimisa no whatsapp
          </a>
        </div>

        {/* Sempre mostrar o leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SegmentLeaderboard segmentId={segmentId} segmentName={segmentName} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 w-full">
        <div className="max-w-4xl mx-auto">
          <footer className="flex gap-6 flex-wrap items-center justify-center py-6 border-t border-gray-200">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-900 transition-colors"
              href="https://mayr.ink?utm_source=xcofrimisa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="./imgs/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
              />
              Mayr.ink →
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <LeaderboardContent />
    </Suspense>
  );
}
