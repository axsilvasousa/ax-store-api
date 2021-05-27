"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const auth_1 = __importDefault(require("@src/factories/auth"));
const logger_1 = __importDefault(require("@src/logger"));
const schema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: [true, "Email must be unique"],
    },
    password: { type: String, required: true },
}, {
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id;
            if (ret.password) {
                delete ret.password;
            }
            delete ret._id;
            delete ret.__v;
        },
    },
});
schema.path("email").validate(async (email) => {
    const emailCount = await mongoose_1.default.models.User.countDocuments({ email });
    return !emailCount;
}, "already exists in the database.", _1.CUSTOM_VALIDATION.DUPLICATED);
schema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) {
        return;
    }
    try {
        const hashedPassword = await auth_1.default.hashPassword(this.password);
        this.password = hashedPassword;
    }
    catch (err) {
        logger_1.default.error(`Error hashing the password for the user ${this.name}`, err);
    }
});
exports.User = mongoose_1.default.model("User", schema);
//# sourceMappingURL=user.js.map