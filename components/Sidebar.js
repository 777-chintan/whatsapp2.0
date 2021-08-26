import styled from "styled-components";
import {Avatar, IconButton, Button} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import Chat from "../components/Chat";

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection("chats").where("users", 'array-contains', user.email);
    const [chatsnapshot] = useCollection(userChatRef);
    const chatAlreadyExits = (recipientEmail) =>
        !!chatsnapshot?.docs.find( 
            (chat) => chat.data().users.find( 
                (user) => user === recipientEmail)?.length>0
        );


    const startChat = () => {
        const input = prompt("Enter Email Address you want to speack with")

        if(!input){return null;}

        if(EmailValidator.validate(input) && !chatAlreadyExits(input) && user.email !== input){
            db.collection("chats").add({
                users : [user.email, input],
            });
        }
    };

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={ () => auth.signOut() }/>
                <HeaderIcons>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <Search>
                <SearchIcon/>
                <SearchInput placeholder="search in chat"></SearchInput>
            </Search>
            <SidebarButton onClick={startChat}>Start a new Chat</SidebarButton>

            {/* List of chats */}
            { chatsnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            ))}
            
        </Container>
    )
}

export default Sidebar;

const Container = styled.div`
    flex : 0.45;
    border-right: 1px solid whitesmoke;
    min-width: 300px;
    max-width: 350px;
    height: 100vh;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }
    --ms-overflow-style : none;
    scrollbar-width: none;

`;
const Header = styled.div`
    display: flex;
    position: sticky;
    top : 0;
    z-index: 100;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    border-bottom: 1px solid whitesmoke;
    padding: 10px;
    height : 80px;
`;
const HeaderIcons = styled.div``;
const UserAvatar = styled(Avatar)`
    margin: 10px;
    cursor: pointer;
    :hover{
        opacity: 0.8
    };
`;

const Search = styled.div`
    display: flex;
    margin: 5px;
    align-items: center;
    border-radius: 20px;
`;
const SearchInput = styled.input`
    outline: none;
    border: none;
    width: 100%;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid  whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;