import { comparePassword, hashpassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import menureqModels from "../models/menureqModels.js";
import bcrypt from "bcrypt";
import complainModels from "../models/complainModels.js";
import feedbackModels from "../models/feedbackModels.js";
import pollModels from "../models/pollModels.js";
import userModels from "../models/userModels.js";
import paymentModels from "../models/paymentModels.js";
import fs from "fs";
import Item from "../models/expensesModels.js";
import noticemodel from "../models/noticeModels.js";

import path from "path";

import upload from "../multerconfig.js";
//for menu approval req
export const menureqsend = async (req, res) => {
  try {
    const { combinedValues } = req.body;

    // Check if combinedValues is an array and not empty
    if (!Array.isArray(combinedValues) || combinedValues.length === 0) {
      return res.status(400).send({
        success: false,
        message:
          "Invalid data format. Expecting non-empty array in combinedValues.",
      });
    }

    // Save the array data to the database
    const reqData = await menureqModels.create({
      managerreq: combinedValues,
    });

    return res.status(200).send({
      success: true,
      message: "Request sent to warden",
      data: reqData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in sending request",
      error: error.message,
    });
  }
};

//for view manu req
export const viewMenuRequests = async (req, res) => {
  try {
    const reqData = await menureqModels.find({});
    console.log(reqData); // Log the data before sending the response for debugging purposes

    return res.status(200).json({
      success: true,
      message: "Menu requests retrieved successfully",
      data: reqData,
    });
  } catch (error) {
    console.error("Error in getting menu requests:", error);

    return res.status(500).json({
      success: false,
      message: "Error in getting menu requests",
      error: error.message,
    });
  }
};

//approve menu req
export const ApproveMenuReq = async (req, res) => {
  const { menuRequestId, comment } = req.body;
  try {
    // Find the menu request by ID
    const menuRequest = await menureqModels.findById(menuRequestId);

    if (!menuRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Menu request not found" });
    }

    // Update the status to "1" and add the warden message with the comment
    menuRequest.status = "1";
    menuRequest.wardenmessage = comment;

    // Save the updated menu request
    await menuRequest.save();

    return res
      .status(200)
      .json({ success: true, message: "Menu request approved successfully" });
  } catch (error) {
    console.error("Error updating menu request:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating menu request",
      error: error.message,
    });
  }
};

// For deleting req message of menu with manager
export const Deletereq = async (req, res) => {
  const id = req.body.id;

  try {
    const deletedData = await menureqModels.deleteOne(id);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Respond with a success message or deleted data
    return res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    // Handle errors, e.g., database error
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// fro registring complain
export const userComplainController = async (req, res) => {
  try {
    const { name, reg, complain } = req.body;
    if (!name || !reg || !complain) {
      return res.send({ message: "field empty" });
    }

    const usercomplain = await new complainModels({
      name,
      reg,
      complain,
    }).save();

    res.status(200).send({
      success: true,
      message: "Complain Registered",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in complain registration",
      e,
    });
  }
};

// for viewing complain

export const viewComplainController = async (req, res) => {
  try {
    const complainData = await complainModels.find({});
    res.status(200).json(complainData);
  } catch (error) {
    console.error("Error fetching complain data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// for resolve complain

export const resolveComplainController = async (req, res) => {
  try {
    const complainId = req.params.id;
    console.log(complainId);

    const updatedComplain = await complainModels.findOneAndUpdate(
      { _id: complainId },
      { resolve: "1" },
      { new: true } // Set to true to return the updated document
    );

    if (!updatedComplain) {
      // If the document is not found
      return res.status(404).json({ message: "Complain not found" });
    }

    res.status(200).json(updatedComplain);
  } catch (error) {
    console.error("Error updating complain data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//////////////////////////////////////////////////////////////feed back

export const feedbackController = async (req, res) => {
  try {
    const { foodRating, serviceRating, feedback, name } = req.body;
    if (!foodRating || !serviceRating) {
      return res.send({ message: "field empty" });
    }

    const userfeedback = await new feedbackModels({
      foodRating,
      serviceRating,
      feedback,
      name,
    }).save();

    res.status(200).send({
      success: true,
      message: "Feedback Submitted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in feedback submission",
      e,
    });
  }
};

////////////////////////////////////////////////////view feedback

export const viewfeedbackController = async (req, res) => {
  try {
    const feedbackData = await feedbackModels.find({});
    res.status(200).json(feedbackData);
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//for creating new poll
export const createNewPollController = async (req, res) => {
  try {
    // Assuming your request body contains the poll data
    const { question, options } = req.body;
    // Create a new poll
    const newPoll = new pollModels({
      question,
      options,
    });

    // Save the new poll to the database
    await newPoll.save();

    // Respond with the newly created poll data or a success message
    res.json({
      message: "Poll successfully created",
      poll: newPoll,
      status: "success",
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: "Internal Server Error", status: "error" });
  }
};

// create one poll
export const createPollcontroller = async (req, res) => {
  try {
    const { question, options } = req.body;
    const { pollId } = req.params; // Extract pollId from params

    // Validate the request data (add more validation as needed)
    if (!pollId || !question || !options || options.length < 2) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // Find the existing poll by ID
    const existingPoll = await pollModels.findById(pollId);

    if (!existingPoll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Update the poll properties
    existingPoll.question = question;
    existingPoll.options = options;

    // Save the updated poll to the database
    const updatedPoll = await existingPoll.save();

    res.status(200).json(updatedPoll);
  } catch (error) {
    console.error("Error updating poll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//for getting poll form
export const viewPollcontroller = async (req, res) => {
  try {
    // Assuming you want to get the latest poll
    const latestPoll = await pollModels.findOne().sort({ _id: -1 }).limit(1);

    if (!latestPoll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    return res.status(200).json(latestPoll);
  } catch (error) {
    console.error("Error fetching poll data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//select poll option
export const submitPollcontroller = async (req, res) => {
  const { selectedOption, username } = req.body;

  try {
    const poll = await pollModels.findOneAndUpdate(
      { "options.id": selectedOption.id },
      {
        $inc: { "options.$.count": 1 },
        $push: { votedUsers: username },
      },
      { new: true }
    );

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    res.status(200).json(poll);
  } catch (error) {
    console.error("Error updating poll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//for delete poll by warden
export const deletePollcontroller = async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const deletedPoll = await pollModels.findByIdAndDelete(pollId);
    if (!deletedPoll) {
      return res
        .status(404)
        .json({ message: "Poll not found", status: "error" });
    }
    return res.json({
      message: "Poll successfully deleted",
      poll: deletedPoll,
      status: "success",
    });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ message: "Internal Server Error", status: "error" });
  }
};

//all user data
export const viewAlluserController = async (req, res) => {
  try {
    const AlluserData = await userModels.find({});
    res.status(200).json(AlluserData);
  } catch (error) {
    console.error("Error fetching all user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//block a user
export const blockUserController = async (req, res) => {
  const { id } = req.body;
  try {
    // Find the user by ID and update the "blocked" field to 1
    const user = await userModels.findByIdAndUpdate(id, { blocked: "1" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//unblock a user
export const unblockUserController = async (req, res) => {
  const { id } = req.body;
  try {
    // Find the user by ID and update the "blocked" field to 1
    const user = await userModels.findByIdAndUpdate(id, { blocked: "0" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// view user with reg with search filter
export const viewFilteredUsersController = async (req, res) => {
  try {
    const searchTerm = req.query.search;

    const searchCriteria = searchTerm
      ? { reg: { $regex: new RegExp(searchTerm, "i") } }
      : {};

    const filteredUsers = await userModels.find(searchCriteria);

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching filtered user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//for getting specific user detail
export const viewSingleuserController = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await userModels.findById(userId);

    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// update userprofile
export const updatesingleuserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { phone, year } = req.body;

    // Construct update object based on provided fields
    const updateObject = {};
    if (phone) updateObject.phone = phone;
    if (year) updateObject.year = year;

    // Find and update user
    const updatedUser = await userModels.findOneAndUpdate(
      { _id: userId },
      { $set: updateObject },
      { new: true } // Return the updated document
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//payment controlller
export const paymentController = async (req, res) => {
  try {
    const userid = req.params.userid;
    const { description } = req.fields;
    const { photo } = req.files;
    //alidation
    console.log(userid);

    const user = await userModels.findById(userid);

    if (user) {
      // const receipt = new paymentModels({ ...req.fields });

      const userName = user.name;
      const userReg = user.reg;
      const receipt = new paymentModels({
        description,
        name: userName,
        reg: userReg,
        imageData: {},
        student: userid,
      });
      if (photo) {
        receipt.imageData.data = fs.readFileSync(photo.path);
        receipt.imageData.contentType = photo.type;
      }
      await receipt.save();

      return res.status(201).send({
        success: true,
        message: "Photo Uploaded Successfully",
        receipt,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in uploading photo",
    });
  }
};

//for expenses

export const expensesController = async (req, res) => {
  try {
    // Extract data from the request body
    const { food, general, dairy, spoon, plates, glass, description } =
      req.body;

    // Create a new item document using the Item model
    const newItem = new Item({
      food,
      general,
      dairy,
      spoon,
      plates,
      glass,
      description,
    });

    // Save the new item to the database
    await newItem.save();

    // Respond with a success message
    res.status(201).json({
      success: true,
      message: "Expenses data saved successfully",
      newItem,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error saving expenses data",
    });
  }
};
// all expenses data to warden

export const viewAllexpensesController = async (req, res) => {
  try {
    const AllexpensesData = await Item.find({});
    res.status(200).json(AllexpensesData);
  } catch (error) {
    console.error("Error fetching all expenses data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all user payment detail
export const getallpayment = async (req, res) => {
  try {
    const payments = await paymentModels
      .find({})
      .select("-imageData")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: payments.length,
      message: "Allpayments ",
      payments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};

// get photo
export const getpaymentPhotoController = async (req, res) => {
  try {
    const payment = await paymentModels
      .findById(req.params.pid)
      .select("imageData");
    if (payment.imageData.data) {
      res.set("Content-type", payment.imageData.contentType);
      return res.status(200).send(payment.imageData.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
// controllers.js

export const verifypaymentController = async (req, res) => {
  try {
    const { userid, id } = req.query;

    if (!userid || !id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or payment ID" });
    }

    // Find the user by user ID
    const user = await userModels.findOne({ _id: userid });

    // Find the payment by payment ID
    const payment = await paymentModels.findOne({ _id: id });

    if (!user || !payment) {
      return res
        .status(404)
        .json({ success: false, message: "User or payment not found" });
    }

    // Update the userModel paid field to 1
    user.paid = "1";

    // Update the paymentModel verify field to 1
    payment.verify = "1";

    // Save the updated user and payment
    await user.save();
    await payment.save();

    return res
      .status(200)
      .json({ success: true, message: "User payment verified" });
  } catch (error) {
    console.error("Error updating user payment status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//view payment of user with search
export const searchpaymentController = async (req, res) => {
  try {
    const { reg } = req.query;

    if (reg) {
      const payments = await paymentModels.find({ reg });

      return res.status(200).json({
        success: true,
        message: "Payments data fetched successfully",
        payments,
      });
    }

    const allPayments = await paymentModels.find();

    return res.status(200).json({
      success: true,
      message: "All payments data fetched successfully",
      payments: allPayments,
    });
  } catch (error) {
    console.error("Error fetching payments data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//show all notices
export const showAllNoticesController = async (req, res) => {
  try {
    const allNotices = await noticemodel.find();
    res.status(200).json({ notices: allNotices });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "error" });
  }
};

// create notice

export const createNoticeController = async (req, res) => {
  try {
    const { title, link, content } = req.body;

    let encodedPdf = null;
    if (req.file) {
      const fileName = req.file.filename;
      // Read the PDF file as binary data
      const pdfData = fs.readFileSync(path.join("./files", fileName));
      // Encode the PDF data to Base64
      encodedPdf = pdfData.toString("base64");
    }

    // Create a new notice model with title, link, content, and encoded PDF
    const newNotice = new noticemodel({
      title,
      link,
      content,
      pdf: encodedPdf, // Store the encoded PDF in MongoDB
    });

    // Save the notice to MongoDB
    await newNotice.save();

    console.log("Notice created successfully.");

    res.status(201).json({ status: "ok" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "error" });
  }
};

// downlaod pdf

export const getNoticePdfController = async (req, res) => {
  const { noticeId } = req.params;

  try {
    const document = await noticemodel.findOne({ _id: noticeId });

    if (document && document.pdf) {
      // Decode the Base64-encoded PDF data to binary
      const decodedPdf = Buffer.from(document.pdf, "base64");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=${document.title}.pdf`
      );
      return res.status(200).end(decodedPdf);
    }

    return res
      .status(404)
      .json({ error: "Document not found or no PDF content available." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
