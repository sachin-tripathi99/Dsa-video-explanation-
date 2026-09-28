class BSTIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.vals, self.i = [], 0

        def inorder(n):                         # flatten up front
            if n:
                inorder(n.left)
                self.vals.append(n.val)
                inorder(n.right)

        inorder(root)

    def next(self) -> int:
        self.i += 1
        return self.vals[self.i - 1]

    def hasNext(self) -> bool:
        return self.i < len(self.vals)
