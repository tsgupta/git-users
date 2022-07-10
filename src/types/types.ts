import { GitUserPublicDetails } from "../services/types";

export interface SearchInput {
    firstName: string;
    lastName: string;
    location: string;
}

export interface UserDetails {
    publicDetails: GitUserPublicDetails;
    repos: GitRepo[];
}

export interface GitRepo {
    id: number;
    repoName: string;
    commits: number;
}
