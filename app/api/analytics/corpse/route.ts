import { NextRequest, NextResponse } from 'next/server'
import { getCorpseAnalytics } from '@/lib/analytics/corpseMetrics'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication - only allow authenticated users
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get analytics data
    const analyticsData = await getCorpseAnalytics()

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching corpse analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
