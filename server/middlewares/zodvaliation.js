import zod from "zod";

const signupSchema = zod.object({
  email: zod.string().email({ message: "Invalid email" }),
  password: zod.string().min(6, { messgae: "Must be at least 6 characters" }),
  name: zod.string().min(3, { message: "Must be at least 3 characters" }),
  dateOfBirth: zod.string().datetime().optional(),
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
  const input = req.body;
  const result = signupSchema.safeParse(input);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      error: result.error.errors,
      message: "Validation error: Invalid Inputs",
    });
  }
};

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
