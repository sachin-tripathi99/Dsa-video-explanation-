class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        vals = []

        def collect(n):                         # sorted, without key
            if n:
                collect(n.left)
                if n.val != key:
                    vals.append(n.val)
                collect(n.right)

        def build(lo, hi):
            if lo > hi:
                return None
            m = (lo + hi) // 2
            return TreeNode(vals[m], build(lo, m - 1), build(m + 1, hi))

        collect(root)
        return build(0, len(vals) - 1)
