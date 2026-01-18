import queryString from "query-string";
import axios, {
    type AxiosError,
    type AxiosResponse,
    type CreateAxiosDefaults,
    HttpStatusCode,
    type InternalAxiosRequestConfig,
} from "axios";
import showMessage from "./showMessage";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    hideMessage?: boolean;
}

const onRequest = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    // const token = useAuthStore.getState().token;
    // config.headers.Authorization = `Bearer ${token}`;

    // if (!token) {
    //     return config;
    // }
    return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    // switch (error.response?.status) {
    //     case 401:
    //         useAuthStore.getState().setLogoutSuccess();
    //         break;
    // }
    return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    const config = response.config as CustomAxiosRequestConfig;
    if (!config.hideMessage && (response.data.code < 1000 || response.data.code > 1999)) {
        showMessage({
            type: "toast",
            level: "error",
            title: response.data.message,
        });
    }
    return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    // switch (error.response?.status) {
    //     case 401:
    //         useAuthStore.getState().setLogoutSuccess();
    //         break;
    // }
    const config = error.config as CustomAxiosRequestConfig;
    const errorData = error.response?.data as any;
    const errorMessage = errorData?.message || error.message;

    if (!config?.hideMessage && error.response?.status !== HttpStatusCode.NotFound) {
        showMessage({
            type: "toast",
            level: "error",
            title: errorMessage,
        });
    }

    return Promise.reject(
        typeof error.response?.data === "object" &&
            error.response.status !== HttpStatusCode.NotFound
            ? error.response.data
            : error
    );
};

const config: CreateAxiosDefaults = {
    baseURL: import.meta.env.VITE_API_BASE_URL || window.location.origin,
    timeout: 120000,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Authorization",
    },
    paramsSerializer: (params) =>
        queryString.stringify(params, { arrayFormat: "comma" }),
};
const axiosApi = axios.create(config);
axiosApi.interceptors.request.use(onRequest, onRequestError);
axiosApi.interceptors.response.use(onResponse, onResponseError);

export default axiosApi;
