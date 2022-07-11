import { OctokitResponse } from "@octokit/types";
import { useCallback, useEffect, useState } from "react";
import { gitServiceFactory } from "../services/GitService";
import { GitRepoDetails, GitUser, GitUserPublicDetails } from "../services/types";
import { GitRepo, SearchInput, UserDetails } from "../types/types";

const MAX_WAIT_MILLIS = 10000;

export const useFindUserDetails = (inputs: SearchInput[]) => {
    const [userDetails, setAllUserDetails] = useState<UserDetails[]>([]);
    
    const fetchDetails = useCallback(async (inputs: SearchInput[]) => {
        const gitService = gitServiceFactory.getInstance();
        setAllUserDetails([]);
        if (!inputs || inputs.length === 0) {
            return;
        }
        let i = 0;
        while (i < inputs.length) {
            const detailsResp = await gitService.getUserDetails(inputs[i]).then();
            const {
                data: { items }
            } = detailsResp;

            if (isLimitReached(detailsResp)) {
                const resetTime = getResetTime(detailsResp);
                const waitMillis = Number(resetTime) * 1000 - Date.now();
                if (!isNaN(waitMillis) && waitMillis < MAX_WAIT_MILLIS) {
                    console.log('Waiting for:' + waitMillis);
                    // wait and retry
                    await wait(waitMillis);
                    continue;
                } else {
                    break;
                }
            }

            if (items.length > 0) {
                const user = items[0];
                Promise.all([getPublicDetails(user), getRepoDetails(user)]).then(([publicDetails, repos]) => {
                    if (publicDetails) {
                        const userDetails: UserDetails = {
                            publicDetails,
                            repos
                        };
                        setAllUserDetails(existingUsers => [...existingUsers, userDetails]);
                    }
                });
            }
            ++i;
        }
    }, []);

    useEffect(()=>{
        fetchDetails(inputs);
    },[inputs, fetchDetails]);

    return {
        userDetails
    }
}

async function wait(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Done waiting");
            resolve(ms);
        }, ms);
    });
}

function isLimitReached(resp: OctokitResponse<any>) {
    const {
        headers: { "x-ratelimit-remaining": remainingLimit }
    } = resp;
    return remainingLimit === "0";
}

function getResetTime(resp: OctokitResponse<any>) {
    const {
        headers: { "x-ratelimit-reset": resetTime }
    } = resp;
    return resetTime;
}

async function getPublicDetails(user: GitUser) {
    const { url } = user;

    const gitService = gitServiceFactory.getInstance();
    const publicDetailsResp = await gitService.request<GitUserPublicDetails>(url);
    if (isLimitReached(publicDetailsResp)) {
        return null;
    }
    const { data: publicDetails } = publicDetailsResp;
    return publicDetails;
}

async function getRepoDetails(user: GitUser) {
    const { repos_url } = user;
    const gitService = gitServiceFactory.getInstance();
    const repoDetailsResp = await gitService.request<GitRepoDetails[]>(repos_url);
    if (isLimitReached(repoDetailsResp)) {
        return [];
    }
    const { data: repoDetails } = repoDetailsResp;
    const commitRequests: Promise<GitRepo>[] = [];
    for (let i = 0; i < repoDetails.length; ++i) {
        const repo = repoDetails[i];
        const { name, commits_url, id } = repo;
        const url = commits_url.replace('{/sha}', '');
        const commitReq = gitService.request<any[]>(url)
            .then(commitResp => {
                const repo: GitRepo = {
                    id,
                    repoName: name,
                    commits: commitResp.data.length
                };
                return repo;
            })
            .catch(() => {
                console.error('Error fetching commits');
                return null;
            });
        commitRequests.push(commitReq);
    };
    const repos = await Promise.all(commitRequests).then(repos => repos.filter(r => Boolean(r)));
    return repos;
}
