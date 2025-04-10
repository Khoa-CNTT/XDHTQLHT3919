import requestApi from "../utils/requestAPI";

export const loginServices = async (dataLogin) => {
    try {
        const respone = await requestApi({
            method: "post",
            url: "user/login",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(dataLogin),
        });
        return respone;
    } catch (error) {
        return error;
    }
};