const express = require("express");
const jobApp = require("../models/jobApp")
const UserSchema = require("../models/User")
const fs = require("fs-extra")
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose')
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await jobApp.find({ studentId: new mongoose.Types.ObjectId(req.query.studentId) });
    res.send(result);
});


router.get("/app", async (req, res) => {
    res.send(await jobApp.find({}))

})

router.get("/:applicationStatus", async (req, res)=> {
    let limit = req.query.limit || 50
    delete limit
    let deduct = 5
    switch (req.params.applicationStatus){
    case "closed":
        const closed = (await jobApp.find({ status: { $in: ['application withdrawn', 'rejected'] } }).limit(parseInt(limit)))
        const closedCount = (await jobApp.find({ status: { $in: 'wishlist' } })).length
        closedCount = closedCount - deduct
        res.send({ result: closed, total: closedCount});
        break;
        case "active":
            const active = (await jobApp.find({ status: { $in: ['interview', 'offer', 'applied'] } }).limit(parseInt(limit)))
            let int = (await jobApp.find({ status: { $in: 'interview' } })).length
            let off = (await jobApp.find({ status: { $in: 'offer' } })).length
            let app = (await jobApp.find({ status: { $in: 'applied' } })).length
            const activeCount = []
            activeCount.push(int + off + app - deduct)
            res.send({ result: active, total: activeCount});
            break;
            case "wishlist":
                const wishlist = (await jobApp.find({ status: { $in: 'wishlist' } }).limit(parseInt(limit)))
                let wishlistCount = (await jobApp.find({ status: { $in: 'wishlist' } })).length
                wishlistCount = wishlistCount - deduct
                res.send({ result: wishlist, total: wishlistCount});
                break;
    }
 
})


router.get("/:id", async (req, res) => {
    try {
      var application = await jobApp.findById({ _id: req.params.id })
      res.send(application)
    }
    catch (ex) {
      res.send(ex)
    }
  })

router.post("/", async (req, res, next) => {
    // req.body.userId = req.user._id
    try {
        const newJobApp = { ...req.body }
        // newJobApp.userId = req.user._id
        await jobApp.create(newJobApp)
        res.send(newJobApp)
    }
    catch (err) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    }
})

router.delete("/:appId", async (req, res, next) => {
    var application = await jobApp.findById(req.params.appId);
    // if (application.userId == req.user._id) {
    jobApp.findByIdAndRemove(
        req.params.appId
    )
        .then(
            app => {
                res.send("Removed");
            },
            err => next(err)
        )
        .catch(err => next(err));
    // }
    // else {
    // res.status(401)
    // res.send("Unauthorized")
    // }
})

router.put("/:appId",
    (req, res, next) => {
        jobApp.findOneAndUpdate(
            { _id: req.params.appId },
            { $set: req.body },
            { $push: { tasks: req.body } },
            { new: true }
        )
            .then(
                app => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(app);
                },
                error => next(error),
            )
            .catch(error => next(error));
    }
)
///////Statistics & PDF
router.get("/totApp", async (req, res) => {
    var totNewApp = (await jobApp.find({ status: { $in: 'applied' } })).length
    var totInt = (await jobApp.find({ status: { $in: 'interview' } })).length
    var totOff = (await jobApp.find({ status: { $in: 'offer' } })).length
    var totApp = []
    totApp.push(totNewApp + totInt + totOff)
    res.send({ totApp: totApp })
})

router.get("/downloadPdf", async (req, res) => {
    //get students 
    var users = await UserSchema.find({ role: { $in: 'Student' } })
    var studentUsers = users.length
    //get last week apps
    var curr = new Date()
    var week = []

    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        week.push(day)
    }

    var finalArr = []
    var newApplications = await jobApp.find({ status: { $in: 'applied' } })
    newApplications.forEach((e1) => week.forEach((e2) => {
        var createdDate = e1.createdAt.toISOString().substr(0, 10)
        if (createdDate == e2) {
            finalArr.push(e1)
        }
    }))
    var lastWeek = finalArr.length
    //get totApps
    var totNewApp = (await jobApp.find({ status: { $in: 'applied' } })).length
    var totInt = (await jobApp.find({ status: { $in: 'interview' } })).length
    var totOff = (await jobApp.find({ status: { $in: 'offer' } })).length
    var totApp = []
    totApp.push(totNewApp + totInt + totOff)
    // Create a document
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('output.pdf'));

    doc.fontSize(30)
        .text("Report", 100, 100, { align: 'center' })
        .underline(270, 100, 100, 27, { align: 'center' })

    doc.save()
    doc.fontSize(25)
        .text("Jobs applied for in the last week: " + lastWeek, 100, 170)

    doc.save()
        .moveTo(100, 150)
    doc.fontSize(25)
        .text("Jobs applied for in total: " + totApp, 100, 220)
    doc.save()
        .moveTo(100, 150)
    doc.fontSize(25)
        .text("Students looking for a job: " + studentUsers, 100, 270)
    doc.save()
        .moveTo(100, 150)

    doc.image('./diagrampicture1.png', 150, 190, { fit: [300, 500], align: 'center', valign: 'center' })

    doc.scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();
    let buffer = []
    doc.on("data", buffer.push.bind(buffer))
    doc.on("end", () => {
        let pdf = Buffer.concat(buffer)
        res.writeHead(200, {
            "Content-Length": Buffer.byteLength(pdf),
            "Content-Type": "application/pdf",
            "Content-disposition": "attachment;filename=export.pdf",
        })
        res.end(pdf)
    })
    doc.end();
})
router.get("/AppsWeek", async (req, res) => {
    var curr = new Date()
    var week = []

    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        week.push(day)
    }
    var finalArr = []
    var newApplications = await jobApp.find({ status: { $in: 'applied' } })
    newApplications.forEach((e1) => week.forEach((e2) => {
        var createdDate = e1.createdAt.toISOString().substr(0, 10)
        if (createdDate == e2) {
            finalArr.push(e1)
        }
    }))
    var lastWeek = finalArr.length
    res.send({ lastWeek: lastWeek })
})
router.get("/:id", async (req, res) => {
    try {
        var apps = await jobApp.findById({ _id: req.params.id })
        res.send(apps)
    }
    catch (ex) {
        res.send(ex)
    }
})
module.exports = router;





