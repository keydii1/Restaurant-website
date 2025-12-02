import { Response, Request } from "express";
import sendMailThankYou from "../utils/SendMail/sendMailThankyou";
import Order from "../models/order.model";
export const createPayment = async (req: Request, res: Response) => {
  try {
    const idOfOrder = req.body.id;
    const email = req.body.email;
    const InforOfOrder = await Order.findById(idOfOrder);
    if (!InforOfOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    var accessKey = "F8BBA842ECF85";
    var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var orderInfo = InforOfOrder._id.toString();
    var partnerCode = "MOMO";
    var redirectUrl =
      "http://localhost:3000/restaurant/api/v1/payments/result?id=" +
      InforOfOrder._id.toString() +
      "&&email=" +
      email.toString();
    var ipnUrl =
      "http://localhost:3000/restaurant/api/v1/payments/result?id=" +
      InforOfOrder._id.toString() +
      "&&email=" +
      email.toString();
    var requestType = "payWithMethod";
    var amount = InforOfOrder.totalPrice.toString();
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = "";
    var paymentCode =
      "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    //Create the HTTPS objects
    const https = require("https");
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };
    //Send the request and get the response
    const req2 = https.request(options, (res2) => {
      console.log(`Status: ${res2.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res2.headers)}`);
      res2.setEncoding("utf8");
      // res2.on('data', (body) => {
      //     console.log('Body: ');
      //     console.log(body);
      //     console.log('resultCode: ');
      //     console.log(JSON.parse(body).resultCode);
      // });
      res2.on("data", (body) => {
        const responseBody = JSON.parse(body);
        res.status(200).json({
          message: "Create MoMo payment successfully",
          data: responseBody,
        });
      });
      res2.on("end", () => {
        console.log("No more data in response.");
      });
    });

    req2.on("error", (e) => {
      console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log("Sending....");
    req2.write(requestBody);
    req2.end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const changePaymentStatus = async (req: Request, res: Response) => {
  try {
    const idOfOrder = req.query.id;
    const email = req.query.email;
    if (!idOfOrder) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    await Order.updateOne(
      {
        _id: idOfOrder,
      },
      {
        status: "Confirmed",
      }
    );
    await sendMailThankYou(email.toString());
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
