/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useContext, useState, useEffect } from "react";
import { LayoutContext } from "src/context";
import { useAsync, useMultiLanguage } from "src/hooks";
import { SubscriptionPackage } from "src/model/app-pages";
import {
  MagazineInfo,
  OrderRequest,
  UserAddress,
  UserDetails,
} from "src/model/orders";
import * as api from "src/api/orders";
import Loading from "src/base/Loading";
import { useHistory } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom";

import {
  PaymentRequestButtonElement,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { PaymentRequest, loadStripe } from "@stripe/stripe-js";

// ignoring to use paypal
// @ts-ignore: Unreachable code error
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

const stripePromise = loadStripe("pk_live_21ddE3jYsoHBbJgWLFJ12ede00UaZzWDA7", {
  apiVersion: "2020-08-27",
});

const CheckoutForm = () => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr as PaymentRequest);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest != null) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  }

  // Use a traditional checkout form.
  return <Loading />;
};

interface Iprops {
  packageInfo: SubscriptionPackage;
  userDetails: UserDetails;
  userAddress: UserAddress;
  billingDetails?: UserDetails;
  billingAddress?: UserAddress;
  magazineDetails: MagazineInfo;
}
const PaymentComponent = ({
  packageInfo,
  userDetails,
  billingAddress,
  billingDetails,
  userAddress,
  magazineDetails,
}: Iprops) => {
  const { isMobile } = useContext(LayoutContext);

  const { localize } = useMultiLanguage();

  const history = useHistory();

  const [addOrderRequest, adding] = useAsync(api.addOrderRequest);

  //   console.log({
  //     packageInfo,
  //     userDetails,
  //     billingAddress,
  //     billingDetails,
  //     userAddress,
  //     magazineDetails,
  //   });

  const submitData = (transactionDetails: any = {}) => {
    const finalOrder = {
      package: {
        id: packageInfo.id || "-",
        term: packageInfo.term || "-",
        type: packageInfo.type || "digital",
        price: packageInfo.price || 0,
        startDate: magazineDetails.startDate,
      },
      userDetails: userDetails,
      ...(userAddress ? { userAddress } : {}),
      ...(billingDetails ? { billingDetails } : {}),
      ...(billingAddress ? { billingAddress } : {}),
      transaction: transactionDetails,
      orderDate: new Date(),
    } as OrderRequest;
    console.log({ finalOrder });
    addOrderRequest(finalOrder).then(() => {
      history.push("/subscribe");
    });
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      plan_id: packageInfo.id || packageInfo.term,
      application_context: {
        brand_name: localize("brandName"),
        shipping_preference: "NO_SHIPPING",
      },
      purchase_units: [
        {
          amount: {
            value: packageInfo.price,
          },
        },
      ],
    });
  };

  const onApprove = (data: any, actions: any) => {
    console.log({ data, actions });
    return actions.order.capture().then((details: any) => {
      console.log({ details });
      submitData(details);
    });
  };

  return (
    <div>
      {adding && <Loading />}
      <div
        css={{
          marginTop: 10,
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "'Montserrat', sans-serif",
          color: "black",
        }}
      >
        {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
        {localize("payment-details").toLocaleUpperCase()}
      </div>
      <div
        css={{
          marginTop: 5,
          padding: 10,
          borderTop: "1px solid lightgrey",
          backgroundColor: "#fbfbfb",
        }}
      >
        <div>
          <PayPalButton
            amount={packageInfo.price}
            shippingPreference="NO_SHIPPING"
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </div>
        {/* <div>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div> */}
        {/* <div css={{ display: "flex", justifyContent: "flex-end", margin: 20 }}>
          <button
            css={css`
              color: #fff;
              font-size: 17px;
              border-radius: 6px;
              text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.25);
              background: #333 none repeat scroll 0% 0%;
              font-weight: bold;
              font-family: "'Montserrat', sans-serif";
              padding: 10px 20px;
              cursor: pointer;
            `}
            onClick={() => {
              submitData();
            }}
          >
            {localize("complete")}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentComponent;
