import React, { useEffect, useState } from 'react';
import './index.css';
import { convertPrice } from '../../../HOC/Help';
import { useDispatch } from 'react-redux';
import { sortProductAction, filterProductAction, searchSizeProductAction } from '../../../Actions/productAction';
import $ from 'jquery';
window.$ = $;

const LeftProductByCategory = (props) => {
    const dispatch = useDispatch();
    const { id } = props;

    const [listSize, setListSize] = useState([]);
    const [save, setSave] = useState({});
    const [quantity, setQuantity] = useState(0);
    const [countClick, setCountClick] = useState(0);
    const [sort, setSort] = useState("");
    const [selectFilter, setSelectFilter] = useState("");
    const [nameCategory, setNameCategory] = useState("");


    const handelLoop = () => {
        let arr = [];
        for (let i = 1; i <= 22; i++) {
            arr.push({
                id: i,
                name: (i + 23).toString(),
                quantity: i + 13,
            });
        }
        return arr;
    };

    useEffect(() => {
        let value = handelLoop();
        if (value.length > 0) {
            setListSize(value);
        }
    }, []);

    const handleClickSize = (item) => {
        let solan = countClick;
        let getQuantity = listSize.find((x) => x.id === item.id);
        if (getQuantity) {
            if (Object.keys(save).length === 0) {
                solan = solan + 1;
                setSave(item);
            }
            if (Object.keys(save).length > 0) {
                if (save.id === getQuantity.id) {
                    solan = solan + 1;
                }
                if (save.id !== getQuantity.id) {
                    solan = 1;
                    handelSendServer(getQuantity);
                    setSave(getQuantity);
                }
            }
        }
        if (solan === 1) {
            handelSendServer(getQuantity.name);
            setQuantity(getQuantity.quantity);
        }
        if (solan === 2) {
            setQuantity(0);
            handelSendServer("all");
            solan = 0;
        }
        setCountClick(solan);
    };


    const handelSendServer = (item) => {
        dispatch(searchSizeProductAction(item, id));
    }

    // begin sort
    const handleErrorSort = () => {
        let flag = true;
        if (sort.length === 0) {
            flag = false;
            $("#sort").show();
            $("#sort").text("B???n ch??a l???a ch???n s???p x???p!!!");
        } else {
            $("#sort").hide();
        }
        return flag;
    }

    const handleSort = () => {
        if (handleErrorSort()) {
            const parameter = sort.split("+")[0];
            const value = sort.split("+")[1];
            dispatch(sortProductAction(parameter, value, id));
            setSelectFilter(undefined);
        }
    }
    // end sort

    // begin filter
    const handleErrorFilter = () => {
        let flag = true;
        if (selectFilter.length === 0) {
            flag = false;
            $("#filter").show();
            $("#filter").text("B???n ch??a l???a ch???n s???p x???p!!!");
        } else {
            $("#filter").hide();
        }
        return flag;
    }
    const handleFilter = () => {
        if (handleErrorFilter()) {
            const min = selectFilter.split("-")[0];
            const max = selectFilter.split("-")[1];
            dispatch(filterProductAction(max, min, id));
            setSort(undefined);
        }
    }
    // end filter


    return (
        <div className="list-product-by-category">
            <div className="sort-layout">
                <label htmlFor="sort">s???p x???p theo</label><br />
                <select
                    className="browser-default"
                    name={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="" selected>
                        S???p x???p:
            </option>
                    <option value="price+1">Gi??: T??ng d???n</option>
                    <option value="price+-1">Gi??: Gi???m d???n</option>
                    <option value="createdAt+1">C?? nh???t</option>
                    <option value="createdAt+-1">M???i nh???t</option>
                </select>
                <p id="sort" />
                <div className="filter-sort" onClick={() => handleSort()} >l???c</div>
            </div>
            {/* sort-layout */}
            <div className="filter-layout">
                <label htmlFor="filter">b??? l???c</label>
                <br />
                <select
                    name={selectFilter}
                    onChange={(e) => setSelectFilter(e.target.value)}
                    className="browser-default"
                >
                    <option value="" disabled selected>
                        Ch???n m???c gi??
            </option>
                    <option value="ALL">All</option>
                    <option value="0-700000">D?????i {convertPrice(700000)}</option>
                    <option value="700000-800000">T??? {convertPrice(700000)} - {convertPrice(800000)}</option>
                    <option value="800000-900000">T??? {convertPrice(800000)} - {convertPrice(900000)}</option>
                    <option value="900000-10000000">Tr??n {convertPrice(900000)}</option>
                </select>
                <p id="filter" />
                <div className="filter-price" onClick={() => handleFilter()} >l???c theo gi??</div>
            </div>
            {/* filter-layout */}

            <div className="size-layout">
                <label htmlFor="size">K??ch th?????c:</label>
                <div className="list-size">
                    {listSize &&
                        listSize.map((item, index) => (
                            <div
                                onClick={() => handleClickSize(item)}
                                className={quantity === item.quantity ? "active" : ""}
                                id="element"
                                key={index}
                            >
                                {item.name}
                            </div>
                        ))}
                </div>
            </div>
            {/* size-layout */}
        </div>
        // list-product-by-category
    );
}

export default LeftProductByCategory;
