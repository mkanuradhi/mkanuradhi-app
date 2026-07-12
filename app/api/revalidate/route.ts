import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const publicMetadata = sessionClaims?.metadata as { roles?: string[] };
  const roles = publicMetadata?.roles || [];

  if (!roles.includes('ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { paths } = await request.json() as { paths: string[] };
  if (!paths?.length) {
    return NextResponse.json({ error: 'No paths provided' }, { status: 400 });
  }

  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, paths });
}