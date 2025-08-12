// TEMPORALMENTE DESHABILITADO EN PRIMER RELEASE
// import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'

export async function POST() { return new Response(JSON.stringify({ error: 'disabled' }), { status: 404 }) }

export async function DELETE() { return new Response(JSON.stringify({ error: 'disabled' }), { status: 404 }) }

export async function GET() { return new Response(JSON.stringify({ follows: [] }), { status: 200 }) }



