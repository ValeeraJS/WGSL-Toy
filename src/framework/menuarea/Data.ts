export const treeData = [
    {
        title: "Color",
        key: "0-0",
        children: [
            { title: "1. pure color", key: "0-0-0", isLeaf: true },
            { title: "2. color by uv", key: "0-0-1", isLeaf: true },
            { title: "3. color by mouse", key: "0-0-2", isLeaf: true },
            { title: "4. chess board", key: "0-0-3", isLeaf: true },
        ],
    },
    {
        title: "Signed Distance Field",
        key: "0-1",
        children: [
            { title: "1. circle", key: "0-1-0", isLeaf: true },
            { title: "2. square", key: "0-1-1", isLeaf: true },
            { title: "3. ellipse", key: "0-1-2", isLeaf: true },
            { title: "4. polygon", key: "0-1-3", isLeaf: true },
            { title: "5. star", key: "0-1-4", isLeaf: true },
        ],
    },
    {
        title: "Noise",
        key: "0-2",
        children: [
            { title: "1. smoke", key: "0-2-0", isLeaf: true },
            { title: "2. cloud", key: "0-2-1", isLeaf: true },
        ],
    },
    {
        title: "Fractal",
        key: "0-3",
        children: [
            { title: "1. julia set", key: "0-3-0", isLeaf: true },
            { title: "2. mandelbrot set", key: "0-3-1", isLeaf: true },
            { title: "3. fantasy tunnel", key: "0-3-2", isLeaf: true },
        ],
    },
];

export function filterTree(tree: any[], text: string) {
    let result: any[] = [];
    for (let item of tree) {
        if (item.title.includes(text)) {
            result.push({
                ...item
            });
        } else {
            let childResult = filterTree(item.children || [], text);
            if (childResult.length) {
                result.push({
                    ...item,
                    children: childResult
                });
            }
        }
    }

    return result;
}
