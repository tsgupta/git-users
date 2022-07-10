import React from "react";
import { UserDetails } from "../types/types";
import { UserDetailsRenderer } from "./UserDetailsRenderer";

interface UserDetailsListProps {
    details: UserDetails[];
}

export const UserDetailsList: React.FC<UserDetailsListProps> = (props) => {
    const { details: userDetails } = props;
    return <>
        {userDetails.length > 0 && <div className='user-details-container'>
            <div className='user-details-header'>Searched User Details</div>
            {userDetails.map(details =>
                <UserDetailsRenderer details={details} key={details.publicDetails.id} />
            )}
        </div>}
    </>;
};
