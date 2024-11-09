import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, UtensilsCrossedIcon } from 'lucide-react'

export default function App() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [targetPrice, setTargetPrice] = useState<number | null>(null)
  const [difference, setDifference] = useState<number | null>(null)
  const [percentageDifference, setPercentageDifference] = useState<number | null>(null)

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
        const data = await response.json()
        setCurrentPrice(data.bpi.USD.rate_float)
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error)
      }
    }

    fetchBitcoinPrice() // Fetch immediately on mount
    const interval = setInterval(fetchBitcoinPrice, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (currentPrice !== null && targetPrice !== null) {
      const diff = targetPrice - currentPrice
      setDifference(diff)
      setPercentageDifference((diff / currentPrice) * 100)
    }
  }, [currentPrice, targetPrice])

  const handleTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setTargetPrice(isNaN(value) ? null : value)
  }

  const getDinnerInvitation = () => {
    if (currentPrice === null || targetPrice === null) return null

    if (currentPrice < targetPrice) {
      return (
        <div className="flex items-center text-blue-600">
          <UtensilsCrossedIcon className="mr-2" />
          <span>Lexander invites for dinner</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-green-600">
          <UtensilsCrossedIcon className="mr-2" />
          <span>Michael invites for dinner</span>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Live Bitcoin Price Comparator</CardTitle>
          <CardDescription>Compare live Bitcoin price with your target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Current Bitcoin Price (USD)
              </label>
              <Input
                id="currentPrice"
                value={currentPrice?.toFixed(2) || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Your Target Price (USD)
              </label>
              <Input
                id="targetPrice"
                value={targetPrice || ''}
                onChange={handleTargetPriceChange}
                placeholder="Enter your target price"
              />
            </div>
            {difference !== null && percentageDifference !== null && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold mb-2">
                    {difference > 0 ? (
                      <span className="text-green-600 flex items-center">
                        <ArrowUpIcon className="mr-1" /> Price needs to rise
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <ArrowDownIcon className="mr-1" /> Price needs to fall
                      </span>
                    )}
                  </p>
                  <p>Difference: ${Math.abs(difference).toFixed(2)}</p>
                  <p>Percentage Difference: {Math.abs(percentageDifference).toFixed(2)}%</p>
                  {getDinnerInvitation()}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-50 py-4">
        <div className="text-center text-sm text-gray-600">
          Built by <a href="Lexander" className="text-primary hover:underline">Lexander</a>
          <div>© 2024 All rights reserved</div>
        </div>
      </footer>
    </div>
  )
}