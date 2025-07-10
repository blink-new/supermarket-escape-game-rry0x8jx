import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ShoppingCart, Package, CheckCircle } from 'lucide-react'

interface SupermarketGameProps {
  onItemCollected: (item: string) => void
  collectedItems: string[]
}

const SHOPPING_LIST = [
  { id: 'milk', name: 'Milk', emoji: '🥛', aisle: 'Dairy' },
  { id: 'bread', name: 'Bread', emoji: '🍞', aisle: 'Bakery' },
  { id: 'eggs', name: 'Eggs', emoji: '🥚', aisle: 'Dairy' },
  { id: 'apples', name: 'Apples', emoji: '🍎', aisle: 'Produce' },
  { id: 'chicken', name: 'Chicken', emoji: '🍗', aisle: 'Meat' },
  { id: 'rice', name: 'Rice', emoji: '🍚', aisle: 'Pantry' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', aisle: 'Dairy' },
  { id: 'tomatoes', name: 'Tomatoes', emoji: '🍅', aisle: 'Produce' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', aisle: 'Pantry' },
  { id: 'bananas', name: 'Bananas', emoji: '🍌', aisle: 'Produce' },
  { id: 'yogurt', name: 'Yogurt', emoji: '🥛', aisle: 'Dairy' },
  { id: 'cereal', name: 'Cereal', emoji: '🥣', aisle: 'Pantry' },
]

const SUPERMARKET_AISLES = [
  { name: 'Produce', color: 'bg-green-500', items: ['apples', 'tomatoes', 'bananas'] },
  { name: 'Dairy', color: 'bg-blue-500', items: ['milk', 'eggs', 'cheese', 'yogurt'] },
  { name: 'Meat', color: 'bg-red-500', items: ['chicken'] },
  { name: 'Bakery', color: 'bg-yellow-500', items: ['bread'] },
  { name: 'Pantry', color: 'bg-purple-500', items: ['rice', 'pasta', 'cereal'] },
]

export default function SupermarketGame({ onItemCollected, collectedItems }: SupermarketGameProps) {
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null)


  const handleItemClick = (item: { id: string; name: string }) => {
    if (collectedItems.includes(item.id)) return
    
    onItemCollected(item.id)
    
    // Add some animation feedback
    const button = document.getElementById(`item-${item.id}`)
    if (button) {
      button.style.transform = 'scale(1.1)'
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 200)
    }
  }

  const getItemsInAisle = (aisleName: string) => {
    const aisle = SUPERMARKET_AISLES.find(a => a.name === aisleName)
    if (!aisle) return []
    
    return SHOPPING_LIST.filter(item => aisle.items.includes(item.id))
  }

  const progress = (collectedItems.length / 10) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-slate-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-800">Murphy's Supermarket</CardTitle>
                  <p className="text-sm text-slate-600">Complete your shopping list</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">
                  {collectedItems.length}/10
                </div>
                <div className="text-sm text-slate-600">Items collected</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="text-slate-800 font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {collectedItems.length >= 9 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-amber-600 font-medium"
                >
                  ⚠️ You feel a strange presence watching you...
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supermarket Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Aisles */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {SUPERMARKET_AISLES.map((aisle) => (
                <motion.div
                  key={aisle.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedAisle === aisle.name 
                        ? 'ring-2 ring-emerald-500 bg-emerald-50' 
                        : 'bg-white/80 hover:bg-white/90'
                    }`}
                    onClick={() => setSelectedAisle(selectedAisle === aisle.name ? null : aisle.name)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${aisle.color}`} />
                        <CardTitle className="text-lg text-slate-800">{aisle.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getItemsInAisle(aisle.name).map((item) => (
                          <Button
                            key={item.id}
                            id={`item-${item.id}`}
                            variant={collectedItems.includes(item.id) ? "default" : "outline"}
                            className={`w-full justify-start gap-2 ${
                              collectedItems.includes(item.id) 
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                            onClick={() => handleItemClick(item)}
                            disabled={collectedItems.includes(item.id)}
                          >
                            <span className="text-lg">{item.emoji}</span>
                            <span className="flex-1 text-left">{item.name}</span>
                            {collectedItems.includes(item.id) && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shopping List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-300 sticky top-4">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Shopping List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {SHOPPING_LIST.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                        collectedItems.includes(item.id)
                          ? 'bg-emerald-100 text-emerald-800 line-through'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="flex-1 text-sm">{item.name}</span>
                      {collectedItems.includes(item.id) && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Collected:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {collectedItems.length}/10
                    </Badge>
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