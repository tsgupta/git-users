import { OctokitResponse } from "@octokit/types";
import { Octokit } from "octokit";
import { SearchInput } from "../types/types";
import { UserSearchResponse } from "./types";
import gitconfig from "../gitconfig.json";

export interface GitService {
    getUserDetails: (input: SearchInput) => Promise<OctokitResponse<UserSearchResponse>>;
    request: <T = unknown>(req: string) => Promise<OctokitResponse<T>>;
}

class GitServiceImpl implements GitService {
    private octokit: Octokit;
    private searchCache: Map<string, OctokitResponse<UserSearchResponse>>;

    constructor() {
        this.octokit = new Octokit({ auth: gitconfig["access-token"] });
        this.searchCache = new Map();
    }

    async getUserDetails(input: SearchInput): Promise<OctokitResponse<UserSearchResponse>> {
        const q = this.getQueryString(input);
        if (this.searchCache.has(q)) {
            return this.searchCache.get(q);
        }
        const resp = await this.octokit.request('GET /search/users', { q });
        this.searchCache.set(q, resp);
        return resp;
    }

    private getQueryString(input: SearchInput) {
        const { firstName, lastName, location } = input;
        let q = `fullname:${firstName} ${lastName} type:user`;
        if (location) {
            q += ` location:${location}`;
        }
        return q;
    }

    async request<T = unknown>(req: string) {
        return this.octokit.request(req, {}) as unknown as OctokitResponse<T>;
    }
}

class GitServiceFactory {
    private gitService: GitService;

    getInstance(){
        if(!this.gitService) {
            this.gitService = new GitServiceImpl();
        }
        return this.gitService;
    }
}

const gitServiceFactory = new GitServiceFactory();
export { gitServiceFactory };
