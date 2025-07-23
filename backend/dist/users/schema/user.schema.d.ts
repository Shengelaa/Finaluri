import mongoose from 'mongoose';
export declare class User {
    name: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
}
export declare const userSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User, any> & User & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>, {}> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
