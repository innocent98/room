"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorTitle = "Authentication Error"
  let errorMessage = "An error occurred during authentication. Please try again."

  // Customize error messages based on error code
  switch (error) {
    case "missing_token":
      errorTitle = "Missing Verification Token"
      errorMessage = "The verification link is invalid. Please request a new verification email."
      break
    case "invalid_token":
      errorTitle = "Invalid Verification Token"
      errorMessage =
        "The verification link is invalid or has already been used. Please request a new verification email."
      break
    case "token_expired":
      errorTitle = "Verification Token Expired"
      errorMessage = "The verification link has expired. Please request a new verification email."
      break
    case "OAuthSignin":
      errorTitle = "OAuth Sign In Error"
      errorMessage = "An error occurred while signing in with your social account. Please try again."
      break
    case "OAuthCallback":
      errorTitle = "OAuth Callback Error"
      errorMessage = "An error occurred while processing your social sign in. Please try again."
      break
    case "OAuthCreateAccount":
      errorTitle = "Account Creation Error"
      errorMessage = "There was a problem creating your account. Please try again."
      break
    case "EmailCreateAccount":
      errorTitle = "Account Creation Error"
      errorMessage = "There was a problem creating your account. Please try again."
      break
    case "Callback":
      errorTitle = "Callback Error"
      errorMessage = "There was a problem with the authentication callback. Please try again."
      break
    case "OAuthAccountNotLinked":
      errorTitle = "Account Not Linked"
      errorMessage =
        "This email is already associated with another account. Please sign in using your original provider."
      break
    case "EmailSignin":
      errorTitle = "Email Sign In Error"
      errorMessage = "The email could not be sent. Please try again."
      break
    case "CredentialsSignin":
      errorTitle = "Invalid Credentials"
      errorMessage = "The email or password you entered is incorrect. Please try again."
      break
    case "server_error":
      errorTitle = "Server Error"
      errorMessage = "An internal server error occurred. Please try again later."
      break
    default:
      // Use default error message
      break
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-300" />
          </div>
          <CardTitle className="text-2xl font-bold">{errorTitle}</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            If you continue to experience issues, please contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-in">Back to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

