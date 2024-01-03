import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { showErrorDialog } from "../../../utility";
import { GoodsReceiptTabel } from "./GoodsReceiptTable";
import {
  resetData,
  selectGoodsReceipt,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchGoodsReceipt,
} from "./goodsReceiptSlice";

import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../_metronic/_partials/controls";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { selectUser } from "../../../modules/Auth/_redux/authRedux";
import LoadingFetchData from "../../../utility/LoadingFetchData";

export const GoodsReceiptPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectGoodsReceipt);
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);
  const [overlayLoading, setOverlayLoading] = useState(false);

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  // Filter
  const [mblnr, setMblnr] = useState("");
  const [mjahr, setMjahr] = useState("");
  const [xblnr, setXblnr] = useState("");
  const [vendorCode, setVendorCode] = useState("");

  const filterVendorCode =
    user.vendor_code === null ? vendorCode : user.vendor_code;

  const handleSearch = async () => {
    const params = {
      MKPF_MBLNR: mblnr,
      MKPF_MJAHR: mjahr,
      MKPF_XBLNR: xblnr,
      MSEG_LIFNR: filterVendorCode,
	  purch_org: user.purch_org,
      pageNo: 1,
      pageSize: 10,
    };
    console.log(params, "params");
    try {
      const response = await dispatch(fetchGoodsReceipt(params));
      if (response.payload.data.status === 200) {
        setOverlayLoading(false);
      } else if (
        response.payload.data.error === "10008" ||
        response.payload.data.error === "10009"
      ) {
        const action = await showErrorDialog(response.payload.data.message);
        if (action.isConfirmed) await history.push("/logout");
      } else {
        showErrorDialog(response.payload.data.message);
        setOverlayLoading(false);
      }
    } catch (error) {
      showErrorDialog(error.message);
      setOverlayLoading(false);
    }
  };

  const handleTableChange = async (
    type,
    { page, sizePerPage, sortField, sortOrder, data }
  ) => {
    if (type === "pagination") {
      const params = {
        mkpF_MBLNR: mblnr,
        mkpF_MJAHR: mjahr,
        MKPF_XBLNR: xblnr,
		purch_org : user.purch_org,
        pageNo: page,
        pageSize: sizePerPage,
      };
      try {
        const response = await dispatch(fetchGoodsReceipt(params));
        if (response.payload.data.status === 200) {
          setOverlayLoading(false);
        } else if (
          response.payload.data.error === "10008" ||
          response.payload.data.error === "10009"
        ) {
          const action = await showErrorDialog(response.payload.data.message);
          if (action.isConfirmed) await history.push("/logout");
        } else {
          showErrorDialog(response.payload.data.message);
          setOverlayLoading(false);
        }
      } catch (error) {
        showErrorDialog(error.message);
        setOverlayLoading(false);
      }
    } else {
      let result;
      if (sortOrder === "asc") {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
        console.log(result, "asc");
      } else {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
        console.log(result, "desc");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // const handleDownload = () => {
  //   let URL =
  //     `${env.REACT_APP_API_URL}/api/goodsreceipt/exportToExcel` +
  //     `?mkpF_MBLNR= ${mblnr}` +
  //     `?mkpF_MJAHR= ${mjahr}`;
  //   window.open(URL);
  // };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <>
      <Card>
        <CardHeader title="Goods Receipt">
          {/* <CardHeaderToolbar>
            <Button
              className="btn-danger"
              onClick={() => history.push("/transaction/goods-receipt/create")}
            >
              Create
            </Button>
          </CardHeaderToolbar> */}
        </CardHeader>
        <LoadingFetchData active={overlayLoading} />
        {/* Filter */}
        <CardBody>
          <Form>
            <Form.Group as={Row}>
              <Col sm={6}>
                {user.vendor_code !== null && (
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <b>Vendor </b>
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        placeholder="Vendor"
                        value={user.vendor_name}
                        disabled
                      />
                    </Col>
                  </Form.Group>
                )}
                {user.vendor_code === null && (
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <b>Vendor</b>
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        placeholder="Vendor"
                        onChange={(e) => {
                          setVendorCode(e.target.value);
                        }}
                        value={vendorCode}
                        onKeyPress={handleKeyPress}
                      />
                    </Col>
                  </Form.Group>
                )}
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    <b>Material Document</b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="Material Document"
                      onChange={(e) => {
                        setMblnr(e.target.value);
                      }}
                      value={mblnr}
                      onKeyPress={handleKeyPress}
                    />
                  </Col>
                </Form.Group>
              </Col>
              {/* Right */}
              <Col sm={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    <b>Document Year</b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="Document Year"
                      onChange={(e) => {
                        setMjahr(e.target.value);
                      }}
                      value={mjahr}
                      onKeyPress={handleKeyPress}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    <b>No Delivery</b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="No Delivery"
                      onChange={(e) => {
                        setXblnr(e.target.value);
                      }}
                      value={xblnr}
                      onKeyPress={handleKeyPress}
                    />
                  </Col> 
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={6}>
                    {user.purch_org !== null && (
                      <Form.Group as={Row} className="mt-3">
                        <Form.Label column sm={6}>
                          <b>Purchasing Organization</b>
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Control
                            type="text"
                            placeholder="Purchasing Organization"
                            value={user.purch_org}
                            disabled
                          />
                        </Col>
                      </Form.Group>
                    )}
                    {user.purch_org === null && (
                      <Form.Group as={Row} className="mt-3">
                        <Form.Label column sm={6}>
                          <b>Purchasing Organization</b>
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Control
                            type="text"
                            placeholder="Purchasing Organization"
                            onChange={(e) => {
                              setVendorCode(e.target.value);
                            }}
                            value={vendorCode}
                            onKeyPress={handleKeyPress}
                          />
                        </Col>
                      </Form.Group>
                    )}
                    <Button className="btn btn-danger" onClick={handleSearch}>
                    Search
                    </Button> 
                  </Col>
                </Form.Group>
                </Col>
            </Form.Group>      
          </Form>
          {/* Table */}
          {data && data.length > 0 && (
            <GoodsReceiptTabel
              data={data}
              page={pageNo}
              sizePerPage={pageSize}
              totalSize={totalRecord}
              onTableChange={handleTableChange}
              loading={loading}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};
