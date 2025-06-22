import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
    
    const { fullName, email, password } = req.body;
   
    if ([fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

  
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        fullName,  // Fixed: schema uses fullName (capital N)
        email,
        password
    });

    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

const createdUser=await User.findById(user._id).select(
    "-password -refreshToken" 
)
 
    return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                createdUser,
                "User registered successfully"
            )
        );
};

export default registerUser;
