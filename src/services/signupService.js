import requestApi from "../utils/requestApi";

export const signupServices = async (dataSignup) => {
    try {
        const respone = await requestApi({
            method: "post",
            url: "user/register",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(dataSignup),
        });
        return respone.data;
    } catch (error) {
        return error;
    }
};
