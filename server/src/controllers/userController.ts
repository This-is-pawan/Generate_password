import { Request,Response } from "express"
import bcrypt from 'bcryptjs'
import {UserModel,UserSave} from "../model/User";
import { Types } from "mongoose";

export const register=async(req:Request,res:Response)=>{
const {name,email,password}=req.body;
if (!name||!email||!password) {
 res.json(`something is missing fromm input field`)
}

try {
 const exist=await UserModel.findOne({email})
if (exist) {
 res.json('user is already register')
}
 const hashPasword=await bcrypt.hash(password,10)
 const user=await UserModel.create({name,email,password:hashPasword})
res.json({success:true,message:'register successfully'})

} catch (error:any) {
 res.json({success:false,message:error})
}

}


export const login=async(req:Request,res:Response)=>{
const {name,email,password}=req.body;
if (!email||!password) {
 res.json(`something is missing from input field`)
}

try {
 const user=await UserModel.findOne({email})
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ success: false, message: "Invalid password" });
  }

  res.json({ success: true, message: "Login successfully"});
} catch (error) {
  res.json({ success: false, message: error });
}
}
export const findUser = async (_req: Request, res: Response) => {
  try {
    const users = await UserSave.find().sort({ _id: -1 }); // Fetch all users

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    res.status(200).json({
      success: true,
      data: users, // includes _id automatically
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const DataSave = async (req: Request, res: Response) => {
  const { url, name } = req.body;

  if (!url || !name) {
    return res
      .status(400)
      .json({ success: false, message: "URL or Name missing" });
  }

  try { 
  
    const existing = await UserSave.findOne({ name });

    if (existing) {
    
      const isSame = await bcrypt.compare(url, existing.url);
      if (isSame) {
        return res
          .status(400)
          .json({ success: false, message: "URL already exists for this user" });
      }
    }

    const hashPassword = await bcrypt.hash(url, 12);
    const newData = await UserSave.create({ url: hashPassword, name });

    res.status(201).json({
      success: true,
      message: "Data saved successfully",
      data: newData,
    });
  } catch (error: any) {
    console.error("Save error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};





export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "User ID is missing" });
  }

  try {
    // Convert string id to ObjectId
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;

    if (!objectId) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    const user = await UserSave.findById(objectId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await UserSave.deleteOne({ _id: objectId });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};





export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; 
  const { name, url } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "User ID missing" });
  }

  try {
    const updatedUser = await UserSave.findByIdAndUpdate(
      id,
      { name, url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Update Error:", error);
    res.json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


