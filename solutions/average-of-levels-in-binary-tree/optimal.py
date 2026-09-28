from collections import deque

class Solution:
    def averageOfLevels(self, root: Optional[TreeNode]) -> List[float]:
        out, q = [], deque([root])
        while q:
            size, total = len(q), 0
            for _ in range(size):
                n = q.popleft()
                total += n.val
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            out.append(total / size)
        return out
