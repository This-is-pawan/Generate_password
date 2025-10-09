import { Document, Schema, Model, model } from "mongoose";

// ------------------ Auth User Interface ------------------
export interface IAuthUser extends Document {
  name: string;
  email: string;
  password: string;
  url: string;
}

// ------------------ Saved URL Interface ------------------
export interface IUserData extends Document {
  name: string;
  url: string;
}

// ------------------ Auth User Schema ------------------
const UserSchema: Schema<IAuthUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    url: { type: String, required: false },
  },
  { timestamps: true }
);

// ------------------ Data Save Schema 
const UserDataSchema: Schema<IUserData> = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: false },
    
  },
  { timestamps: true }
);

// ------------------ Models ------------------
export const UserModel: Model<IAuthUser> = model<IAuthUser>("User", UserSchema);
export const UserSave: Model<IUserData> = model<IUserData>("UserSave", UserDataSchema);
