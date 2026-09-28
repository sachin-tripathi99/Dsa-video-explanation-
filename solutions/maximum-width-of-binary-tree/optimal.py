from collections import deque

class Solution:
    def widthOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        q, best = deque([(root, 0)]), 0         # (node, position)
        while q:
            base, last = q[0][1], 0
            for _ in range(len(q)):
                n, p = q.popleft()
                p -= base                       # normalise per level
                last = p
                if n.left:
                    q.append((n.left, 2 * p))
                if n.right:
                    q.append((n.right, 2 * p + 1))
            best = max(best, last + 1)
        return best
