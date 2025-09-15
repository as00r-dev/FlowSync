import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Implement user info retrieval with session management for Next.js
  // For now, we'll return a 401 status to indicate not authenticated
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
}