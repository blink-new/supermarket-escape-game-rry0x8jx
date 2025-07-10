import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { ShoppingCart, Key, Clock, Zap } from 'lucide-react'
import SupermarketGame from './components/SupermarketGame'
import BunkerGame from './components/BunkerGame'

export type GamePhase = 'menu' | 'supermarket' | 'knockout' | 'bunker' | 'escaped'

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu')
  const [collectedItems, setCollectedItems] = useState<string[]>([])
  const [foundKeys, setFoundKeys] = useState<string[]>([])

  const handleItemCollected = (item: string) => {
    const newItems = [...collectedItems, item]
    setCollectedItems(newItems)
    
    // Trigger knockout at 10th item
    if (newItems.length === 10) {
      setTimeout(() => {
        setGamePhase('knockout')
        setTimeout(() => {
          setGamePhase('bunker')
        }, 3000)
      }, 1000)
    }
  }

  const handleKeyFound = (key: string) => {
    const newKeys = [...foundKeys, key]
    setFoundKeys(newKeys)
    
    // Need all 3 keys to escape
    if (newKeys.length === 3) {
      setTimeout(() => {
        setGamePhase('escaped')
      }, 1000)
    }
  }

  const resetGame = () => {
    setGamePhase('menu')
    setCollectedItems([])
    setFoundKeys([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <AnimatePresence mode="wait">
        {gamePhase === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <Card className="w-full max-w-md bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="mx-auto mb-4 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <ShoppingCart className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-white">
                  Supermarket Escape
                </CardTitle>
                <p className="text-slate-300 mt-2">
                  Complete your shopping list, but beware... something sinister awaits at the 10th item.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Phase 1: Collect 10 items</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Zap className="w-4 h-4" />
                    <span>Phase 2: Escape the bunker</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Key className="w-4 h-4" />
                    <span>Find 3 keys to freedom</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setGamePhase('supermarket')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {gamePhase === 'supermarket' && (
          <SupermarketGame 
            onItemCollected={handleItemCollected}
            collectedItems={collectedItems}
          />
        )}

        {gamePhase === 'knockout' && (
          <motion.div
            key="knockout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen p-4 bg-red-900/20"
          >
            <Card className="w-full max-w-md bg-red-900/50 border-red-700">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 1 }}
                  className="text-4xl mb-4"
                >
                  💥
                </motion.div>
                <h2 className="text-2xl font-bold mb-4 text-red-300">
                  KNOCKED OUT!
                </h2>
                <p className="text-red-200">
                  Something struck you from behind as you reached for the 10th item...
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="mt-4 h-2 bg-red-800 rounded-full"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {gamePhase === 'bunker' && (
          <BunkerGame 
            onKeyFound={handleKeyFound}
            foundKeys={foundKeys}
          />
        )}

        {gamePhase === 'escaped' && (
          <motion.div
            key="escaped"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <Card className="w-full max-w-md bg-emerald-900/50 border-emerald-700">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 1 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 text-emerald-300">
                  ESCAPED!
                </h2>
                <p className="text-emerald-200 mb-6">
                  You've successfully escaped the underground bunker! 
                  The Irish countryside welcomes you back to freedom.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Items collected:</span>
                    <Badge variant="secondary">{collectedItems.length}/10</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Keys found:</span>
                    <Badge variant="secondary">{foundKeys.length}/3</Badge>
                  </div>
                </div>
                <Button 
                  onClick={resetGame}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                >
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App