import { Grid } from "@material-ui/core";
import { IData } from "src/hooks/types";
import Card from "./components/Card";

interface ICardsList {
    data: IData[];
}

function CardsList({ data }: ICardsList) {
    return (
        <Grid container spacing={2}>
            {data.map(info => (
                <Grid xs={12} lg={6} item key={`${info.name}-${info.name}`}>
                    <Card {...info} />
                </Grid>
            ))}
        </Grid>
    );
}

export default CardsList;
