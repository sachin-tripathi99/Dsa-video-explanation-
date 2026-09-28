class Solution:
    def longestZigZag(self, root: Optional[TreeNode]) -> int:
        def walk(node, go_left):
            length = 0
            while True:
                nxt = node.left if go_left else node.right
                if not nxt:
                    return length
                node, length, go_left = nxt, length + 1, not go_left   # switch direction

        best, stack = 0, [root]
        while stack:                            # start a walk at every node
            node = stack.pop()
            if node:
                best = max(best, walk(node, True), walk(node, False))
                stack += [node.left, node.right]
        return best
