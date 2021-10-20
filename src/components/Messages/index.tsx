import { useDispatch, useSelector } from "react-redux";
import { close } from "../../store/slices/messages-slice";
import "./console-interceptor";
import { MessagesState } from "../../store/slices/messages-slice";
import { IReduxState } from "../../store/slices/state.interface";
import React, { useEffect } from "react";
import { useSnackbar } from "notistack";

// A component that displays error messages
function Messages() {
    const { enqueueSnackbar } = useSnackbar();
    const messages = useSelector<IReduxState, MessagesState>(state => state.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        if (messages.message) {
            enqueueSnackbar(JSON.stringify(messages.message));
            dispatch(close());
        }
    }, [messages.message]);

    return <div></div>;
}

export default Messages;
