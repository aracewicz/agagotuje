import {ApiClient} from "../../core/API-client/ApiClient.ts";
import {config} from "../config/config.ts";
export const apiClient = new ApiClient(config.api.baseUrl);
