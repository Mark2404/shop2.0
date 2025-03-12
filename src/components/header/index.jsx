import React, { useState } from 'react';
import { RxExit } from "react-icons/rx";
import { Spin } from 'antd';
import { logout } from '../../utils/API';
import useGroups from '../hooks/useGroups';
import { FaSearch } from "react-icons/fa";
import './index.scss';
import Search from 'antd/es/transfer/search';

const Header = () => {
    const [group, setGroup] = useState([]);
    const { groups, isLoadingGroups, isErrorGroups } = useGroups(group);


    return (
        <div className="header">
            <header>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h1>Useful Product List</h1>
                </div>

                <label>

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                    />
                    {group.length > 0 && (
                        <div className="search-results">
                            {groups.length > 0 && !isLoadingGroups && <h3>Groups</h3>}
                            <ul>
                                {isLoadingGroups ? (
                                    <p className="loading">Loading groups...</p>
                                ) : groups.length > 0 ? (
                                    groups?.map((user, index) => (
                                        <li key={user.id || index + 1}>
                                            <div className="user">
                                                <div className="user-info">
                                                    <h4>{user.name}</h4>
                                                    <span>{new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</span>
                                                </div>
                                                <p>Created By: <span>{user.owner.name}</span></p>
                                            </div>
                                            <button className="join-btn">Join</button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="no-results">No groups found</p>
                                )}
                            </ul>
                        </div>
                    )}
                </label>


                <div className="exit-box" onClick={logout}>
                    <p>Log out</p>
                    <RxExit className="exit-icon" />
                </div>
            </header>
        </div>
    );
};

export default Header;
