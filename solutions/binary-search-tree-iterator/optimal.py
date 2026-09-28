class BSTIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.st = []
        self._push_left(root)

    def _push_left(self, n):
        while n:                                # the left spine
            self.st.append(n)
            n = n.left

    def next(self) -> int:
        n = self.st.pop()                       # next smallest
        self._push_left(n.right)
        return n.val

    def hasNext(self) -> bool:
        return bool(self.st)
