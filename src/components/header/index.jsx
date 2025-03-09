import React from 'react'
import { RxExit } from "react-icons/rx";
import './index.scss';
import { Input, Space } from 'antd';
import { logout } from '../../utils/API'
const { Search } = Input;
import { FaSearch } from "react-icons/fa";
const onSearch = (value, _e, info) => console.log(info?.source, value);
const Exit = () => {
    logout();
}
const index = () => {
    return (
        <div className='header'>
            <header>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h1>Useful product list</h1>

                </div>


                <Search
                    className='gruop-search'
                    placeholder="input search text"
                    allowClear
                    enterButton=<FaSearch />
                    size="large"
                    onSearch={onSearch}
                />
                <div className='exit-box' onClick={Exit}    >
                    <p>log out</p>
                    <RxExit className='exit-icon' />

                </div>

            </header>
        </div>


    )
}

export default index