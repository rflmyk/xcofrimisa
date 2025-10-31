"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SegmentLeaderboard from "../components/SegmentLeaderboard";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const segmentId = searchParams.get("segmentId") || "40229658"; // Default segment
  const segmentName =
    searchParams.get("segmentName") || "XCO OFICIAL 100% NA MATA";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 border-b-2 border-gray-200 pb-6">
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
            </div>
          </div>
        </div>

        {/* Sempre mostrar o leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SegmentLeaderboard segmentId={segmentId} segmentName={segmentName} />
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
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
