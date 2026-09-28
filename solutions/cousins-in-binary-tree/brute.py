class Solution:
    def isCousins(self, root: Optional[TreeNode], x: int, y: int) -> bool:
        def find(n, target, d, p):              # (depth, parent) of target
            if not n:
                return None
            if n.val == target:
                return d, p
            return find(n.left, target, d + 1, n.val) or find(n.right, target, d + 1, n.val)

        dx, px = find(root, x, 0, None)
        dy, py = find(root, y, 0, None)         # second full search
        return dx == dy and px != py
