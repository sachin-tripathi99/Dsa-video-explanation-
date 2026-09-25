class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        def ser(n):
            return "#" if not n else f"{n.val},{ser(n.left)},{ser(n.right)}"
        return ser(p) == ser(q)
