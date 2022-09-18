import { Zoom } from "@material-ui/core";
import React from "react";
import "./blog.scss";
import { useMedium } from "../../hooks/useMedium";
import Post from "./components/Post";

function Blog() {
    const posts = useMedium();

    return (
        <div className="blog-view">
            <Zoom in={true}>
                <div className="blog-posts-wrap">
                    <p className="blog-posts-title">Blog</p>
                    <div className="blog-posts-container">
                        {posts.map((post, index) => (
                            <Post key={index} {...post} />
                        ))}
                    </div>
                </div>
            </Zoom>
        </div>
    );
}

export default Blog;
