import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import moment from "moment";

function Message({user, message}) {
    const [userLoggedIn] = useAuthState(auth);
    const Messager = (user === userLoggedIn.email) ? Sender : Receiver;
    return (
        <Container>
            <Messager>{message.message}
                <TimeStamp>
                    {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
                </TimeStamp>
            </Messager>
        </Container>
    )
}

export default Message;

const Container = styled.div``;
const MessageContent = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 70px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
`;

const Sender = styled(MessageContent)`
    margin-left: auto;
    background-color: #dcf8c6;
`;

const Receiver = styled(MessageContent)`
    background-color: whitesmoke;
    text-align: left;
`;

const TimeStamp = styled.span`
    color:gray;
    padding : 10px;
    font-size: 10px;
    position: absolute;
    bottom: 0;
    right : 0;
    text-align:right;
`;