export const setAll = (state: any, properties: any) => {
    const props = Object.keys(properties);
    props.forEach(key => {
        state[key] = properties[key];
    });
};
