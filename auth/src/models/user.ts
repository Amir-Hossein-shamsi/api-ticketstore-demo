import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../errors/badrequesterror';

//NOTE: User attributes
interface UserAttrs {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}
//NOTE: interface for describe create one doucument static function
interface UserModel extends mongoose.Model<UserDocument> {
  creating(attres: UserAttrs): UserDocument;
  credential(email: string, password: string): UserDocument;
}
//NOTE: interface that describe User document
interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.creating = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.statics.credential = async function (email, password) {
  const cheickinguser = await User.findOne({ email });

  if (!cheickinguser) {
    throw new BadRequestError('Invalid Credentials', 400);
  }

  const passwordChecking = await bcrypt.compare(
    password,
    cheickinguser.password
  );

  if (!passwordChecking) {
    throw new BadRequestError('Invalid Credentials password', 400);
  }

  return cheickinguser;
};

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const hased = await bcrypt.hash(this.get('password'), 10);
    this.set('password', hased);
  }
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
