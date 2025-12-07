import { Request, Response } from "express";
import Order from "../models/order.model";
import { OK, Created } from "../core/success.response";
import { BadRequestError } from "../core/error.response";
import sendMailThankYou from "../utils/SendMail/sendMailThankyou";
import socketService from "../services/socket.service";
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });
    return new OK({
      message: "Fetch all orders successfully",
      metadata: orders,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching orders").send(res);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).accessToken.id;
    const orders = await Order.find({ userId: userId })
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });
    return new OK({
      message: "Fetch orders successfully",
      metadata: orders,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching orders").send(res);
  }
};

export const GetOrderDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });
    if (!order) {
      return new BadRequestError("Order not found").send(res);
    }
    return new OK({
      message: "Fetch order successfully",
      metadata: order,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching order").send(res);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).accessToken.id;
    const newOrder = new Order(req.body);
    newOrder.userId = userId;
    await newOrder.save();
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });

    // 🆕 Gửi socket notification cho tất cả đơn hàng mới (COD và MoMo)
    socketService.notifyNewOrder({
      orderId: newOrder._id,
      email: (populatedOrder?.userId as any)?.email || "",
      order: populatedOrder,
      message: `Đơn hàng mới #${newOrder._id}!`,
    });

    // Chỉ gửi email cảm ơn cho đơn COD (cash) - MoMo sẽ gửi sau khi thanh toán thành công
    if (req.body.typeOfPayment === "cash") {
      await sendMailThankYou((populatedOrder?.userId as any)?.email || "");
    }

    return new Created({
      message: "Order created successfully",
      metadata: populatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error creating order").send(res);
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Order.updateOne({ _id: id }, { $set: req.body });
    const updatedOrder = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });
    if (!updatedOrder) {
      return new BadRequestError("Order not found").send(res);
    }
    return new OK({
      message: "Order updated successfully",
      metadata: updatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating order").send(res);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return new BadRequestError("Invalid status value").send(res);
    }
    await Order.updateOne({ _id: id }, { status: status });
    const updatedOrder = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });
    if (!updatedOrder) {
      return new BadRequestError("Order not found").send(res);
    }

    // Gửi socket notification khi cập nhật trạng thái đơn hàng
    socketService.notifyOrderStatusUpdate({
      orderId: id,
      status: status,
      order: updatedOrder,
      message: `Trạng thái đơn hàng #${id} đã được cập nhật thành: ${status}`,
    });

    return new OK({
      message: "Order status updated successfully",
      metadata: updatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating order status").send(res);
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // update payment method/type according to schema (typeOfPayment)
    const { typeOfPayment } = req.body;
    const validPayments = ["cash", "card", "momo"];
    if (typeOfPayment && !validPayments.includes(typeOfPayment)) {
      return new BadRequestError("Invalid payment type").send(res);
    }
    await Order.updateOne({ _id: id }, { $set: { typeOfPayment } });
    const updatedOrder = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });
    if (!updatedOrder) {
      return new BadRequestError("Order not found").send(res);
    }
    return new OK({
      message: "Payment updated successfully",
      metadata: updatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating payment status").send(res);
  }
};
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
      "http://localhost:3000/restaurant/api/v1/orders/result?id=" +
      InforOfOrder._id.toString() +
      "&&email=" +
      email.toString();
    var ipnUrl =
      "http://localhost:3000/restaurant/api/v1/orders/result?id=" +
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

export const successfulPayment = async (req: Request, res: Response) => {
  try {
    const idOfOrder = req.query.id;
    const email = req.query.email;
    const InforOfOrder = await Order.findById(idOfOrder);
    if (!InforOfOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.updateOne(
      {
        _id: idOfOrder,
      },
      {
        status: "confirmed",
        payed: true,
      }
    );

    // Lấy thông tin order đầy đủ để gửi qua socket
    const updatedOrder = await Order.findById(idOfOrder)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status position orderTime")
      .populate({
        path: "cartId",
        populate: {
          path: "items.dishId",
          select: "name price image",
        },
      });

    // Gửi thông báo qua Socket.IO đến admin
    socketService.notifyPaymentSuccess({
      orderId: idOfOrder,
      email: email,
      order: updatedOrder,
      message: `Đơn hàng #${idOfOrder} đã thanh toán thành công!`,
    });

    // Gửi email cảm ơn cho đơn MoMo sau khi thanh toán thành công
    await sendMailThankYou(email.toString());
    res.status(200).json({
      message: "Payment successful",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Test socket notification endpoint
export const testSocketNotification = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, email } = req.body;

    // Gửi thông báo test qua Socket.IO
    socketService.notifyPaymentSuccess({
      orderId: orderId || "TEST-" + Date.now(),
      email: email || "test@example.com",
      order: {
        _id: orderId || "TEST-" + Date.now(),
        totalPrice: amount || 150000,
        status: "confirmed",
        createdAt: new Date(),
      },
      message: `🧪 [TEST] Đơn hàng #${orderId || "TEST"} đã thanh toán ${
        amount || 150000
      }đ!`,
    });

    res.status(200).json({
      success: true,
      message: "Test notification sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
