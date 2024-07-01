import mongoose from "mongoose";

const UserRoleSchema = new mongoose.Schema({
  role_description: {
    type: String,
    require: true,
  },
});

const UserRole = mongoose.model("UserRole", UserRoleSchema);

export default UserRole;
