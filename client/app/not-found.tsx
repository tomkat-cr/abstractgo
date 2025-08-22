"use client"

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-sm">The page you are looking for does not exist.</p>
      </div>
    </div>
  )
}
