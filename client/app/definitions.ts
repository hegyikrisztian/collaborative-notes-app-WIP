

export type Note = {
    id: string,
    title: string,
    content: string,
    last_modified: Date,
    creator: string,
}

// select n.id, n.title, n.content, n.last_modified, n.creator from notes n inner join users_notes un on un.creator_id = n.creator where (un.creator_id = '90184a99-c3e4-48b9-8a17-94b06a6b0c8e' and un.note_id = n.id) or n.creator = '90184a99-c3e4-48b9-8a17-94b06a6b0c8e';
export type Breadcrumb = {
    name: string,
    active: boolean,
    href: string
}