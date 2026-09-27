import { useGame } from './game/engine';
import { StartScreen } from './game/StartScreen';
import { GameScreen } from './game/GameScreen';
import { ResultsScreen } from './game/ResultsScreen';

export default function App() {
  const game = useGame();
  const { state, start, reset } = game;

  return (
    <div className="w-screen h-screen overflow-hidden bg-black select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {state.phase === 'start' && <StartScreen onStart={start} />}
      {state.phase === 'playing' && <GameScreen state={state} actions={game} />}
      {state.phase === 'results' && <ResultsScreen stats={state.stats} onRestart={reset} />}
    </div>
  );
}
