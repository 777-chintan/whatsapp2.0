import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../components/Message";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useState, useRef } from "react";
import firebase from "firebase";
import TimeAgo from "timeago-react"

function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const recipientEmail = getRecipientEmail(chat.users, user);
    const router = useRouter();
    const endOfMessageRef = useRef(null);
    const [messagesSnapshot] = useCollection(
        db
            .collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .orderBy("timestamp","asc")
    ); 
    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const sendMessage = (e) => {
        e.preventDefault();

        // update lastseen var
        db.collection("users").doc(user.uid).set(
            {
                lastseen: firebase.firestore.FieldValue.serverTimestamp(),
            },{merge : true}
        );

        db.collection("chats").doc(router.query.id).collection("messages").add({
            message : input,
            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
            user : user.email,
            photoURL : user.photoURL,
        });

        setInput("");
        scrollToBottem();
    };

    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot.docs.map((message)=>(
                <Message 
                    key = {message.id}
                    user = {message.data().user}
                    message = {{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        }
        else{
            return JSON.parse(messages).map((message) => (
                <Message 
                    key={message.id}
                    user = {message.user}
                    message = {message} />
            ));
        }
    };

    const scrollToBottem = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: "start",
        })
    };

    return (
        <Container>
            <Header>
            {recipient?(
                <Avatar src={recipient?.photoURL} />
            ) : (
                <Avatar> {recipientEmail[0]} </Avatar>
            )}
                <HeaderInfo >
                <h3>{recipientEmail}</h3>
                {recipientSnapshot?(
                    <p>Last Active :{" "} {
                        recipient?.lastseen?.toDate() ? ( 
                            <TimeAgo datetime={recipient?.lastseen?.toDate()}/>
                        ):(
                            "Unavailable"
                        ) 
                    } </p>
                ):(
                    <p>Loading ...</p>
                )}
                </HeaderInfo>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* all messages */}
                {showMessages()}

                <EndOfMessage ref={endOfMessageRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={ e => setInput(e.target.value)}/>
                <button hidden type="submit" onClick={sendMessage} disabled={!input}>Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    top:0;
    z-index:100;
    background-color: white;
    display: flex;
    padding: 10px;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3{
        margin-bottom: 2px;
    }

    > p{
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div`
    margin-right: 15px;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px
`;

const InputContainer = styled.form`
    display: flex;
    position: sticky;
    bottom: 0;
    align-items: center;
    padding: 10px;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    background-color: whitesmoke;
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;