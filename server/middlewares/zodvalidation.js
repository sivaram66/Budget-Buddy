import zod from "zod";

const signupSchema = zod.object({
  name: zod.string().trim().min(3, "Name must be at least 3 characters"),
  email: zod.string().trim().email("Enter a valid email address"),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(64, "Password cannot exceed 64 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character"
    ),
  dateOfBirth: zod
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use date format YYYY-MM-DD")
    .optional(),
});

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

const expenseSchema = zod.string().min(6);

const goalSchema = zod.object({
  name: zod.string(),
  targetAmount: zod.number().min(1, { message: "Must be greater than 0" }),
  currentAmount: zod.number(),
  description: zod.string()
})

const signupValidation = (req, res, next) => {
  

  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    console.log("Signup validation errors:", fieldErrors);

    return res.status(400).json({
      ok: false,
      message: "Validation error",
      errors: fieldErrors, 
    });
  }

  req.body = result.data;
  next();
}

const loginValidation = (req, res, next) => {
  const input = req.body;
  const result = loginSchema.safeParse(input);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      error: result.error.errors,
      message: "Validation error: Invalid Inputs",
    });
  }
};

const expenseValidation = (req, res, next) => {
  const expense = req.body.expense;
  const result = expenseSchema.safeParse(expense);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      error: result.error.errors,
      message: "Validation error: Invalid Inputs",
    });
  }
};

const goalValidation = (req, res, next) => {
  const goal = req.body.goal;
  const result = goalSchema.safeParse(goal);
  if (result.success) {
    next();
  }
  else {
    res.status(400).json({
      error: result.error.errors,
      message: "Validaton error: Invalid Inputs",
    });
  }
}

export { signupValidation, loginValidation, expenseValidation };
