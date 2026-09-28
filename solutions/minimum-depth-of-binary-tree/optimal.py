from collections import deque

class Solution:
    def minDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        q, d = deque([root]), 1
        while True:
            for _ in range(len(q)):
                n = q.popleft()
                if not n.left and not n.right:
                    return d                    # first leaf = shallowest
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            d += 1
