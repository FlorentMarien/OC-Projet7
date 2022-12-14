import '../styles/Bodymain.css';

import { useState, useEffect } from 'react';
import Nav from './Nav';
import SectionmainProfil from './Sectionmain_profil';
import SectionmainActu from './Sectionmain_actu';
import SectionmainParametre from './Sectionmain_parametre';
import SectionmainAside from './Sectionmain_aside';
import SectionmainRecherche from './Sectionmain_recherche';
import SectionmainMessage from './Sectionmain_message';
import NotifSound from '../assets/sound/simple_notification.mp3';
function Bodymain({ auth, setAuth }) {
    let [chat, setchat] = useState({
        // (A) INIT CHAT
        name: null, // USER'S NAME
        userId: null,
        destuserId: null,
        imageUrl: null,
        socket: null, // CHAT WEBSOCKET
        ewrap: null, // HTML CHAT HISTORY
        emsg: null, // HTML CHAT MESSAGE
        ego: null, // HTML CHAT GO BUTTON
        init: () => {
            chat.userId = auth[1];
            chat.destuserId = targetRechercheUser.userid;

            // (A3) CONNECT TO CHAT SERVER
            chat.socket = new WebSocket('ws://localhost:8086?id=' + auth[1]);

            // (A4) ON CONNECT - ANNOUNCE "I AM HERE" TO THE WORLD

            // (A5) ON RECEIVE MESSAGE - DRAW IN HTML
            chat.socket.addEventListener('message', (evt) => {
                chat.draw(evt.data);
            });

            // (A6) ON ERROR & CONNECTION LOST

            chat.socket.addEventListener('error', (err) => {
                chat.controls();
                console.log(err);
                alert('Websocket connection error!');
            });
        },
        initPrivate: () => {
            // (A1) GET HTML ELEMENTS
            chat.ewrap = document.getElementById('chatShow');
            chat.emsg = document.getElementById('chatMsg');
            chat.ego = document.getElementById('chatGo');

            // (A2) USER'S NAME
            //chat.name = profilData.name + " " +profilData.prename;
            // ID
            //chat.destuserId = targetRechercheUser.userid;

            chat.controls(1);
            chat.send('Joined the chat room.', 'open');
        },
        // (B) TOGGLE HTML CONTROLS
        controls: (enable) => {
            if (enable) {
                chat.emsg.disabled = false;
                chat.ego.disabled = false;
            } else {
                chat.emsg.disabled = true;
                chat.ego.disabled = true;
            }
        },
        isWrite: (bool) => {
            chat.socket.send(
                JSON.stringify({
                    state: 'isWrite',
                    isWrite: bool.isWrite,
                    userId: chat.userId,
                    destuserId: chat.destuserId,
                    msg: '',
                })
            );

            return false;
        },
        // (C) SEND MESSAGE TO CHAT SERVER
        send: (msg, state) => {
            if (msg === undefined) {
                msg = chat.emsg.value;
                chat.emsg.value = '';
            }
            if (state === 'sendfile') {
                return new Promise((resolve) => {
                    let objectcontact = {
                        name: chat.name,
                        userId: chat.userId,
                        destuserId: chat.destuserId,
                        dateTime: Date.now(),
                        msg: chat.msg,
                    };
                    let baseURL = '';
                    // Make new FileReader
                    let reader = new FileReader();
                    // Convert the file to base64 text
                    reader.readAsDataURL(msg);

                    // on reader load somthing...
                    reader.onload = () => {
                        // Make a fileInfo Object
                        baseURL = reader.result;
                        chat.socket.send(
                            JSON.stringify({
                                state: 'sendfile',
                                img: baseURL,
                                ...objectcontact,
                            })
                        );
                        resolve(baseURL);
                    };
                });
            } else {
                if (msg !== undefined && msg !== '') {
                    chat.socket.send(
                        JSON.stringify({
                            state: state,
                            name: chat.name,
                            userId: chat.userId,
                            destuserId: chat.destuserId,
                            msg: msg,
                        })
                    );
                }
            }
            return false;
        },
        // (D) DRAW MESSAGE IN HTML
        draw: (msg) => {
            // (D1) PARSE JSON
            // AVOIR
            let verif = false;
            msg = JSON.parse(msg);
            let target = document.getElementById('chatShow');
            if (target !== undefined && target !== null) {
                if (
                    (target.attributes['userid'].value === msg.userId ||
                        target.attributes['userid'].value === msg.destuserId) &&
                    (target.attributes['destuserid'].value === msg.userId ||
                        target.attributes['destuserid'].value ===
                            msg.destuserId)
                ) {
                    if (
                        msg.state === 'send' ||
                        msg.state === 'open' ||
                        msg.state === 'close' ||
                        msg.state === 'sendfile'
                    ) {
                        let row = document.createElement('div');
                        row.className =
                            msg['userId'] === auth[1]
                                ? 'privateMessage_user'
                                : 'privateMessage_destuser';
                        if (row.className === 'privateMessage_destuser') {
                            let mySound = new Audio(NotifSound);
                            mySound.play();
                        }

                        if (msg.state !== 'sendfile') {
                            row.innerHTML = `<div class="chatName">${msg['name']}</div> <div class="chatMsg"><p>${msg['msg']}<p></div>`;
                        } else {
                            let img = document.createElement('img');
                            let arr = msg.img.split(','),
                                mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[1]),
                                n = bstr.length,
                                u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }

                            let file = new File([u8arr], 'img', { type: mime });
                            img.src = URL.createObjectURL(file);
                            let firstdiv = document.createElement('div');
                            firstdiv.className = 'chatName';
                            firstdiv.textContent = msg['name'];
                            let seconddiv = document.createElement('div');
                            seconddiv.className = 'chatMsg';
                            if (msg['msg'] !== '' && msg['msg'] !== null) {
                                let p = document.createElement('p');
                                p.textContent = msg['msg'];
                                seconddiv.appendChild(p);
                            }
                            seconddiv.appendChild(img);
                            row.appendChild(firstdiv);
                            row.appendChild(seconddiv);
                        }
                        chat.ewrap.appendChild(row);
                        document.getElementById('iswrite').style.display =
                            'none';
                    }
                    if (msg.state === 'isWrite') {
                        if (msg.isWrite === true) {
                            document.getElementById('iswrite').style.display =
                                'block';
                        } else {
                            document.getElementById('iswrite').style.display =
                                'none';
                        }
                    }
                    window.scrollTo(0, document.body.scrollHeight);
                } else {
                    //In discution privatemessage mais pas le m??me user
                    verif = true;
                }
            } else {
                //Hors discution privatemessage
                verif = true;
            }
            if (verif === true) {
                //Reception message
                if (msg.state !== 'isWrite') {
                    //let row = document.getElementById("notifprivatemessage");
                    let mySound = new Audio(NotifSound);
                    mySound.play();
                    let row = document.createElement('div');
                    row.className = 'notifprivatemessage';
                    if (msg.state === 'sendfile' && msg.msg === '') {
                        msg.msg = 'Vous avez re??u une photo';
                    }
                    let ul = document.createElement('ul');
                    ul.className = 'list_notif';
                    ul.innerHTML = `<li>${msg['name']}</li><li>${msg['msg']}</li>`;
                    ul.onclick = (e) => {
                        e.preventDefault();
                        settargetRechercheUserPrivateMessage({
                            userid: msg.userId,
                        });
                    };
                    row.appendChild(ul);
                    row.style.transitionDuration = '2s';
                    row.style.transitionProperty = 'opacity';
                    if (
                        document.getElementById('notifprivatemessage') ===
                            null ||
                        document.getElementById('notifprivatemessage') ===
                            undefined
                    ) {
                        let rowmain = document.createElement('div');
                        rowmain.setAttribute('id', 'notifprivatemessage');
                        document
                            .getElementById('main_container')
                            .appendChild(rowmain);
                    }
                    document
                        .getElementById('notifprivatemessage')
                        .appendChild(row);
                    let size = document.getElementsByClassName(
                        'notifprivatemessage'
                    ).length;
                    let target = document.getElementsByClassName(
                        'notifprivatemessage'
                    )[size - 1];

                    window.setTimeout(function () {
                        target.style.opacity = '1';
                        window.setTimeout(function () {
                            target.style.opacity = '0';
                            window.setTimeout(function () {
                                window.setTimeout(function () {
                                    target.remove();
                                }, 50);
                            }, 2000);
                        }, 2000);
                    }, 50);
                }
            }
        },
    });
    let [indexPage, setindexPage] = useState({ index: 1, emetteur: 'navbar' });
    const [profilData, setprofilData] = useState(0);
    let [targetRechercheUser, settargetRechercheUser] = useState({
        userid: undefined,
    });
    const [
        targetRechercheUserPrivateMessage,
        settargetRechercheUserPrivateMessage,
    ] = useState({
        userid: undefined,
    });
    useEffect(() => {
        //Recuperation profil user
        async function getUser(objData) {
            return await fetch('http://localhost:3000/api/auth/getlogin', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth[2],
                },
                method: 'POST',
                body: objData,
            })
                .then(function (res) {
                    return res.json();
                })
                .then(function (result) {
                    return result;
                })
                .catch(function (err) {
                    return err;
                });
        }
        let objData = {
            userid: auth[1],
        };
        getUser(JSON.stringify(objData))
            .then((result) => {
                if (!result.error) {
                    setprofilData({
                        state: 1,
                        name: result.name,
                        prename: result.prename,
                        imageUrl: result.imageUrl,
                        adminLevel: result.adminLevel,
                        imageArray: result.imageArray,
                        email: result.email,
                    });
                } else {
                    throw result;
                }
            })
            .catch((err) => {
                console.log(err);
                localStorage.clear();
                setAuth([0]); // TokenExpired/ProblemeToken
            });
        // Chat
        console.log('init chat');
        chat.init();
        return () => {
            chat.socket.close();
        };
    }, [auth, setAuth]);
    useEffect(() => {
        if (indexPage.index === 0 && indexPage.emetteur === 'navbar') {
            settargetRechercheUser({ userid: auth[1] });
        }
    }, [indexPage]);
    useEffect(() => {
        //	Force actualisation si recherche user
        if (indexPage.index !== 0 && targetRechercheUser.userid !== undefined) {
            setindexPage({ index: 0, emetteur: 'navbar-aside' });
        }
    }, [targetRechercheUser]);
    useEffect(() => {
        //	Force actualisation si recherche user
        if (indexPage.index !== 3 && targetRechercheUser.userid !== undefined) {
            setindexPage({ index: 3, emetteur: 'navbar-aside' });
        }
    }, [targetRechercheUserPrivateMessage]);

    return (
        <div id="main_container">
            <Nav
                auth={auth}
                setAuth={setAuth}
                indexPage={indexPage}
                setindexPage={setindexPage}
                profilData={profilData}
                setprofilData={setprofilData}
                settargetRechercheUser={settargetRechercheUser}
            />
            {indexPage.index === 0 ? (
                <SectionmainProfil
                    key={targetRechercheUser.userid}
                    targetRechercheUser={targetRechercheUser}
                    auth={auth}
                    setAuth={setAuth}
                    indexPage={indexPage}
                    setindexPage={setindexPage}
                    profilData={profilData}
                    setprofilData={setprofilData}
                />
            ) : indexPage.index === 1 ? (
                <SectionmainActu
                    key={'section_actu'}
                    auth={auth}
                    setAuth={setAuth}
                    indexPage={indexPage}
                    setindexPage={setindexPage}
                    profilData={profilData}
                    setprofilData={setprofilData}
                />
            ) : indexPage.index === 4 ? (
                <SectionmainParametre
                    key={'section_parametre'}
                    auth={auth}
                    setAuth={setAuth}
                    indexPage={indexPage}
                    setindexPage={setindexPage}
                    profilData={profilData}
                    setprofilData={setprofilData}
                />
            ) : indexPage.index === 2 ? (
                <SectionmainRecherche
                    key={'section_recherche'}
                    auth={auth}
                    setAuth={setAuth}
                    indexPage={indexPage}
                    setindexPage={setindexPage}
                    profilData={profilData}
                    setprofilData={setprofilData}
                />
            ) : indexPage.index === 3 ? (
                <SectionmainMessage
                    key={'section_message'}
                    auth={auth}
                    setAuth={setAuth}
                    indexPage={indexPage}
                    setindexPage={setindexPage}
                    profilData={profilData}
                    setprofilData={setprofilData}
                    chat={chat}
                    targetRechercheUserPrivateMessage={
                        targetRechercheUserPrivateMessage
                    }
                    settargetRechercheUserPrivateMessage={
                        settargetRechercheUserPrivateMessage
                    }
                />
            ) : null}
            {indexPage.index !== 2 && indexPage.index !== 3 && (
                <SectionmainAside
                    key={'section_aside'}
                    auth={auth}
                    setAuth={setAuth}
                    indexPage={indexPage}
                    setindexPage={setindexPage}
                    profilData={profilData}
                    setprofilData={setprofilData}
                    targetRechercheUser={targetRechercheUser}
                    settargetRechercheUser={settargetRechercheUser}
                />
            )}
        </div>
    );
}

export default Bodymain;
