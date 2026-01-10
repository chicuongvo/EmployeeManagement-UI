import showMessage, { type MessageType } from "@/utils/showMessage";
import {
    type MutationOptions,
    type QueryKey,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

export const CacheTimeDefault: number = 5 * 60 * 1000;

interface Message {
    content?: string | React.ReactNode;
    type?: MessageType;
}

type QueryError = {
    name?: "AxiosError";
    message: string;
};

interface DataResponse {
    code: number;
    message: string;
}

export interface UsePostOptions<TResponse extends DataResponse, TRequest>
    extends MutationOptions<TResponse, QueryError, TRequest> {
    queryKey?: QueryKey;
    showError?: false | "silent";
    messageError?: Message;
    messageSuccess?: Message;
}

export interface UseDeleteOptions<TResponse extends DataResponse, TRequest>
    extends MutationOptions<TResponse, QueryError, TRequest> {
    queryKey?: QueryKey;
    showError?: false | "silent";
    messageError?: Message;
    messageSuccess?: Message;
}

export const usePost = <TResponse extends DataResponse, TRequest>({
    queryKey,
    showError,
    messageError,
    messageSuccess,
    ...config
}: UsePostOptions<TResponse, TRequest>) => {
    const queryClient = useQueryClient();
    const context = useMutation<TResponse, QueryError, TRequest, unknown>({
        onSettled: () => {
            if (queryKey?.length) {
                void queryClient.invalidateQueries({ queryKey });
            }
        },
        ...config,
        onMutate: async (data, context) => {
            if (queryKey?.length) {
                await queryClient.cancelQueries({ queryKey });
            }
            if (typeof config.onMutate === "function") {
                return await config.onMutate(data, context);
            }
        },
        onSuccess: (data, variables, onMutateResult, context) => {
            if (data.code >= 1000 && data.code <= 1999) {
                if (messageSuccess?.type === "modal") {
                    showMessage({
                        type: "modal",
                        level: "success",
                        title:
                            typeof messageSuccess.content === "string"
                                ? messageSuccess.content
                                : messageSuccess.content,
                    });
                } else if (messageSuccess?.type === "toast") {
                    showMessage({
                        type: "toast",
                        level: "success",
                        title:
                            typeof messageSuccess.content === "string"
                                ? messageSuccess.content
                                : messageSuccess.content,
                    });
                } else if ([203, 204].includes(data.code)) {
                    if (messageSuccess?.type === "toast") {
                        showMessage({
                            type: "toast",
                            level: "warning",
                            title:
                                typeof messageSuccess.content === "string"
                                    ? messageSuccess.content
                                    : messageSuccess.content,
                        });
                    } else {
                        if (messageSuccess?.type === "toast") {
                            showMessage({
                                type: "toast",
                                level: "error",
                                title:
                                    typeof messageSuccess.content === "string"
                                        ? messageSuccess.content
                                        : messageSuccess.content,
                            });
                        } else {
                            showMessage({
                                type: "modal",
                                level: "error",
                                title:
                                    typeof messageSuccess?.content === "string"
                                        ? messageSuccess.content
                                        : messageSuccess?.content,
                            });
                        }
                    }
                }
            }

            if (typeof config.onSuccess === "function") {
                config.onSuccess(data, variables, onMutateResult, context);
            }
        },
        onError: (error, variables, onMutateResult, context) => {
            if (error && showError !== "silent") {
                if (messageError?.type === "toast") {
                    showMessage({
                        type: "toast",
                        level: "error",
                        title: error.message,
                    });
                } else {
                    showMessage({
                        type: "modal",
                        level: "error",
                        title: error.message,
                    });
                }
            }
            if (typeof config.onError === "function") {
                config.onError(error, variables, onMutateResult, context);
            }
        },
    });

    return context;
};

export const useDelete = <TResponse extends DataResponse, TRequest>({
    queryKey,
    showError,
    messageError,
    messageSuccess,
    ...config
}: UseDeleteOptions<TResponse, TRequest>) => {
    const queryClient = useQueryClient();
    const context = useMutation<TResponse, QueryError, TRequest, unknown>({
        onSettled: () => {
            if (queryKey?.length) {
                void queryClient.invalidateQueries({ queryKey });
            }
        },
        ...config,
        onMutate: async (data, context) => {
            if (queryKey?.length) {
                await queryClient.cancelQueries({ queryKey });
            }
            if (typeof config.onMutate === "function") {
                return await config.onMutate(data, context);
            }
        },
        onSuccess: (data, variables, onMutateResult, context) => {
            if (data.code >= 1000 && data.code <= 1999) {
                if (messageSuccess?.type === "modal") {
                    showMessage({
                        type: "modal",
                        level: "success",
                        title:
                            typeof messageSuccess.content === "string"
                                ? messageSuccess.content
                                : messageSuccess.content,
                    });
                } else if (messageSuccess?.type === "toast") {
                    showMessage({
                        type: "toast",
                        level: "success",
                        title:
                            typeof messageSuccess.content === "string"
                                ? messageSuccess.content
                                : messageSuccess.content,
                    });
                } else if ([203, 204].includes(data.code)) {
                    if (messageSuccess?.type === "toast") {
                        showMessage({
                            type: "toast",
                            level: "warning",
                            title:
                                typeof messageSuccess.content === "string"
                                    ? messageSuccess.content
                                    : messageSuccess.content,
                        });
                    } else {
                        if (messageSuccess?.type === "toast") {
                            showMessage({
                                type: "toast",
                                level: "error",
                                title:
                                    typeof messageSuccess.content === "string"
                                        ? messageSuccess.content
                                        : messageSuccess.content,
                            });
                        } else {
                            showMessage({
                                type: "modal",
                                level: "error",
                                title:
                                    typeof messageSuccess?.content === "string"
                                        ? messageSuccess.content
                                        : messageSuccess?.content,
                            });
                        }
                    }
                }
            }

            if (typeof config.onSuccess === "function") {
                config.onSuccess(data, variables, onMutateResult, context);
            }
        },
        onError: (error, variables, onMutateResult, context) => {
            if (error && showError !== "silent") {
                if (messageError?.type === "toast") {
                    showMessage({
                        type: "toast",
                        level: "error",
                        title: error.message,
                    });
                } else {
                    showMessage({
                        type: "modal",
                        level: "error",
                        title: error.message,
                    });
                }
            }
            if (typeof config.onError === "function") {
                config.onError(error, variables, onMutateResult, context);
            }
        },
    });

    return context;
};
