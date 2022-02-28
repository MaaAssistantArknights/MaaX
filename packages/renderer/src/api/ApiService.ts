import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import version from "@/hooks/caller/version";
import _ from "lodash";

const getCoreVersion = () => {
  const coreVersion = version.core();
  return coreVersion ? `(core ${coreVersion})` : "(without core)";
};

class ApiService {
  constructor(baseUrl: string) {
    this._instance = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
    });

    this._instance.interceptors.request.use(
      (request) => {
        request.headers = Object.assign(request.headers ?? {}, {
          "User-Agent": ApiService._ua,
        });
        return request;
      },
      (error) => {
        return Promise.resolve(new Error(error));
      }
    );

    this._instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.resolve(new Error(error));
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T | Error> {
    const response = await this._instance.get(url, config);
    if (_.isError(response)) {
      return response;
    }
    return response.data;
  }

  static updateUA = () => {
    ApiService._ua = `MeoAssistantArknights ${version.ui()} ${getCoreVersion()}`;
  };

  private _instance: AxiosInstance;
  private static _ua: string = `MeoAssistantArknights ${version.ui()} ${getCoreVersion()}`;
}

export default ApiService;
