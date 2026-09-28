from collections import deque

class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        out, q, ltr = [], deque([root]) if root else deque(), True
        while q:
            size = len(q)
            row = [0] * size
            for i in range(size):
                n = q.popleft()
                row[i if ltr else size - 1 - i] = n.val   # write in this level's direction
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            out.append(row)
            ltr = not ltr
        return out
