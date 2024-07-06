import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import UserRole from "../models/UserRole";
import bcrypt from "bcrypt";
import { UserAddressInterface, UserInterface } from "../service/userInterface";
import UserAddress from "../models/UserAddress";

const getAllUsers: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const search = req.query.search || "";
    const role = req.query.role || "";

    const query: any = {
      user_phoneNumber: { $regex: search, $options: "i" },
    };

    const foundRole = await UserRole.findOne({
      role_description: "customer",
    });

    if (foundRole && role !== "customer") {
      query.user_role = { $ne: foundRole._id };
    } else if (foundRole && role === "customer") {
      query.user_role = foundRole._id;
    }

    const users = await User.find(query)
      .populate("user_role", "role_description -_id")
      .populate("address_id", "-_id")
      .lean();

    if (!users?.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  }
);

const getUserDetail: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    try {
      const phoneNumber = req.query.phoneNumber || 0

      const foundUser = await User.findOne({ user_phoneNumber: phoneNumber }).populate("address_id","-_id")

      if (!foundUser) {
        return res.status(404).json({ message: "Số điện thoại này không tồn tại" })
      }

      return res.status(200).json(foundUser)

    } catch (error) {
      return res.status(500).json('Internal server error')
    }
  })

const createNewUser: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const requestUser: UserInterface = req.body;

    //confirm data
    if (!requestUser.user_phoneNumber || !requestUser.user_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check duplicate
    const duplicate = await User.findOne({
      user_phoneNumber: requestUser.user_phoneNumber,
    })
      .lean()
      .exec();

    if (duplicate) {
      return res.status(409).json({ message: "Phone number existed" });
    }

    //hash password
    const hashedPwd = await bcrypt.hash(requestUser.user_password, 10);

    //relationship
    const roles = await UserRole.find({}).lean();
    if (!roles) {
      const newRoles = [
        { role_description: "admin" },
        { role_description: "manager" },
        { role_description: "staff" },
        { role_description: "customer" },
      ];
      await UserRole.create(newRoles);
    }

    const role = await UserRole.findOne({
      role_description: requestUser?.user_role?.toLowerCase(),
    }).lean();

    //create new user address
    const userAddress = await UserAddress.create({
      fullname: requestUser.user_fullname || "",
      phoneNumber: requestUser.user_phoneNumber,
    });

    //create and store new user
    const user = await User.create({
      ...requestUser,
      user_phoneNumber: requestUser.user_phoneNumber,
      user_password: hashedPwd,
      user_role: role?._id,
      address_id: userAddress._id,
      user_status: true,
    });
    if (user) {
      res
        .status(200)
        .json({ message: `${requestUser.user_phoneNumber} create success` });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  }
);

const updateUser: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const requestUser: UserInterface = req.body;

    //confirm data
    if (!requestUser.user_phoneNumber) {
      return res.status(400).json({ message: "user_phoneNumber is required" });
    }

    const user = await User.findOne({user_phoneNumber:requestUser.user_phoneNumber}).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //hash password
    if (requestUser.user_password && requestUser.user_password.length > 0) {
      user.user_password = await bcrypt.hash(requestUser.user_password, 10);
    } else user.user_password = user.user_password;

    //relationship role
    const role = await UserRole.findOne({
      role_description: requestUser.user_role.toLocaleLowerCase(),
    });

    //relationship address
    const address = await UserAddress.findById(user.address_id);
    if (!address) {
      const createNewAddress = await UserAddress.create({
        fullname: user.user_fullname,
        address_line1: requestUser.address,
      });
      await user.updateOne({}, {}).set("address_id", createNewAddress._id);
    } else {
      if (requestUser?.address && requestUser.address.length > 0) {
        if (address?.address_line1 && address?.address_line1.length > 0) {
          if (requestUser.default) {
            console.log("address1");

            address.address_line1 = requestUser.address;
          } else {
            address.address_line2 = requestUser.address;
          }
        } else address!.address_line1 = requestUser.address;
      }

      //fullname
      address.phoneNumber = requestUser.user_phoneNumber;
      await address?.save();
    }
      (user.user_fullname = requestUser.user_fullname || user.user_fullname),
      (user.user_email = requestUser.user_email || user.user_email),
      (user.user_status = requestUser.user_status),
      await user.updateOne({}, {}).set("user_role", role?._id);
    await user.save();

    const updatedUser = await User.findById(requestUser.user_id)
      .populate("user_role", "role_description -_id")
      .populate("address_id", "-_id")
      .lean();

    res.status(200).json({
      message: `${user.user_phoneNumber} updated success`,
      updatedUser,
    });
  }
);

const confirmUserAddress: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const requestUser: UserAddressInterface = req.body;

    //confirm data
    if (!requestUser.user_id) {
      return res.status(400).json({ message: "id is required" });
    }

    const user = await User.findById(requestUser.user_id).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const address = await UserAddress.findById(user.address_id).exec();

    if (!address) {
      const createNewAddress = await UserAddress.create({});
      await user.updateOne({}, {}).set("address_id", createNewAddress._id);
      await user.save();
    }

    if (requestUser?.address && requestUser.address.length > 0) {
      if (address?.address_line1 && address?.address_line1.length > 0) {
        if (requestUser.default) {
          console.log("address1");

          address.address_line1 = requestUser.address;
        } else {
          address.address_line2 = requestUser.address;
        }
      } else address!.address_line1 = requestUser.address;

      //fullname
      address!.fullname = requestUser.fullname || user.user_fullname;
      address!.phoneNumber =
        requestUser.phoneNumber || user.user_phoneNumber || "";
      await address?.save();
    }

    const updatedUser = await User.findById(requestUser.user_id)
      .populate("user_role", "role_description -_id")
      .populate("address_id", "-_id")
      .lean();

    res.status(200).json({
      message: `${user.user_phoneNumber} updated success`,
      updatedUser,
    });
  }
);

const deleteUser: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findById(user_id).exec();

    await UserAddress.findByIdAndDelete(user?.address_id);

    const deletedUser = await User.findByIdAndDelete(user_id).lean().exec();

    res
      .status(200)
      .json({ message: `${deletedUser?.user_phoneNumber} deleted success` });
  }
);

const checkPhoneExisted: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const { user_phoneNumber } = req.body;

    if (!user_phoneNumber) {
      return res.status(400).json({ message: "phoneNumber are required" });
    }

    //check duplicate
    const duplicate = await User.findOne({
      user_phoneNumber: user_phoneNumber,
    })
      .lean()
      .exec();

    if (duplicate) {
      return res.status(409).json({ message: "Phone number existed" });
    }

    return res.json({ message: "phoneNumber doesn't existed" });
  }
);

const changePassword: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const { user_phoneNumber, user_password } = req.body;

    if (!user_phoneNumber && !user_password) {
      return res
        .status(400)
        .json({ message: "phoneNumber, password are required" });
    }

    //check duplicate
    const foundPhone = await User.findOne({
      user_phoneNumber: user_phoneNumber,
    }).exec();

    if (!foundPhone) {
      return res.json({ message: "phoneNumber doesn't existed" });
    }

    if (user_password && user_password.length > 0) {
      foundPhone.user_password = await bcrypt.hash(user_password, 10);
    } else foundPhone.user_password = foundPhone.user_password;

    foundPhone.save();

    return res.status(200).json("update password success");
  }
);

const userController = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  confirmUserAddress,
  checkPhoneExisted,
  changePassword,
  getUserDetail
};

export default userController;
