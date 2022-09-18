import { IPost } from "../../../../hooks/useMedium";
import "./post.scss";
import { Link } from "@material-ui/core";
import moment from "moment";

function Post({ title, link, pubDate, thumbnail, description }: IPost) {
    const part = description.split("<p>")[1].split(" ");
    const text = `${part.slice(0, 15).join(" ")} ...`;

    return (
        <Link href={link} target="_blank">
            <div className="post-card-root">
                <div className="post-card-img-wrap">
                    <img alt="" src={thumbnail} />
                </div>
                <div className="post-card-body">
                    <p className="post-card-body-title">{title}</p>
                    <p className="post-card-body-desc">{text}</p>
                    <p className="post-card-body-time">{moment(pubDate).fromNow()}</p>
                </div>
            </div>
        </Link>
    );
}

export default Post;
