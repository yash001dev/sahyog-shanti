import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = 2; // decoded.userId;
  if (req.method === "POST") {
    const {
      purchaseOrderNo,
      schoolName,
      billingName,
      books,
      publicationName,
      status,
      createdBy,
      companyId,
      shippingAddressId,
    } = req.body;
    //Traverse Through Books and convert quantity to integer
    books.forEach((book) => {
      book.qty = parseInt(book.qty);
    });
    try {
      // Create the purchase order
      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          purchaseOrderNo,
          schoolName,
          billingName,
          publicationName,
          status,
          createdBy: userId,
          books: {
            create: books,
          },
          shippingAddressId: shippingAddressId,
        },
      });

      //Also get Shipping Address
      const shippingAddress = await prisma.shippingAddress.findUnique({
        where: { id: shippingAddressId },
      });

      if (!status) {
        //Send an email to the company
        const companyEmail = await prisma.company.findUnique({
          where: { id: companyId },
          select: { email: true },
        });
        if (companyEmail) {
          await sendEmail(companyEmail.email, {
            ...req.body,
            ...purchaseOrder,
            shippingAddress: shippingAddress.address,
          });
        }
      }

      res.status(201).json(purchaseOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    //If get request for getting one purchase order
    if (req.query.status) {
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: { status: req.query.status },
        include: { books: true },
      });
      res.status(200).json(purchaseOrders);
    }

    if (req.query.id) {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id: parseInt(req.query.id) },
        include: { books: true },
      });
      if (!purchaseOrder) {
        res.status(404).json({ error: "Purchase Order Not Found" });
      }
      res.status(200).json(purchaseOrder);
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: { books: true },
    });
    res.status(200).json(purchaseOrders);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    console.log("deleting", id);
    try {
      await prisma.purchaseOrder.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    //Edit the purchase order
    const {
      id,
      purchaseOrderNo,
      schoolName,
      billingName,
      books,
      publicationName,
      status,
      companyId,
    } = req.body;
    console.log("id:", id);
    //Traverse Through Books and convert quantity to integer
    books.forEach((book) => {
      book.qty = parseInt(book.qty);
    });
    try {
      // Create the purchase order
      const purchaseOrder = await prisma.purchaseOrder.update({
        where: { id: parseInt(id) },
        data: {
          purchaseOrderNo,
          schoolName,
          billingName,
          publicationName,
          status,
          books: {
            deleteMany: {},
            create: books,
          },
        },
      });
      console.log("purchaseOrder", purchaseOrder);

      if (!status) {
        //Send an email to the company
        const companyEmail = await prisma.company.findUnique({
          where: { id: companyId },
          select: { email: true },
        });
        if (companyEmail) {
          await sendEmail(companyEmail.email, {
            ...req.body,
            ...purchaseOrder,
          });
        }
      }

      res.status(201).json(purchaseOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

async function sendEmail(to, purchaseOrder) {
  console.log("sending email to", process.env.EMAIL_USER);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configure Handlebars options
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./src/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./src/templates"),
    extName: ".hbs",
  };

  // Use Handlebars with Nodemailer
  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "New Purchase Order",
    template: "purchaseOrder", // Name of the template file without extension
    context: purchaseOrder, // Pass purchaseOrder object to the template
  };

  await transporter.sendMail(mailOptions);
}
