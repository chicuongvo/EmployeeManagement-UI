/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient as axiosApi } from '@/lib/axios';

interface RequestApiOptions {
    [key: string]: any;
}

const requestApi = {
    get: <TResponse>(
        url: string,
        params?: object,
        config: RequestApiOptions = {}
    ) =>
        axiosApi
            .get<TResponse>(url, { params, ...config })
            .then((res) => Promise.resolve(res.data)),
    post: <TResponse>(url: string, data: any, config: RequestApiOptions = {}) =>
        axiosApi
            .post<TResponse>(url, data, config)
            .then((res) => Promise.resolve(res.data)),
    put: <TResponse>(url: string, data: any, config: RequestApiOptions = {}) => axiosApi
        .put<TResponse>(url, data, config)
        .then((res) => Promise.resolve(res.data)),
    patch: <TResponse>(url: string, data: any, config: RequestApiOptions = {}) => axiosApi
        .patch<TResponse>(url, data, config)
        .then((res) => Promise.resolve(res.data)),
    delete: <TResponse>(
        url: string,
        data?: any,
        config: RequestApiOptions = {}
    ) =>
        axiosApi
            .delete<TResponse>(url, { data, ...config })
            .then((res) => Promise.resolve(res.data)),
};

export default requestApi;
