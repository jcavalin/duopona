// The Duopona mascot (feature 012, docs/design/mascot.md). Decorative: the prompt text and the
// feedback sheet carry the meaning, so it is hidden from assistive technology.
import celebrate from '../assets/mascot/mascot-celebrate.svg'
import happy from '../assets/mascot/mascot-happy.svg'
import idle from '../assets/mascot/mascot-idle.svg'
import sad from '../assets/mascot/mascot-sad.svg'

export type MascotExpression = 'idle' | 'sad' | 'happy' | 'celebrate'

const urls: Record<MascotExpression, string> = { idle, sad, happy, celebrate }

/** Exercise expression from the answer result: idle before Check, then sad or happy */
export function exerciseExpression(result?: 'correct' | 'wrong'): MascotExpression {
  return result === 'wrong' ? 'sad' : result === 'correct' ? 'happy' : 'idle'
}

export default function Mascot({ expression, className }: { expression: MascotExpression; className?: string }) {
  return (
    <img
      src={urls[expression]}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
      data-expression={expression}
    />
  )
}
