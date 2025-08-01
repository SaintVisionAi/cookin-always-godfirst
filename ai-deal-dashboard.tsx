"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  Brain,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Star,
  Send,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react"
import { toast } from "sonner"

interface DealData {
  id: string
  name: string
  company: string
  value: number
  probability: number
  stage: string
  industry?: string
  description?: string
  contact_name?: string
  contact_email?: string
  score?: number
  grade?: string
  ai_insights?: string[]
  recommended_actions?: string[]
  risk_factors?: string[]
  analyzed_at?: string
}

interface PortfolioInsights {
  total_value: number
  average_score: number
  high_priority_deals: number
  at_risk_deals: number
  stage_distribution: { [key: string]: number }
  recommendations: string[]
}

export function AIDealDashboard() {
  const [deals, setDeals] = useState<DealData[]>([])
  const [portfolioInsights, setPortfolioInsights] =
    useState<PortfolioInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])

  useEffect(() => {
    loadSampleDeals()
  }, [])

  const loadSampleDeals = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/deals/analyze")
      const data = await response.json()
      if (data.success) {
        setDeals(data.data || [])
      }
    } catch (error) {
      console.error("Failed to load deals:", error)
      toast.error("Failed to load deals")
    } finally {
      setLoading(false)
    }
  }

  const analyzeDeals = async () => {
    if (deals.length === 0) {
      toast.error("No deals to analyze")
      return
    }

    setAnalyzing(true)
    try {
      const response = await fetch("/api/deals/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals: deals,
          analysisType: "comprehensive"
        })
      })

      const data = await response.json()
      if (data.success) {
        setDeals(data.data.deals)
        setPortfolioInsights(data.data.portfolio_insights)
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      toast.error("Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  const pushToGHL = async () => {
    const dealsToPush =
      selectedDeals.length > 0
        ? deals.filter(deal => selectedDeals.includes(deal.id))
        : deals.filter(deal => (deal.score || 0) >= 70)

    if (dealsToPush.length === 0) {
      toast.error("No qualifying deals to push")
      return
    }

    setLoading(true)
    try {
      // Simulate GHL push
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success(
        `Successfully pushed ${dealsToPush.length} deals to GoHighLevel!`
      )
      setSelectedDeals([])
    } catch (error) {
      toast.error("Failed to push deals to GHL")
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-500"
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-green-400"
      case "B":
        return "text-yellow-400"
      case "C":
        return "text-orange-400"
      default:
        return "text-red-400"
    }
  }

  const chartColors = ["#EAB308", "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"]

  const stageChartData = portfolioInsights?.stage_distribution
    ? Object.entries(portfolioInsights.stage_distribution).map(
        ([stage, count]) => ({
          stage: stage.charAt(0).toUpperCase() + stage.slice(1),
          count
        })
      )
    : []

  const scoreDistribution = deals.reduce(
    (acc, deal) => {
      const scoreRange = deal.score
        ? deal.score >= 80
          ? "80-100"
          : deal.score >= 60
            ? "60-79"
            : deal.score >= 40
              ? "40-59"
              : "0-39"
        : "Unscored"
      acc[scoreRange] = (acc[scoreRange] || 0) + 1
      return acc
    },
    {} as { [key: string]: number }
  )

  const scoreChartData = Object.entries(scoreDistribution).map(
    ([range, count]) => ({
      range,
      count,
      fill:
        range === "80-100"
          ? "#10B981"
          : range === "60-79"
            ? "#EAB308"
            : range === "40-59"
              ? "#F59E0B"
              : "#EF4444"
    })
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">
            🧠 SaintSal™ AI Deal Dashboard
          </h2>
          <p className="text-gray-400">
            AI-powered opportunity analysis and CRM integration
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={analyzeDeals}
            disabled={analyzing || deals.length === 0}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                AI Analyze
              </>
            )}
          </Button>

          <Button
            onClick={pushToGHL}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pushing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Push to GHL
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      {portfolioInsights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${portfolioInsights.total_value.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Score</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {portfolioInsights.average_score}%
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">High Priority</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {portfolioInsights.high_priority_deals}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">At Risk</p>
                  <p className="text-2xl font-bold text-red-400">
                    {portfolioInsights.at_risk_deals}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="deals">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="deals">Deal Analysis</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="deals" className="space-y-4">
          {deals.map(deal => (
            <Card
              key={deal.id}
              className="bg-gradient-to-br from-gray-900 to-black border-yellow-500/20"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-yellow-400">
                      {deal.name}
                    </CardTitle>
                    <p className="text-gray-400">{deal.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {deal.grade && (
                      <Badge
                        className={`${getGradeColor(deal.grade)} font-bold`}
                      >
                        Grade: {deal.grade}
                      </Badge>
                    )}
                    {deal.score && (
                      <Badge
                        className={`${getScoreColor(deal.score)} text-white`}
                      >
                        {deal.score}% Score
                      </Badge>
                    )}
                    <input
                      type="checkbox"
                      checked={selectedDeals.includes(deal.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedDeals([...selectedDeals, deal.id])
                        } else {
                          setSelectedDeals(
                            selectedDeals.filter(id => id !== deal.id)
                          )
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Value:</span>
                      <span className="text-green-400 font-semibold">
                        ${deal.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Probability:</span>
                      <span className="text-blue-400">{deal.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Stage:</span>
                      <span className="text-purple-400">{deal.stage}</span>
                    </div>
                    {deal.industry && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Industry:</span>
                        <span className="text-yellow-400">{deal.industry}</span>
                      </div>
                    )}
                  </div>

                  {deal.ai_insights && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-purple-400">
                        AI Insights:
                      </h4>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {deal.ai_insights.slice(0, 3).map((insight, i) => (
                          <li key={i}>• {insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {deal.score && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">AI Score</span>
                      <span className="text-white">{deal.score}%</span>
                    </div>
                    <Progress value={deal.score} className="h-2" />
                  </div>
                )}

                {deal.recommended_actions && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">
                      Recommended Actions:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {deal.recommended_actions.slice(0, 4).map((action, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs justify-start"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <BarChart3 className="h-5 w-5" />
                  Deal Stages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="stage" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #EAB308"
                      }}
                    />
                    <Bar dataKey="count" fill="#EAB308" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <PieChartIcon className="h-5 w-5" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={scoreChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                    >
                      {scoreChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #10B981"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {portfolioInsights && (
            <Card className="bg-gradient-to-br from-gray-900 to-black border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  Portfolio Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {portfolioInsights.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
