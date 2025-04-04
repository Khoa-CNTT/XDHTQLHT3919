import requestApi from "../utils/requestApi";

export const editProfileService = (userEdit) => {
    return requestApi({
        method: "put",
        url: `user/edit`,
        data: JSON.stringify(userEdit),
        headers: {
            "Content-Type": "application/json",
        },
    });
};

// export const uploadAvatarService = (idUser, formData) => {
//     return requestApi({
//         method: "put",
//         url: `user/upload-avatar/${idUser}`,
//         data: formData
//     });
// };


export const getInforUserService = () => {
    return requestApi({
        method: "get",
        url: `user/get_infor`

    });
};
export const getAllUserService = () => {
    return requestApi({
        method: "get",
        url: `user/all`
    });
};
export const getAllRoleService = () => {
    return requestApi({
        method: "get",
        url: `role/all`
    });
};
export const deleteUser = async (id) => {
    try {
        const respone = await requestApi({
            method: "delete",
            url: `user/delete`,
            data: JSON.stringify(id),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return respone.data;
    } catch (error) {
        return error;
    }
};
export const changePasswordService = (data) => {
    return requestApi({
        method: "post",
        url: "user/changepass",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
};


