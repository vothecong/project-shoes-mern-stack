import React, { useState, useEffect } from "react";
import "./index.css";
import pcVN from "pc-vn";
import { Link } from "react-router-dom";
import $ from "jquery";
import { convertPrice } from "../../../HOC/Help";
import { useSelector, useDispatch } from "react-redux";
import { GiCancel } from "react-icons/gi";
import isEmail from "validator/lib/isEmail";
window.$ = $;

const REGEX_PHONE = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

const AddressCheckout = (props) => {
    const dispatch = useDispatch();
    const category = useSelector((state) => state.category);
    const { listCategory } = category;

    const auth = useSelector((state) => state.auth);
    const { user } = auth;

    const [name, setName] = useState(
        Object.keys(user).length > 0 ? user.name : ""
    );
    const [email, setEmail] = useState(
        Object.keys(user).length > 0 ? user.email : ""
    );
    const [phone, setPhone] = useState(
        Object.keys(user).length > 0 ? user.phone : ""
    );
    const [address, setAddress] = useState(
        Object.keys(user).length > 0 ? user.address : ""
    );
    const [newAddress, setNewAddress] = useState(false);
    const cart = useSelector((state) => state.cart.items);
    ///
    const [listCity, setListCity] = useState([]);
    const [listDistructs, setListDistructs] = useState([]);
    const [listWards, setListWards] = useState([]);
    const [city, setCity] = useState(undefined);
    const [distruct, setDistruct] = useState(undefined);
    const [ward, setWard] = useState(undefined);
    const [street, setStreet] = useState("84/14, duong so 6");
    ///
    useEffect(() => {
        const getProvinces = pcVN.getProvinces();
        setListCity(getProvinces);
        if (typeof city !== "undefined") {
            let data = pcVN.getDistrictsByProvinceCode(city);
            setListDistructs(data);
        }
        if (typeof distruct !== "undefined") {
            let dataWards = pcVN.getWardsByDistrictCode(distruct);
            setListWards(dataWards);
        }
    }, [city, dispatch, distruct]);

    const handleError = () => {
        let flag = true;
        if (name.length === 0) {
            flag = false;
            $("#error_name_client").show();
            $("#error_name_client").text("H??? t??n kh??ng ???????c ????? tr???ng!!!");
        } else {
            $("#error_name_client").hide();
        }
        if (phone.length === 0 || !REGEX_PHONE.test(phone)) {
            flag = false;
            $("#error_phone_client").show();
            $("#error_phone_client").text("S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!!!");
        } else {
            $("#error_phone_client").hide();
        }

        if (email.length === 0 || !isEmail(email)) {
            $("#error_email_client").show();
            $("#error_email_client").text(
                "Email kh??ng ???????c ????? tr???ng ho???c kh??ng ch??nh x??c!!!"
            );
            flag = false;
        } else {
            $("#error_email_client").hide();
        }

        if (Object.is(city, undefined)) {
            $("#error_city_client").text("Vui l??ng ch???n Th??nh Ph???/T???nh!");
            $("#error_city_client").show();
            flag = false;
        } else {
            $("#error_city_client").hide();
        }

        if (Object.is(distruct, undefined)) {
            $("#error_distruct_client").text("Vui l??ng ch???n Qu???n/Huy???n!");
            $("#error_distruct_client").show();
            flag = false;
        } else {
            $("#error_distruct_client").hide();
        }

        if (Object.is(ward, undefined)) {
            $("#error_ward_client").text("Vui l??ng ch???n X??/Th??? Tr???n!");
            $("#error_ward_client").show();
            flag = false;
        } else {
            $("#error_ward_client").hide();
        }

        if (street.length === 0) {
            $("#error_street_client").text("Vui l??ng nh???p t??n ???????ng!");
            $("#error_street_client").show();
            flag = false;
        } else {
            $("#error_street_client").hide();
        }

        return flag;
    };

    const toUpper = (str) => {
        return str
            .toLowerCase()
            .split(" ")
            .map(function (Word) {
                return Word[0].toUpperCase() + Word.substr(1);
            })
            .join(" ");
    };

    const handleAddNewAddress = (e) => {
        e.preventDefault();
        if (handleError()) {
            const d1 = listCity.find((x) => x.code.toString() === city.toString());
            const d2 = listDistructs.find(
                (x) => x.code.toString() === distruct.toString()
            );
            const d3 = listWards.find((x) => x.code.toString() === ward.toString());
            let newAddress = "";
            if (d1 || d2 || d3) {
                newAddress = `${toUpper(street)}, ${d3.name}, ${d2.name}, ${d1.name}`;
            }

            setNewAddress(false);
            // eslint-disable-next-line no-unused-vars
            const item = {
                name,
                phone,
                address: newAddress,
                id: null,
            };
            setAddress(newAddress);
        }
    };

    const handleLink = (item) => {
        let data = listCategory.find((x) => x._id === item.categoryID);
        if (data) {
            return (
                <Link
                    to={`/chi-tiet/${data.slug}/${item.slug}`}
                    style={{ textTransform: "capitalize" }}
                    className="name-product-cart-in-page-address-checkout"
                >
                    <span style={{ fontSize: "20px", fontWeight: "bold" }} >{item.quantity} </span> x {item.name}
                </Link>
            );
        }
    };

    const handleDeleteAddressOrder = () => {
        setName("");
        setAddress("");
        setPhone("");
        setEmail("");
        setNewAddress(true);
    };

    const handleShipToAddress = () => {
        props.handleNext();
        const item = {
            name,
            phone,
            address,
            id: null,
        };
        props.handleGetInfo(item);
    };

    return (
        <div className="address-checkout">
            <div className="info-order-address-checkout">
                <div className="title-address-checkout">
                    <div>
                        <span>????n h??ng</span>
                        <br />
                        <span>({cart && cart.length} s???n ph???m)</span>
                    </div>
                    {/* title-address-checkout */}
                    <Link to="/gio-hang" className="edit-order-address-checkout">
                        s???a{""}
                    </Link>
                </div>
                {/* edit-order-address-checkout */}
                {cart.length > 0 ? (
                    cart.map((item, index) => (
                        <div
                            key={index}
                            className="list-product-cart-in-page-address-checkout"
                        >
                            <div>
                                <div className="image-by-product-cart-in-page-address-checkout">
                                    {/* <span className="quantity-product-cart-in-page-address-checkout">
                                        {item.quantity}{" "}
                                    </span> */}
                                    <img src={item.images[0].img} alt={item.name} />
                                </div>
                                {/* image-by-product-cart-in-page-address-checkout */}
                                {handleLink(item)}
                            </div>
                            {/* name-product-cart-in-page-address-checkout */}
                            <spam className="total-money-by-product-cart-page-address-checkout">
                                {convertPrice(item.price)}
                            </spam>
                        </div>
                    ))
                ) : (
                        <div>loading...</div>
                    )}

                {/* list-product-cart-in-page-address-checkout */}

                <p className="total-money-address-checkout">
                    <span>Th??nh ti???n:</span>
                    <span>
                        {convertPrice(cart.reduce((a, c) => a + c.price * c.quantity, 0))}
                    </span>
                </p>
                {/* total-money-address-checkout */}
            </div>
            {/* info-order-address-checkout */}
            <div className="delivery-address-checkout">
                <div className="title-delivery-address-checkout">
                    <div>
                        <h3>?????a ch??? giao h??ng</h3>
                        {/* <p>Ch???n ?????a ch??? giao h??ng</p> */}
                    </div>
                    {newAddress ? (
                        <div className="form-add-new-address-checkout">
                            <h4>Th??m ?????a ch???</h4>
                            <form onSubmit={(e) => handleAddNewAddress(e)}>
                                <div className="div-input-address-checkout">
                                    <div className="input-in-address-checkout">
                                        <label htmlFor="name"> H??? t??n: </label>
                                        <br />
                                        <input
                                            type="text"
                                            placeholder="M???i b???n nh???p h??? v?? t??n"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={{
                                                textTransform: "capitalize",
                                                width: "13rem",
                                                height: "25px",
                                            }}
                                        />
                                        <br />
                                        <span
                                            style={{
                                                color: "red",
                                                fontWeight: "bold",
                                                display: "none",
                                            }}
                                            id="error_name_client"
                                        />
                                    </div>
                                    {/* input-in-address-checkout */}
                                    <div className="input-in-address-checkout">
                                        <label htmlFor="phone"> S??? ??i???n tho???i: </label>
                                        <br />
                                        <input
                                            type="text"
                                            placeholder="M???i b???n nh???p s??? ??i???n tho???i"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            style={{
                                                textTransform: "capitalize",
                                                width: "13rem",
                                                height: "25px",
                                            }}
                                        />
                                        <br />
                                        <span
                                            style={{
                                                color: "red",
                                                fontWeight: "bold",
                                                display: "none",
                                            }}
                                            id="error_phone_client"
                                        />
                                    </div>
                                    {/* input-in-address-checkout */}
                                </div>
                                <div
                                    className="input-in-address-checkout"
                                    style={{ marginLeft: "18px" }}
                                >
                                    <label htmlFor="email">Email: </label>
                                    <br />
                                    <input
                                        type="text"
                                        placeholder="Vui l??ng nh???p email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: "92%", height: "25px" }}
                                    />
                                    <br />
                                    <span
                                        style={{
                                            color: "red",
                                            fontWeight: "bold",
                                            display: "none",
                                        }}
                                        id="error_email_client"
                                    />
                                </div>
                                {/* input-in-address-checkout */}
                                {/* end div input */}
                                <div
                                    className="div-textarea-in-address-checkout"
                                    style={{
                                        width: "93%",
                                        margin: "5px 10px",
                                        display: "inline-block",
                                    }}
                                >
                                    <div
                                        style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <div>
                                            <label htmlFor="city">T???nh/Th??nh Ph???:</label>
                                            <br />
                                            <select
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                style={{
                                                    width: "14rem",
                                                    padding: "10px",
                                                    borderRadius: "7px",
                                                    fontSize: "18px",
                                                    outline: "none",
                                                }}
                                            >
                                                <option value="">Vui l??ng ch???n t???nh/th??nh ph??? </option>
                                                {listCity &&
                                                    listCity.map((item, index) => (
                                                        <option key={index} value={item.code}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            <br />
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontWeight: "bold",
                                                    display: "none",
                                                }}
                                                id="error_city_client"
                                            />
                                        </div>
                                        {/* city */}
                                        {city && (
                                            <div>
                                                <label htmlFor="distruct">Qu???n/Huy???n:</label>
                                                <br />
                                                <select
                                                    value={distruct}
                                                    onChange={(e) => setDistruct(e.target.value)}
                                                    style={{
                                                        width: "14rem",
                                                        padding: "10px",
                                                        borderRadius: "7px",
                                                        fontSize: "18px",
                                                        outline: "none",
                                                    }}
                                                >
                                                    <option value="">Vui l??ng ch???n Qu???n/Huy???n </option>
                                                    {listDistructs &&
                                                        listDistructs.map((item, index) => (
                                                            <option key={index} value={item.code}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                <br />
                                                <span
                                                    style={{
                                                        color: "red",
                                                        fontWeight: "bold",
                                                        display: "none",
                                                    }}
                                                    id="error_distruct_client"
                                                />
                                            </div>
                                            // distruct
                                        )}
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        {distruct && (
                                            <div>
                                                <label htmlFor="ward">X??/Th??? Tr???n:</label>
                                                <br />
                                                <select
                                                    value={ward}
                                                    onChange={(e) => setWard(e.target.value)}
                                                    style={{
                                                        width: "14rem",
                                                        padding: "10px",
                                                        borderRadius: "7px",
                                                        fontSize: "18px",
                                                        outline: "none",
                                                    }}
                                                >
                                                    <option value="">Vui l??ng ch???n Th??? Tr???n/X?? </option>
                                                    {listWards &&
                                                        listWards.map((item, index) => (
                                                            <option key={index} value={item.code}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                <br />
                                                <span
                                                    style={{
                                                        color: "red",
                                                        fontWeight: "bold",
                                                        display: "none",
                                                    }}
                                                    id="error_ward_client"
                                                />
                                            </div>
                                            // distruct
                                        )}
                                        {ward && (
                                            <div>
                                                <label htmlFor="ward">S??? nh?? v?? T??n ???????ng:</label>
                                                <br />
                                                <input
                                                    type="text"
                                                    placeholder="Vui l??ng nh???p S??? nh?? v?? T??n ???????ng"
                                                    value={street}
                                                    onChange={(e) => setStreet(e.target.value)}
                                                    style={{
                                                        width: "12.8rem",
                                                        padding: "11px",
                                                        borderRadius: "7px",
                                                        fontSize: "16px",
                                                        outline: "none",
                                                        marginLeft: "9px",
                                                        textAlign: "center",
                                                        textTransform: "capitalize",
                                                    }}
                                                />
                                                <br />
                                                <span
                                                    style={{
                                                        color: "red",
                                                        fontWeight: "bold",
                                                        display: "none",
                                                    }}
                                                    id="error_street_client"
                                                />
                                            </div>
                                            // distruct
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="button-finish-in-address-checkout"
                                    type="submit"
                                >
                                    ho??n th??nh{""}
                                </button>
                            </form>
                        </div>
                    ) : (
                            // form-add-new-address-checkout
                            name !== "" &&
                            phone !== "" &&
                            address !== "" && (
                                <div
                                    style={{ textAlign: "center", lineHeight: "38px" }}
                                    div
                                    className="info-delivery-address-checkout"
                                >
                                    <div
                                        className="cancel-address-checkout"
                                        onClick={() => handleDeleteAddressOrder()}
                                    >
                                        <GiCancel />
                                    </div>
                                    <p
                                        style={{
                                            textTransform: "capitalize",
                                            fontWeight: "600",
                                            fontSize: "20px",
                                        }}
                                    >
                                        {name}
                                    </p>
                                    <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                                        <span
                                            style={{
                                                fontWeight: "650",
                                                textTransform: "capitalize",
                                                fontSize: "16px",
                                            }}
                                        >
                                            S??? ??i???n tho???i:{""}
                                        </span>{" "}
                                        {phone}
                                    </p>
                                    <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                                        <span
                                            style={{
                                                fontWeight: "650",
                                                textTransform: "capitalize",
                                                fontSize: "16px",
                                            }}
                                        >
                                            ?????a ch???:{""}
                                        </span>
                                        <span
                                            style={{
                                                textTransform: "capitalize",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                            }}
                                        >
                                            {address}
                                        </span>
                                    </p>
                                    {Object.is(phone, null) && Object.is(address, null) ? null : (
                                        <p
                                            className="continue-payment-signin-checkout"
                                            onClick={() => {
                                                handleShipToAddress();
                                            }}
                                        >
                                            giao ?????n ?????a ch??? n??y{" "}
                                        </p>
                                    )}
                                </div>
                            )
                        )}
                    {/* {Object.keys(user).length > 0
                        ? null
                        : !newAddress && (
                            <div
                                className="button-add-new-address-checkout"
                                onClick={() => setNewAddress(true)}
                            >
                                th??m ?????a ch??? m???i
                            </div>
                        )} */}
                    {!newAddress && (
                        <div
                            className="button-add-new-address-checkout"
                            onClick={() => setNewAddress(true)}
                        >
                            th??m ?????a ch??? m???i
                        </div>
                    )}
                </div>
                {/* title-delivery-address-checkout */}
                <div className="ship-address-checkout"></div>
                {/* ship-address-checkout */}
            </div>
            {/* delivery-address-checkout */}
        </div>
        // address-checkout
    );
};

export default AddressCheckout;
