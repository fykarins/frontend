import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";

import { AsnTable } from "./AsnTable";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectAsn,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchAsn,
} from "./asnSlice";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { showErrorDialog } from "../../../utility";
import { selectUser } from "../../../modules/Auth/_redux/authRedux";
import LoadingFetchData from "../../../utility/LoadingFetchData";

export const AsnPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectAsn);
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Filter
  const [type, setType] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  const filterVendorName =
    user.vendor_name === null ? vendorName : user.vendor_name;

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      vendor_name: filterVendorName,
      vendor_code: vendorCode,
      delivery_date: deliveryDate,
      delivery_note: deliveryNote,
      purch_org: user.purch_org,
      pageNo: 1,
      pageSize: 10,
    };
    try {
      const response = await dispatch(fetchAsn(params));
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
        vendor_name: filterVendorName,
        vendor_code: vendorCode,
        delivery_date: deliveryDate,
        delivery_note: deliveryNote,
		purch_org: user.purch_org,
        pageNo: page,
        pageSize: sizePerPage,
      };
      try {
        const response = await dispatch(fetchAsn(params));
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

  // Contoh deklarasi fungsi dan variabel
const [allocNmbr, setAllocNmbr] = useState('inputValue');
const handleInputChange = (e) => {
  // Assuming you are handling an input change event
  const inputValue = e.target.value;
  setAllocNmbr(inputValue); 
};

// Penggunaan variabel dan fungsi
setAllocNmbr(allocNmbr); // Memanggil fungsi setAllocNmbr
console.log(allocNmbr); // Menggunakan variabel allocNmbr

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Advance Shipping Notice">
        <CardHeaderToolbar>
          <Button
            className="btn btn-danger"
            onClick={() =>
              history.push("/transaction/advance-shipping-notice/create")
            }
          >
            Create
          </Button>
        </CardHeaderToolbar>
      </CardHeader>
      <LoadingFetchData active={overlayLoading} />
      <CardBody>
        {/* Filter */}
        <Form className="mb-5">
          <Form.Group as={Row}>
            <Col sm={9}>
              {user.vendor_code !== null && (
                <>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <b>Vendor Code</b>
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        placeholder="Vendor"
                        value={user.vendor_code}
                        disabled
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <b>Vendor Name</b>
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
                </>
              )}
              <Col sm={6}>
                {user.vendor_code === null && (
                  <>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <b>Vendor Code</b>
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
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <b>Vendor Name</b>
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Vendor"
                          onChange={(e) => {
                            setVendorName(e.target.value);
                          }}
                          value={vendorName}
                          onKeyPress={handleKeyPress}
                        />
                      </Col>
                    </Form.Group>
                  </>
                )}
              </Col>
              {/* Right Row */}
              <Col sm={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    <b>No Faktur Pajak</b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="No Faktur Pajak"
                      onChange={(e) => {
                        setAllocNmbr(e.target.value);
                      }}
                      value={allocNmbr}
                      onKeyPress={handleKeyPress}
                    />
                  </Col>
                </Form.Group>
                <Col sm={9}>
                  <Col sm={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <b>Delivery Date</b>
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="date"
                          onChange={(e) => {
                            setDeliveryDate(e.target.value);
                          }}
                          value={deliveryDate}
                          onKeyPress={handleKeyPress}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <b>Delivery Note</b>
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Delivery Note"
                          onChange={(e) => {
                            setDeliveryNote(e.target.value);
                          }}
                          value={deliveryNote}
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
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={12}>
                    <Form.Group as={Row}>
                      <Col sm={3}>

                      </Col>
                    </Form.Group>
                    <Button
                      className="btn btn-danger"
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </Col>
                </Col>
              </Col>
            </Col>
          </Form.Group>
          {/* Table */}
          {data.length > 0 && (
            <AsnTable
              data={data}
              page={pageNo}
              sizePerPage={pageSize}
              totalSize={totalRecord}
              onTableChange={handleTableChange}
              loading={loading}
            />
          )}
        </Form>
      </CardBody>
    </Card>
  );
};