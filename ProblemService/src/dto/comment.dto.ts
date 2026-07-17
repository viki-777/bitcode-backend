export type CreateCommentDTO = {
    problemId: string;
    userId: string;
    content: string;
    parentId?: string;
}
