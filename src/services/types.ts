export interface GitUser {
    avatar_url: string,
    html_url: string,
    repos_url: string,
    url: string
}

export interface UserSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitUser[];
}

export interface GitUserPublicDetails {
    id: number;
    avatar_url: string,
    name: string,
    bio: string,
    company: string,
    created_at: string,
    followers: number,
    following: number,
    html_url: string,
    location: string,
    followers_url: string,
    following_url: string,
}

export interface GitRepoDetails {
    id: number;
    name: string;
    commits_url: string;
}
