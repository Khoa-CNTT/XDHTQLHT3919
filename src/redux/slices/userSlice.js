import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginServices } from "../../services/loginServices";
import { signupServices } from "../../services/signupService";
import {
    editProfileService,
    getInforUserService,
    uploadAvatarService,
} from "../../services/userService";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        status: "idle",
        message: "logout",
        currentUser: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLoginApi.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userLoginApi.fulfilled, (state, action) => {
                action.payload.accessToken === undefined
                    ? (state.message = "Đăng nhập thất bại!")
                    : (state.message = "Đăng nhập thành công!");
                if (state.message === "Đăng nhập thành công!") {
                    state.currentUser = action.payload.currentUser.data;
                    localStorage.setItem(
                        "user",
                        JSON.stringify(action.payload.currentUser.data)
                    );
                    state.status = 200;
                }
            })
            .addCase(userSignupApi.pending, (state) => {
                state.status = "loading";
            });
    },
});

export const userLoginApi = createAsyncThunk(
    "user/userLogin",
    async (dataLogin) => {
        const responeToken = await loginServices(dataLogin);
        return responeToken.data;
    }
);

export const userSignupApi = createAsyncThunk(
    "user/userSignup",
    async (dataSignup) => {
        const response = await signupServices(dataSignup);
        return response;
    }
);
export const editProfileApi = createAsyncThunk(
    "user/userEdit",
    async (userEdit) => {
        const response = await editProfileService(userEdit);
        localStorage.setItem("user", JSON.stringify(response.data.data[0]));
        return response;
    }
);

export const uploadAvatarApi = (idUser, formData) => {
    return async (dispatch) => {
        try {
            await uploadAvatarService(idUser, formData);
            const { data } = await getInforUserService();
            localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.log(error);
        }
    };
};
