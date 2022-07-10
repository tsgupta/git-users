import React, { useState } from "react";
import { UserDetails } from "../types/types";

interface UserDetailsRendererProps {
    details: UserDetails;
}

export const UserDetailsRenderer: React.FC<UserDetailsRendererProps> = (props) => {
    const { details: { publicDetails, repos } } = props;
    const {
        avatar_url,
        name,
        bio,
        company,
        created_at,
        followers,
        following,
        html_url,
        location,
    } = publicDetails;

    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const date = new Date(created_at).toDateString();

    return <div className="user-details">
        <img src={avatar_url} alt="avatar" />
        <span style={{ marginLeft: "6px" }}>{name}</span>
        <span className="show-details" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "Show" : "Hide"} Details
        </span>
        {!isCollapsed && <div className="details">
            <span>Location: {location}</span>
            <span>Bio: {bio}</span>
            <span>Company: {company}</span>
            <span>User since: {date}</span>
            <span>Followers: {followers}</span>
            <span>Following: {following}</span>
            <a href={html_url} target="_blank" rel="noopener noreferrer">Profile link</a>
            <span className="repo-header">Repositories</span>
            {repos.map(repo =>
                <div key={repo.id}>
                    <span>{repo.repoName}: {repo.commits} commits</span>
                </div>
            )}
        </div>}
    </div>;
};
