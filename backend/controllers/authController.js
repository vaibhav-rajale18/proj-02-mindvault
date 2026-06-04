const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register User
const registerUser = async (req, res) => {
try {
const { name, email, password } = req.body;

```
// Check if all fields are provided
if (!name || !email || !password) {
  return res.status(400).json({
    message: "Please provide all fields",
  });
}

// Check if user already exists
const userExists = await User.findOne({ email });

if (userExists) {
  return res.status(400).json({
    message: "User already exists",
  });
}

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Create user
const user = await User.create({
  name,
  email,
  password: hashedPassword,
});

res.status(201).json({
  message: "User registered successfully",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});
```

} catch (error) {
res.status(500).json({
message: "Server Error",
error: error.message,
});
}
};

module.exports = {
registerUser,
};
