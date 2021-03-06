import React, { useState, useEffect, useRef } from "react";
import {
    Jumbotron,
    Button,
    Col,
    Container,
    Row,
    FormControl,
    Form,
} from "react-bootstrap";
import pcVN from "pc-vn";
import Layout from "../../Components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import "./index.css";
import $ from "jquery";
import { signupAdminAtion, updateAccountAction } from "../../Actions/authAction";
window.$ = $;
/**
 * FaSave
 * GiCancel
 */

const REGEX_PHONE = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const Detail = (props) => {
    const refImage = useRef(null);
    const dispatch = useDispatch();
    const [flag, setFlag] = useState(false);
    const [flagRegister, setFlagRegister] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    //register admin
    const [nameRegister, setNameRegister] = useState("");
    const [emailRegister, setEmailRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const [image, setImage] = useState("");

    const auth = useSelector((state) => state.auth);
    const { user, messageRegister, errorRegister } = auth;

    ///
    const [listCity, setListCity] = useState([]);
    const [listDistructs, setListDistructs] = useState([]);
    const [listWards, setListWards] = useState([]);
    const [city, setCity] = useState(undefined);
    const [distruct, setDistruct] = useState(undefined);
    const [ward, setWard] = useState(undefined);
    const [street, setStreet] = useState("");
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

    const uploadImage = (file) => {
        let data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "instagram-clone");
        data.append("cloud_name", "kh??ng c??");
        fetch("	https://api.cloudinary.com/v1_1/kh-ng-c/image/upload", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((result) => {
                setImage(result.url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleShowUpdateAdmin = (flag) => {
        if (flag) {
            return (
                <Col>
                    <div>
                        <label
                            htmlFor="name"
                            style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                textTransform: "capitalize",
                            }}
                        >
                            H??? v?? T??n:{""}
                        </label>
                        <br />
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            style={{
                                borderRadius: "8px",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                fontSize: "20px",
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <span
                            style={{ color: "red", fontWeight: "bold", display: "none" }}
                            id="error_name_admin"
                        />
                    </div>
                    <br />
                    <div>
                        <label
                            htmlFor="email"
                            style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                textTransform: "capitalize",
                            }}
                        >
                            Email:{""}
                        </label>
                        <br />
                        <span style={{ fontSize: "25px" }}>{user?.email}</span>
                    </div>
                    <br />
                    <div>
                        <label
                            htmlFor="phone"
                            style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                textTransform: "capitalize",
                            }}
                        >
                            S??? ??i???n tho???i:{""}
                        </label>
                        <br />
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            style={{
                                borderRadius: "8px",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                fontSize: "20px",
                            }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <span
                            style={{ color: "red", fontWeight: "bold", display: "none" }}
                            id="error_phone_admin"
                        />
                    </div>
                    <br />
                    <div style={{ width: "208%" }}>
                        <Row>
                            <Col>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                    <Form.Label>T???nh/Th??nh Ph???:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        custom
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        <option value="">Vui l??ng ch???n t???nh/th??nh ph??? </option>
                                        {listCity &&
                                            listCity.map((item, index) => (
                                                <option key={index} value={item.code}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </Form.Control>
                                    <span
                                        style={{ color: "red", fontWeight: "bold" }}
                                        id="error_city_admin"
                                    />
                                </Form.Group>
                            </Col>
                            {/* end Col */}
                            {city && (
                                <Col>
                                    <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Qu???n/Huy???n:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            custom
                                            value={distruct}
                                            onChange={(e) => setDistruct(e.target.value)}
                                        >
                                            <option value="">Vui l??ng ch???n Qu???n/Huy???n </option>
                                            {listDistructs &&
                                                listDistructs.map((item, index) => (
                                                    <option key={index} value={item.code}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </Form.Control>
                                        <span
                                            style={{ color: "red", fontWeight: "bold" }}
                                            id="error_distruct_admin"
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            {/* end Col */}
                        </Row>
                        {distruct && (
                            <Row>
                                <Col>
                                    <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Th??? Tr???n/X??:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            custom
                                            value={ward}
                                            onChange={(e) => setWard(e.target.value)}
                                        >
                                            <option value="">Vui l??ng ch???n Th??? Tr???n/X?? </option>
                                            {listWards &&
                                                listWards.map((item, index) => (
                                                    <option key={index} value={item.code}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </Form.Control>
                                        <span
                                            style={{ color: "red", fontWeight: "bold" }}
                                            id="error_ward_admin"
                                        />
                                    </Form.Group>
                                </Col>
                                {ward && (
                                    <Col>
                                        <label
                                            htmlFor="phone"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "18px",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            S??? Nh?? v?? T??n ???????ng:{""}
                                        </label>
                                        <br />
                                        <textarea
                                            style={{
                                                outline: "none",
                                                border: "1px solid #b6aaaa",
                                                // width: "208%",
                                                height: "3rem",
                                                borderRadius: "13px",
                                                fontSize: "20px",
                                                fontWeight: "600",
                                                textAlign: "center",
                                                textTransform: "capitalize",
                                            }}
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                        ></textarea>
                                        <span
                                            style={{
                                                color: "red",
                                                fontWeight: "bold",
                                                display: "none",
                                            }}
                                            id="error_street_admin"
                                        />
                                    </Col>
                                )}
                            </Row>
                        )}
                    </div>
                </Col>
            );
        }
        return (
            <Col>
                <div>
                    <label
                        htmlFor="name"
                        style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            textTransform: "capitalize",
                        }}
                    >
                        H??? v?? T??n:{""}
                    </label>
                    <br />
                    <span style={{ fontSize: "25px", textTransform: "capitalize" }}>
                        {user?.name}
                    </span>
                </div>
                <br />
                <div>
                    <label
                        htmlFor="email"
                        style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            textTransform: "capitalize",
                        }}
                    >
                        Email:{""}
                    </label>
                    <br />
                    <span style={{ fontSize: "25px" }}>{user?.email}</span>
                </div>
                <br />
                <div>
                    <label
                        htmlFor="phone"
                        style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            textTransform: "capitalize",
                        }}
                    >
                        S??? ??i???n tho???i:{""}
                    </label>
                    <br />
                    <span style={{ fontSize: "20px" }}>
                        {Object.is(user.phone, null)
                            ? "Vui l??ng c???p nh???t s??? ??i???n tho???i"
                            : user.phone}
                    </span>
                </div>
                <br />
                <div style={{ width: "208%" }}>
                    <label
                        htmlFor="address"
                        style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            textTransform: "capitalize",
                        }}
                    >
                        ?????a Ch???:{""}
                    </label>
                    <br />
                    <span style={{ fontSize: "20px", textTransform: "capitalize" }}>
                        {Object.is(user.address, null)
                            ? "Vui l??ng c???p nh???t ?????a ch???"
                            : user.address}
                    </span>
                </div>
            </Col>
        );
    };

    const handleError = () => {
        let flag = true;
        if (Object.is(name, null) || name.length === 0) {
            $("#error_name_admin").text("T??n kh??ng ???????c ????? tr???ng!");
            $("#error_name_admin").show();
            flag = false;
        } else {
            $("#error_name_admin").hide();
        }

        if (phone.length === 0 || !REGEX_PHONE.test(phone)) {
            $("#error_phone_admin").text(
                "S??? ??i???n tho???i c???a b???n kh??ng ????ng ?????nh d???ng!"
            );
            $("#error_phone_admin").show();
            flag = false;
        } else {
            $("#error_phone_admin").hide();
        }

        if (Object.is(city, undefined)) {
            $("#error_city_admin").text("Vui l??ng ch???n Th??nh Ph???/T???nh!");
            $("#error_city_admin").show();
            flag = false;
        } else {
            $("#error_city_admin").hide();
        }

        if (Object.is(distruct, undefined)) {
            $("#error_distruct_admin").text("Vui l??ng ch???n Qu???n/Huy???n!");
            $("#error_distruct_admin").show();
            flag = false;
        } else {
            $("#error_distruct_admin").hide();
        }

        if (Object.is(ward, undefined)) {
            $("#error_ward_admin").text("Vui l??ng ch???n X??/Th??? Tr???n!");
            $("#error_ward_admin").show();
            flag = false;
        } else {
            $("#error_ward_admin").hide();
        }

        if (Object.is(street, null) || street.length === 0) {
            $("#error_street_admin").text("Vui l??ng nh???p t??n ???????ng!");
            $("#error_street_admin").show();
            flag = false;
        } else {
            $("#error_street_admin").hide();
        }

        return flag;
    };

    const handleUpdate = () => {
        if (handleError()) {
            const d1 = listCity.find((x) => x.code.toString() === city.toString());
            const d2 = listDistructs.find(
                (x) => x.code.toString() === distruct.toString()
            );
            const d3 = listWards.find((x) => x.code.toString() === ward.toString());
            let newAddress = "";
            if (d1 || d2 || d3) {
                newAddress = `${street}, ${d3.name}, ${d2.name}, ${d1.name}`;
            }

            dispatch(updateAccountAction(name, phone, newAddress));
            setName("");
            setPhone("");
            setCity(undefined);
            setDistruct(undefined);
            setWard(undefined);
            setStreet("");
            setFlag(false);
        }
    };

    const handleErrorRegister = () => {
        let flag = true;
        if (Object.is(nameRegister, null) || nameRegister.length === 0) {
            $("#error_name_register_admin").text("T??n kh??ng ???????c ????? tr???ng!");
            $("#error_name_register_admin").show();
            flag = false;
        } else {
            $("#error_name_register_admin").hide();
        }

        if (
            Object.is(emailRegister, null) ||
            emailRegister.length === 0 ||
            !REGEX_EMAIL.test(emailRegister)
        ) {
            $("#error_email_register_admin").text("Email kh??ng h???p l???!");
            $("#error_email_register_admin").show();
            flag = false;
        } else {
            $("#error_email_register_admin").hide();
        }

        if (
            Object.is(passwordRegister, null) ||
            passwordRegister.length === 0 ||
            !REGEX_PASSWORD.test(passwordRegister)
        ) {
            $("#error_password_register_admin").text(
                "M???t kh???u t???i thi???u 6 k?? t???, k?? t??? hoa th?????ng, ?????t bi???t!"
            );
            $("#error_password_register_admin").show();
            flag = false;
        } else {
            $("#error_password_register_admin").hide();
        }

        return flag;
    };

    const handleRegister = () => {
        // console.log("handleErrorRegister", handleErrorRegister());
        if (handleErrorRegister()) {
            const data = {
                name: nameRegister,
                email: emailRegister,
                password: passwordRegister,
                avatar: image.length > 0 ? image : undefined,
            };

            dispatch(signupAdminAtion(data));
            setFlagRegister(false);
            setNameRegister("");
            setEmailRegister("");
            setPasswordRegister("");
        }
    };

    return (
        <Layout sidebar>
            <Container className="page">
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <Jumbotron>
                                    <h2 style={{ textAlign: "center" }}>
                                        Th??ng tin t??i kho???n Admin{""}
                                    </h2>
                                    <Row>
                                        {handleShowUpdateAdmin(flag)}
                                        {/* end col left */}
                                        <Col style={{ height: "18rem" }}>
                                            <div>
                                                <label
                                                    htmlFor="avatar"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "18px",
                                                        textTransform: "capitalize",
                                                        textAlign: "center",
                                                        margin: "0px auto",
                                                        display: "block",
                                                    }}
                                                >
                                                    ???nh ?????i di???n:{""}
                                                </label>
                                                <br />
                                                <img
                                                    src={user?.avatar}
                                                    alt={user?.name}
                                                    style={{
                                                        width: "100%",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <br />
                                    <Row>
                                        {flag ? (
                                            <>
                                                <Col>
                                                    <Button
                                                        variant="success"
                                                        block
                                                        onClick={() => handleUpdate()}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <FaSave className="icon-detail" />
                                                        <span
                                                            style={{ fontSize: "23px", marginTop: "-3px" }}
                                                        >
                                                            L??u{""}
                                                        </span>
                                                    </Button>{" "}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        variant="danger"
                                                        block
                                                        onClick={() => {
                                                            setFlag(false);
                                                            setName("");
                                                            setPhone("");
                                                        }}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <MdCancel className="icon-detail" />
                                                        <span
                                                            style={{ fontSize: "23px", marginTop: "-3px" }}
                                                        >
                                                            H???y{""}
                                                        </span>
                                                    </Button>{" "}
                                                </Col>
                                            </>
                                        ) : (
                                                <>
                                                    <Col>
                                                        <Button
                                                            variant="primary"
                                                            block
                                                            onClick={() => {
                                                                setFlag(true);
                                                                setName(user.name);
                                                                setPhone(user?.phone);
                                                            }}
                                                        >
                                                            C???p nh???t th??ng tin{""}
                                                        </Button>{" "}
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            variant="danger"
                                                            block
                                                            onClick={() => setFlagRegister(true)}
                                                        >
                                                            ????ng K?? T??i Kho???n{""}
                                                        </Button>{" "}
                                                    </Col>
                                                </>
                                            )}
                                    </Row>
                                </Jumbotron>
                            </Col>
                        </Row>
                    </Col>
                    {/* col info admin */}
                    <Col>
                        {flagRegister ? (
                            <Row>
                                <Col>
                                    <Jumbotron>
                                        <h2 style={{ textAlign: "center" }}>
                                            Th??m t??i kho???n Admin{""}
                                        </h2>
                                        <Row>
                                            <Col>
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        style={{
                                                            fontWeight: "bold",
                                                            fontSize: "18px",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        H??? v?? T??n:{""}
                                                    </label>
                                                    <br />
                                                    <FormControl
                                                        aria-label="Default"
                                                        aria-describedby="inputGroup-sizing-default"
                                                        style={{
                                                            borderRadius: "8px",
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                            textTransform: "capitalize",
                                                            fontSize: "20px",
                                                        }}
                                                        value={nameRegister}
                                                        onChange={(e) => setNameRegister(e.target.value)}
                                                    />
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontWeight: "bold",
                                                            display: "none",
                                                        }}
                                                        id="error_name_register_admin"
                                                    />
                                                </div>
                                            </Col>
                                            {/* end col left */}
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        style={{
                                                            fontWeight: "bold",
                                                            fontSize: "18px",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        Email:{""}
                                                    </label>
                                                    <br />
                                                    <FormControl
                                                        aria-label="Default"
                                                        aria-describedby="inputGroup-sizing-default"
                                                        style={{
                                                            borderRadius: "8px",
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                            fontSize: "20px",
                                                        }}
                                                        type="email"
                                                        value={emailRegister}
                                                        onChange={(e) => setEmailRegister(e.target.value)}
                                                    />
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontWeight: "bold",
                                                            display: "none",
                                                        }}
                                                        id="error_email_register_admin"
                                                    />
                                                </div>
                                            </Col>
                                            {/* end col left */}
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        style={{
                                                            fontWeight: "bold",
                                                            fontSize: "18px",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        M???t Kh???u:{""}
                                                    </label>
                                                    <br />
                                                    <FormControl
                                                        aria-label="Default"
                                                        aria-describedby="inputGroup-sizing-default"
                                                        style={{
                                                            borderRadius: "8px",
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                            textTransform: "capitalize",
                                                            fontSize: "20px",
                                                        }}
                                                        type="password"
                                                        value={passwordRegister}
                                                        onChange={(e) =>
                                                            setPasswordRegister(e.target.value)
                                                        }
                                                    />
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontWeight: "bold",
                                                            display: "none",
                                                        }}
                                                        id="error_password_register_admin"
                                                    />
                                                </div>
                                            </Col>
                                            {/* end col left */}
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group controlId="formBasicImage">
                                                    <Form.Label
                                                        style={{ fontWeight: "bold", fontSize: "21px" }}
                                                    >
                                                        H??nh ???nh:{""}
                                                    </Form.Label>
                                                    <br />
                                                    <>
                                                        <input
                                                            ref={refImage}
                                                            type="file"
                                                            hidden
                                                            onChange={(e) => uploadImage(e.target.files[0])}
                                                        />
                                                        <div className="image">
                                                            {image ? (
                                                                <>
                                                                    <img
                                                                        src={image}
                                                                        alt={image}
                                                                        className="image-category"
                                                                        style={{
                                                                            width: "22%",
                                                                            height: "100%",
                                                                            cursor: "pointer",
                                                                            margin: "5px",
                                                                        }}
                                                                    />
                                                                    <ImCancelCircle
                                                                        className="icon-delete"
                                                                        onClick={() => setImage("")}
                                                                    />
                                                                </>
                                                            ) : (
                                                                    <p
                                                                        className="select-image"
                                                                        onClick={() => refImage.current.click()}
                                                                    ></p>
                                                                )}
                                                        </div>
                                                    </>
                                                    <Form.Control.Feedback id="error-image-category" />
                                                </Form.Group>
                                            </Col>
                                            {/* end col left */}
                                        </Row>
                                        <hr />
                                        <br />
                                        <Row>
                                            {/* {flag ? (
                                                <> */}
                                            <Col>
                                                <Button
                                                    variant="success"
                                                    block
                                                    onClick={() => handleRegister()}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <FaSave className="icon-detail" />
                                                    <span style={{ fontSize: "23px", marginTop: "-3px" }}>
                                                        ????ng K??{""}
                                                    </span>
                                                </Button>{" "}
                                            </Col>
                                            <Col>
                                                <Button
                                                    variant="danger"
                                                    block
                                                    onClick={() => {
                                                        setFlagRegister(false);
                                                        setNameRegister("");
                                                        setEmailRegister("");
                                                        setPasswordRegister("");
                                                    }}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <MdCancel className="icon-detail" />
                                                    <span style={{ fontSize: "23px", marginTop: "-3px" }}>
                                                        H???y{""}
                                                    </span>
                                                </Button>{" "}
                                            </Col>
                                        </Row>
                                    </Jumbotron>
                                </Col>
                            </Row>
                        ) : undefined}
                    </Col>
                    {/* col info register admin */}
                </Row>
            </Container>
        </Layout>
    );
};

export default Detail;
