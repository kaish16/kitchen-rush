import { useState } from 'react';
import type { GamePhase, KitchenRushStats } from './game/types';
import { StartScreen } from './game/StartScreen';
import { IntroScene } from './game/IntroScene';
import { GameScreen } from './game/GameScreen';
import { ResultsScreen } from './game/ResultsScreen';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [shiftNumber, setShiftNumber] = useState<number>(1);
  const [latestStats, setLatestStats] = useState<KitchenRushStats>({
    shiftNumber: 1,
    money: 0,
    ordersServed: 0,
    ordersFailed: 0,
    riddlesSolved: 0,
    conveyorGrabs: 0,
    maxFlow: 1,
    timeSurvived: 120,
    xpEarned: 0,
  });

  const handleStartGame = () => {
    setPhase('intro');
  };

  const handleIntroComplete = () => {
    setPhase('playing');
  };

  const handleShiftComplete = (stats: KitchenRushStats) => {
    setLatestStats(stats);
    setPhase('results');
  };

  const handleNextShift = () => {
    setShiftNumber((s) => s + 1);
    setPhase('intro');
  };

  const handleRestart = () => {
    setPhase('intro');
  };

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-black select-none"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {phase === 'start' && (
        <StartScreen onStart={handleStartGame} shiftNumber={shiftNumber} />
      )}

      {phase === 'intro' && (
        <IntroScene onComplete={handleIntroComplete} shiftNumber={shiftNumber} />
      )}

      {phase === 'playing' && (
        <GameScreen
          key={`shift-${shiftNumber}`}
          shiftNumber={shiftNumber}
          onShiftComplete={handleShiftComplete}
        />
      )}

      {phase === 'results' && (
        <ResultsScreen
          stats={latestStats}
          onNextShift={handleNextShift}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
