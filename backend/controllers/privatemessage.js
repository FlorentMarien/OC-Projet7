const Privatemessage = require('../models/Privatemessage');
const User = require('../models/User');
exports.sendMessage = (msg) => {
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
exports.getAllLastMessageofuser = (req, res) => {
    Privatemessage.find({userId: req.body.userId})
                    .then((result)=>{
                        Privatemessage.find({destuserId: req.body.userId})
                                        .then((result2)=>{
                                            let array=[...result,...result2];
                                                array.sort(function (a, b) {
                                                    if (a.dateTime > b.dateTime) return 1;
                                                    if (a.dateTime < b.dateTime) return -1;
                                                    return 0;
                                            });
                                            array.reverse();
                                            let arrayReturn=[];
                                            let doublonArray=[];
                                            let parametre;
                                            array.forEach((element)=>{
                                                if(element.userId===req.auth.userId) parametre=element.destuserId;
                                                else if(element.destuserId===req.auth.destuserId) parametre=element.userId;

                                                if(doublonArray.includes(parametre)){
                                                    //Doublon
                                                }else{
                                                    
                                                    doublonArray.push(parametre);
                                                    arrayReturn.push(element);
                                                }
                                            })
                                            getuserinfo(arrayReturn,req).then((array)=>{
                                                res.status(200).json({conversation:array});
                                            });
                                            
                        })
                        
                    })
                    .catch((err)=>res.status(400).json({err}))
};
async function getuserinfo(array,req){
    let parametre;
    for(let x=0;x<array.length;x++){
        if(array[x].userId === req.auth.userId) parametre=array[x].destuserId;
        else parametre=array[x].userId
        await User.findOne({_id: parametre})
            .then((result)=>{
                array[x]={
                    ...array[x]._doc,
                    profilname:result.name,
                    profilprename:result.prename,
                    profilimageUrl:result.imageUrl,
                }
            })
    }
    return array;
}