

export type Note = {
    id: string,
    title: string,
    content: string,
    last_modified: Date,
    creator: string,
}

export type Breadcrumb = {
    name: string,
    active: boolean,
    href: string
}