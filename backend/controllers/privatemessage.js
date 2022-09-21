const Privatemessage = require('../models/Privatemessage');

exports.sendMessage = (msg) => {
    console.log(msg);
    let message = new Privatemessage({
        ...msg,
        message:msg.msg,
    });
    delete message.msg;
    message.save()
            .then(()=>{return 1})
};

exports.getMessages = (req, res) => {
    Privatemessage.find({userId: {$in: [req.body.userId,req.body.destuserId]},destuserId:{$in: [req.body.userId , req.body.destuserId]}})
                    .then((result)=>{
                        res.status(200).json({conversation:result});
                    })
                    .catch((err)=>res.status(400).json({err}))
};