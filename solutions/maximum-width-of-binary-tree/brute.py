class Solution:
    def widthOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        level, best = [root], 0
        while True:
            real = [i for i, n in enumerate(level) if n]
            if not real:
                return best                     # no real nodes left
            first, last = real[0], real[-1]
            best = max(best, last - first + 1)
            nxt = []
            for n in level[first:last + 1]:     # placeholders keep the gaps
                nxt += [n.left, n.right] if n else [None, None]
            level = nxt
