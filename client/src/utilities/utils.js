export const parseQueryString = url => {
    const query = url.split('?')[1];
    if (query) {
        const attr = query.split('&');
        return attr.reduce((acc, v) => {
            const parts = v.split('=');
            acc[parts[0]] = parts[1];
            return acc;
        }, {});
    } else {
        return null;
    }
};
