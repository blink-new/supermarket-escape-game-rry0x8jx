import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Key, MapPin, Search, Lock, Lightbulb } from 'lucide-react'

interface BunkerGameProps {
  onKeyFound: (key: string) => void
  foundKeys: string[]
}

const BUNKER_ROOMS = [
  {
    id: 'cell',
    name: 'Prison Cell',
    emoji: '🔒',
    description: 'A dank stone cell with iron bars. You wake up here.',
    items: ['torch', 'note'],
    key: null,
    color: 'bg-slate-600'
  },
  {
    id: 'corridor',
    name: 'Stone Corridor',
    emoji: '🌫️',
    description: 'A long corridor with flickering torches on the walls.',
    items: ['rope', 'coin'],
    key: null,
    color: 'bg-stone-600'
  },
  {
    id: 'armory',
    name: 'Old Armory',
    emoji: '⚔️',
    description: 'Rusty weapons and armor hang from the walls.',
    items: ['shield', 'sword'],
    key: 'brass-key',
    color: 'bg-amber-600'
  },
  {
    id: 'library',
    name: 'Dusty Library',
    emoji: '📚',
    description: 'Ancient books and scrolls line the shelves.',
    items: ['map', 'book'],
    key: 'silver-key',
    color: 'bg-purple-600'
  },
  {
    id: 'storage',
    name: 'Storage Room',
    emoji: '📦',
    description: 'Wooden crates and barrels fill this room.',
    items: ['bottle', 'blanket'],
    key: 'iron-key',
    color: 'bg-green-600'
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    emoji: '🍳',
    description: 'An old kitchen with a large stone hearth.',
    items: ['pot', 'bread'],
    key: null,
    color: 'bg-orange-600'
  },
  {
    id: 'exit',
    name: 'Exit Door',
    emoji: '🚪',
    description: 'A heavy wooden door with three locks. Your way to freedom.',
    items: [],
    key: null,
    color: 'bg-emerald-600'
  }
]

const KEY_NAMES = {
  'brass-key': '🗝️ Brass Key',
  'silver-key': '🗝️ Silver Key',
  'iron-key': '🗝️ Iron Key'
}

export default function BunkerGame({ onKeyFound, foundKeys }: BunkerGameProps) {
  const [currentRoom, setCurrentRoom] = useState('cell')
  const [searchedRooms, setSearchedRooms] = useState<string[]>([])
  const [foundItems, setFoundItems] = useState<string[]>([])

  const handleRoomSearch = (roomId: string) => {
    if (searchedRooms.includes(roomId)) return
    
    const room = BUNKER_ROOMS.find(r => r.id === roomId)
    if (!room) return
    
    setSearchedRooms(prev => [...prev, roomId])
    setFoundItems(prev => [...prev, ...room.items])
    
    // Check if room has a key
    if (room.key && !foundKeys.includes(room.key)) {
      setTimeout(() => {
        onKeyFound(room.key!)
      }, 500)
    }
  }

  const getCurrentRoom = () => {
    return BUNKER_ROOMS.find(r => r.id === currentRoom)
  }

  const canEscape = foundKeys.length === 3

  const handleEscape = () => {
    if (canEscape) {
      // This will be handled by the parent component
      console.log('Attempting escape...')
    }
  }

  const progress = (foundKeys.length / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-slate-900 text-white p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Card className="bg-stone-800/80 backdrop-blur-sm border-stone-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-stone-100">Underground Bunker</CardTitle>
                  <p className="text-sm text-stone-300">County Cork, Ireland</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-stone-100">
                  {foundKeys.length}/3
                </div>
                <div className="text-sm text-stone-300">Keys found</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-300">Escape Progress</span>
                <span className="text-stone-100 font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex gap-2 mt-3">
                {Object.entries(KEY_NAMES).map(([keyId, keyName]) => (
                  <Badge
                    key={keyId}
                    variant={foundKeys.includes(keyId) ? "default" : "outline"}
                    className={`${
                      foundKeys.includes(keyId) 
                        ? 'bg-yellow-600 text-yellow-100' 
                        : 'bg-stone-700 text-stone-300'
                    }`}
                  >
                    {keyName}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Room Map */}
          <div className="lg:col-span-3">
            <Card className="bg-stone-800/80 backdrop-blur-sm border-stone-700 mb-4">
              <CardHeader>
                <CardTitle className="text-stone-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Bunker Layout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BUNKER_ROOMS.map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          currentRoom === room.id
                            ? 'ring-2 ring-emerald-500 bg-emerald-900/30'
                            : searchedRooms.includes(room.id)
                            ? 'bg-stone-700/50'
                            : 'bg-stone-800/50 hover:bg-stone-700/50'
                        }`}
                        onClick={() => setCurrentRoom(room.id)}
                      >
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl mb-2">{room.emoji}</div>
                            <div className="text-sm font-medium text-stone-100 mb-1">
                              {room.name}
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              {searchedRooms.includes(room.id) && (
                                <Search className="w-3 h-3 text-green-400" />
                              )}
                              {room.key && foundKeys.includes(room.key) && (
                                <Key className="w-3 h-3 text-yellow-400" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Room Detail */}
            {getCurrentRoom() && (
              <Card className="bg-stone-800/80 backdrop-blur-sm border-stone-700">
                <CardHeader>
                  <CardTitle className="text-stone-100 flex items-center gap-2">
                    <span className="text-2xl">{getCurrentRoom()!.emoji}</span>
                    {getCurrentRoom()!.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-300 mb-4">{getCurrentRoom()!.description}</p>
                  
                  <div className="flex gap-3">
                    {getCurrentRoom()!.id !== 'exit' && (
                      <Button
                        onClick={() => handleRoomSearch(getCurrentRoom()!.id)}
                        disabled={searchedRooms.includes(getCurrentRoom()!.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        {searchedRooms.includes(getCurrentRoom()!.id) ? 'Searched' : 'Search Room'}
                      </Button>
                    )}
                    
                    {getCurrentRoom()!.id === 'exit' && (
                      <Button
                        onClick={handleEscape}
                        disabled={!canEscape}
                        className={`${
                          canEscape 
                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                            : 'bg-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <Key className="w-4 h-4 mr-2" />
                        {canEscape ? 'Escape!' : `Need ${3 - foundKeys.length} more keys`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Inventory Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-stone-800/80 backdrop-blur-sm border-stone-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-stone-100 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-stone-200 mb-2">Keys</h4>
                    <div className="space-y-1">
                      {foundKeys.length > 0 ? (
                        foundKeys.map((key) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 p-2 bg-yellow-900/30 rounded-lg"
                          >
                            <Key className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-stone-100">
                              {KEY_NAMES[key as keyof typeof KEY_NAMES]}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-stone-400">No keys found yet</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-stone-200 mb-2">Items</h4>
                    <div className="space-y-1">
                      {foundItems.length > 0 ? (
                        foundItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-stone-700/30 rounded-lg"
                          >
                            <span className="text-sm text-stone-100 capitalize">
                              {item}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-stone-400">No items found yet</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-stone-700">
                  <div className="text-center">
                    <div className="text-xs text-stone-400 mb-1">
                      Rooms searched: {searchedRooms.length}/{BUNKER_ROOMS.length - 1}
                    </div>
                    <div className="text-xs text-stone-400">
                      Find all 3 keys to escape!
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
