import { User } from "../modles/user.models.js";


const getUsers = async (req, res) => {
    try {

        const fetchUsers = await User.find();

        if (!fetchUsers) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Users not found"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "User Fetched Succefull",
                allUsers: fetchUsers
            }
        );

    } catch (error) {
        console.log(`Error getting all users ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error getting users"
            }
        );
    };
};

// Update user 
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(402).json(
                {
                    success: false,
                    message: "User id is not provide"
                }
            );
        };

        const findUser = await User.findById(id);

        if (!findUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User Not found!"
                }
            );
        };

        const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateUser) {
            return res.status(500).json(
                {
                    success: false,
                    message: "Error Updatind User"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "User Update successfully",
                updatedUser: updateUser
            }
        );

    } catch (error) {
        console.log(`Error updatind user Internal server error:- ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error Updating user"
            }
        );

    };
};

// Delete User 
const   deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(402).json(
                {
                    success: false,
                    message: "User id is not provide"
                }
            );
        };

        const findUser = await User.findById(id);

        if (!findUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User Not found!"
                }
            );
        };

        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(500).json(
                {
                    success: false,
                    message: "Error Deleting User"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "User Deleted Succesfull",
                deletedUser: deleteUser
            }
        );

    } catch (error) {
        console.log(`Error Internal server deleting user ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error Delete user"
            }
        );
    }
};

// Get User with id ;
const getUserWithId = async (req , res) => {
    const { id } = req.params;

    if(!id){
        return res.status(401).json(
            {
                success: false,
                 message: "Id not provide for edit user!"
            }
        );
    };
    try {
        const findUser = await User.findById(id);

        if(!findUser){
            return res.status(404).json(
                {
                    success: false,
                     message: "User Not found"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                 message: "User Fetched Succesfull",
                 user: findUser
            }
        );

    } catch (error) {
        console.log(`Error Find user with id:- ${error}`);
        return res.status(500).json(
            {
                success: false, 
                message: "Internal server error please try again"
            }
        );    
    };
};


export {
    getUsers,
    updateUser,
    deleteUser,
    getUserWithId
}