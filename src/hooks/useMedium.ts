import axios from "axios";
import { useState, useEffect } from "react";
import { MEDIUM_RSS } from "../constants/endpoints";

export interface IPost {
    readonly title: string;
    readonly pubDate: string;
    readonly link: string;
    readonly thumbnail: string;
    readonly description: string;
}

export const useMedium = () => {
    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {
        axios.get(MEDIUM_RSS).then(({ data }) => {
            if (data.items) {
                setPosts(data.items);
            }
        });
    }, []);

    return posts;
};
