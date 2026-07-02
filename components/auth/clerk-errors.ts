/**
 * Clerk error helpers.
 *
 * The Clerk v7 signal-based hooks return `{ error }` instead of throwing,
 * so we need to format those error objects into display strings.
 */

interface ClerkErrorLike {
  message?: string;
  longMessage?: string;
  code?: string;
  errors?: Array<{
    longMessage?: string;
    message?: string;
    code?: string;
  }>;
}

/**
 * Extracts a human-readable error message from a Clerk error object
 * (or any thrown error).
 */
export function isClerkError(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";

  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const e = error as ClerkErrorLike;

    // Structured errors array (most common Clerk shape)
    if (Array.isArray(e.errors) && e.errors.length > 0) {
      const first = e.errors[0];
      const fallback =
        first?.longMessage ||
        first?.message ||
        "Something went wrong. Please try again.";

      switch (first?.code) {
        case "form_identifier_not_found":
          return "We couldn't find an account with that email address.";
        case "form_password_incorrect":
          return "The password you entered is incorrect.";
        case "form_identifier_exists":
          return "An account with this email already exists.";
        case "form_param_format_invalid":
          return "Please check that your email address is valid.";
        case "form_password_pwned":
          return "This password has been found in a data breach. Please choose a stronger password.";
        case "form_code_incorrect":
          return "The verification code is incorrect or has expired.";
        default:
          return fallback;
      }
    }

    if (typeof e.message === "string" && e.message.length > 0) {
      return e.message;
    }
    if (typeof e.longMessage === "string" && e.longMessage.length > 0) {
      return e.longMessage;
    }
  }

  return "Something went wrong. Please try again.";
}
