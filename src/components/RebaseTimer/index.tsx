import { useSelector } from "react-redux";
import { secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useMemo } from "react";
import { IReduxState } from "../../store/slices/state.interface";

function RebaseTimer() {
    const currentBlock = useSelector<IReduxState, number>(state => {
        return state.app.currentBlock;
    });

    const nextRebase = useSelector<IReduxState, number>(state => {
        return state.app.nextRebase;
    });

    const timeUntilRebase = useMemo(() => {
        if (currentBlock && nextRebase) {
            const seconds = secondsUntilBlock(currentBlock, nextRebase);
            return prettifySeconds(seconds);
        }
    }, [currentBlock, nextRebase]);

    return (
        <Box className="rebase-timer">
            <p>
                {currentBlock ? (
                    timeUntilRebase ? (
                        <>
                            <strong>{timeUntilRebase}</strong> to Next Rebase
                        </>
                    ) : (
                        <strong>Rebasing</strong>
                    )
                ) : (
                    <Skeleton width="200px" />
                )}
            </p>
        </Box>
    );
}

export default RebaseTimer;
