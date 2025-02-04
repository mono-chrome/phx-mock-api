interface UserUpdate {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  gender: "female" | "male";
  segment: "anonymous" | "lead" | "vip" | string;
  store: number;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validators = {
  email: (email: string): ValidationResult => {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: expression.test(email),
      error: expression.test(email) ? undefined : "Invalid Email Address.",
    };
  },
  password: (password: string): ValidationResult => {
    return {
      isValid: password.length >= 6,
      error:
        password.length >= 6
          ? undefined
          : "Password should be at least 6 characters.",
    };
  },
  first_name: (first_name: string): ValidationResult => {
    return {
      isValid: first_name.length >= 1,
      error:
        first_name.length >= 1
          ? undefined
          : "First name should be at least 1 letter.",
    };
  },
  last_name: (last_name: string): ValidationResult => {
    return {
      isValid: last_name.length >= 1,
      error:
        last_name.length >= 1
          ? undefined
          : "Last name should be at least 1 letter.",
    };
  },
  gender: (gender: string): ValidationResult => {
    const genders = ["female", "male"];
    return {
      isValid: genders.includes(gender),
      error: genders.includes(gender)
        ? undefined
        : "Gender must be 'male' or 'female'",
    };
  },
  segment: (segment: string): ValidationResult => {
    const segments = ["anonymous", "lead", "vip"];
    const funnelSegment = segment.startsWith("funnel_") && segment.length <= 30;
    const isValidSegment = segments.includes(segment) || funnelSegment;
    return {
      isValid: isValidSegment,
      error: isValidSegment
        ? undefined
        : "Segment must be 'anonymous', 'lead', 'vip', 'funnel_<string(23)>'",
    };
  },
  store: (store: number): ValidationResult => {
    const isValidStore = !isNaN(store) && store >= 0 && store <= 99;
    return {
      isValid: isValidStore,
      error: isValidStore ? undefined : "Store must be >= 0 or <= 99",
    };
  },
};

function validateUserUpdate(fields: Partial<UserUpdate>): ValidationResult {
  for (const [key, value] of Object.entries(fields)) {
    if (!Object.keys(validators).includes(key)) {
      return {
        isValid: false,
        error: `Field ${key} cannot be modified.`,
      };
    }

    if (key in validators) {
      const validator = validators[key as keyof typeof validators]; // I hate typescript
      const result = validator(value as never);

      if (!result.isValid) {
        return {
          isValid: false,
          error: result.error,
        };
      }
    }
  }
  return {
    isValid: true,
  };
}

export { validateUserUpdate };
